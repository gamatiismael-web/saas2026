'use client';

import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCreateWebsite } from '@/hooks/useAnalytics';

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddWebsiteModal({ isOpen, onClose, onSuccess }: AddWebsiteModalProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<'form' | 'script'>('form');
  const [trackingScript, setTrackingScript] = useState<string | null>(null);
  const [scriptId, setScriptId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { createWebsite, loading, error } = useCreateWebsite();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const website = await createWebsite(url, name, description);
    if (website) {
      setScriptId(website.tracking_script_id);
      const scriptContent = `<!-- ValueConnection Analytics -->
<script>
  window.vc_api_endpoint = '${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}';
</script>
<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/vc-analytics.js?id=${website.tracking_script_id}"></script>`;
      setTrackingScript(scriptContent);
      setStep('script');
    }
  };

  const copyScript = () => {
    if (trackingScript) {
      navigator.clipboard.writeText(trackingScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setUrl('');
    setName('');
    setDescription('');
    setStep('form');
    setTrackingScript(null);
    setScriptId(null);
    onClose();
  };

  const handleSuccess = () => {
    handleClose();
    onSuccess?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {step === 'form' ? 'Add Website' : 'Install Tracking Script'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website URL *
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include protocol (http:// or https://)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website Name *
                </label>
                <Input
                  type="text"
                  placeholder="My Awesome Website"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Brief description of your website..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" fullWidth onClick={handleClose}>
                  Cancel
                </Button>
                <Button fullWidth loading={loading} disabled={loading || !url || !name}>
                  Continue
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4">
                <p className="text-blue-400 text-sm">
                  Copy the script below and paste it into your website's HTML, preferably in the head section or before closing body tag.
                </p>
              </div>

              <div className="relative">
                <div className="bg-gray-900 border border-gray-700 rounded p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                  {trackingScript}
                </div>
                <button
                  onClick={copyScript}
                  className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                  title="Copy script"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-300" />
                  )}
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-300 font-medium">Your Tracking ID:</p>
                <div className="bg-gray-900 border border-gray-700 rounded p-3 flex items-center justify-between">
                  <code className="text-blue-400">{scriptId}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(scriptId || '');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded p-4 space-y-2 text-sm">
                <p className="text-gray-300 font-medium">Installation Steps:</p>
                <ol className="list-decimal list-inside text-gray-400 space-y-1">
                  <li>Copy the script above</li>
                  <li>Login to your website hosting/editor</li>
                  <li>Add the script to your website's HTML (head or before {'</body>'})</li>
                  <li>Save and publish changes</li>
                  <li>We'll start tracking your analytics within minutes</li>
                </ol>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" fullWidth onClick={() => setStep('form')}>
                  Back
                </Button>
                <Button fullWidth onClick={handleSuccess}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
