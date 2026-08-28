import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarEvent, CalendarViewType } from '@/types/shared/calendar';
import { EventCard } from './EventCard';
import { ViewToggle } from './ViewToggle';

interface CalendarViewProps {
  events: CalendarEvent[];
  initialView?: CalendarViewType;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getWeekDates(date: Date): Date[] {
  const start = new Date(date);
  const day = start.getDay();
  start.setDate(start.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function getEventsForDate(events: CalendarEvent[], dateStr: string): CalendarEvent[] {
  return events.filter((e) => e.date === dateStr);
}

export function CalendarView({ events, initialView = 'month' }: CalendarViewProps) {
  const [view, setView] = useState<CalendarViewType>(initialView);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayStr = new Date().toISOString().split('T')[0];

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getHeaderLabel = (): string => {
    if (view === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    if (view === 'week') {
      const weekDates = getWeekDates(currentDate);
      const start = weekDates[0];
      const end = weekDates[6];
      if (start.getMonth() === end.getMonth()) {
        return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()} - ${end.getDate()}, ${year}`;
      }
      return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()} - ${MONTH_NAMES[end.getMonth()]} ${end.getDate()}, ${year}`;
    }
    return `${MONTH_NAMES[month]} ${year}`;
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div
          key={`empty-${i}`}
          className="min-h-[100px] border-b border-r border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/30"
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      const dayEvents = getEventsForDate(events, dateStr);
      const isToday = dateStr === todayStr;

      cells.push(
        <div
          key={day}
          className="min-h-[100px] border-b border-r border-gray-200 p-1.5 dark:border-gray-700"
        >
          <div className="mb-1 flex items-center justify-center">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                isToday ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {day}
            </span>
          </div>
          <div className="space-y-0.5">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${
                  event.type === 'class'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : event.type === 'exam'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      : event.type === 'assignment'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : event.type === 'meeting'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : event.type === 'announcement'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <span className="px-1 text-[10px] text-gray-500 dark:text-gray-400">
                +{dayEvents.length - 3} more
              </span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          {DAY_LABELS.map((label) => (
            <div
              key={label}
              className="border-r border-gray-200 py-2 text-center text-xs font-semibold text-gray-600 last:border-r-0 dark:border-gray-700 dark:text-gray-400"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">{cells}</div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 7);

    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          <div className="border-r border-gray-200 p-2 dark:border-gray-700" />
          {weekDates.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const isToday = dateStr === todayStr;
            return (
              <div
                key={dateStr}
                className="border-r border-gray-200 p-2 text-center last:border-r-0 dark:border-gray-700"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {DAY_LABELS[date.getDay()]}
                </div>
                <div
                  className={`mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                    isToday ? 'bg-primary-600 text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-b border-gray-200 last:border-b-0 dark:border-gray-700"
            >
              <div className="border-r border-gray-200 p-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
              {weekDates.map((date) => {
                const dateStr = date.toISOString().split('T')[0];
                const hourEvents = getEventsForDate(events, dateStr).filter((e) => {
                  if (!e.startTime) return false;
                  const eventHour = parseInt(e.startTime.split(':')[0], 10);
                  return eventHour === hour;
                });
                return (
                  <div
                    key={`${dateStr}-${hour}`}
                    className="min-h-[60px] border-r border-gray-200 p-1 last:border-r-0 dark:border-gray-700"
                  >
                    {hourEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          event.type === 'class'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : event.type === 'exam'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : event.type === 'assignment'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                : event.type === 'meeting'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : event.type === 'announcement'
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayEvents = getEventsForDate(events, dateStr);
    const hours = Array.from({ length: 12 }, (_, i) => i + 7);

    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {hours.map((hour) => {
            const hourEvents = dayEvents.filter((e) => {
              if (!e.startTime) return false;
              const eventHour = parseInt(e.startTime.split(':')[0], 10);
              return eventHour === hour;
            });
            return (
              <div
                key={hour}
                className="flex border-b border-gray-200 last:border-b-0 dark:border-gray-700"
              >
                <div className="w-20 flex-shrink-0 border-r border-gray-200 p-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
                <div className="flex-1 p-2">
                  {hourEvents.length === 0 ? (
                    <div className="h-12" />
                  ) : (
                    <div className="space-y-1">
                      {hourEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const sortedEvents = [...events]
      .filter((e) => e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));

    const grouped = sortedEvents.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    }, {});

    if (Object.keys(grouped).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            No upcoming events
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            There are no upcoming events scheduled.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, dateEvents]) => (
          <div key={date}>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
            </div>
            <div className="ml-1 space-y-2 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
              {dateEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('prev')}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getHeaderLabel()}
          </h2>
          <button
            onClick={() => navigate('next')}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
      {view === 'agenda' && renderAgendaView()}
    </div>
  );
}
