export type CalendarViewType = 'month' | 'week' | 'day' | 'agenda';
export type CalendarEventType =
  'class' | 'exam' | 'assignment' | 'meeting' | 'announcement' | 'holiday';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  courseName?: string;
}

export interface CalendarDay {
  date: string;
  events: CalendarEvent[];
}

export interface CalendarState {
  currentDate: Date;
  view: CalendarViewType;
  selectedDate: string;
  events: CalendarEvent[];
}

export type CalendarAction =
  | { type: 'setView'; view: CalendarViewType }
  | { type: 'setSelectedDate'; date: string }
  | { type: 'setCurrentDate'; date: Date }
  | { type: 'setEvents'; events: CalendarEvent[] }
  | { type: 'navigate'; direction: 'prev' | 'next' };

export function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'setView':
      return { ...state, view: action.view };
    case 'setSelectedDate':
      return { ...state, selectedDate: action.date };
    case 'setCurrentDate':
      return { ...state, currentDate: action.date };
    case 'setEvents':
      return { ...state, events: action.events };
    case 'navigate': {
      const newDate = new Date(state.currentDate);
      if (state.view === 'month') {
        newDate.setMonth(newDate.getMonth() + (action.direction === 'next' ? 1 : -1));
      } else if (state.view === 'week') {
        newDate.setDate(newDate.getDate() + (action.direction === 'next' ? 7 : -7));
      } else if (state.view === 'day') {
        newDate.setDate(newDate.getDate() + (action.direction === 'next' ? 1 : -1));
      }
      return { ...state, currentDate: newDate };
    }
    default:
      return state;
  }
}
