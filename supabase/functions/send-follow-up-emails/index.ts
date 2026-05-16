import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FollowUpEmailData {
  to: string;
  businessName: string;
  websiteUrl: string;
  overallScore: number;
  auditId: string;
  daysSinceAudit: number;
}

function generateFollowUpHTML(data: FollowUpEmailData): string {
  const { businessName, websiteUrl, overallScore, auditId, daysSinceAudit } = data;
  const resultsUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.supabase.co')}/audit/results/${auditId}`;

  // Different messages based on days since audit
  let subject = '';
  let mainMessage = '';

  if (daysSinceAudit === 1) {
    subject = `Ready to improve ${businessName}'s online performance?`;
    mainMessage = `
      <p style="margin: 0 0 15px; color: #4b5563; font-size: 16px; line-height: 1.6;">
        Yesterday, you received your website audit showing <strong style="color: #111827;">${100 - overallScore} points</strong> of improvement opportunity for ${businessName}.
      </p>
      <p style="margin: 0 0 15px; color: #4b5563; font-size: 16px; line-height: 1.6;">
        We wanted to reach out and offer you a <strong style="color: #111827;">free 30-minute strategy call</strong> to discuss exactly how we can help you capture this growth.
      </p>
    `;
  } else if (daysSinceAudit === 3) {
    subject = `Don't let this opportunity slip - ${businessName}`;
    mainMessage = `
      <p style="margin: 0 0 15px; color: #4b5563; font-size: 16px; line-height: 1.6;">
        Three days ago, we identified <strong style="color: #111827;">${100 - overallScore} points</strong> of untapped potential in your website.
      </p>
      <p style="margin: 0 0 15px; color: #4b5563; font-size: 16px; line-height: 1.6;">
        While your competitors are optimizing their online presence, you could be implementing the exact improvements that will help ${businessName} stand out.
      </p>
      <p style="margin: 0 0 15px; color: #4b5563; font-size: 16px; line-height: 1.6;">
        <strong style="color: #111827;">Book your free strategy call today</strong> and we'll create a custom roadmap for your growth.
      </p>
    `;
  } else {
    subject = `Final reminder: Your growth opportunity awaits`;
    mainMessage = `
      <p style="margin: 0 0 15px; color: #4b5563; font-size: 16px; line-height: 1.6;">
        We wanted to give you one final reminder about the <strong style="color: #111827;">${100 - overallScore} points</strong> of improvement we identified for ${businessName}.
      </p>
      <p style="margin: 0 0 15px; color: #4b5563; font-size: 16px; line-height: 1.6;">
        Every day without optimization is a day of missed opportunities. Your competitors aren't waiting - and neither should you.
      </p>
      <p style="margin: 0 0 15px; color: #4b5563; font-size: 16px; line-height: 1.6;">
        <strong style="color: #111827;">This is your last chance</strong> to book a free strategy call and unlock your website's full potential.
      </p>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1f2937 0%, #000000 100%); padding: 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Value-Connection</h1>
                  <p style="margin: 10px 0 0; color: #e5e7eb; font-size: 16px;">Your Growth Opportunity Awaits</p>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px;">${businessName}</h2>
                  ${mainMessage}
                </td>
              </tr>

              <!-- Benefits -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <h3 style="margin: 0 0 15px; color: #111827; font-size: 18px;">What You'll Get on the Call:</h3>
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
                        <span style="color: #4b5563; font-size: 15px;">Personalized growth roadmap for ${businessName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
                        <span style="color: #4b5563; font-size: 15px;">Expert analysis of your biggest opportunities</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
                        <span style="color: #4b5563; font-size: 15px;">Custom strategy to increase traffic and conversions</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
                        <span style="color: #4b5563; font-size: 15px;">Zero obligation - just valuable insights</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA Buttons -->
              <tr>
                <td style="padding: 0 40px 20px; text-align: center;">
                  <a href="${resultsUrl}" style="display: inline-block; padding: 16px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin-bottom: 12px;">Book Your Free Strategy Call</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px 40px; text-align: center;">
                  <a href="${resultsUrl}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">View Your Full Audit Report</a>
                </td>
              </tr>

              <!-- Social Proof -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px; font-style: italic; line-height: 1.6;">
                    "Value-Connection helped us increase our online leads by 300% in just 3 months. The strategy call alone gave us actionable insights we could implement immediately."
                  </p>
                  <p style="margin: 0; color: #111827; font-size: 14px; font-weight: 600;">
                    - Sarah Mitchell, CEO of TechStart UK
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #ffffff;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    Best regards,<br>
                    <strong style="color: #111827;">The Value-Connection Team</strong>
                  </p>
                </td>
              </tr>
            </table>

            <!-- Footer Links -->
            <table role="presentation" style="width: 600px; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="text-align: center; padding: 0 40px;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © 2024 Value-Connection. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

async function sendFollowUpEmail(emailData: FollowUpEmailData): Promise<boolean> {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

  // If no Resend API key, just log and return success (for testing)
  if (!RESEND_API_KEY) {
    console.log('No RESEND_API_KEY configured - follow-up email would be sent to:', emailData.to);
    console.log('Business:', emailData.businessName);
    console.log('Days since audit:', emailData.daysSinceAudit);
    return true;
  }

  try {
    let subject = '';
    if (emailData.daysSinceAudit === 1) {
      subject = `Ready to improve ${emailData.businessName}'s online performance?`;
    } else if (emailData.daysSinceAudit === 3) {
      subject = `Don't let this opportunity slip - ${emailData.businessName}`;
    } else {
      subject = `Final reminder: Your growth opportunity awaits`;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Value-Connection <gamati.ismael@gmail.com>',
        to: [emailData.to],
        subject: subject,
        html: generateFollowUpHTML(emailData),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return false;
    }

    const result = await response.json();
    console.log('Follow-up email sent successfully:', result);
    return true;

  } catch (error) {
    console.error('Error sending follow-up email:', error);
    return false;
  }
}

async function processFollowUps() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get audits from 1, 3, and 7 days ago
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const targets = [
    { date: oneDayAgo, days: 1 },
    { date: threeDaysAgo, days: 3 },
    { date: sevenDaysAgo, days: 7 },
  ];

  const results = [];

  for (const target of targets) {
    const startOfDay = new Date(target.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(target.date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: audits, error } = await supabase
      .from('audits')
      .select('*')
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString());

    if (error) {
      console.error(`Error fetching audits for ${target.days} days ago:`, error);
      continue;
    }

    if (audits && audits.length > 0) {
      for (const audit of audits) {
        const emailData: FollowUpEmailData = {
          to: audit.email,
          businessName: audit.business_name,
          websiteUrl: audit.website_url,
          overallScore: audit.overall_score,
          auditId: audit.id,
          daysSinceAudit: target.days,
        };

        const sent = await sendFollowUpEmail(emailData);
        results.push({
          email: audit.email,
          days: target.days,
          sent,
        });
      }
    }
  }

  return results;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // This endpoint can be called via cron job or manually
    const results = await processFollowUps();

    return new Response(
      JSON.stringify({
        message: 'Follow-up emails processed',
        results,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error in send-follow-up-emails function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
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
