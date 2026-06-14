'use client';

import { Card, CardBody } from '@/components/ui/Card';
import { AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface Recommendation {
  id: string;
  category: 'quick-win' | 'content' | 'technical' | 'traffic' | 'conversion';
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedRoi: string;
  completed: boolean;
}

const categories = {
  'quick-win': { label: 'Quick Wins', color: 'bg-green-500' },
  'content': { label: 'Content Opportunities', color: 'bg-blue-500' },
  'technical': { label: 'Technical Improvements', color: 'bg-purple-500' },
  'traffic': { label: 'Traffic Growth', color: 'bg-orange-500' },
  'conversion': { label: 'Conversion Optimization', color: 'bg-pink-500' },
};

const recommendations: Recommendation[] = [
  {
    id: '1',
    category: 'quick-win',
    title: 'Add Meta Descriptions',
    description: 'You have 24 pages missing meta descriptions. This can improve CTR by 5-10%.',
    difficulty: 'Easy',
    expectedRoi: '+8% CTR',
    completed: false,
  },
  {
    id: '2',
    category: 'technical',
    title: 'Optimize Image Size',
    description: 'Large uncompressed images are slowing down your site. Consider WebP format.',
    difficulty: 'Medium',
    expectedRoi: '-2.3s load time',
    completed: false,
  },
  {
    id: '3',
    category: 'content',
    title: 'Create Content for "web analytics guide"',
    description: 'This keyword has 12K monthly searches and low competition. Great opportunity.',
    difficulty: 'Hard',
    expectedRoi: '+150 organic visitors',
    completed: false,
  },
  {
    id: '4',
    category: 'conversion',
    title: 'Add Social Proof on Homepage',
    description: 'Adding testimonials or trust badges can increase conversions by 3-5%.',
    difficulty: 'Easy',
    expectedRoi: '+4% conversions',
    completed: true,
  },
];

export function AIRecommendationsTab() {
  const completedCount = recommendations.filter((r) => r.completed).length;

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <p className="text-gray-400 text-sm mb-2">Total Recommendations</p>
            <p className="text-4xl font-bold text-white">{recommendations.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-gray-400 text-sm mb-2">Completed</p>
            <p className="text-4xl font-bold text-green-400">{completedCount}</p>
            <p className="text-gray-400 text-sm mt-2">{Math.round((completedCount / recommendations.length) * 100)}% done</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-gray-400 text-sm mb-2">Potential Impact</p>
            <p className="text-2xl font-bold text-blue-400">+28% Growth</p>
            <p className="text-gray-400 text-sm mt-2">If all implemented</p>
          </CardBody>
        </Card>
      </div>

      {/* Recommendations by Category */}
      {Object.entries(categories).map(([catKey, catValue]) => {
        const catRecommendations = recommendations.filter((r) => r.category === catKey);
        if (catRecommendations.length === 0) return null;

        return (
          <div key={catKey}>
            <h3 className="text-lg font-bold text-white mb-4">{catValue.label}</h3>
            <div className="space-y-3">
              {catRecommendations.map((rec) => (
                <Card key={rec.id} hover>
                  <CardBody className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        {rec.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className={`font-semibold ${rec.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                            {rec.title}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">{rec.description}</p>
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <Badge variant={rec.difficulty === 'Easy' ? 'success' : rec.difficulty === 'Medium' ? 'warning' : 'danger'}>
                              {rec.difficulty}
                            </Badge>
                            <span className="text-blue-400 text-sm font-semibold flex items-center gap-1">
                              <Zap className="h-4 w-4" />
                              {rec.expectedRoi}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <input type="checkbox" checked={rec.completed} readOnly className="mt-1 w-5 h-5" />
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
