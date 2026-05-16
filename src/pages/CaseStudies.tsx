import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Clock, DollarSign, ArrowRight } from 'lucide-react';

export function CaseStudies() {
  const caseStudies = [
    {
      company: 'Mitchell & Co Solicitors',
      industry: 'Professional Services',
      challenge: 'Outdated website generating minimal enquiries despite strong local reputation',
      solution: 'Complete website redesign with focus on trust-building and clear service explanation',
      timeline: '3 months',
      revenueImpact: '£28,000/month',
      before: { score: 42, traffic: '850/month', conversions: '12/month' },
      after: { score: 89, traffic: '1,573/month', conversions: '34/month' },
      results: [
        { metric: 'Enquiries', value: '+60%', icon: TrendingUp },
        { metric: 'Organic Traffic', value: '+85%', icon: Users },
        { metric: 'Time to First Contact', value: '-40%', icon: Clock },
      ],
      testimonial: {
        quote: 'Value-Connection transformed our online presence. Within 3 months, we saw a 60% increase in enquiries and our website finally represents the quality of our services.',
        author: 'Sarah Mitchell',
        position: 'Director',
      },
    },
    {
      company: 'Peterson\'s Home Services',
      industry: 'Home Services',
      challenge: 'No online visibility in local searches, relying entirely on word-of-mouth',
      solution: 'SEO-optimised website with local search focus and project gallery showcase',
      timeline: '4 months',
      revenueImpact: '£42,000/month',
      before: { score: 38, traffic: '420/month', conversions: '8/month' },
      after: { score: 91, traffic: '924/month', conversions: '22/month' },
      results: [
        { metric: 'Local Search Visibility', value: '+120%', icon: TrendingUp },
        { metric: 'Online Bookings', value: '+95%', icon: Users },
        { metric: 'Quote Requests', value: '+75%', icon: Clock },
      ],
      testimonial: {
        quote: 'The dashboard makes it so easy to track progress. We\'re now the top result for our services in the local area, and the phone hasn\'t stopped ringing.',
        author: 'James Peterson',
        position: 'Owner',
      },
    },
    {
      company: 'The Wellness Clinic',
      industry: 'Healthcare',
      challenge: 'Competing with large chains while maintaining personal touch and trust',
      solution: 'Professional, compliant website with online booking and patient resources',
      timeline: '5 months',
      revenueImpact: '£18,500/month',
      before: { score: 51, traffic: '1,240/month', conversions: '28/month' },
      after: { score: 87, traffic: '2,108/month', conversions: '62/month' },
      results: [
        { metric: 'New Patient Bookings', value: '+55%', icon: TrendingUp },
        { metric: 'Online Appointments', value: '+70%', icon: Users },
        { metric: 'Patient Satisfaction', value: '4.9/5', icon: Clock },
      ],
      testimonial: {
        quote: 'Value-Connection understood our compliance needs and created a website that builds trust while making it easy for patients to book appointments online.',
        author: 'Dr. Amanda Clarke',
        position: 'Practice Owner',
      },
    },
    {
      company: 'Artisan Bakery Co.',
      industry: 'Retail',
      challenge: 'Limited online sales and no way to showcase daily fresh products',
      solution: 'E-commerce website with daily product updates and local delivery integration',
      timeline: '3 months',
      revenueImpact: '£35,600/month',
      before: { score: 34, traffic: '680/month', conversions: '15/month' },
      after: { score: 88, traffic: '1,666/month', conversions: '52/month' },
      results: [
        { metric: 'Online Sales', value: '+145%', icon: TrendingUp },
        { metric: 'Customer Base', value: '+90%', icon: Users },
        { metric: 'Average Order Value', value: '+35%', icon: Clock },
      ],
      testimonial: {
        quote: 'Our online sales have grown faster than we imagined. The platform is so easy to update with our daily fresh products, and customers love the convenience.',
        author: 'Tom Richardson',
        position: 'Founder',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-16">
        <section className="bg-gradient-to-br from-gray-900 to-black py-20 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Success Stories
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Real results from UK small businesses growing with Value-Connection
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {caseStudies.map((study, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-2/3">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{study.company}</h2>
                            <p className="text-blue-500 font-semibold text-sm uppercase tracking-wide">{study.industry}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 bg-green-900/30 border border-green-700 px-3 py-1 rounded-full mb-2">
                              <DollarSign className="h-4 w-4 text-green-400" />
                              <span className="text-green-300 font-bold text-sm">{study.revenueImpact}</span>
                            </div>
                            <p className="text-xs text-gray-400">Revenue increase</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-900/50 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-xs text-gray-400 mb-1">Before</div>
                            <div className="text-2xl font-bold text-red-400">{study.before.score}</div>
                            <div className="text-xs text-gray-500">{study.before.traffic}</div>
                            <div className="text-xs text-gray-500">{study.before.conversions}</div>
                          </div>
                          <div className="flex items-center justify-center">
                            <ArrowRight className="h-6 w-6 text-blue-500" />
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-400 mb-1">After {study.timeline}</div>
                            <div className="text-2xl font-bold text-green-400">{study.after.score}</div>
                            <div className="text-xs text-gray-500">{study.after.traffic}</div>
                            <div className="text-xs text-gray-500">{study.after.conversions}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-5">
                          <div>
                            <h3 className="font-semibold text-white mb-2 text-base">The Challenge</h3>
                            <p className="text-gray-300 leading-relaxed">{study.challenge}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white mb-2 text-base">Our Solution</h3>
                            <p className="text-gray-300 leading-relaxed">{study.solution}</p>
                          </div>
                          <div className="bg-gray-900/50 border-l-4 border-blue-500 p-5 rounded-r">
                            <p className="text-gray-200 italic mb-3 text-base">"{study.testimonial.quote}"</p>
                            <p className="text-sm text-gray-400">
                              <strong className="text-white">{study.testimonial.author}</strong> — {study.testimonial.position}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </div>
                    <div className="md:w-1/3 bg-gradient-to-br from-gray-900 to-black p-6 border-l border-gray-800">
                      <h3 className="font-bold text-white mb-6 text-lg">Key Results</h3>
                      <div className="space-y-4">
                        {study.results.map((result, idx) => {
                          const Icon = result.icon;
                          return (
                            <div key={idx} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                              <div className="flex items-center space-x-3 mb-2">
                                <Icon className="h-5 w-5 text-blue-500" />
                                <span className="text-sm text-gray-300 font-medium">{result.metric}</span>
                              </div>
                              <div className="text-3xl font-bold text-blue-400">{result.value}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Write Your Success Story?</h2>
            <p className="text-lg text-gray-400 mb-8">
              Get a free audit and discover how we can help your business achieve similar results
            </p>
            <Link to="/audit">
              <Button size="lg">Get Your Free Audit</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
