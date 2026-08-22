import type { CalendarEvent } from '@/types/student';
import { Calendar, Clock, MapPin, FileText, BookOpen } from 'lucide-react';

interface ScheduleItemProps {
  event: CalendarEvent;
}

const typeConfig = {
  class: {
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    icon: BookOpen,
    label: 'Class',
  },
  exam: {
    color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    icon: FileText,
    label: 'Exam',
  },
  assignment: {
    color: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
    icon: FileText,
    label: 'Assignment',
  },
  event: {
    color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    icon: Calendar,
    label: 'Event',
  },
  holiday: {
    color: 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800',
    icon: Calendar,
    label: 'Holiday',
  },
};

export function ScheduleItem({ event }: ScheduleItemProps) {
  const config = typeConfig[event.type];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border p-3 ${config.color}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 rounded-lg bg-white/50 p-2 dark:bg-gray-800/50">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {config.label}
            </span>
          </div>
          {event.courseName && (
            <p className="text-xs text-gray-600 dark:text-gray-300">{event.courseName}</p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {event.startTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {event.startTime}
                {event.endTime ? ` - ${event.endTime}` : ''}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
