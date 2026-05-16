import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  to: string;
  businessName: string;
  websiteUrl: string;
  overallScore: number;
  auditId: string;
}

function generateEmailHTML(data: EmailRequest): string {
  const { businessName, websiteUrl, overallScore, auditId } = data;
  const resultsUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.supabase.co')}/audit/results/${auditId}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Website Audit Results</title>
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
                  <p style="margin: 10px 0 0; color: #e5e7eb; font-size: 16px;">Your Website Audit Results</p>
                </td>
              </tr>

              <!-- Score Circle -->
              <tr>
                <td style="padding: 40px; text-align: center; background-color: #f9fafb;">
                  <div style="display: inline-block; position: relative;">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" stroke-width="12"/>
                      <circle cx="80" cy="80" r="70" fill="none" stroke="${overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#3b82f6' : '#ef4444'}" stroke-width="12" stroke-dasharray="${2 * Math.PI * 70}" stroke-dashoffset="${2 * Math.PI * 70 * (1 - overallScore / 100)}" transform="rotate(-90 80 80)" stroke-linecap="round"/>
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                      <div style="font-size: 48px; font-weight: bold; color: ${overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#3b82f6' : '#ef4444'};">${overallScore}</div>
                      <div style="font-size: 14px; color: #6b7280;">/ 100</div>
                    </div>
                  </div>
                  <h2 style="margin: 20px 0 5px; color: #111827; font-size: 24px;">${businessName}</h2>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">${websiteUrl}</p>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <h3 style="margin: 0 0 15px; color: #111827; font-size: 20px;">Growth Opportunity Identified</h3>
                  <p style="margin: 0 0 15px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Your website has <strong style="color: #111827;">${100 - overallScore} points</strong> of improvement opportunity. Our analysis has identified specific areas where you can increase traffic, improve conversions, and grow your business online.
                  </p>
                  <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    We've created a detailed report with actionable recommendations tailored specifically for ${businessName}.
                  </p>
                </td>
              </tr>

              <!-- CTA Button -->
              <tr>
                <td style="padding: 0 40px 40px; text-align: center;">
                  <a href="${resultsUrl}" style="display: inline-block; padding: 16px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">View Full Report</a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    This audit was generated for ${websiteUrl}. If you have any questions, we're here to help.
                  </p>
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

async function sendEmail(emailData: EmailRequest): Promise<boolean> {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

  // If no Resend API key, just log and return success (for testing)
  if (!RESEND_API_KEY) {
    console.log('No RESEND_API_KEY configured - email would be sent to:', emailData.to);
    console.log('Subject: Your Website Audit Results from WebPilot UK');
    console.log('Business:', emailData.businessName);
    console.log('Score:', emailData.overallScore);
    return true;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WebPilot <onboarding@resend.dev>',
        to: [emailData.to],
        subject: `Your Website Audit Results - ${emailData.overallScore}/100 Score`,
        html: generateEmailHTML(emailData),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return false;
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return true;

  } catch (error) {
    console.error('Error sending email:', error);
    return false;
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
    const emailData: EmailRequest = await req.json();

    if (!emailData.to || !emailData.businessName || !emailData.auditId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const success = await sendEmail(emailData);

    if (success) {
      return new Response(
        JSON.stringify({ message: 'Email sent successfully' }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

  } catch (error) {
    console.error('Error in send-audit-email function:', error);
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
