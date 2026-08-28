import { useEffect, useState } from 'react';
import { PageHeader, EmptyState } from '@/features/student';
import { studentApi } from '@/services/api/studentApi';
import type { CalendarEvent } from '@/types/student';
import { Calendar } from '@/components';

export function StudentCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.getCalendarEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const selectedEvents = events.filter((e) => e.date === selectedDate);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    exam: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    assignment: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    event: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    holiday: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" subtitle="View your schedule and important dates" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} events={events} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Events on{' '}
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            {selectedEvents.length === 0 ? (
              <EmptyState
                title="No events"
                description="You have no events scheduled for this day."
              />
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[event.type] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {event.type}
                      </span>
                      {event.startTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {event.startTime}
                          {event.endTime ? ` - ${event.endTime}` : ''}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h4>
                    {event.courseName && (
                      <p className="text-xs text-gray-600 dark:text-gray-300">{event.courseName}</p>
                    )}
                    {event.location && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Location: {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
