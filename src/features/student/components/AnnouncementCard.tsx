import type { Announcement } from '@/types/student';
import { Megaphone } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${announcement.important ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 rounded-lg p-2 ${announcement.important ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
        >
          <Megaphone className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {announcement.title}
            </h4>
            {announcement.important && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Important
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {announcement.content}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{announcement.author}</span>
            <span>•</span>
            <span>{announcement.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
