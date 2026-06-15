import { Card, CardBody } from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricProps {
  label: string;
  value: string | number;
  trend?: number; // percentage change
  unit?: string;
}

interface KPIStripProps {
  metrics: MetricProps[];
}

export function KPIStrip({ metrics }: KPIStripProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, idx) => (
        <Card key={idx} variant="stat">
          <CardBody>
            <p className="text-gray-400 text-sm font-medium">{metric.label}</p>
            <div className="flex items-end justify-between mt-3">
              <div>
                <p className="text-3xl font-bold text-white">{metric.value}</p>
                {metric.unit && <p className="text-xs text-gray-500 mt-1">{metric.unit}</p>}
              </div>
              {metric.trend !== undefined && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  metric.trend >= 0 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {metric.trend >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-xs font-semibold">{Math.abs(metric.trend)}%</span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
