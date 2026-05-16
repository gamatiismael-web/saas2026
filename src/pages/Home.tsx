import { Link } from 'react-router-dom';
import { ArrowRight, Target, Rocket, BarChart3, Star, Gauge, LineChart, Shield } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';

export function Home() {
  const benefits = [
    { icon: Gauge, title: 'Real-Time Performance Tracking', description: 'See your website stats as easily as checking social media' },
    { icon: LineChart, title: 'Simple Visual Reports', description: 'Clear graphs and insights you can actually understand' },
    { icon: BarChart3, title: 'Traffic & Conversion Metrics', description: 'Know exactly how many visitors you get and what they do' },
    { icon: Shield, title: 'Automated Monitoring', description: 'We watch your site 24/7 so you do not have to worry' },
  ];

  const steps = [
    {
      icon: Target,
      number: '01',
      title: 'Connect Your Website',
      description: 'Quick setup in minutes. No technical knowledge needed.',
    },
    {
      icon: Rocket,
      number: '02',
      title: 'Track Performance',
      description: 'View your stats anytime, anywhere from your dashboard.',
    },
    {
      icon: BarChart3,
      number: '03',
      title: 'Get Insights',
      description: 'Receive monthly reports with clear next steps to grow.',
    },
  ];

  const testimonials = [
    {
      quote: "Finally, a platform that makes sense. I can check my website performance as easily as I check Instagram. No more confusing analytics dashboards.",
      author: "Sarah Mitchell",
      role: "Small Business Owner",
      location: "London",
    },
    {
      quote: "The monthly reports are so simple my teenage daughter could understand them. I actually know what's happening with my website now.",
      author: "James Peterson",
      role: "Cafe Owner",
      location: "Manchester",
    },
    {
      quote: "It's like having a fitness tracker for my website. I log in, see the numbers, and know if things are improving. Perfect.",
      author: "Emma Thompson",
      role: "Freelance Consultant",
      location: "Birmingham",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 to-black py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Track Your Website Like Social Media
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-10 leading-relaxed">
                Simple performance tracking for your website. No confusion. No tech jargon. <br className="hidden sm:block" />
                Just clear insights you can check anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg">Start Free 14-Day Trial</Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg">See Pricing</Button>
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-4">No credit card required · Cancel anytime</p>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">What You Get</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Everything you need to understand and improve your website performance
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} hover>
                    <CardBody className="text-center">
                      <div className="bg-gray-950 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Get started in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="relative inline-block mb-6">
                      <div className="bg-black text-white rounded-full w-20 h-20 flex items-center justify-center">
                        <Icon className="h-10 w-10" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white text-black text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">What People Say</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Real feedback from business owners like you
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardBody>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-blue-500 text-blue-500" />
                      ))}
                    </div>
                    <p className="text-gray-200 mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="border-t border-gray-800 pt-4">
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-gray-300">{testimonial.role}</p>
                      <p className="text-sm text-gray-400">{testimonial.location}</p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-br from-black to-gray-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Start Tracking Today</h2>
            <p className="text-xl text-gray-100 mb-10 leading-relaxed">
              Join hundreds of business owners who finally understand their website performance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="secondary">
                  Start Free 14-Day Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-4">No credit card required · Cancel anytime</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
