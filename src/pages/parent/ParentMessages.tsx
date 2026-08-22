import { useEffect, useState } from 'react';
import { PageHeader } from '@/features/parent';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { parentMockService } from '@/services/mock/parentMockService';
import type { ParentMessage } from '@/types/parent';

export function ParentMessages() {
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parentMockService.getMessages().then((data) => {
      setMessages(data);
      setLoading(false);
    });
  }, []);

  const selected = messages.find((m) => m.id === selectedId);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        subtitle={`${messages.filter((m) => !m.read).length} unread messages`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => setSelectedId(message.id)}
                  className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-750 ${selectedId === message.id ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {message.read ? (
                        <MailOpen className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Mail className="h-5 w-5 text-primary-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium ${message.read ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}
                        >
                          {message.senderName}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {message.timestamp}
                        </span>
                      </div>
                      <p
                        className={`mt-1 text-sm ${message.read ? 'text-gray-600 dark:text-gray-300' : 'font-medium text-gray-900 dark:text-white'}`}
                      >
                        {message.subject}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {message.preview}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selected.subject}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    From: <span className="font-medium">{selected.senderName}</span> •{' '}
                    {selected.timestamp}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    <MailOpen className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selected.body}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
