import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Globe, Search, BarChart3, Wrench, FileText, Headphones, CheckCircle2 } from 'lucide-react';

export function Services() {
  const services = [
    {
      icon: Globe,
      title: 'Website Design & Build',
      description: 'Modern, responsive websites tailored to your business goals and brand identity',
      features: [
        'Custom design aligned with your brand',
        'Mobile-first responsive approach',
        'Fast loading times',
        'Conversion-focused layouts',
      ],
    },
    {
      icon: Search,
      title: 'SEO Optimisation',
      description: 'Get found by customers searching for your services on Google and other search engines',
      features: [
        'Keyword research and strategy',
        'On-page SEO optimisation',
        'Technical SEO improvements',
        'Local SEO for UK markets',
      ],
    },
    {
      icon: BarChart3,
      title: 'Performance Monitoring',
      description: 'Track your website performance with real-time dashboards and detailed monthly reports',
      features: [
        'Traffic and conversion tracking',
        'User behaviour analysis',
        'Competitor benchmarking',
        'Monthly performance reports',
      ],
    },
    {
      icon: Wrench,
      title: 'Ongoing Maintenance',
      description: 'Keep your website secure, up-to-date, and performing at its best',
      features: [
        'Regular content updates',
        'Security monitoring',
        'Plugin and software updates',
        'Performance optimisation',
      ],
    },
    {
      icon: FileText,
      title: 'Content Management',
      description: 'Professional content creation and management to engage your audience',
      features: [
        'SEO-optimised copywriting',
        'Blog and news management',
        'Image optimisation',
        'Content calendar planning',
      ],
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      description: 'Get expert help whenever you need it with our responsive UK-based support team',
      features: [
        'Email and chat support',
        'Project dashboard access',
        'Priority issue resolution',
        'Strategic growth advice',
      ],
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
                Comprehensive Website Services
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Everything you need to build, grow, and manage your online presence in one subscription-based platform
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} hover>
                    <CardHeader>
                      <div className="bg-gray-950 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <Icon className="h-7 w-7 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                    </CardHeader>
                    <CardBody>
                      <p className="text-gray-300 mb-4 leading-relaxed">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-200">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Start your free 14-day trial and see exactly how your website is performing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg">Start Free 14-Day Trial</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">View Pricing Plans</Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">No credit card required · Cancel anytime</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
