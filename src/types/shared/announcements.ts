export type AnnouncementCategory =
  'academic' | 'attendance' | 'assignment' | 'exam' | 'fees' | 'announcement' | 'system';
export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  status: AnnouncementStatus;
  targetAudience: string[];
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface AnnouncementState {
  announcements: Announcement[];
  selectedAnnouncement: Announcement | null;
  filters: {
    search: string;
    category: string;
    status: string;
  };
}

export type AnnouncementAction =
  | { type: 'setAnnouncements'; announcements: Announcement[] }
  | { type: 'selectAnnouncement'; announcement: Announcement | null }
  | { type: 'updateStatus'; id: string; status: AnnouncementStatus }
  | { type: 'setFilters'; filters: AnnouncementState['filters'] };

export function announcementReducer(
  state: AnnouncementState,
  action: AnnouncementAction
): AnnouncementState {
  switch (action.type) {
    case 'setAnnouncements':
      return { ...state, announcements: action.announcements };
    case 'selectAnnouncement':
      return { ...state, selectedAnnouncement: action.announcement };
    case 'updateStatus':
      return {
        ...state,
        announcements: state.announcements.map((a) =>
          a.id === action.id
            ? {
                ...a,
                status: action.status,
                publishedAt:
                  action.status === 'published'
                    ? new Date().toISOString().split('T')[0]
                    : a.publishedAt,
              }
            : a
        ),
      };
    case 'setFilters':
      return { ...state, filters: action.filters };
    default:
      return state;
  }
}
