'use client';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function SEORankingsTab() {
  // Mock data
  const keywords = [
    { keyword: 'website analytics', rank: 8, change: 2, searchVolume: 4200 },
    { keyword: 'web tracking platform', rank: 15, change: -1, searchVolume: 2100 },
    { keyword: 'SEO monitoring tool', rank: 12, change: 3, searchVolume: 1800 },
    { keyword: 'analytics dashboard', rank: 24, change: -2, searchVolume: 3500 },
  ];

  const opportunities = [
    { keyword: 'best analytics platform', rank: 42, searchVolume: 2800, difficulty: 'Medium' },
    { keyword: 'free website metrics', rank: 38, searchVolume: 1900, difficulty: 'Easy' },
    { keyword: 'conversion tracking tools', rank: 47, searchVolume: 3200, difficulty: 'Medium' },
  ];

  return (
    <div className="space-y-8">
      {/* SEO Health Score */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <p className="text-gray-400 text-sm mb-2">SEO Health Score</p>
            <p className="text-4xl font-bold text-green-400">78/100</p>
            <p className="text-gray-400 text-sm mt-2">Excellent</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-gray-400 text-sm mb-2">Tracked Keywords</p>
            <p className="text-4xl font-bold text-white">32</p>
            <p className="text-gray-400 text-sm mt-2">+5 this month</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-gray-400 text-sm mb-2">Top 10 Keywords</p>
            <p className="text-4xl font-bold text-white">8</p>
            <p className="text-gray-400 text-sm mt-2">+2 this month</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-gray-400 text-sm mb-2">Avg Rank Position</p>
            <p className="text-4xl font-bold text-white">19</p>
            <p className="text-gray-400 text-sm mt-2">↓ 2 positions</p>
          </CardBody>
        </Card>
      </div>

      {/* Tracked Keywords */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Top Performing Keywords</h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left text-gray-400 font-semibold">Keyword</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-semibold">Rank</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-semibold">Change</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-semibold">Search Volume</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-white">{item.keyword}</td>
                    <td className="px-4 py-3 text-white font-semibold">#{item.rank}</td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1 ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.change >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {Math.abs(item.change)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{item.searchVolume.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Quick Win Opportunities */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Ranking Opportunities (11-50)</h3>
          <p className="text-gray-400 text-sm">Easy wins - Keywords ranked 11-50 with potential to reach top 10</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {opportunities.map((opp, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-semibold">{opp.keyword}</p>
                  <p className="text-gray-400 text-sm">Current rank: #{opp.rank}</p>
                </div>
                <div className="text-right ml-4">
                  <Badge variant={opp.difficulty === 'Easy' ? 'success' : 'warning'}>
                    {opp.difficulty}
                  </Badge>
                  <p className="text-gray-400 text-sm mt-1">{opp.searchVolume.toLocaleString()} searches</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
