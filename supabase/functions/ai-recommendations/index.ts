import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type Recommendation = {
  title: string;
  insight: string;
  action: string;
  priority: "high" | "medium" | "low";
  category: string;
};

async function callOpenAI(openAiKey: string, prompt: string): Promise<Recommendation[]> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert digital strategist. Respond only with valid JSON arrays.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 1400,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error: ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "[]";

  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    return [];
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured", notConfigured: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const mode = body.mode ?? "analytics";

    // ── Design Improvements mode ──────────────────────────────────────────────
    if (mode === "design") {
      const { websiteUrl, businessName, industry, focusAreas } = body;

      const prompt = `You are a senior UX/UI designer and conversion rate optimisation expert.
Analyse the website for the business below and generate 6 specific, actionable design improvement recommendations.

Business: ${businessName || "Unknown"}
Industry: ${industry || "Not specified"}
Website: ${websiteUrl || "Not specified"}
Areas of focus: ${focusAreas?.join(", ") || "General UX, conversion, accessibility, mobile"}

Return a JSON array of exactly 6 recommendation objects:
[
  {
    "title": "Short action-oriented title (max 8 words)",
    "insight": "Why this matters for this type of business (1-2 sentences)",
    "action": "Exactly what to change or add (1-2 sentences)",
    "priority": "high|medium|low",
    "category": "accessibility|conversion|ux|mobile|performance|branding"
  }
]

Rules:
- Tailor recommendations to the industry (e.g. hospitality = booking flow, healthcare = trust signals)
- Mix categories: include at least one accessibility, one conversion, one mobile recommendation
- Priority "high" = quick win with high impact; "medium" = moderate effort; "low" = nice to have
- Be specific, not generic — avoid advice like "make it look better"
- Return only valid JSON, no markdown`;

      const recommendations = await callOpenAI(openAiKey, prompt);
      return new Response(JSON.stringify({ recommendations }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Analytics mode (default) ──────────────────────────────────────────────
    const {
      sessions,
      totalUsers,
      pageViews,
      bounceRate,
      avgSessionDuration,
      topPages,
      trafficSources,
      devices,
      dateRange,
      websiteUrl,
      businessName,
      seoGoal,
      keywords,
    } = body;

    const prompt = `You are a senior digital marketing analyst. Analyse the following website analytics data and provide 5 concise, actionable recommendations to improve performance.

Business: ${businessName || "Unknown"}
Website: ${websiteUrl || "Unknown"}
SEO Goal: ${seoGoal || "Not specified"}
Target Keywords: ${keywords?.join(", ") || "Not specified"}
Period: ${dateRange}

ANALYTICS DATA:
- Sessions: ${sessions.toLocaleString()}
- Unique Visitors: ${totalUsers.toLocaleString()}
- Page Views: ${pageViews.toLocaleString()}
- Bounce Rate: ${bounceRate.toFixed(1)}%
- Avg Session Duration: ${Math.floor(avgSessionDuration / 60)}m ${Math.round(avgSessionDuration % 60)}s
- Pages per session: ${sessions > 0 ? (pageViews / sessions).toFixed(2) : "N/A"}

Top Pages (by views):
${topPages.slice(0, 5).map((p: any) => `  - ${p.path}: ${p.views.toLocaleString()} views`).join("\n")}

Traffic Sources:
${trafficSources.map((s: any) => `  - ${s.name}: ${s.percentage}%`).join("\n")}

Devices:
${devices.map((d: any) => `  - ${d.name}: ${d.percentage}%`).join("\n")}

Return a JSON array of exactly 5 recommendation objects with this structure:
[
  {
    "title": "Short action-oriented title (max 8 words)",
    "insight": "What the data shows (1-2 sentences)",
    "action": "Specific thing to do (1-2 sentences)",
    "priority": "high|medium|low",
    "category": "traffic|engagement|conversion|seo|technical"
  }
]

Rules:
- Be specific to the data provided, not generic advice
- Reference actual numbers from the data
- Priority "high" = significant impact, quick win; "medium" = moderate effort/impact; "low" = nice to have
- Return only valid JSON, no markdown, no explanation`;

    const recommendations = await callOpenAI(openAiKey, prompt);
    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
