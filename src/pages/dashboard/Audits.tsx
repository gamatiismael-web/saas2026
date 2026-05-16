import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FileText, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Audits() {
  const audits = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      date: '2024-03-01',
      overallScore: 72,
      status: 'completed',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Audit Reports</h1>
            <p className="text-gray-300">Review your website performance audits</p>
          </div>
          <Link to="/audit">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Request New Audit
            </Button>
          </Link>
        </div>

        {audits.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No audits yet</h3>
              <p className="text-gray-300 mb-6">Request your first audit to get started</p>
              <Link to="/audit">
                <Button>Request Audit</Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {audits.map((audit) => (
              <Card key={audit.id} hover>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Website Audit - {new Date(audit.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="success">Completed</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-500">{audit.overallScore}</div>
                      <div className="text-sm text-gray-300">Overall Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span>View detailed recommendations and insights</span>
                    </div>
                    <Link to={`/audit/results/${audit.id}`}>
                      <Button variant="outline">View Report</Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
