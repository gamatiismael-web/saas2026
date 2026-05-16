import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MessageSquare, Send } from 'lucide-react';

export function Messages() {
  const messages = [
    {
      id: 1,
      subject: 'Homepage design approval needed',
      preview: 'We\'ve completed the initial homepage design and would love your feedback...',
      from: 'Value-Connection Team',
      date: '2024-03-12',
      read: false,
    },
    {
      id: 2,
      subject: 'Monthly performance report',
      preview: 'Your March performance report is now available in your dashboard...',
      from: 'Value-Connection Team',
      date: '2024-03-08',
      read: true,
    },
    {
      id: 3,
      subject: 'Welcome to Value-Connection UK',
      preview: 'Thank you for choosing Value-Connection UK for your website growth journey...',
      from: 'Value-Connection Team',
      date: '2024-03-01',
      read: true,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
            <p className="text-gray-300">Communicate with your project team</p>
          </div>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Inbox</h2>
          </CardHeader>
          <CardBody>
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No messages yet</h3>
                <p className="text-gray-300">Your conversations will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      message.read
                        ? 'bg-black border-gray-800 hover:bg-black'
                        : 'bg-black border-blue-200 hover:bg-gray-950'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-semibold ${message.read ? 'text-white' : 'text-blue-500'}`}>
                            {message.subject}
                          </h3>
                          {!message.read && <Badge variant="info">New</Badge>}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">From: {message.from}</div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(message.date).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{message.preview}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
