import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Briefcase, ShoppingBag, Building2, Users, Wrench, GraduationCap, Heart, Scale } from 'lucide-react';

export function Industries() {
  const industries = [
    {
      icon: Briefcase,
      title: 'Professional Services',
      description: 'Solicitors, accountants, consultants, and other professional service providers',
      challenges: [
        'Establishing trust and credibility online',
        'Converting website visitors into enquiries',
        'Showcasing expertise and qualifications',
      ],
      solutions: [
        'Professional, trust-building website design',
        'Client testimonial and case study sections',
        'Lead capture forms and contact systems',
      ],
    },
    {
      icon: ShoppingBag,
      title: 'Retail & E-commerce',
      description: 'Independent retailers and online shops looking to grow their customer base',
      challenges: [
        'Competing with larger retailers',
        'Managing product catalogues',
        'Converting browsers into buyers',
      ],
      solutions: [
        'User-friendly e-commerce platforms',
        'Product SEO and search optimisation',
        'Conversion rate optimisation',
      ],
    },
    {
      icon: Building2,
      title: 'Hospitality',
      description: 'Hotels, restaurants, cafes, and other hospitality businesses',
      challenges: [
        'Standing out in local searches',
        'Showcasing atmosphere and offerings',
        'Managing bookings and reservations',
      ],
      solutions: [
        'Visual, engaging website designs',
        'Local SEO optimisation',
        'Booking system integration',
      ],
    },
    {
      icon: Users,
      title: 'Healthcare & Wellness',
      description: 'Private clinics, dentists, therapists, and wellness providers',
      challenges: [
        'Building patient trust online',
        'GDPR and privacy compliance',
        'Online appointment booking',
      ],
      solutions: [
        'Compliant, secure website platforms',
        'Patient information and resources',
        'Online booking and consultation systems',
      ],
    },
    {
      icon: Wrench,
      title: 'Home Services',
      description: 'Tradespeople, contractors, and home service providers',
      challenges: [
        'Getting found by local customers',
        'Showcasing previous work',
        'Managing enquiries efficiently',
      ],
      solutions: [
        'Local SEO and Google My Business',
        'Project gallery and testimonials',
        'Lead management systems',
      ],
    },
    {
      icon: GraduationCap,
      title: 'Education & Training',
      description: 'Training providers, tutors, and educational institutions',
      challenges: [
        'Attracting the right students',
        'Explaining course offerings clearly',
        'Managing enrolments and payments',
      ],
      solutions: [
        'Clear course presentation and structure',
        'Student testimonials and success stories',
        'Online enrolment systems',
      ],
    },
    {
      icon: Heart,
      title: 'Beauty & Personal Care',
      description: 'Salons, spas, and personal care service providers',
      challenges: [
        'Showcasing services and treatments',
        'Online booking and scheduling',
        'Building a loyal customer base',
      ],
      solutions: [
        'Visual portfolio of services',
        'Integrated booking systems',
        'Customer loyalty programmes',
      ],
    },
    {
      icon: Scale,
      title: 'Financial Services',
      description: 'IFAs, mortgage brokers, and financial advisors',
      challenges: [
        'Regulatory compliance',
        'Building trust with prospects',
        'Explaining complex services simply',
      ],
      solutions: [
        'FCA-compliant website platforms',
        'Clear service explanations',
        'Secure client portals',
      ],
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
                Industry Solutions
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Tailored website solutions for UK small businesses across all sectors
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {industries.map((industry, index) => {
                const Icon = industry.icon;
                return (
                  <Card key={index} hover>
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-500/10 rounded-lg w-14 h-14 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-7 w-7 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{industry.title}</h3>
                          <p className="text-gray-300">{industry.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <div className="mb-6">
                        <h4 className="font-semibold text-white mb-3 text-base">Common Challenges:</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          {industry.challenges.map((challenge, idx) => (
                            <li key={idx} className="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-red-400 before:text-lg">
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-3 text-base">Our Solutions:</h4>
                        <ul className="space-y-2 text-sm text-gray-200">
                          {industry.solutions.map((solution, idx) => (
                            <li key={idx} className="pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-blue-500 before:font-bold">
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Not Sure Which Solution Fits?</h2>
            <p className="text-lg text-gray-400 mb-8">
              Get a free audit and we'll recommend the best approach for your specific business
            </p>
            <Link to="/audit">
              <Button size="lg">Get Your Free Industry Audit</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
