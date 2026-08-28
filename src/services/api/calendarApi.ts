import type { CalendarEvent } from '@/types/shared/calendar';
import { environment } from '@/config/environment';
import { sharedCalendarService } from '@/services/mock/sharedCalendarService';
import { getApiClient } from './apiClient';

export interface CalendarApiService {
  getEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]>;
  getEvent(id: string): Promise<CalendarEvent | undefined>;
  getEventsByDate(date: string): Promise<CalendarEvent[]>;
  getEventsByType(type: CalendarEvent['type']): Promise<CalendarEvent[]>;
  getUpcomingEvents(days?: number): Promise<CalendarEvent[]>;
}

class CalendarApi implements CalendarApiService {
  private readonly client = getApiClient();

  async getEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    return this.client.get<CalendarEvent[]>('/api/calendar/events', {
      params: { startDate, endDate },
    });
  }

  async getEvent(id: string): Promise<CalendarEvent | undefined> {
    return this.client.get<CalendarEvent>(`/api/calendar/events/${id}`);
  }

  async getEventsByDate(date: string): Promise<CalendarEvent[]> {
    return this.client.get<CalendarEvent[]>('/api/calendar/events', {
      params: { date },
    });
  }

  async getEventsByType(type: CalendarEvent['type']): Promise<CalendarEvent[]> {
    return this.client.get<CalendarEvent[]>('/api/calendar/events', {
      params: { type },
    });
  }

  async getUpcomingEvents(days?: number): Promise<CalendarEvent[]> {
    return this.client.get<CalendarEvent[]>('/api/calendar/events/upcoming', {
      params: { days },
    });
  }
}

class MockCalendarApi implements CalendarApiService {
  async getEvents(startDate?: string, endDate?: string) {
    return sharedCalendarService.getEvents(startDate, endDate);
  }
  async getEvent(id: string) {
    return sharedCalendarService.getEvent(id);
  }
  async getEventsByDate(date: string) {
    return sharedCalendarService.getEventsByDate(date);
  }
  async getEventsByType(type: CalendarEvent['type']) {
    return sharedCalendarService.getEventsByType(type);
  }
  async getUpcomingEvents(days?: number) {
    return sharedCalendarService.getUpcomingEvents(days);
  }
}

export const calendarApi: CalendarApiService = environment.useMockApi
  ? new MockCalendarApi()
  : new CalendarApi();
