// Lightweight, dependency-free homepage SEO checks.
// Fetches the homepage HTML server-side and runs deterministic on-page /
// technical checks. Each check returns a structured finding; the AI layer
// turns warn/fail findings into plain-English explanations + next steps.

export type SeoGroup = 'on-page' | 'technical';
export type SeoStatus = 'pass' | 'warn' | 'fail';

export interface SeoFinding {
  id: string;
  group: SeoGroup;
  /** Short label of what was checked, e.g. "Title tag". */
  label: string;
  status: SeoStatus;
  /** Concrete evidence from the page, e.g. the title text and its length. */
  evidence: string;
}

export interface SeoAuditResult {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  httpStatus: number;
  findings: SeoFinding[];
}

const FETCH_TIMEOUT_MS = 12000;
const USER_AGENT =
  'Mozilla/5.0 (compatible; ValueConnectionSEOBot/1.0; +https://value-connection.com/bot)';

/** Fetch a single page's HTML with a timeout and browser-like UA. */
async function fetchHtml(url: string): Promise<{ html: string; status: number; finalUrl: string }> {
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml',
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  const html = await response.text();
  return { html, status: response.status, finalUrl: response.url || url };
}

// --- small HTML parsing helpers (regex-based, no DOM dependency) ---

function getTagContent(html: string, tag: string): string | null {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].replace(/\s+/g, ' ').trim() : null;
}

function getMetaContent(html: string, nameOrProp: 'name' | 'property', value: string): string | null {
  // Handles attribute order variations by matching the tag then the content attr.
  const tagRegex = new RegExp(
    `<meta[^>]*\\b${nameOrProp}=["']${value}["'][^>]*>`,
    'i'
  );
  const tag = html.match(tagRegex)?.[0];
  if (!tag) return null;
  const content = tag.match(/\bcontent=["']([^"']*)["']/i);
  return content ? content[1].trim() : '';
}

function countMatches(html: string, regex: RegExp): number {
  const matches = html.match(regex);
  return matches ? matches.length : 0;
}

