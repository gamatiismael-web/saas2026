import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card, CardBody, CardFooter, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { CheckCircle2, X, Shield, Clock, TrendingUp } from 'lucide-react';
import { Testimonials } from '../components/ui/Testimonials';

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 20,
      description: 'Essential tracking for small businesses',
      tagline: 'Perfect for getting started',
      features: [
        { included: true, text: 'Website Audit', highlight: true },
        { included: true, text: 'Google Analytics Setup', highlight: true },
        { included: true, text: 'Monthly Performance Report', highlight: true },
        { included: true, text: 'Email Support', highlight: false },
        { included: false, text: 'SEO Ranking Tracking', highlight: false },
        { included: false, text: 'Improvement Recommendations', highlight: false },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Growth',
      price: 30,
      description: 'Everything in Starter plus SEO tracking',
      tagline: 'Most popular for growing businesses',
      features: [
        { included: true, text: 'Everything in Starter', highlight: false },
        { included: true, text: 'Website Audit', highlight: false },
        { included: true, text: 'Google Analytics Setup', highlight: false },
        { included: true, text: 'Monthly Performance Report', highlight: false },
        { included: true, text: 'SEO Ranking Tracking', highlight: true },
        { included: false, text: 'Improvement Recommendations', highlight: false },
      ],
      cta: 'Choose Growth',
      popular: true,
    },
    {
      name: 'Pro',
      price: 50,
      description: 'Complete package with expert recommendations',
      tagline: 'Best value for serious growth',
      features: [
        { included: true, text: 'Everything in Growth', highlight: false },
        { included: true, text: 'Website Audit', highlight: false },
        { included: true, text: 'Google Analytics Setup', highlight: false },
        { included: true, text: 'Monthly Performance Report', highlight: false },
        { included: true, text: 'SEO Ranking Tracking', highlight: false },
        { included: true, text: 'Improvement Recommendations', highlight: true },
      ],
      cta: 'Go Pro',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-16">
        <section className="bg-gradient-to-br from-gray-900 to-black py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Simple, Affordable Pricing
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Choose the plan that fits your needs. All plans include easy-to-understand reports and insights.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                <div className="inline-flex items-center space-x-3 bg-blue-500 text-white px-6 py-3 rounded-full">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">30-Day Money-Back Guarantee</span>
                </div>
                <div className="inline-flex items-center space-x-3 bg-red-600 text-white px-6 py-3 rounded-full animate-pulse">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Limited Offer: First Month 50% Off</span>
                </div>
              </div>
              <p className="text-base text-gray-400">
                All prices in GBP • Cancel anytime • No hidden fees
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={plan.popular ? 'ring-2 ring-white relative' : ''}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    {plan.popular && (
                      <div className="mb-3">
                        <span className="inline-flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          <TrendingUp className="h-3 w-3" />
                          <span>87% Choose This</span>
                        </span>
                      </div>
                    )}
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-2xl text-gray-500 line-through">£{plan.price * 2}</span>
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">50% OFF</span>
                      </div>
                      <span className="text-5xl font-bold text-white">£{plan.price}</span>
                      <span className="text-gray-300">/month</span>
                      <p className="text-xs text-gray-400 mt-1">First month, then £{plan.price * 2}/month</p>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{plan.description}</p>
                  </CardHeader>
                  <CardBody>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          {feature.included ? (
                            <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                          )}
                          <span
                            className={feature.included ? 'text-gray-200' : 'text-gray-500'}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                  <CardFooter>
                    <Link to="/signup" className="block">
                      <Button
                        variant={plan.popular ? 'primary' : 'outline'}
                        fullWidth
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>14-day free trial included</span>
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Testimonials />

        <section className="py-16 bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <Card className="border-2 border-blue-500">
                <CardBody>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">What's your money-back guarantee?</h3>
                      <p className="text-gray-300">
                        We offer a 14-day money-back guarantee on all plans. If you're not completely satisfied with our service within the first 14 days, we'll refund your payment in full - no questions asked. That's how confident we are that you'll see value.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-white mb-2">Is there a setup fee?</h3>
                  <p className="text-gray-300">
                    No setup fees. Your first month covers the initial build and setup of your website.
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-white mb-2">Can I cancel anytime?</h3>
                  <p className="text-gray-300">
                    Yes, you can cancel your subscription at any time with 30 days notice. No long-term contracts.
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-white mb-2">What if I need to upgrade or downgrade?</h3>
                  <p className="text-gray-300">
                    You can change your plan at any time. Upgrades take effect immediately, downgrades at your next billing cycle.
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-white mb-2">What's included in hosting?</h3>
                  <p className="text-gray-300">
                    All plans include secure hosting, SSL certificate, daily backups, and 99.9% uptime guarantee.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Not Sure Which Plan is Right?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Start your free 14-day trial and explore all features before committing to a plan
            </p>
            <Link to="/signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">No credit card required · Cancel anytime</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
