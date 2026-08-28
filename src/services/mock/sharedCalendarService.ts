import type { CalendarEvent } from '@/types/shared/calendar';

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const EVENTS: CalendarEvent[] = [
  {
    id: 'cal1',
    title: 'Data Structures Lecture',
    type: 'class',
    date: formatDate(addDays(today, 1)),
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    location: 'Room 301',
    courseName: 'Data Structures & Algorithms',
  },
  {
    id: 'cal2',
    title: 'Database Lecture',
    type: 'class',
    date: formatDate(addDays(today, 2)),
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    location: 'Room 205',
    courseName: 'Database Management Systems',
  },
  {
    id: 'cal3',
    title: 'Mid-Term - CS201',
    type: 'exam',
    date: formatDate(addDays(today, 14)),
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    location: 'Hall A',
    courseName: 'Data Structures & Algorithms',
  },
  {
    id: 'cal4',
    title: 'Binary Tree Assignment Due',
    type: 'assignment',
    date: formatDate(addDays(today, 2)),
    courseName: 'Data Structures & Algorithms',
  },
  {
    id: 'cal5',
    title: 'SQL Joins Quiz',
    type: 'exam',
    date: formatDate(addDays(today, 5)),
    startTime: '02:00 PM',
    endTime: '02:45 PM',
    location: 'Room 204',
    courseName: 'Database Management Systems',
  },
  {
    id: 'cal6',
    title: 'Independence Day',
    type: 'holiday',
    date: formatDate(addDays(today, 10)),
  },
  {
    id: 'cal7',
    title: 'Tech Fest',
    type: 'announcement',
    date: formatDate(addDays(today, 20)),
    description: 'Annual technical festival with workshops and competitions.',
  },
  {
    id: 'cal8',
    title: 'Faculty Meeting',
    type: 'meeting',
    date: formatDate(addDays(today, 3)),
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    location: 'Conference Room',
  },
];

export class SharedCalendarService {
  private getDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    await this.getDelay(400);
    let events = [...EVENTS];
    if (startDate && endDate) {
      events = events.filter((e) => e.date >= startDate && e.date <= endDate);
    }
    return events;
  }

  async getEvent(id: string): Promise<CalendarEvent | undefined> {
    await this.getDelay(300);
    return EVENTS.find((e) => e.id === id);
  }

  async getEventsByDate(date: string): Promise<CalendarEvent[]> {
    await this.getDelay(300);
    return EVENTS.filter((e) => e.date === date);
  }

  async getEventsByType(type: CalendarEvent['type']): Promise<CalendarEvent[]> {
    await this.getDelay(300);
    return EVENTS.filter((e) => e.type === type);
  }

  async getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
    await this.getDelay(400);
    const endDate = formatDate(addDays(today, days));
    return EVENTS.filter((e) => e.date >= formatDate(today) && e.date <= endDate);
  }
}

export const sharedCalendarService = new SharedCalendarService();
