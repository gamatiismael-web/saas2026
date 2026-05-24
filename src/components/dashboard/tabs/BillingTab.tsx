'use client';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2 } from 'lucide-react';

export function BillingTab() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: ['1 website', 'Basic metrics', 'Limited history'],
      current: false,
    },
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      features: ['5 websites', 'SEO rankings', '6 months history'],
      current: true,
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      features: ['25 websites', 'AI recommendations', 'Unlimited history', 'API access'],
      current: false,
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Billing & Subscription</h2>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Current Plan</h3>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Plan</p>
              <p className="text-2xl font-bold text-white">Starter</p>
              <p className="text-gray-400 text-sm mt-2">$29/month</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Next Billing Date</p>
              <p className="text-2xl font-bold text-white">June 24, 2026</p>
              <p className="text-gray-400 text-sm mt-2">15 days remaining</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Usage & Quotas</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {[
            { label: 'Websites Tracked', used: 3, limit: 5 },
            { label: 'API Calls This Month', used: 12453, limit: 100000 },
            { label: 'Storage Used', used: 2.3, limit: 10, unit: ' GB' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-300">{item.label}</p>
                <p className="text-white font-semibold">
                  {item.used}{item.unit || ''} / {item.limit}{item.unit || ''}
                </p>
              </div>
              <div className="bg-gray-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(item.used / item.limit) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Plan Selection */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Choose a Plan</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.current ? 'border-blue-500 border-2' : ''}>
              <CardBody className="space-y-4">
                <div>
                  <p className="text-lg font-bold text-white">{plan.name}</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {plan.price}
                    <span className="text-sm text-gray-400 font-normal">{plan.period}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant={plan.current ? 'outline' : 'primary'}
                  fullWidth
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Payment Method</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div>
              <p className="text-white font-semibold">Visa ending in 4242</p>
              <p className="text-gray-400 text-sm">Expires 12/26</p>
            </div>
            <Badge variant="success">Default</Badge>
          </div>
          <Button variant="outline" fullWidth>
            Update Payment Method
          </Button>
        </CardBody>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Recent Invoices</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {[
              { date: 'May 24, 2026', amount: '$29.00', status: 'Paid' },
              { date: 'April 24, 2026', amount: '$29.00', status: 'Paid' },
            ].map((invoice, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white">{invoice.date}</p>
                  <p className="text-gray-400 text-sm">{invoice.amount}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
