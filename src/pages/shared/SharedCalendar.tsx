import { useEffect, useReducer, useState } from 'react';
import { PageHeader, EmptyState } from '@/features/student';
import { calendarApi } from '@/services/api/calendarApi';
import { calendarReducer } from '@/types/shared/calendar';
import { CalendarView, ViewToggle } from '@/features/shared';
import type { CalendarEvent, CalendarViewType } from '@/types/shared/calendar';

const initialState = {
  currentDate: new Date(),
  view: 'month' as CalendarViewType,
  selectedDate: new Date().toISOString().split('T')[0],
  events: [] as CalendarEvent[],
};

export function SharedCalendar() {
  const [state, dispatch] = useReducer(calendarReducer, initialState);
  const [loading, setLoading] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    async function loadData() {
      const events = await calendarApi.getEvents();
      dispatch({ type: 'setEvents', events });
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    const selected = state.events.filter((e) => e.date === state.selectedDate);
    setSelectedEvents(selected);
  }, [state.selectedDate, state.events]);

  const handleViewChange = (view: CalendarViewType) => {
    dispatch({ type: 'setView', view });
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
      <PageHeader title="Calendar" subtitle="View your schedule and important dates" />

      <ViewToggle view={state.view} onViewChange={handleViewChange} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CalendarView events={state.events} initialView={state.view} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Events on{' '}
              {new Date(state.selectedDate).toLocaleDateString('en-US', {
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
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
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
