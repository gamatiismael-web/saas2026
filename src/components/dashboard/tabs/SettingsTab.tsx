'use client';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function SettingsTab() {
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
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-white font-semibold">example.com</p>
              <p className="text-gray-400 text-sm">Active • Added 2 weeks ago</p>
            </div>
            <Button variant="outline" fullWidth>
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
                <span className="text-gray-300">{integration}</span>
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
    </div>
  );
}
