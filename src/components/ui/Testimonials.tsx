import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  improvement?: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Mitchell",
    role: "Marketing Director",
    company: "TechStart Solutions",
    content: "Within 3 months of implementing WebPilot's recommendations, our organic traffic increased by 156% and conversion rate jumped from 2.1% to 4.8%. The ROI has been incredible.",
    rating: 5,
    improvement: "+156% Traffic"
  },
  {
    name: "James Chen",
    role: "CEO",
    company: "Riverside Dental",
    content: "We were losing potential patients due to slow load times. WebPilot identified and fixed critical issues. Now our site loads in under 2 seconds and appointment bookings are up 87%.",
    rating: 5,
    improvement: "+87% Bookings"
  },
  {
    name: "Emma Thompson",
    role: "Owner",
    company: "Thompson & Associates Law",
    content: "The audit revealed we weren't showing up in local searches at all. After implementing their strategy, we now rank #1 for 12 key practice areas in our city. Phone calls tripled.",
    rating: 5,
    improvement: "+200% Inquiries"
  },
  {
    name: "Michael Roberts",
    role: "E-commerce Manager",
    company: "Urban Lifestyle Co.",
    content: "Our bounce rate was killing us at 78%. WebPilot's UX improvements brought it down to 31% and our average order value increased by £47. Best investment we've made.",
    rating: 5,
    improvement: "+£47 AOV"
  },
  {
    name: "Dr. Priya Patel",
    role: "Medical Director",
    company: "City Health Clinic",
    content: "Accessibility was something we overlooked completely. WebPilot made our site accessible to everyone, and we've seen a 45% increase in senior patient registrations. It was the right thing to do.",
    rating: 5,
    improvement: "+45% Registrations"
  },
  {
    name: "Tom Anderson",
    role: "Founder",
    company: "Anderson Consulting",
    content: "I thought our website was fine until the audit showed we were losing 60% of mobile users. The mobile optimization alone increased our qualified leads by 124%.",
    rating: 5,
    improvement: "+124% Leads"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real Results from Real Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of businesses that transformed their online presence and revenue
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {testimonial.improvement && (
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  {testimonial.improvement}
                </div>
              )}

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p className="text-sm text-gray-500">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 text-gray-600">
            <div>
              <div className="text-4xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm">Average Rating</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div>
              <div className="text-4xl font-bold text-gray-900">340+</div>
              <div className="text-sm">Happy Clients</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div>
              <div className="text-4xl font-bold text-gray-900">£2.4M+</div>
              <div className="text-sm">Revenue Generated</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
