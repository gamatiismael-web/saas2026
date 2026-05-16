import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, AlertCircle, TrendingUp, Calendar, DollarSign, Target, Zap, ArrowRight } from 'lucide-react';
import { supabase, Audit } from '../lib/supabase';

export function AuditResults() {
  const { id } = useParams<{ id: string }>();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAudit = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error loading audit:', error);
      } else {
        setAudit(data);
      }
      setLoading(false);
    };

    loadAudit();

    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Audit Not Found</h1>
          <p className="text-gray-400 mb-8">We couldn't find the audit you're looking for.</p>
          <Link to="/audit">
            <Button>Start New Audit</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-blue-500';
    if (score >= 60) return 'text-blue-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-blue-500';
    if (score >= 60) return 'bg-blue-500';
    return 'bg-red-500';
  };

  const packageDetails: Record<string, { name: string; price: number; description: string }> = {
    starter: {
      name: 'Starter',
      price: 297,
      description: 'Perfect for establishing your online presence',
    },
    growth: {
      name: 'Growth',
      price: 497,
      description: 'Ideal for scaling your business online',
    },
    pro: {
      name: 'Pro',
      price: 797,
      description: 'Maximum results for ambitious businesses',
    },
  };

  const recommendedPlan = packageDetails[audit.recommended_package];

  const calculateBusinessImpact = () => {
    const improvementPoints = 100 - audit.overall_score;
    const estimatedTrafficIncrease = Math.round(improvementPoints * 2.5);
    const estimatedConversionIncrease = Math.round(improvementPoints * 1.2);
    const currentMonthlyVisitors = 1000;
    const currentConversionRate = 0.02;
    const averageOrderValue = 150;

    const currentMonthlyRevenue = currentMonthlyVisitors * currentConversionRate * averageOrderValue;
    const projectedVisitors = currentMonthlyVisitors * (1 + estimatedTrafficIncrease / 100);
    const projectedConversionRate = currentConversionRate * (1 + estimatedConversionIncrease / 100);
    const projectedRevenue = projectedVisitors * projectedConversionRate * averageOrderValue;
    const monthlyRevenueIncrease = projectedRevenue - currentMonthlyRevenue;

    return {
      trafficIncrease: estimatedTrafficIncrease,
      conversionIncrease: estimatedConversionIncrease,
      monthlyRevenueIncrease: Math.round(monthlyRevenueIncrease),
      annualRevenueIncrease: Math.round(monthlyRevenueIncrease * 12),
      roi: Math.round((monthlyRevenueIncrease * 12 - recommendedPlan.price * 12) / (recommendedPlan.price * 12) * 100)
    };
  };

  const businessImpact = calculateBusinessImpact();

  const quickWins = [
    {
      title: "Add Clear Call-to-Action Above the Fold",
      impact: "Easy",
      time: "10 min",
      description: "Place a prominent button or form in the first screen visitors see. Use action words like 'Get Started' or 'Book Now'."
    },
    {
      title: "Optimize Page Load Speed",
      impact: "Medium",
      time: "30 min",
      description: "Compress images using tools like TinyPNG, enable browser caching, and minimize CSS/JS files."
    },
    {
      title: "Add Customer Testimonials",
      impact: "Easy",
      time: "20 min",
      description: "Display 3-5 customer reviews with names and photos on your homepage and key landing pages."
    },
    {
      title: "Improve Mobile Menu Navigation",
      impact: "Easy",
      time: "15 min",
      description: "Ensure your mobile menu is easy to tap, opens quickly, and shows your most important pages first."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-16">
        <section className="bg-gradient-to-br from-gray-900 to-black border-b border-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <CheckCircle2 className="h-4 w-4" />
                <span>Analysis Complete</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Your Growth Opportunity Report
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                {audit.business_name}
              </p>
              <p className="text-base text-gray-400">
                {audit.website_url}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-2 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">Website Performance Score</h2>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Overall Rating</span>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <svg className="w-48 h-48 transform -rotate-90">
                            <circle
                              cx="96"
                              cy="96"
                              r="88"
                              stroke="#e5e7eb"
                              strokeWidth="12"
                              fill="none"
                            />
                            <circle
                              cx="96"
                              cy="96"
                              r="88"
                              stroke="currentColor"
                              strokeWidth="12"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 88}`}
                              strokeDashoffset={`${2 * Math.PI * 88 * (1 - audit.overall_score / 100)}`}
                              className={getScoreColor(audit.overall_score)}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className={`text-5xl font-bold ${getScoreColor(audit.overall_score)}`}>
                                {audit.overall_score}
                              </div>
                              <div className="text-sm text-gray-500 font-medium">/ 100</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-white mb-2">Growth Potential</h3>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            Your website has <strong className="text-white">{100 - audit.overall_score} points</strong> of improvement opportunity. Our platform can help you capture this growth systematically.
                          </p>
                        </div>
                        <div className="pt-4 border-t border-gray-800">
                          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Benchmarked Against</div>
                          <p className="text-sm text-gray-200">200+ UK SME websites in {audit.industry}</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="border-2 border-green-500">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500 rounded-lg p-2">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Estimated Business Impact</h2>
                        <p className="text-gray-300 text-sm">What these improvements could mean for your revenue</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-black rounded-lg p-6 text-center">
                        <div className="text-green-500 font-semibold text-sm mb-2">Traffic Growth</div>
                        <div className="text-4xl font-bold text-white mb-1">+{businessImpact.trafficIncrease}%</div>
                        <div className="text-gray-400 text-xs">Organic visitors</div>
                      </div>
                      <div className="bg-black rounded-lg p-6 text-center">
                        <div className="text-green-500 font-semibold text-sm mb-2">Conversion Lift</div>
                        <div className="text-4xl font-bold text-white mb-1">+{businessImpact.conversionIncrease}%</div>
                        <div className="text-gray-400 text-xs">More customers</div>
                      </div>
                      <div className="bg-black rounded-lg p-6 text-center">
                        <div className="text-green-500 font-semibold text-sm mb-2">Revenue Increase</div>
                        <div className="text-4xl font-bold text-white mb-1">£{businessImpact.monthlyRevenueIncrease.toLocaleString()}</div>
                        <div className="text-gray-400 text-xs">Per month</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-700 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm text-green-300 font-medium mb-1">12-Month Projection</div>
                          <div className="text-3xl font-bold text-white mb-2">
                            +£{businessImpact.annualRevenueIncrease.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-300">
                            Additional annual revenue at current pricing
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-300 font-medium mb-1">Return on Investment</div>
                          <div className="text-3xl font-bold text-green-400">
                            {businessImpact.roi}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 text-center">
                      *Projections based on industry benchmarks for similar improvement projects. Actual results may vary.
                    </p>
                  </CardBody>
                </Card>

                <Card className="border-2 border-yellow-500">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-500 rounded-lg p-2">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Quick Wins You Can Implement Today</h2>
                        <p className="text-gray-300 text-sm">Start improving immediately while you consider our services</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    {quickWins.map((win, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-black rounded-lg border border-gray-800 hover:border-yellow-500 transition-colors"
                      >
                        <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">{win.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="success">{win.impact}</Badge>
                              <span className="text-xs text-gray-400">{win.time}</span>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{win.description}</p>
                        </div>
                      </div>
                    ))}
                    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mt-4">
                      <p className="text-sm text-yellow-200">
                        <strong>Pro Tip:</strong> These are just the beginning. Our platform provides a systematic approach to implement 20+ optimizations tailored to your industry and business goals.
                      </p>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-white">Detailed Breakdown</h2>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white">Homepage Clarity</span>
                        <span className={`font-semibold ${getScoreColor(audit.homepage_clarity_score)}`}>
                          {audit.homepage_clarity_score}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreBgColor(audit.homepage_clarity_score)} rounded-full transition-all duration-500`}
                          style={{ width: `${audit.homepage_clarity_score}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white">SEO Performance</span>
                        <span className={`font-semibold ${getScoreColor(audit.seo_score)}`}>
                          {audit.seo_score}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreBgColor(audit.seo_score)} rounded-full transition-all duration-500`}
                          style={{ width: `${audit.seo_score}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white">Conversion Optimization</span>
                        <span className={`font-semibold ${getScoreColor(audit.conversion_score)}`}>
                          {audit.conversion_score}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreBgColor(audit.conversion_score)} rounded-full transition-all duration-500`}
                          style={{ width: `${audit.conversion_score}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white">Mobile Experience</span>
                        <span className={`font-semibold ${getScoreColor(audit.mobile_score)}`}>
                          {audit.mobile_score}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreBgColor(audit.mobile_score)} rounded-full transition-all duration-500`}
                          style={{ width: `${audit.mobile_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-white">Top Recommendations</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    {audit.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-black rounded-lg"
                      >
                        {rec.priority === 'high' ? (
                          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-white">{rec.title}</h3>
                            <Badge variant={rec.priority === 'high' ? 'error' : 'info'}>
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardBody>
                </Card>

                <Card className="border-2 border-blue-500">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 rounded-lg p-2">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Book Your Free Strategy Call</h2>
                        <p className="text-gray-300 text-sm">Let's discuss how to implement these improvements</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="mb-4 space-y-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <span>30-minute personalized consultation</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <span>Custom growth roadmap for your business</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <span>No obligation, just expert advice</span>
                      </div>
                    </div>
                    <div
                      className="calendly-inline-widget"
                      data-url="https://calendly.com/your-calendly-username/30min?hide_landing_page_details=1&hide_gdpr_banner=1"
                      style={{ minWidth: '320px', height: '700px' }}
                    ></div>
                  </CardBody>
                </Card>
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <h3 className="text-xl font-bold text-white">Recommended Plan</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-blue-500 mb-2">
                        {recommendedPlan.name}
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">
                        £{recommendedPlan.price}
                        <span className="text-base text-gray-300 font-normal">/month</span>
                      </div>
                      <p className="text-sm text-gray-300">{recommendedPlan.description}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-white mb-1">
                            Estimated Improvement
                          </div>
                          <div className="text-2xl font-bold text-blue-500">
                            +{100 - audit.overall_score} points
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link to="/pricing">
                      <Button
                        size="lg"
                        fullWidth
                        className="mb-3"
                      >
                        <Target className="h-5 w-5 mr-2" />
                        Get Started Now
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      className="mb-4"
                      onClick={() => {
                        document.querySelector('.calendly-inline-widget')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Free Call First
                    </Button>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">
                        30-day money-back guarantee • Cancel anytime
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
