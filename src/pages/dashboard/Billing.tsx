import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardBody, CardFooter, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, X, Download, CreditCard } from 'lucide-react';

export function Billing() {
  const currentPlan = {
    name: 'Growth',
    price: 497,
    billingDate: '2024-04-15',
    status: 'active',
  };

  const plans = [
    {
      name: 'Starter',
      price: 297,
      description: 'Perfect for new businesses',
      features: [
        { included: true, text: 'Up to 5 pages' },
        { included: true, text: 'Mobile responsive design' },
        { included: true, text: 'Basic SEO optimisation' },
        { included: true, text: '2 content updates per month' },
        { included: true, text: 'Monthly performance report' },
        { included: false, text: 'Dedicated project manager' },
        { included: false, text: 'Advanced analytics' },
      ],
      current: false,
    },
    {
      name: 'Growth',
      price: 497,
      description: 'For established businesses',
      features: [
        { included: true, text: 'Up to 10 pages' },
        { included: true, text: 'Premium design & branding' },
        { included: true, text: 'Advanced SEO strategy' },
        { included: true, text: '4 content updates per month' },
        { included: true, text: 'Weekly performance reports' },
        { included: true, text: 'Dedicated project manager' },
        { included: true, text: 'Advanced analytics' },
      ],
      current: true,
    },
    {
      name: 'Pro',
      price: 797,
      description: 'Maximum results',
      features: [
        { included: true, text: 'Unlimited pages' },
        { included: true, text: 'Custom design & development' },
        { included: true, text: 'Comprehensive SEO programme' },
        { included: true, text: 'Unlimited content updates' },
        { included: true, text: 'Real-time reporting dashboard' },
        { included: true, text: 'Dedicated project team' },
        { included: true, text: 'Custom integrations' },
      ],
      current: false,
    },
  ];

  const invoices = [
    { id: 'INV-2024-03', date: '2024-03-15', amount: 497, status: 'paid' },
    { id: 'INV-2024-02', date: '2024-02-15', amount: 497, status: 'paid' },
    { id: 'INV-2024-01', date: '2024-01-15', amount: 497, status: 'paid' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
          <p className="text-gray-300">Manage your subscription and billing information</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Current Subscription</h2>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-300 mb-1">Plan</div>
                <div className="text-2xl font-bold text-blue-500">{currentPlan.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-1">Monthly Cost</div>
                <div className="text-2xl font-bold text-white">£{currentPlan.price}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-1">Next Billing Date</div>
                <div className="text-2xl font-bold text-white">
                  {new Date(currentPlan.billingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <Badge variant="success">Active Subscription</Badge>
              <p className="text-sm text-gray-300 mt-2">
                Your subscription will automatically renew on {new Date(currentPlan.billingDate).toLocaleDateString('en-GB')}
              </p>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Update Payment Method
            </Button>
          </CardFooter>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={plan.current ? 'ring-2 ring-black' : ''}>
                {plan.current && (
                  <div className="bg-blue-500 text-white px-4 py-2 text-center font-medium">
                    Current Plan
                  </div>
                )}
                <CardHeader className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-blue-500">£{plan.price}</span>
                    <span className="text-gray-300">/month</span>
                  </div>
                  <p className="text-sm text-gray-300">{plan.description}</p>
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
                        <span className={feature.included ? 'text-gray-200' : 'text-gray-500'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
                <CardFooter>
                  {plan.current ? (
                    <Button variant="outline" fullWidth disabled>
                      Current Plan
                    </Button>
                  ) : index > plans.findIndex(p => p.current) ? (
                    <Button fullWidth>Upgrade to {plan.name}</Button>
                  ) : (
                    <Button variant="outline" fullWidth>Downgrade to {plan.name}</Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Billing History</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-black rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-black rounded-lg p-3 border border-gray-800">
                      <CreditCard className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{invoice.id}</div>
                      <div className="text-sm text-gray-300">
                        {new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-semibold text-white text-right">£{invoice.amount}</div>
                      <Badge variant="success">Paid</Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
