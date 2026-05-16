import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Audit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    websiteUrl: '',
    industry: '',
    businessGoal: '',
    email: '',
  });

  const industries = [
    { value: '', label: 'Select your industry' },
    { value: 'professional-services', label: 'Professional Services' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'healthcare', label: 'Healthcare & Wellness' },
    { value: 'home-services', label: 'Home Services' },
    { value: 'education', label: 'Education & Training' },
    { value: 'beauty', label: 'Beauty & Personal Care' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'other', label: 'Other' },
  ];

  const goals = [
    { value: '', label: 'Select your primary goal' },
    { value: 'increase-traffic', label: 'Increase Website Traffic' },
    { value: 'generate-leads', label: 'Generate More Leads' },
    { value: 'boost-sales', label: 'Boost Online Sales' },
    { value: 'improve-seo', label: 'Improve Search Rankings' },
    { value: 'brand-awareness', label: 'Build Brand Awareness' },
    { value: 'modernise', label: 'Modernise Existing Website' },
  ];

  const analyzeWebsite = async (url: string) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-website`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze website');
      }

      const results = await response.json();
      return results;
    } catch (error) {
      console.error('Error calling analyze-website function:', error);
      throw error;
    }
  };

  const sendAuditEmail = async (auditData: any) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-audit-email`;

      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditData),
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Analyze the website using the edge function
      const results = await analyzeWebsite(formData.websiteUrl);

      const { data, error } = await supabase
        .from('audits')
        .insert({
          business_name: formData.businessName,
          website_url: formData.websiteUrl,
          industry: formData.industry,
          business_goal: formData.businessGoal,
          email: formData.email,
          overall_score: results.overall_score,
          homepage_clarity_score: results.homepage_clarity_score,
          seo_score: results.seo_score,
          conversion_score: results.conversion_score,
          mobile_score: results.mobile_score,
          recommendations: results.recommendations,
          recommended_package: results.recommended_package,
          status: 'completed',
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from audit submission');
      }

      console.log('Audit created successfully:', data.id);

      // Send email with audit results
      await sendAuditEmail({
        to: formData.email,
        businessName: formData.businessName,
        websiteUrl: formData.websiteUrl,
        overallScore: results.overall_score,
        auditId: data.id,
      });

      navigate(`/audit/results/${data.id}`);
    } catch (error: any) {
      console.error('Error submitting audit:', error);
      const errorMessage = error?.message || 'There was an error submitting your audit. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Detailed analysis of your current website',
    'Homepage clarity and messaging score',
    'SEO performance assessment',
    'Conversion optimization recommendations',
    'Mobile experience evaluation',
    'Personalized improvement roadmap',
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-16">
        <section className="bg-gradient-to-br from-gray-900 to-black border-b border-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Free Website Audit
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Get a comprehensive analysis of your website in just 2 minutes. No credit card required.
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
                    <h2 className="text-2xl font-bold text-white">Tell Us About Your Business</h2>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        label="Business Name"
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="Your Business Ltd"
                      />
                      <Input
                        label="Website URL"
                        type="url"
                        required
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        placeholder="https://www.yourwebsite.co.uk"
                        helperText="Enter your full website URL including https://"
                      />
                      <Select
                        label="Industry"
                        required
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        options={industries}
                      />
                      <Select
                        label="Primary Business Goal"
                        required
                        value={formData.businessGoal}
                        onChange={(e) => setFormData({ ...formData, businessGoal: e.target.value })}
                        options={goals}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        helperText="We'll send your detailed audit report to this email"
                      />
                      <Button type="submit" size="lg" fullWidth disabled={loading}>
                        {loading ? 'Analyzing Your Website...' : 'Get My Free Audit'}
                      </Button>
                      <p className="text-xs text-gray-400 text-center">
                        By submitting, you agree to receive communications from Value-Connection. Unsubscribe anytime.
                      </p>
                    </form>
                  </CardBody>
                </Card>
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-white">What You'll Get</h3>
                  </CardHeader>
                  <CardBody>
                    <ul className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-200">{benefit}</span>
                        </li>
                      ))}
                    </ul>
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
