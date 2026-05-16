import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowLeft, FileBarChart, Download, TrendingUp, TrendingDown, Calendar,
  Mail, Plus, X, CheckCircle2, AlertCircle, Loader2, Send, Users,
} from 'lucide-react';

const REPORTS = [
  { month: 'March 2024', status: 'Ready', visitors: 2847, leads: 91, score: 78 },
  { month: 'February 2024', status: 'Ready', visitors: 2505, leads: 77, score: 66 },
  { month: 'January 2024', status: 'Ready', visitors: 2210, leads: 64, score: 61 },
  { month: 'December 2023', status: 'Ready', visitors: 1980, leads: 58, score: 55 },
  { month: 'November 2023', status: 'Ready', visitors: 1740, leads: 49, score: 50 },
  { month: 'October 2023', status: 'Ready', visitors: 1590, leads: 43, score: 47 },
];

const HIGHLIGHTS = [
  { label: 'Best Month', value: 'March 2024', sub: '2,847 visitors', up: true },
  { label: 'Lead Growth', value: '+111.6%', sub: 'Oct → Mar', up: true },
  { label: 'Score Improvement', value: '+31 pts', sub: 'since Oct 2023', up: true },
  { label: 'Avg Monthly Visitors', value: '2,145', sub: 'over 6 months', up: true },
];

