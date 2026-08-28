import type { Announcement } from '@/types/shared/announcements';
import { Pin } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
  isImportant?: boolean;
}

export function AnnouncementCard({ announcement, isImportant = false }: AnnouncementCardProps) {
  const isHighlighted = isImportant || announcement.status === 'published';

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md ${
        isHighlighted
          ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10'
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 rounded-lg p-2 ${
            isHighlighted
              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          <Pin className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {announcement.title}
            </h4>
            {isHighlighted && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Important
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {announcement.content}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {announcement.category}
            </span>
            <span>{announcement.authorName}</span>
            <span>•</span>
            <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
