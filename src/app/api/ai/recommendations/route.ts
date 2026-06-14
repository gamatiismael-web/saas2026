import { NextRequest, NextResponse } from 'next/server';
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { getAuthSession } from '@/lib/auth';
import { query } from '@/lib/db';

const AI_MODEL = 'openai/gpt-5.4-mini';

// Schema for AI-generated recommendations
const recommendationSchema = z.object({
  id: z.string(),
  category: z.enum(['quick-win', 'content', 'technical', 'traffic', 'conversion']),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  expectedRoi: z.string(),
  actionUrl: z.string().optional().nullable(),
});

const recommendationsSchema = z.object({
  recommendations: z.array(recommendationSchema),
  summary: z.string(),
  totalPotentialImpact: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { websiteId } = await request.json();
    if (!websiteId) {
      return NextResponse.json(
        { status: 'error', message: 'websiteId is required' },
        { status: 400 }
      );
    }

    // Fetch the website and verify ownership
    const websiteResult = await query(
      'SELECT * FROM websites WHERE id = $1 AND user_id = $2',
      [websiteId, session.user.id]
    );

    if (websiteResult.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Website not found' },
        { status: 404 }
      );
    }

    // Fetch metrics for the last 7 days
    const metricsResult = await query(
      `SELECT 
         SUM(CAST(visitors AS NUMERIC)) as total_visitors,
         SUM(CAST(pageviews AS NUMERIC)) as total_pageviews,
         SUM(CAST(sessions AS NUMERIC)) as total_sessions,
         AVG(CAST(bounce_rate AS NUMERIC)) as avg_bounce_rate,
         AVG(CAST(conversion_rate AS NUMERIC)) as avg_conversion_rate,
         SUM(CAST(organic_traffic AS NUMERIC)) as total_organic,
         SUM(CAST(mobile_traffic AS NUMERIC)) as total_mobile,
         SUM(CAST(desktop_traffic AS NUMERIC)) as total_desktop,
         SUM(CAST(social_traffic AS NUMERIC)) as total_social,
         SUM(CAST(paid_traffic AS NUMERIC)) as total_paid
       FROM website_metrics
       WHERE website_id = $1 AND metric_date >= CURRENT_DATE - INTERVAL '7 days'`,
      [websiteId]
    );

    const metrics = metricsResult.rows[0] || {};

    // Prepare metrics summary for AI analysis
    const metricsSummary = {
      totalVisitors: parseInt(metrics.total_visitors || '0'),
      totalPageviews: parseInt(metrics.total_pageviews || '0'),
      totalSessions: parseInt(metrics.total_sessions || '0'),
      avgBounceRate: parseFloat(metrics.avg_bounce_rate || '0'),
      avgConversionRate: parseFloat(metrics.avg_conversion_rate || '0'),
      trafficBreakdown: {
        organic: parseInt(metrics.total_organic || '0'),
        mobile: parseInt(metrics.total_mobile || '0'),
        desktop: parseInt(metrics.total_desktop || '0'),
        social: parseInt(metrics.total_social || '0'),
        paid: parseInt(metrics.total_paid || '0'),
      },
    };

    // Generate AI recommendations
    const prompt = `You are a digital marketing analytics expert. Analyze the following 7-day website metrics and generate 4-6 actionable AI recommendations to improve performance.

Website: ${websiteResult.rows[0].domain}
Metrics (last 7 days):
- Total Visitors: ${metricsSummary.totalVisitors}
- Total Pageviews: ${metricsSummary.totalPageviews}
- Total Sessions: ${metricsSummary.totalSessions}
- Average Bounce Rate: ${metricsSummary.avgBounceRate.toFixed(1)}%
- Average Conversion Rate: ${metricsSummary.avgConversionRate.toFixed(2)}%
- Traffic Sources: ${metricsSummary.trafficBreakdown.organic} organic, ${metricsSummary.trafficBreakdown.social} social, ${metricsSummary.trafficBreakdown.paid} paid, ${metricsSummary.trafficBreakdown.mobile} mobile

Generate recommendations in these categories:
- quick-win: Easy, high-impact improvements
- technical: Performance and infrastructure improvements
- traffic: Strategies to increase traffic volume
- conversion: Ways to improve conversion rates
- content: Content strategy improvements

For each recommendation, provide:
1. A clear, actionable title
2. A description explaining the benefit with specific expected ROI
3. Difficulty level (Easy, Medium, or Hard)
4. Expected ROI or impact

Return ONLY valid JSON matching the schema, no markdown, no explanations.`;

    const result = await generateText({
      model: AI_MODEL,
      system:
        'You are a data-driven marketing expert. Provide practical, measurable recommendations based on analytics data. Always return valid JSON.',
      prompt,
      output: Output.object({
        schema: recommendationsSchema,
        description: 'AI-generated marketing recommendations based on website metrics',
      }),
    });

    // Extract the structured output
    const recommendations = (result as any).output || result;

    return NextResponse.json(
      {
        status: 'success',
        data: recommendations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] AI recommendations error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to generate recommendations',
        fallback: {
          recommendations: [
            {
              id: 'fw1',
              category: 'quick-win',
              title: 'Analyze Your Traffic Sources',
              description: 'Review which channels drive the most conversions and reallocate budget accordingly.',
              difficulty: 'Easy',
              expectedRoi: '+5-10% conversions',
            },
            {
              id: 'fw2',
              category: 'technical',
              title: 'Improve Page Load Speed',
              description: 'Optimize images and enable caching to reduce bounce rate on mobile devices.',
              difficulty: 'Medium',
              expectedRoi: '-15% bounce rate',
            },
          ],
          summary: 'Review your analytics to identify quick wins and growth opportunities.',
          totalPotentialImpact: '+15% overall growth',
        },
      },
      { status: 200 }
    );
  }
}
