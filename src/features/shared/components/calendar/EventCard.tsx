import { Clock, MapPin, BookOpen } from 'lucide-react';
import type { CalendarEvent, CalendarEventType } from '@/types/shared/calendar';

interface EventCardProps {
  event: CalendarEvent;
}

const typeColors: Record<CalendarEventType, { bg: string; border: string; dot: string }> = {
  class: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-l-blue-500',
    dot: 'bg-blue-500',
  },
  exam: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-l-red-500',
    dot: 'bg-red-500',
  },
  assignment: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-l-amber-500',
    dot: 'bg-amber-500',
  },
  meeting: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-l-green-500',
    dot: 'bg-green-500',
  },
  announcement: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-l-purple-500',
    dot: 'bg-purple-500',
  },
  holiday: {
    bg: 'bg-gray-50 dark:bg-gray-700/50',
    border: 'border-l-gray-400',
    dot: 'bg-gray-400',
  },
};

export function EventCard({ event }: EventCardProps) {
  const colors = typeColors[event.type];

  return (
    <div
      className={`rounded-lg border border-l-4 ${colors.border} ${colors.bg} p-3 transition-shadow hover:shadow-sm`}
    >
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${colors.dot}`} />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {event.title}
          </h4>
          {event.startTime && (
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>
                {event.startTime}
                {event.endTime ? ` - ${event.endTime}` : ''}
              </span>
            </div>
          )}
          {event.location && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.courseName && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <BookOpen className="h-3 w-3" />
              <span className="truncate">{event.courseName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
