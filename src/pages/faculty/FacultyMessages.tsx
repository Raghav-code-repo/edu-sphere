import { useEffect, useState } from 'react';
import { Search, Mail, MailOpen, Trash2, Send } from 'lucide-react';
import { PageHeader } from '@/features/faculty';
import { facultyApi } from '@/services/api/facultyApi';
import type { FacultyMessage } from '@/types/faculty';

export function FacultyMessages() {
  const [messages, setMessages] = useState<FacultyMessage[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [loading, setLoading] = useState(true);

  const [compose, setCompose] = useState({ to: '', subject: '', body: '' });

  useEffect(() => {
    facultyApi.getMessages().then((data) => {
      setMessages(data);
      setLoading(false);
    });
  }, []);

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.senderName.toLowerCase().includes(search.toLowerCase()) ||
      m.preview.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' || (filter === 'read' && m.read) || (filter === 'unread' && !m.read);
    return matchesSearch && matchesFilter;
  });

  const selected = messages.find((m) => m.id === selectedId);

  const handleSend = async () => {
    if (!compose.to || !compose.subject || !compose.body) return;
    await facultyApi.sendMessage({
      senderId: 'f1',
      senderName: 'Dr. Sarah Johnson',
      senderRole: 'Faculty',
      subject: compose.subject,
      preview: compose.body.slice(0, 100) + (compose.body.length > 100 ? '...' : ''),
      body: compose.body,
      read: true,
    });
    setShowCompose(false);
    setCompose({ to: '', subject: '', body: '' });
    const updated = await facultyApi.getMessages();
    setMessages(updated);
  };

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
        actions={
          <button
            onClick={() => setShowCompose(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Send className="h-4 w-4" />
            Compose
          </button>
        }
      />

      {showCompose && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compose Message</h3>
            <button
              onClick={() => setShowCompose(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              &times;
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                To
              </label>
              <input
                type="text"
                value={compose.to}
                onChange={(e) => setCompose({ ...compose, to: e.target.value })}
                className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Recipient name or email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                value={compose.subject}
                onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                value={compose.body}
                onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                rows={5}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Write your message..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCompose(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'read' | 'unread')}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No messages found.
                </div>
              ) : (
                filtered.map((message) => (
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
                ))
              )}
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
