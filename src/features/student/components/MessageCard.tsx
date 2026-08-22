import { Link } from 'react-router-dom';
import type { Message } from '@/types/student';
import { Mail, MailOpen } from 'lucide-react';

interface MessageCardProps {
  message: Message;
}

export function MessageCard({ message }: MessageCardProps) {
  return (
    <Link
      to={`/student/messages/${message.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
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
            <span className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</span>
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
    </Link>
  );
}
