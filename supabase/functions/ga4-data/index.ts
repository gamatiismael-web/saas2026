import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number } | null> {
  const clientId = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET");
  if (!clientId || !clientSecret) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (data.error || !data.access_token) return null;
  return { access_token: data.access_token, expires_in: data.expires_in };
}

async function runGA4Report(accessToken: string, propertyId: string, body: object) {
  const cleanId = propertyId.replace(/^properties\//, "");
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${cleanId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  return res.json();
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end === "today" ? new Date().toISOString().split("T")[0] : end);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const jwt = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("ga4_property_id, google_access_token, google_refresh_token, google_token_expiry, google_connected_email")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.google_access_token && !profile?.google_refresh_token) {
      return new Response(
        JSON.stringify({ error: "Google account not connected", notConfigured: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const requestBody = await req.json();
    const { propertyId: bodyPropertyId, startDate, endDate } = requestBody;
    const propertyId = bodyPropertyId || profile?.ga4_property_id;

    if (!propertyId) {
      return new Response(
        JSON.stringify({ error: "No GA4 property configured", notConfigured: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Refresh token if expired or within 5 minutes of expiry
    let accessToken = profile.google_access_token!;
    const expiry = profile.google_token_expiry ? new Date(profile.google_token_expiry) : null;
    const needsRefresh = !expiry || expiry.getTime() - Date.now() < 5 * 60 * 1000;

    if (needsRefresh && profile.google_refresh_token) {
      const refreshed = await refreshAccessToken(profile.google_refresh_token);
      if (refreshed) {
        accessToken = refreshed.access_token;
        const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
        await supabase
          .from("profiles")
          .update({ google_access_token: accessToken, google_token_expiry: newExpiry })
          .eq("id", user.id);
      }
    }

    const resolvedStart = startDate ?? "30daysAgo";
    const resolvedEnd = endDate ?? "today";

    let comparisonStart: string;
    let comparisonEnd: string;

    if (resolvedStart.endsWith("daysAgo")) {
      const days = parseInt(resolvedStart);
      comparisonStart = `${days * 2}daysAgo`;
      comparisonEnd = `${days + 1}daysAgo`;
    } else {
      const periodDays = daysBetween(resolvedStart, resolvedEnd);
      comparisonEnd = shiftDate(resolvedStart, 1);
      comparisonStart = shiftDate(resolvedStart, periodDays);
    }

    const dateRange = { startDate: resolvedStart, endDate: resolvedEnd };
    const compRange = { startDate: comparisonStart, endDate: comparisonEnd };

    const [overviewReport, pagesReport, devicesReport, channelsReport] = await Promise.all([
      runGA4Report(accessToken, propertyId, {
        dateRanges: [
          { ...dateRange, name: "current" },
          { ...compRange, name: "previous" },
        ],
        metrics: [
          { name: "totalUsers" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
          { name: "sessions" },
        ],
      }),
      runGA4Report(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 5,
      }),
      runGA4Report(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      }),
      runGA4Report(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 6,
      }),
    ]);

    // Check for API errors (e.g. no access to property)
    if (overviewReport.error) {
      return new Response(
        JSON.stringify({ error: overviewReport.error.message || "GA4 API error", apiError: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // With two dateRanges, the API returns one row per dateRange (identified by dimensionValues[0] = dateRangeName)
    // When no other dimensions are set, rows[0] = "current", rows[1] = "previous"
    const rows: any[] = overviewReport.rows ?? [];
    const currentRow = rows.find((r: any) =>
      r.dimensionValues?.[0]?.value === "current"
    ) ?? rows[0];
    const previousRow = rows.find((r: any) =>
      r.dimensionValues?.[0]?.value === "previous"
    ) ?? rows[1];

    const getMetric = (row: any, idx: number) => row?.metricValues?.[idx]?.value ?? "0";

    const totalUsers = parseInt(getMetric(currentRow, 0));
    const pageViews = parseInt(getMetric(currentRow, 1));
    const bounceRate = parseFloat(getMetric(currentRow, 2)) * 100;
    const avgDuration = parseFloat(getMetric(currentRow, 3));
    const sessions = parseInt(getMetric(currentRow, 4));

    const prevTotalUsers = parseInt(getMetric(previousRow, 0));
    const prevPageViews = parseInt(getMetric(previousRow, 1));
    const prevBounceRate = parseFloat(getMetric(previousRow, 2)) * 100;
    const prevAvgDuration = parseFloat(getMetric(previousRow, 3));

    const pct = (a: number, b: number) =>
      b === 0 ? null : (((a - b) / b) * 100).toFixed(1);

    const avgMins = Math.floor(avgDuration / 60);
    const avgSecs = Math.round(avgDuration % 60);

    const channelRows: any[] = channelsReport.rows ?? [];
    const totalChannelSessions = channelRows.reduce(
      (sum: number, r: any) => sum + parseInt(r.metricValues[0].value),
      0
    );

    const channelColors: Record<string, string> = {
      "Organic Search": "bg-blue-500",
      Direct: "bg-emerald-500",
      Referral: "bg-amber-500",
      "Organic Social": "bg-rose-500",
      Email: "bg-cyan-500",
      Paid: "bg-orange-500",
    };

    const deviceRows: any[] = devicesReport.rows ?? [];
    const totalDeviceSessions = deviceRows.reduce(
      (sum: number, r: any) => sum + parseInt(r.metricValues[0].value),
      0
    );

    return new Response(
      JSON.stringify({
        stats: [
          {
            label: "Total Visitors",
            value: totalUsers.toLocaleString(),
            change: pct(totalUsers, prevTotalUsers),
            up: totalUsers >= prevTotalUsers,
          },
          {
            label: "Page Views",
            value: pageViews.toLocaleString(),
            change: pct(pageViews, prevPageViews),
            up: pageViews >= prevPageViews,
          },
          {
            label: "Avg. Session",
            value: `${avgMins}m ${avgSecs}s`,
            change: pct(avgDuration, prevAvgDuration),
            up: avgDuration >= prevAvgDuration,
          },
          {
            label: "Bounce Rate",
            value: `${bounceRate.toFixed(1)}%`,
            change: pct(bounceRate, prevBounceRate),
            up: bounceRate <= prevBounceRate,
          },
        ],
        topPages: (pagesReport.rows ?? []).map((row: any) => ({
          path: row.dimensionValues[0].value,
          label: row.dimensionValues[0].value === "/" ? "Homepage" : row.dimensionValues[0].value,
          views: parseInt(row.metricValues[0].value),
        })),
        sources: channelRows.map((row: any) => {
          const name = row.dimensionValues[0].value;
          const count = parseInt(row.metricValues[0].value);
          return {
            name,
            percentage: Math.round((count / totalChannelSessions) * 100),
            color: channelColors[name] ?? "bg-gray-500",
          };
        }),
        devices: deviceRows.map((row: any) => {
          const name = row.dimensionValues[0].value;
          const count = parseInt(row.metricValues[0].value);
          return {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            percentage: Math.round((count / totalDeviceSessions) * 100),
          };
        }),
        sessions,
        connectedEmail: profile.google_connected_email,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