/** Run all deterministic checks against fetched HTML. */
export function analyzeHtml(params: {
  url: string;
  finalUrl: string;
  status: number;
  html: string;
}): SeoFinding[] {
  const { url, finalUrl, status, html } = params;
  const findings: SeoFinding[] = [];

  // ---------- ON-PAGE ----------

  // Title
  const title = getTagContent(html, 'title');
  if (!title) {
    findings.push({ id: 'title', group: 'on-page', label: 'Title tag', status: 'fail', evidence: 'No <title> tag found.' });
  } else {
    const len = title.length;
    const status = len >= 30 && len <= 60 ? 'pass' : 'warn';
    findings.push({
      id: 'title',
      group: 'on-page',
      label: 'Title tag',
      status,
      evidence: `Title is ${len} characters: "${title.slice(0, 80)}". Ideal range is 30-60.`,
    });
  }

  // Meta description
  const description = getMetaContent(html, 'name', 'description');
  if (description === null) {
    findings.push({ id: 'meta-description', group: 'on-page', label: 'Meta description', status: 'fail', evidence: 'No meta description found.' });
  } else {
    const len = description.length;
    const st = len >= 70 && len <= 160 ? 'pass' : 'warn';
    findings.push({
      id: 'meta-description',
      group: 'on-page',
      label: 'Meta description',
      status: st,
      evidence: `Meta description is ${len} characters. Ideal range is 70-160.`,
    });
  }

  // H1
  const h1Count = countMatches(html, /<h1[\s>]/gi);
  findings.push({
    id: 'h1',
    group: 'on-page',
    label: 'H1 heading',
    status: h1Count === 1 ? 'pass' : 'warn',
    evidence:
      h1Count === 0
        ? 'No <h1> heading found on the page.'
        : `Found ${h1Count} <h1> headings. A page should have exactly one.`,
  });

  // Images missing alt
  const imgCount = countMatches(html, /<img[\s>]/gi);
  const imgWithAlt = countMatches(html, /<img[^>]*\balt=/gi);
  const missingAlt = Math.max(0, imgCount - imgWithAlt);
  findings.push({
    id: 'img-alt',
    group: 'on-page',
    label: 'Image alt text',
    status: missingAlt === 0 ? 'pass' : 'warn',
    evidence:
      imgCount === 0
        ? 'No images detected on the page.'
        : `${missingAlt} of ${imgCount} images are missing alt text.`,
  });

  // Open Graph tags
  const ogTitle = getMetaContent(html, 'property', 'og:title');
  const ogDesc = getMetaContent(html, 'property', 'og:description');
  const ogImage = getMetaContent(html, 'property', 'og:image');
  const ogPresent = [ogTitle, ogDesc, ogImage].filter((v) => v !== null).length;
  findings.push({
    id: 'open-graph',
    group: 'on-page',
    label: 'Social (Open Graph) tags',
    status: ogPresent === 3 ? 'pass' : ogPresent === 0 ? 'fail' : 'warn',
    evidence: `${ogPresent} of 3 key Open Graph tags (og:title, og:description, og:image) are present.`,
  });

  // ---------- TECHNICAL ----------

  // HTTPS
  const isHttps = finalUrl.startsWith('https://') || url.startsWith('https://');
  findings.push({
    id: 'https',
    group: 'technical',
    label: 'HTTPS',
    status: isHttps ? 'pass' : 'fail',
    evidence: isHttps ? 'Site is served over HTTPS.' : 'Site is not served over HTTPS.',
  });

  // Viewport (mobile friendliness)
  const viewport = getMetaContent(html, 'name', 'viewport');
  findings.push({
    id: 'viewport',
    group: 'technical',
    label: 'Mobile viewport',
    status: viewport ? 'pass' : 'fail',
    evidence: viewport ? `Viewport meta tag present: "${viewport}".` : 'No viewport meta tag found; the page may not be mobile-friendly.',
  });

  // Canonical
  const hasCanonical = /<link[^>]*\brel=["']canonical["'][^>]*>/i.test(html);
  findings.push({
    id: 'canonical',
    group: 'technical',
    label: 'Canonical URL',
    status: hasCanonical ? 'pass' : 'warn',
    evidence: hasCanonical ? 'A canonical link tag is present.' : 'No canonical link tag found.',
  });

  // html lang
  const langMatch = html.match(/<html[^>]*\blang=["']([^"']+)["']/i);
  findings.push({
    id: 'html-lang',
    group: 'technical',
    label: 'Language attribute',
    status: langMatch ? 'pass' : 'warn',
    evidence: langMatch ? `<html> lang is "${langMatch[1]}".` : 'The <html> tag has no lang attribute.',
  });

  // Structured data
  const hasJsonLd = /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html);
  findings.push({
    id: 'structured-data',
    group: 'technical',
    label: 'Structured data',
    status: hasJsonLd ? 'pass' : 'warn',
    evidence: hasJsonLd ? 'JSON-LD structured data detected.' : 'No JSON-LD structured data (schema.org) found.',
  });

  // robots noindex
  const robots = getMetaContent(html, 'name', 'robots');
  const isNoindex = robots ? /noindex/i.test(robots) : false;
  findings.push({
    id: 'robots',
    group: 'technical',
    label: 'Indexability',
    status: isNoindex ? 'fail' : 'pass',
    evidence: isNoindex
      ? `The page has a robots "noindex" directive ("${robots}") and will be excluded from search results.`
      : 'No "noindex" directive blocking search engines.',
  });

  // Response / size signals
  const sizeKb = Math.round(html.length / 1024);
  findings.push({
    id: 'response',
    group: 'technical',
    label: 'Response & page weight',
    status: status >= 200 && status < 300 ? (sizeKb > 1024 ? 'warn' : 'pass') : 'warn',
    evidence: `HTTP status ${status}; HTML document is ~${sizeKb} KB.`,
  });

  return findings;
}

/** Crawl the homepage and produce a full audit result. */
export async function auditHomepage(url: string): Promise<SeoAuditResult> {
  const { html, status, finalUrl } = await fetchHtml(url);
  const findings = analyzeHtml({ url, finalUrl, status, html });

  return {
    url,
    finalUrl,
    fetchedAt: new Date().toISOString(),
    httpStatus: status,
    findings,
  };
}
