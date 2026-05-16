import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Target, Heart, Zap, Shield } from 'lucide-react';

export function About() {
  const values = [
    {
      icon: Target,
      title: 'Results-Focused',
      description: 'Every decision we make is guided by delivering measurable results for your business',
    },
    {
      icon: Heart,
      title: 'Client-Centric',
      description: 'Your success is our success. We build long-term partnerships, not one-off projects',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage the latest technology and AI to deliver cutting-edge solutions',
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Clear pricing, honest communication, and full visibility into your project progress',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-16">
        <section className="bg-gradient-to-br from-gray-900 to-black border-b border-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                About Value-Connection
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Track your website performance as easily as you check your social media stats
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We asked ourselves a simple question: why is it harder to check your website performance than it is to check your Instagram likes?
                </p>
                <p>
                  Social media made it effortless to track views, engagement, and growth in real-time. But for your actual business website? You'd need multiple logins, confusing dashboards, expensive consultants, and a degree in analytics just to understand if anyone's even visiting.
                </p>
                <p>
                  That didn't make sense to us. Your website is one of your most important business assets, yet tracking its performance felt like rocket science.
                </p>
                <p>
                  So we built Value-Connection as a simple, intuitive platform where you can see your website traffic, rankings, and conversions as easily as checking your social media stats. No jargon. No complexity. Just clear insights you can actually use.
                </p>
                <p>
                  Think of it as your website's performance dashboard, designed for business owners who want to grow online without needing to become tech experts.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                These principles guide everything we do at Value-Connection
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} hover>
                    <CardBody className="text-center">
                      <div className="bg-gray-950 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{value.description}</p>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-black to-gray-800 rounded-2xl p-8 sm:p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Why Choose Value-Connection?</h2>
              <p className="text-xl text-gray-100 mb-8 leading-relaxed">
                Finally, a platform that makes website performance as simple and accessible as checking your phone.
              </p>
              <div className="grid sm:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="text-4xl font-bold mb-2">200+</div>
                  <div className="text-gray-100">Active Clients</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">47%</div>
                  <div className="text-gray-100">Avg Traffic Increase</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">4.9/5</div>
                  <div className="text-gray-100">Client Satisfaction</div>
                </div>
              </div>
              <Link to="/signup">
                <Button size="lg" variant="secondary">
                  Start Free 14-Day Trial
                </Button>
              </Link>
              <p className="text-sm text-gray-400 mt-3">No credit card required · Cancel anytime</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
