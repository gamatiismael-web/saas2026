import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalysisResult {
  overall_score: number;
  homepage_clarity_score: number;
  seo_score: number;
  conversion_score: number;
  mobile_score: number;
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
  recommended_package: string;
  analysis_details: {
    has_ssl: boolean;
    has_meta_description: boolean;
    has_title: boolean;
    has_viewport: boolean;
    title_length: number;
    meta_description_length: number;
    has_h1: boolean;
    h1_count: number;
    load_time_ms: number;
    status_code: number;
  };
}

async function analyzeWebsite(url: string): Promise<AnalysisResult> {
  try {
    const startTime = Date.now();

    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Fetch the website
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Value-Connection-Analyzer/1.0)'
      }
    });

    const loadTime = Date.now() - startTime;
    const html = await response.text();
    const statusCode = response.status;

    // Parse HTML (basic analysis without DOM parser)
    const hasSSL = url.startsWith('https://');

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    const titleLength = title.length;

    // Extract meta description
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';
    const metaDescriptionLength = metaDescription.length;

    // Check viewport
    const hasViewport = html.includes('name="viewport"') || html.includes("name='viewport'");

    // Count H1 tags
    const h1Matches = html.match(/<h1[^>]*>/gi);
    const h1Count = h1Matches ? h1Matches.length : 0;
    const hasH1 = h1Count > 0;

    // Calculate scores
    let seoScore = 0;
    let homepageScore = 0;
    let mobileScore = 0;
    let conversionScore = 50; // Base score

    // SEO Score (0-100)
    if (hasSSL) seoScore += 15;
    if (title && titleLength >= 30 && titleLength <= 60) seoScore += 25;
    else if (title && titleLength > 0) seoScore += 15;
    if (metaDescription && metaDescriptionLength >= 120 && metaDescriptionLength <= 160) seoScore += 25;
    else if (metaDescription && metaDescriptionLength > 0) seoScore += 15;
    if (hasH1 && h1Count === 1) seoScore += 20;
    else if (hasH1) seoScore += 10;
    if (statusCode === 200) seoScore += 15;

    // Homepage Clarity Score
    if (title && titleLength >= 20) homepageScore += 30;
    else if (title) homepageScore += 15;
    if (metaDescription && metaDescriptionLength >= 100) homepageScore += 30;
    else if (metaDescription) homepageScore += 15;
    if (hasH1) homepageScore += 20;
    if (html.toLowerCase().includes('about') || html.toLowerCase().includes('services')) homepageScore += 20;

    // Mobile Score
    if (hasViewport) mobileScore += 40;
    if (html.includes('responsive') || html.includes('mobile')) mobileScore += 20;
    if (loadTime < 3000) mobileScore += 40;
    else if (loadTime < 5000) mobileScore += 20;

    // Conversion Score (check for CTAs, contact forms, etc.)
    if (html.toLowerCase().includes('contact')) conversionScore += 15;
    if (html.toLowerCase().includes('book') || html.toLowerCase().includes('schedule')) conversionScore += 10;
    if (html.toLowerCase().includes('call') || html.toLowerCase().includes('phone')) conversionScore += 10;
    if (html.toLowerCase().includes('email') || html.toLowerCase().includes('@')) conversionScore += 10;
    if (html.includes('type="submit"') || html.includes('button')) conversionScore += 5;

    // Calculate overall score
    const overallScore = Math.round((seoScore + homepageScore + mobileScore + conversionScore) / 4);

    // Generate recommendations
    const recommendations: Array<{title: string; description: string; priority: "high" | "medium" | "low"}> = [];

    if (!hasSSL) {
      recommendations.push({
        title: 'Enable HTTPS/SSL Certificate',
        description: 'Your website is not secure (HTTP). This hurts trust and SEO. Switch to HTTPS immediately.',
        priority: 'high'
      });
    }

    if (!title || titleLength < 30) {
      recommendations.push({
        title: 'Improve Page Title',
        description: 'Your page title is missing or too short. Add a clear, keyword-rich title between 30-60 characters.',
        priority: 'high'
      });
    }

    if (!metaDescription || metaDescriptionLength < 120) {
      recommendations.push({
        title: 'Add Meta Description',
        description: 'Meta descriptions help search engines understand your page and improve click-through rates. Add a compelling 120-160 character description.',
        priority: 'high'
      });
    }

    if (!hasViewport) {
      recommendations.push({
        title: 'Add Mobile Viewport Tag',
        description: 'Your site is missing the viewport meta tag, which is essential for mobile responsiveness.',
        priority: 'high'
      });
    }

    if (h1Count === 0) {
      recommendations.push({
        title: 'Add H1 Heading',
        description: 'Every page needs exactly one H1 tag that clearly describes the page content.',
        priority: 'high'
      });
    } else if (h1Count > 1) {
      recommendations.push({
        title: 'Fix Multiple H1 Tags',
        description: 'You have multiple H1 tags. Use only one H1 per page and use H2-H6 for subheadings.',
        priority: 'medium'
      });
    }

    if (loadTime > 3000) {
      recommendations.push({
        title: 'Improve Page Load Speed',
        description: `Your page loads in ${(loadTime / 1000).toFixed(1)}s. Aim for under 3 seconds by optimizing images and reducing code.`,
        priority: loadTime > 5000 ? 'high' : 'medium'
      });
    }

    if (!html.toLowerCase().includes('contact')) {
      recommendations.push({
        title: 'Add Clear Contact Information',
        description: 'Make it easy for customers to reach you. Add visible contact details or a contact form.',
        priority: 'medium'
      });
    }

    // Determine recommended package
    let recommendedPackage = 'starter';
    if (overallScore < 60) {
      recommendedPackage = 'growth';
    }
    if (overallScore < 50) {
      recommendedPackage = 'pro';
    }

    return {
      overall_score: overallScore,
      homepage_clarity_score: homepageScore,
      seo_score: seoScore,
      conversion_score: conversionScore,
      mobile_score: mobileScore,
      recommendations: recommendations.slice(0, 5), // Top 5 recommendations
      recommended_package: recommendedPackage,
      analysis_details: {
        has_ssl: hasSSL,
        has_meta_description: metaDescription.length > 0,
        has_title: title.length > 0,
        has_viewport: hasViewport,
        title_length: titleLength,
        meta_description_length: metaDescriptionLength,
        has_h1: hasH1,
        h1_count: h1Count,
        load_time_ms: loadTime,
        status_code: statusCode
      }
    };

  } catch (error) {
    console.error('Error analyzing website:', error);

    // Return fallback scores if analysis fails
    return {
      overall_score: 55,
      homepage_clarity_score: 50,
      seo_score: 45,
      conversion_score: 60,
      mobile_score: 65,
      recommendations: [
        {
          title: 'Website Analysis Limited',
          description: 'We had difficulty accessing your website. Please ensure the URL is correct and the site is publicly accessible.',
          priority: 'high'
        },
        {
          title: 'Improve Website Accessibility',
          description: 'Ensure your website is accessible to all users and search engines.',
          priority: 'high'
        }
      ],
      recommended_package: 'growth',
      analysis_details: {
        has_ssl: false,
        has_meta_description: false,
        has_title: false,
        has_viewport: false,
        title_length: 0,
        meta_description_length: 0,
        has_h1: false,
        h1_count: 0,
        load_time_ms: 0,
        status_code: 0
      }
    };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'Website URL is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const analysis = await analyzeWebsite(url);

    return new Response(
      JSON.stringify(analysis),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in analyze-website function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze website' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
