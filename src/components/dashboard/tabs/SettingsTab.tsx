'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { AddWebsiteModal } from '@/components/analytics/AddWebsiteModal';
import { useWebsites } from '@/hooks/useAnalytics';

export function SettingsTab() {
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const { websites, loading, refetch } = useWebsites();

  const handleWebsiteAdded = () => {
    setIsAddWebsiteOpen(false);
    refetch();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Settings</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Account</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <Input disabled value="user@example.com" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Full Name</label>
              <Input placeholder="Your name" />
            </div>
            <Button variant="primary" fullWidth>Save Changes</Button>
          </CardBody>
        </Card>

        {/* Website Management */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Websites</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {loading ? (
              <div className="text-gray-400 text-sm py-4">Loading websites...</div>
            ) : websites && websites.length > 0 ? (
              <>
                {websites.map((website) => (
                  <div key={website.id} className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-white font-semibold text-sm">{website.name}</p>
                        <p className="text-gray-400 text-xs">{website.domain}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant={website.status === 'active' ? 'success' : 'warning'}
                          >
                            {website.status}
                          </Badge>
                          {website.metrics_collection_status === 'active' && (
                            <Badge variant="info">Tracking</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-gray-400 text-sm py-4">No websites added yet</div>
            )}
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => setIsAddWebsiteOpen(true)}
            >
              Add Website
            </Button>
          </CardBody>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Integrations</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {['Google Search Console', 'Google Analytics', 'Slack'].map((integration) => (
              <div key={integration} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{integration}</span>
                <Button variant="ghost" size="sm">Connect</Button>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Security */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Security</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Two-Factor Authentication</p>
              <p className="text-gray-400 text-sm">Secure your account with 2FA</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          <div className="flex items-center justify-between border-t border-gray-800 pt-4">
            <div>
              <p className="text-white font-semibold">Change Password</p>
              <p className="text-gray-400 text-sm">Update your password regularly</p>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </CardBody>
      </Card>

      {/* Add Website Modal */}
      <AddWebsiteModal 
        isOpen={isAddWebsiteOpen}
        onClose={() => setIsAddWebsiteOpen(false)}
        onSuccess={handleWebsiteAdded}
      />
    </div>
  );
}
