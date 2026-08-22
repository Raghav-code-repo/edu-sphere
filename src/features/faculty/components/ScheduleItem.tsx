import type { FacultyCalendarEvent } from '@/types/faculty';

interface ScheduleItemProps {
  event: FacultyCalendarEvent;
}

export function ScheduleItem({ event }: ScheduleItemProps) {
  const typeColors: Record<string, string> = {
    class: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    exam: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    assignment: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    event: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    holiday: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    office_hours: 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <div className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
        <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-sm font-bold text-primary-700 dark:text-primary-300">
          {new Date(event.date).getDate()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{event.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : ''}
          {event.location ? ` • ${event.location}` : ''}
        </p>
      </div>
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[event.type] || typeColors.class}`}
      >
        {event.type.replace('_', ' ')}
      </span>
    </div>
  );
}
