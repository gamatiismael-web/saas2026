'use client';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, Download, Share2 } from 'lucide-react';

export function ReportsTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Reports & Exports</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Report Templates</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {[
              { name: 'Executive Summary', desc: '1-page overview' },
              { name: 'Full Analytics Report', desc: 'Detailed metrics' },
              { name: 'SEO Performance', desc: 'Rankings & keywords' },
            ].map((template) => (
              <button
                key={template.name}
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <p className="text-white font-semibold">{template.name}</p>
                <p className="text-gray-400 text-sm">{template.desc}</p>
              </button>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Export Data</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <Button variant="outline" fullWidth>
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" fullWidth>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" fullWidth>
              <Share2 className="h-4 w-4 mr-2" />
              Share Report Link
            </Button>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Recent Reports</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {[
              { name: 'May 2026 Report', date: 'May 23, 2026', type: 'PDF' },
              { name: 'April 2026 Report', date: 'April 30, 2026', type: 'PDF' },
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white">{report.name}</p>
                    <p className="text-gray-400 text-sm">{report.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Download</Button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
