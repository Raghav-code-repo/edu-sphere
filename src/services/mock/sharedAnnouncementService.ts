import type { Announcement } from '@/types/shared/announcements';

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Mid-Term Examination Schedule Released',
    content:
      'The mid-term examination schedule for the current semester has been published. Please check the exam portal for your specific schedule and venue details.',
    category: 'academic',
    status: 'published',
    targetAudience: ['all'],
    authorId: 'u1',
    authorName: 'Academic Office',
    createdAt: formatDate(addDays(today, -1)),
    updatedAt: formatDate(addDays(today, -1)),
    publishedAt: formatDate(addDays(today, -1)),
  },
  {
    id: 'a2',
    title: 'Library Extended Hours During Exams',
    content: 'The library will remain open 24/7 during the mid-term examination period.',
    category: 'announcement',
    status: 'published',
    targetAudience: ['all'],
    authorId: 'u2',
    authorName: 'Library Admin',
    createdAt: formatDate(addDays(today, -2)),
    updatedAt: formatDate(addDays(today, -2)),
    publishedAt: formatDate(addDays(today, -2)),
  },
  {
    id: 'a3',
    title: 'Annual Tech Fest - Registration Open',
    content: 'Register for the annual technical festival with workshops and competitions.',
    category: 'announcement',
    status: 'published',
    targetAudience: ['students', 'faculty'],
    authorId: 'u1',
    authorName: 'Admin User',
    createdAt: formatDate(addDays(today, -3)),
    updatedAt: formatDate(addDays(today, -3)),
    publishedAt: formatDate(addDays(today, -3)),
  },
  {
    id: 'a4',
    title: 'Urgent: Server Maintenance Notice',
    content: 'The student portal will be unavailable on Sunday from 2 AM to 6 AM for maintenance.',
    category: 'system',
    status: 'draft',
    targetAudience: ['all'],
    authorId: 'u1',
    authorName: 'IT Department',
    createdAt: formatDate(today),
    updatedAt: formatDate(today),
  },
  {
    id: 'a5',
    title: 'New Course Enrollment Open',
    content:
      'Enrollment for new elective courses is now open. Choose your courses before the deadline.',
    category: 'academic',
    status: 'published',
    targetAudience: ['students'],
    authorId: 'u2',
    authorName: 'Academic Office',
    createdAt: formatDate(addDays(today, -4)),
    updatedAt: formatDate(addDays(today, -4)),
    publishedAt: formatDate(addDays(today, -4)),
  },
];

export class SharedAnnouncementService {
  private getDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAnnouncements(filters?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<Announcement[]> {
    await this.getDelay(400);
    let results = [...ANNOUNCEMENTS];
    if (filters?.category && filters.category !== 'all') {
      results = results.filter((a) => a.category === filters.category);
    }
    if (filters?.status && filters.status !== 'all') {
      results = results.filter((a) => a.status === filters.status);
    }
    if (filters?.search) {
      const lower = filters.search.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.content.toLowerCase().includes(lower) ||
          a.authorName.toLowerCase().includes(lower)
      );
    }
    return results;
  }

  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    await this.getDelay(300);
    return ANNOUNCEMENTS.find((a) => a.id === id);
  }

  async createAnnouncement(
    data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Announcement> {
    await this.getDelay(400);
    const announcement: Announcement = {
      ...data,
      id: `a${Date.now()}`,
      createdAt: formatDate(today),
      updatedAt: formatDate(today),
    };
    ANNOUNCEMENTS.push(announcement);
    return announcement;
  }

  async updateAnnouncement(
    id: string,
    data: Partial<Announcement>
  ): Promise<Announcement | undefined> {
    await this.getDelay(400);
    const index = ANNOUNCEMENTS.findIndex((a) => a.id === id);
    if (index === -1) return undefined;
    ANNOUNCEMENTS[index] = { ...ANNOUNCEMENTS[index], ...data, updatedAt: formatDate(today) };
    return { ...ANNOUNCEMENTS[index] };
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await this.getDelay(300);
    const index = ANNOUNCEMENTS.findIndex((a) => a.id === id);
    if (index > -1) {
      ANNOUNCEMENTS.splice(index, 1);
    }
  }

  async publishAnnouncement(id: string): Promise<Announcement | undefined> {
    await this.getDelay(300);
    const announcement = ANNOUNCEMENTS.find((a) => a.id === id);
    if (announcement) {
      announcement.status = 'published';
      announcement.publishedAt = formatDate(today);
      announcement.updatedAt = formatDate(today);
    }
    return announcement;
  }

  async archiveAnnouncement(id: string): Promise<Announcement | undefined> {
    await this.getDelay(300);
    const announcement = ANNOUNCEMENTS.find((a) => a.id === id);
    if (announcement) {
      announcement.status = 'archived';
      announcement.updatedAt = formatDate(today);
    }
    return announcement;
  }
}

export const sharedAnnouncementService = new SharedAnnouncementService();
