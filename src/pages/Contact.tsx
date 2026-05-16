import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-16">
        <section className="bg-gradient-to-br from-gray-900 to-black py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Get In Touch
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>
                  </CardHeader>
                  <CardBody>
                    {submitted ? (
                      <div className="py-8 text-center">
                        <div className="bg-gray-800 text-white rounded-lg p-6 mb-4">
                          <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                          <p className="text-gray-300">We've received your message and will get back to you within 24 hours.</p>
                        </div>
                        <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            label="Name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Smith"
                          />
                          <Input
                            label="Email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            label="Phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="0800 123 4567"
                          />
                          <Input
                            label="Company Name"
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Your Business Ltd"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-1.5">
                            Message
                          </label>
                          <textarea
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                            placeholder="Tell us about your project and how we can help..."
                          />
                        </div>
                        <Button type="submit" size="lg" fullWidth>
                          Send Message
                        </Button>
                      </form>
                    )}
                  </CardBody>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardBody>
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <Mail className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Email Us</h3>
                        <a href="mailto:gamati.ismael@gmail.com" className="text-gray-300 hover:text-white">
                          gamati.ismael@gmail.com
                        </a>
                        <p className="text-sm text-gray-400 mt-1">We reply within 24 hours</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <Phone className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Call Us</h3>
                        <a href="tel:07983485102" className="text-gray-300 hover:text-white">
                          07983 485102
                        </a>
                        <p className="text-sm text-gray-400 mt-1">Mon-Fri, 9am-6pm GMT</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <MapPin className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Location</h3>
                        <p className="text-gray-300">London, United Kingdom</p>
                        <p className="text-sm text-gray-400 mt-1">Serving businesses across the UK</p>
                      </div>
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
