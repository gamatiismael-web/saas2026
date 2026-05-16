import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MousePointerClick,
  Search,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
  Lightbulb,
  ExternalLink,
  Clock,
} from 'lucide-react';

export function Performance() {
  const kpis = [
    {
      label: 'Total Visitors',
      value: '2,847',
      change: '+387',
      percentChange: '+15.7%',
      trend: 'up',
      period: 'vs last month',
      icon: Users,
    },
    {
      label: 'Organic Traffic',
      value: '1,842',
      change: '+294',
      percentChange: '+19.0%',
      trend: 'up',
      period: 'vs last month',
      icon: Search,
    },
    {
      label: 'Form Submissions',
      value: '91',
      change: '+14',
      percentChange: '+18.2%',
      trend: 'up',
      period: 'vs last month',
      icon: MousePointerClick,
    },
    {
      label: 'Conversion Rate',
      value: '3.2%',
      change: '+0.1%',
      percentChange: '+3.2%',
      trend: 'up',
      period: 'vs last month',
      icon: TrendingUp,
    },
    {
      label: 'Top Keyword Ranking',
      value: '#3',
      change: '+2',
      percentChange: 'up 2 positions',
      trend: 'up',
      period: 'this month',
      icon: BarChart3,
    },
    {
      label: 'Avg Search Position',
      value: '8.4',
      change: '-1.8',
      percentChange: 'improved',
      trend: 'up',
      period: 'vs last month',
      icon: Search,
    },
  ];

  const trafficData = [
    { day: 'Jan 14', visitors: 78 },
    { day: 'Jan 15', visitors: 92 },
    { day: 'Jan 16', visitors: 85 },
    { day: 'Jan 17', visitors: 94 },
    { day: 'Jan 18', visitors: 88 },
    { day: 'Jan 19', visitors: 45 },
    { day: 'Jan 20', visitors: 52 },
    { day: 'Jan 21', visitors: 96 },
    { day: 'Jan 22', visitors: 102 },
    { day: 'Jan 23', visitors: 98 },
    { day: 'Jan 24', visitors: 105 },
    { day: 'Jan 25', visitors: 92 },
    { day: 'Jan 26', visitors: 48 },
    { day: 'Jan 27', visitors: 54 },
    { day: 'Jan 28', visitors: 108 },
    { day: 'Jan 29', visitors: 112 },
    { day: 'Jan 30', visitors: 106 },
    { day: 'Jan 31', visitors: 115 },
    { day: 'Feb 1', visitors: 98 },
    { day: 'Feb 2', visitors: 56 },
    { day: 'Feb 3', visitors: 61 },
    { day: 'Feb 4', visitors: 118 },
    { day: 'Feb 5', visitors: 122 },
    { day: 'Feb 6', visitors: 114 },
    { day: 'Feb 7', visitors: 125 },
    { day: 'Feb 8', visitors: 108 },
    { day: 'Feb 9', visitors: 64 },
    { day: 'Feb 10', visitors: 68 },
    { day: 'Feb 11', visitors: 128 },
    { day: 'Feb 12', visitors: 132 },
  ];

  const maxVisitors = Math.max(...trafficData.map((d) => d.visitors));

  const trafficSources = [
    { source: 'Organic Search', visitors: 1842, percentage: 64.7, color: 'bg-blue-500' },
    { source: 'Direct', visitors: 625, percentage: 22.0, color: 'bg-blue-500' },
    { source: 'Referral', visitors: 285, percentage: 10.0, color: 'bg-blue-400' },
    { source: 'Social', visitors: 95, percentage: 3.3, color: 'bg-blue-300' },
  ];

  const keywords = [
    {
      keyword: 'website design manchester',
      currentRank: 3,
      previousRank: 5,
      change: 2,
      volume: '1,200',
      page: '/services',
    },
    {
      keyword: 'web development uk',
      currentRank: 7,
      previousRank: 9,
      change: 2,
      volume: '3,400',
      page: '/services',
    },
    {
      keyword: 'seo services for small business',
      currentRank: 5,
      previousRank: 4,
      change: -1,
      volume: '890',
      page: '/services/seo',
    },
    {
      keyword: 'website maintenance uk',
      currentRank: 4,
      previousRank: 4,
      change: 0,
      volume: '720',
      page: '/services',
    },
    {
      keyword: 'affordable web design',
      currentRank: 12,
      previousRank: 18,
      change: 6,
      volume: '2,100',
      page: '/pricing',
    },
    {
      keyword: 'subscription website service',
      currentRank: 8,
      previousRank: 11,
      change: 3,
      volume: '480',
      page: '/about',
    },
  ];

  const topPages = [
    {
      url: '/services',
      visitors: 847,
      avgTime: '3m 24s',
      conversions: 28,
      conversionRate: '3.3%',
    },
    {
      url: '/',
      visitors: 1245,
      avgTime: '2m 12s',
      conversions: 31,
      conversionRate: '2.5%',
    },
    {
      url: '/pricing',
      visitors: 542,
      avgTime: '4m 18s',
      conversions: 18,
      conversionRate: '3.3%',
    },
    {
      url: '/case-studies',
      visitors: 384,
      avgTime: '5m 42s',
      conversions: 8,
      conversionRate: '2.1%',
    },
    {
      url: '/about',
      visitors: 298,
      avgTime: '2m 48s',
      conversions: 4,
      conversionRate: '1.3%',
    },
  ];

  const insights = [
    {
      type: 'positive',
      text: 'Traffic increased by 15.7% this month compared to last month.',
    },
    {
      type: 'positive',
      text: 'Your keyword "affordable web design" jumped 6 positions to rank #12.',
    },
    {
      type: 'info',
      text: 'Your /services page is your top converting page with a 3.3% conversion rate.',
    },
    {
      type: 'positive',
      text: 'Organic traffic grew by 19% - your SEO optimisation is working.',
    },
    {
      type: 'info',
      text: 'Average session duration increased to 2m 34s, up 22 seconds from last month.',
    },
  ];

  const getRankingChange = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-blue-500 text-sm font-medium">
          <ArrowUp className="h-4 w-4 mr-1" />
          {change}
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-500 text-sm font-medium">
          <ArrowDown className="h-4 w-4 mr-1" />
          {Math.abs(change)}
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-400 text-sm font-medium">
          <Minus className="h-4 w-4 mr-1" />
          0
        </div>
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Performance Dashboard</h1>
          <p className="text-gray-300">
            Real-time insights into your website traffic, rankings, and conversions
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="border border-gray-800">
                <CardBody>
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-gray-950 rounded-lg p-2">
                      <Icon className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className={`flex items-center text-xs font-medium ${
                      kpi.trend === 'up' ? 'text-blue-500' : 'text-red-500'
                    }`}>
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {kpi.percentChange}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{kpi.value}</div>
                  <div className="text-sm font-medium text-white mb-1">{kpi.label}</div>
                  <div className="text-xs text-gray-400">
                    {kpi.change} {kpi.period}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Traffic Trend (Last 30 Days)</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="flex items-end justify-between h-48 gap-1">
                  {trafficData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col justify-end group relative">
                      <div
                        className="bg-black hover:bg-gray-700 transition-colors rounded-t"
                        style={{ height: `${(data.visitors / maxVisitors) * 100}%` }}
                      />
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {data.day}: {data.visitors} visitors
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>{trafficData[0].day}</span>
                  <span>{trafficData[trafficData.length - 1].day}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Traffic Sources</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {trafficSources.map((source, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-medium text-white">{source.source}</span>
                      <span className="text-gray-300">
                        {source.visitors.toLocaleString()} ({source.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${source.color} rounded-full transition-all duration-500`}
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Keyword Rankings</h2>
              <Badge variant="info">Google Search Console</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      Keyword
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white">
                      Current
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white">
                      Previous
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white">
                      Change
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white">
                      Volume
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      Page
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((keyword, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-black">
                      <td className="py-3 px-4 text-sm text-white font-medium">
                        {keyword.keyword}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">
                          {keyword.currentRank}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-400">
                        #{keyword.previousRank}
                      </td>
                      <td className="py-3 px-4 text-center">{getRankingChange(keyword.change)}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-300">
                        {keyword.volume}/mo
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">{keyword.page}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Top Landing Pages</h2>
              <Badge variant="info">Last 30 Days</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                      Page URL
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white">
                      Visitors
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white">
                      Avg. Time
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white">
                      Conversions
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white">
                      Conv. Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((page, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-black">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-white font-medium">{page.url}</span>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-sm font-medium text-white">
                        {page.visitors.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-300">
                        <div className="flex items-center justify-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-300" />
                          <span>{page.avgTime}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-sm font-medium text-white">
                        {page.conversions}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant={
                            parseFloat(page.conversionRate) >= 3 ? 'success' : 'info'
                          }
                        >
                          {page.conversionRate}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card className="border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-black">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-white">AI Insights</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    insight.type === 'positive'
                      ? 'bg-gray-950 border border-blue-500'
                      : 'bg-gray-950 border border-blue-500'
                  }`}
                >
                  {insight.type === 'positive' ? (
                    <TrendingUp className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <BarChart3 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  )}
                  <p
                    className={`text-sm leading-relaxed ${
                      insight.type === 'positive' ? 'text-gray-200' : 'text-gray-200'
                    }`}
                  >
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
