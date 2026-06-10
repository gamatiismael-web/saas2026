import { NextRequest, NextResponse } from 'next/server';
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { getAuthSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { auditHomepage, type SeoFinding } from '@/lib/seo-audit';

export const maxDuration = 60;

const SEO_MODEL = 'openai/gpt-5.4-mini';

// Helpful reference links keyed by check id, used for the "what to do next" step.
const REFERENCE_LINKS: Record<string, string> = {
  title: 'https://developers.google.com/search/docs/appearance/title-link',
  'meta-description': 'https://developers.google.com/search/docs/appearance/snippet',
  h1: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
  'img-alt': 'https://developers.google.com/search/docs/appearance/google-images',
  'open-graph': 'https://ogp.me/',
  https: 'https://developers.google.com/search/docs/crawling-indexing/https',
  viewport: 'https://developers.google.com/search/docs/appearance/mobile',
  canonical: 'https://developers.google.com/search/docs/crawling-indexing/canonicalization',
  'html-lang': 'https://developers.google.com/search/docs/specialty/international/localized-versions',
  'structured-data': 'https://schema.org/docs/gs.html',
  robots: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag',
  response: 'https://web.dev/articles/optimize-lcp',
};

const recommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      id: z.string(),
      group: z.enum(['on-page', 'technical']),
      priority: z.enum(['high', 'medium', 'low']),
      title: z.string(),
      explanation: z.string(),
      action: z.string(),
    })
  ),
});

type Recommendation = z.infer<typeof recommendationSchema>['recommendations'][number] & {
  link: string | null;
};

// Only warn/fail findings become recommendations.
function actionableFindings(findings: SeoFinding[]): SeoFinding[] {
  return findings.filter((f) => f.status !== 'pass');
}

// Templated fallback used if the AI call fails, so the tab always works.
function fallbackRecommendations(findings: SeoFinding[]): Recommendation[] {
  return actionableFindings(findings).map((f) => ({
    id: f.id,
    group: f.group,
    priority: f.status === 'fail' ? 'high' : 'medium',
    title: `Improve: ${f.label}`,
    explanation: f.evidence,
    action: `Review the "${f.label}" item on your homepage and address the issue described.`,
    link: REFERENCE_LINKS[f.id] ?? null,
  }));
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const websiteId: string | undefined = body?.websiteId;
    if (!websiteId) {
      return NextResponse.json({ status: 'error', message: 'websiteId is required' }, { status: 400 });
    }

    // Verify the website belongs to the signed-in user.
    const result = await query(
      `SELECT w.id, w.url, w.domain, w.name
         FROM websites w
         JOIN users u ON u.id = w.user_id
        WHERE w.id = $1 AND u.email = $2`,
      [websiteId, session.user.email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ status: 'error', message: 'Website not found' }, { status: 404 });
    }

    const website = result.rows[0];

    // 1. Crawl the homepage and run deterministic checks.
    let audit;
    try {
      audit = await auditHomepage(website.url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json(
        {
          status: 'error',
          message: `Could not reach ${website.url}. The site may be down, blocking bots, or too slow to respond. (${msg})`,
        },
        { status: 502 }
      );
    }

    const findings = audit.findings;
    const toExplain = actionableFindings(findings);
    const passedCount = findings.length - toExplain.length;

    // 2. AI layer: turn findings into plain-English explanations + next steps.
    let recommendations: Recommendation[];

    if (toExplain.length === 0) {
      recommendations = [];
    } else {
      try {
        const { experimental_output } = await generateText({
          model: SEO_MODEL,
          experimental_output: Output.object({ schema: recommendationSchema }),
          system:
            'You are an expert SEO consultant. You are given structured SEO findings from a website homepage crawl. ' +
            'For each finding, write a clear, encouraging, jargon-free explanation of why it matters for search ranking, ' +
            'and a specific, immediately-actionable next step the site owner can take. ' +
            'Assign a priority: "high" for issues that block indexing or strongly hurt ranking, "medium" for meaningful improvements, "low" for minor polish. ' +
            'Keep each explanation to 1-2 sentences and each action to 1 sentence. Preserve the given id and group exactly.',
          prompt:
            `Website: ${website.name} (${website.url})\n\n` +
            `Findings (only issues needing attention are listed):\n` +
            toExplain
              .map((f) => `- id=${f.id} | group=${f.group} | status=${f.status} | ${f.label}: ${f.evidence}`)
              .join('\n'),
        });

        const aiRecs = experimental_output.recommendations;
        // Attach reference links by id (don't trust the model to invent URLs).
        recommendations = aiRecs.map((r) => ({ ...r, link: REFERENCE_LINKS[r.id] ?? null }));
      } catch (err) {
        console.error('[v0] SEO AI generation failed, using fallback:', err);
        recommendations = fallbackRecommendations(findings);
      }
    }

    const priorityRank = { high: 0, medium: 1, low: 2 } as const;
    recommendations.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);

    return NextResponse.json({
      status: 'success',
      website: { id: website.id, name: website.name, url: website.url, domain: website.domain },
      analyzedAt: audit.fetchedAt,
      summary: {
        high: recommendations.filter((r) => r.priority === 'high').length,
        medium: recommendations.filter((r) => r.priority === 'medium').length,
        low: recommendations.filter((r) => r.priority === 'low').length,
        passed: passedCount,
        total: findings.length,
      },
      recommendations,
    });
  } catch (error) {
    console.error('[v0] SEO analyze error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message: `Failed to analyze: ${msg}` }, { status: 500 });
  }
}
