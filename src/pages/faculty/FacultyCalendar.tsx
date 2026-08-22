import { useEffect, useState } from 'react';
import { PageHeader, EmptyState, ScheduleItem } from '@/features/faculty';
import { facultyMockService } from '@/services/mock/facultyMockService';
import type { FacultyCalendarEvent } from '@/types/faculty';

const today = new Date().toISOString().split('T')[0];

const typeColors: Record<string, string> = {
  class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  exam: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  assignment: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  event: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  holiday: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  office_hours: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
};

export function FacultyCalendar() {
  const [events, setEvents] = useState<FacultyCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<FacultyCalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    facultyMockService.getCalendarEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const upcomingEvents = events.filter((e) => e.date >= today);
  const groupedEvents = events.reduce<Record<string, FacultyCalendarEvent[]>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedEvents).sort();

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
        title="Calendar"
        subtitle="View your schedule and important dates"
        actions={
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-l-lg transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-sm font-medium rounded-r-lg transition-colors ${viewMode === 'calendar' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              Calendar
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-2">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events.</p>
              ) : (
                upcomingEvents.slice(0, 5).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`w-full text-left rounded-lg border p-3 transition-colors hover:shadow-md ${selectedEvent?.id === event.id ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[event.type] || typeColors.class}`}
                      >
                        {event.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{event.date}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {selectedEvent ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[selectedEvent.type] || typeColors.class}`}
                    >
                      {selectedEvent.type.replace('_', ' ')}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedEvent.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Date</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedEvent.date}
                    </p>
                  </div>
                  {selectedEvent.startTime && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Time</p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedEvent.startTime}
                        {selectedEvent.endTime ? ` - ${selectedEvent.endTime}` : ''}
                      </p>
                    </div>
                  )}
                  {selectedEvent.location && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Location
                      </p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedEvent.location}
                      </p>
                    </div>
                  )}
                  {selectedEvent.courseName && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Course</p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedEvent.courseName}
                        {selectedEvent.courseCode ? ` (${selectedEvent.courseCode})` : ''}
                      </p>
                    </div>
                  )}
                </div>
                {selectedEvent.description && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-6">
                {sortedDates.length === 0 ? (
                  <EmptyState title="No events" description="You have no events scheduled." />
                ) : (
                  sortedDates.map((date) => (
                    <div key={date}>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </h3>
                      <div className="space-y-2">
                        {groupedEvents[date].map((event) => (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="w-full text-left"
                          >
                            <ScheduleItem event={event} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDates.length === 0 ? (
                  <EmptyState title="No events" description="You have no events scheduled." />
                ) : (
                  sortedDates.map((date) => (
                    <div key={date}>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </h3>
                      <div className="space-y-2">
                        {groupedEvents[date].map((event) => (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="w-full text-left"
                          >
                            <ScheduleItem event={event} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
