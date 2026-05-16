import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Image, Upload, File, Key, Trash2 } from 'lucide-react';

export function Assets() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Assets', icon: File },
    { id: 'logo', name: 'Logo', icon: Image },
    { id: 'brand_guidelines', name: 'Brand Guidelines', icon: FileText },
    { id: 'images', name: 'Images', icon: Image },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'credentials', name: 'Credentials', icon: Key },
  ];

  const assets = [
    { id: 1, name: 'company-logo.svg', category: 'logo', size: '24 KB', uploadedAt: '2024-03-10' },
    { id: 2, name: 'brand-guidelines.pdf', category: 'brand_guidelines', size: '1.2 MB', uploadedAt: '2024-03-09' },
    { id: 3, name: 'team-photo-1.jpg', category: 'images', size: '856 KB', uploadedAt: '2024-03-08' },
    { id: 4, name: 'team-photo-2.jpg', category: 'images', size: '921 KB', uploadedAt: '2024-03-08' },
    { id: 5, name: 'service-image-1.jpg', category: 'images', size: '645 KB', uploadedAt: '2024-03-07' },
    { id: 6, name: 'website-credentials.txt', category: 'credentials', size: '2 KB', uploadedAt: '2024-03-06' },
  ];

  const filteredAssets = selectedCategory === 'all'
    ? assets
    : assets.filter(asset => asset.category === selectedCategory);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Assets</h1>
            <p className="text-gray-300">Upload and manage your project files</p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>

        <Card>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const count = category.id === 'all' ? assets.length : assets.filter(a => a.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedCategory === category.id
                        ? 'border-black bg-black'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mb-2 ${selectedCategory === category.id ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div className={`font-medium text-sm ${selectedCategory === category.id ? 'text-white' : 'text-gray-300'}`}>
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{count} files</div>
                  </button>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">
              {categories.find(c => c.id === selectedCategory)?.name || 'All Assets'}
            </h2>
          </CardHeader>
          <CardBody>
            {filteredAssets.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No files yet</h3>
                <p className="text-gray-300 mb-4">Upload your first file to get started</p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 bg-black hover:bg-gray-950 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-black rounded-lg p-3 border border-gray-800">
                        {asset.category === 'images' ? (
                          <Image className="h-6 w-6 text-blue-500" />
                        ) : asset.category === 'credentials' ? (
                          <Key className="h-6 w-6 text-blue-500" />
                        ) : (
                          <FileText className="h-6 w-6 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">{asset.name}</div>
                        <div className="text-sm text-gray-300">
                          {asset.size} • Uploaded {new Date(asset.uploadedAt).toLocaleDateString('en-GB')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Download</Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Upload Guidelines</h2>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-white mb-3">Logo Files</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    SVG, PNG, or EPS format
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Transparent background preferred
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    High resolution (min 300 DPI for print)
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-white mb-3">Images</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    JPG or PNG format
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Minimum 1920px wide for full-width images
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Compress before upload for faster loading
                  </li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