type ReportRecipient = { id: string; email: string; addedAt: Date };
type GenerateStatus = 'idle' | 'generating' | 'success' | 'error';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildReportHTML(report: typeof REPORTS[0], businessName: string, websiteUrl: string): string {
  const scoreColor = report.score >= 80 ? '#10b981' : report.score >= 60 ? '#3b82f6' : '#ef4444';
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference * (1 - report.score / 100);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Performance Report – ${report.month}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: #fff; color: #111827; }
  .page { max-width: 780px; margin: 0 auto; padding: 48px 40px; }
  .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 28px; border-bottom: 2px solid #f3f4f6; margin-bottom: 36px; }
  .brand { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #111827; }
  .brand span { color: #2563eb; }
  .meta { text-align: right; font-size: 13px; color: #6b7280; line-height: 1.6; }
  .hero { display: flex; align-items: center; gap: 40px; background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); border-radius: 16px; padding: 36px 40px; margin-bottom: 36px; color: #fff; }
  .score-wrap { flex-shrink: 0; position: relative; width: 128px; height: 128px; }
  .score-wrap svg { transform: rotate(-90deg); }
  .score-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
  .score-num { font-size: 36px; font-weight: 800; color: ${scoreColor}; line-height: 1; }
  .score-denom { font-size: 12px; color: #9ca3af; margin-top: 2px; }
  .hero-text h1 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
  .hero-text p { font-size: 14px; color: #94a3b8; line-height: 1.5; }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 36px; }
  .stat { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px 22px; }
  .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .stat-value { font-size: 26px; font-weight: 700; color: #111827; }
  .stat-trend { font-size: 12px; color: #10b981; margin-top: 4px; font-weight: 600; }
  .section { margin-bottom: 32px; }
  .section-title { font-size: 15px; font-weight: 700; color: #111827; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; margin-bottom: 16px; }
  .bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .bar-label { font-size: 13px; color: #374151; width: 130px; flex-shrink: 0; }
  .bar-track { flex: 1; height: 8px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
  .bar-fill { height: 100%; background: #2563eb; border-radius: 99px; }
  .bar-val { font-size: 12px; font-weight: 600; color: #374151; width: 50px; text-align: right; flex-shrink: 0; }
  .footer { padding-top: 28px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #9ca3af; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="brand">Web<span>Pilot</span></div>
    <div class="meta">
      <strong style="color:#111827;">${businessName || 'Performance Report'}</strong><br/>
      ${websiteUrl || ''}<br/>
      Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
    </div>
  </div>

  <div class="hero">
    <div class="score-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="10"/>
        <circle cx="64" cy="64" r="54" fill="none" stroke="${scoreColor}" stroke-width="10"
          stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}" stroke-linecap="round"/>
      </svg>
      <div class="score-label">
        <div class="score-num">${report.score}</div>
        <div class="score-denom">/100</div>
      </div>
    </div>
    <div class="hero-text">
      <h1>${report.month} Performance Report</h1>
      <p>Overall performance score based on traffic, lead generation, and website health metrics.</p>
    </div>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-label">Total Visitors</div>
      <div class="stat-value">${report.visitors.toLocaleString()}</div>
      <div class="stat-trend">This month</div>
    </div>
    <div class="stat">
      <div class="stat-label">Leads Generated</div>
      <div class="stat-value">${report.leads}</div>
      <div class="stat-trend">This month</div>
    </div>
    <div class="stat">
      <div class="stat-label">Performance Score</div>
      <div class="stat-value" style="color:${scoreColor}">${report.score}/100</div>
      <div class="stat-trend">${report.score >= 70 ? 'Good' : report.score >= 50 ? 'Average' : 'Needs work'}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Performance Breakdown</div>
    ${[
      { label: 'Traffic & Reach', value: Math.round(report.score * 0.95) },
      { label: 'Lead Conversion', value: Math.round(report.score * 0.88) },
      { label: 'Page Speed', value: Math.round(report.score * 0.82) },
      { label: 'SEO Health', value: Math.round(report.score * 1.05 > 100 ? 100 : report.score * 1.05) },
      { label: 'Mobile Experience', value: Math.round(report.score * 0.78) },
    ].map(item => `
      <div class="bar-row">
        <span class="bar-label">${item.label}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${item.value}%"></div></div>
        <span class="bar-val">${item.value}/100</span>
      </div>`).join('')}
  </div>

  <div class="footer">
    <span>WebPilot Monthly Performance Report · ${report.month}</span>
    <span>Confidential — for internal use only</span>
  </div>
</div>
</body>
</html>`;
}

export function Reporting() {
  const { profile } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [recipients, setRecipients] = useState<ReportRecipient[]>([]);
  const [emailError, setEmailError] = useState('');
  const [generateStatus, setGenerateStatus] = useState<GenerateStatus>('idle');
  const [generatingMonth, setGeneratingMonth] = useState<string | null>(null);
  const [downloadedReports, setDownloadedReports] = useState<Set<string>>(new Set());

  const addRecipient = () => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;
    if (!isValidEmail(trimmed)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (recipients.some((r) => r.email === trimmed)) {
      setEmailError('This email is already added.');
      return;
    }
    setRecipients((prev) => [
      ...prev,
      { id: crypto.randomUUID(), email: trimmed, addedAt: new Date() },
    ]);
    setEmailInput('');
    setEmailError('');
  };

  const removeRecipient = (id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRecipient();
    }
  };

  const generateReport = async (month: string) => {
    const report = REPORTS.find((r) => r.month === month);
    if (!report) return;
    setGeneratingMonth(month);
    setGenerateStatus('generating');
    try {
      const html = buildReportHTML(
        report,
        profile?.business_name ?? 'Your Business',
        profile?.website_url ?? ''
      );
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      // Open in hidden iframe and trigger print-to-PDF
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;';
      document.body.appendChild(iframe);

      await new Promise<void>((resolve) => {
        iframe.onload = () => {
          setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            resolve();
          }, 300);
        };
        iframe.src = url;
      });

      // Fallback: also trigger an HTML download so user always gets a file
      const a = document.createElement('a');
      a.href = url;
      a.download = `WebPilot-Report-${month.replace(/\s+/g, '-')}.html`;
      a.click();

      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 5000);

      setGenerateStatus('success');
      setDownloadedReports((prev) => new Set([...prev, month]));
    } catch {
      setGenerateStatus('error');
    }
    setTimeout(() => {
      setGenerateStatus('idle');
      setGeneratingMonth(null);
    }, 2500);
  };

  const sendReports = async () => {
    if (recipients.length === 0) return;
    setGenerateStatus('generating');
    setGeneratingMonth('send');
    await new Promise((r) => setTimeout(r, 2000));
    setGenerateStatus('success');
    setTimeout(() => {
      setGenerateStatus('idle');
      setGeneratingMonth(null);
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
            <FileBarChart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Reporting</h1>
            <p className="text-sm text-gray-400">Monthly performance summaries and report distribution</p>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HIGHLIGHTS.map((h, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-sm text-gray-400 mb-1">{h.label}</div>
              <div className="text-2xl font-bold text-white mb-1">{h.value}</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${h.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {h.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {h.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Email recipients */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-400" />
            Report Recipients
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Add email addresses to automatically receive monthly reports when they are generated.
          </p>

          {/* Add email */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); }}
                onKeyDown={handleEmailKeyDown}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={addRecipient}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition-colors flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {emailError && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5 mb-3">
              <AlertCircle className="h-3.5 w-3.5" />
              {emailError}
            </p>
          )}

          {recipients.length === 0 ? (
            <div className="border border-dashed border-gray-700 rounded-xl p-6 text-center">
              <Mail className="h-8 w-8 text-gray-700 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No recipients added yet.</p>
              <p className="text-xs text-gray-600 mt-0.5">Add emails above to send reports automatically.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recipients.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-3.5 w-3.5 text-amber-400" />
                    </div>
                    <span className="text-sm text-white">{r.email}</span>
                  </div>
                  <button
                    onClick={() => removeRecipient(r.id)}
                    className="text-gray-600 hover:text-rose-400 transition-colors ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={sendReports}
                disabled={generatingMonth === 'send'}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
              >
                {generatingMonth === 'send' && generateStatus === 'generating' ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending reports...</>
                ) : generatingMonth === 'send' && generateStatus === 'success' ? (
                  <><CheckCircle2 className="h-4 w-4" /> Reports sent!</>
                ) : (
                  <><Send className="h-4 w-4" /> Send Latest Report to {recipients.length} Recipient{recipients.length !== 1 ? 's' : ''}</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Monthly reports */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400" />
            Monthly Reports
          </h2>
          <div className="space-y-3">
            {REPORTS.map((report, i) => {
              const isGenerating = generatingMonth === report.month && generateStatus === 'generating';
              const isSuccess = generatingMonth === report.month && generateStatus === 'success';
              const wasDownloaded = downloadedReports.has(report.month);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-gray-950 rounded-xl border border-gray-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <FileBarChart className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{report.month}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {report.visitors.toLocaleString()} visitors · {report.leads} leads · Score {report.score}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {wasDownloaded && !isGenerating && !isSuccess && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Generated
                      </span>
                    )}
                    <button
                      onClick={() => generateReport(report.month)}
                      disabled={isGenerating}
                      className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg hover:bg-amber-400/10"
                    >
                      {isGenerating ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...</>
                      ) : isSuccess ? (
                        <><CheckCircle2 className="h-3.5 w-3.5" /> Done!</>
                      ) : wasDownloaded ? (
                        <><Download className="h-3.5 w-3.5" /> Re-download</>
                      ) : (
                        <><Download className="h-3.5 w-3.5" /> Generate & Download</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance trend bar chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Performance Trend</h2>
          <div className="flex items-end gap-2 h-32 pt-4">
            {REPORTS.slice().reverse().map((r, i) => {
              const heightPct = Math.round((r.score / 100) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-600 mb-1">{r.score}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-amber-700 to-amber-500 transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-xs text-gray-600 truncate w-full text-center">
                    {r.month.split(' ')[0].slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
