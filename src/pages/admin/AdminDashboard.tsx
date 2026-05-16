import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TrendingUp, Users, FileText, DollarSign, Clock, CheckCircle2 } from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { label: 'Total Clients', value: '47', change: '+8 this month', icon: Users, color: 'blue' },
    { label: 'New Leads', value: '23', change: '+5 this week', icon: TrendingUp, color: 'green' },
    { label: 'Audit Requests', value: '12', change: 'Pending review', icon: FileText, color: 'amber' },
    { label: 'Monthly Revenue', value: '£23,359', change: '+12% vs last month', icon: DollarSign, color: 'green' },
  ];

  const clients = [
    { name: 'Mitchell & Co Solicitors', plan: 'Growth', status: 'active', progress: 85 },
    { name: 'Peterson Home Services', plan: 'Pro', status: 'active', progress: 100 },
    { name: 'The Wellness Clinic', plan: 'Growth', status: 'active', progress: 60 },
    { name: 'Artisan Bakery Co.', plan: 'Starter', status: 'onboarding', progress: 35 },
  ];

  const recentActivity = [
    { action: 'New client signup', client: 'Thompson & Associates', time: '2 hours ago' },
    { action: 'Project launched', client: 'Peterson Home Services', time: '5 hours ago' },
    { action: 'Audit completed', client: 'Sarah Mitchell', time: '1 day ago' },
    { action: 'Payment received', client: 'The Wellness Clinic', time: '1 day ago' },
  ];

  const tasks = [
    { title: 'Review Artisan Bakery homepage design', priority: 'high', dueDate: '2024-03-15' },
    { title: 'Complete audit for new lead', priority: 'medium', dueDate: '2024-03-16' },
    { title: 'Monthly report for Mitchell & Co', priority: 'medium', dueDate: '2024-03-18' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Overview of platform metrics and client activity</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardBody>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`bg-${stat.color}-100 rounded-lg p-2`}>
                      <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.change}</div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Client Status</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {clients.map((client, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{client.name}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="info">{client.plan}</Badge>
                          <Badge variant={client.status === 'active' ? 'success' : 'warning'}>
                            {client.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-400">{client.progress}%</div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${client.progress === 100 ? 'bg-black' : 'bg-black'}`}
                        style={{ width: `${client.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                    <CheckCircle2 className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white">{activity.action}</div>
                      <div className="text-sm text-gray-400">{activity.client}</div>
                      <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Upcoming Tasks</h2>
            <Badge variant="warning">{tasks.length} pending</Badge>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-black rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-white">{task.title}</div>
                      <div className="text-sm text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                  </div>
                  <Badge variant={task.priority === 'high' ? 'error' : 'warning'}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
