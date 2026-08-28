import type { Conversation, Message } from '@/types/shared/messaging';

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    participantId: 'f1',
    participantName: 'Dr. Sarah Johnson',
    participantRole: 'faculty',
    participantAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    lastMessage: 'The deadline for the binary tree assignment has been extended...',
    lastMessageTimestamp: formatDate(addDays(today, 0)),
    unreadCount: 2,
    subject: 'Assignment Deadline Extension',
  },
  {
    id: 'conv2',
    participantId: 'a1',
    participantName: 'Admin Office',
    participantRole: 'admin',
    lastMessage: 'The mid-term examination schedule has been published.',
    lastMessageTimestamp: formatDate(addDays(today, -1)),
    unreadCount: 1,
    subject: 'Mid-Term Examination Schedule',
  },
  {
    id: 'conv3',
    participantId: 'f3',
    participantName: 'Dr. Emily Davis',
    participantRole: 'faculty',
    participantAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    lastMessage: 'Lab session moved to Friday.',
    lastMessageTimestamp: formatDate(addDays(today, -2)),
    unreadCount: 0,
    subject: 'Lab Session Rescheduled',
  },
  {
    id: 'conv4',
    participantId: 'f2',
    participantName: 'Prof. Michael Chen',
    participantRole: 'faculty',
    participantAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    lastMessage: 'Grades for Quiz 2 have been posted.',
    lastMessageTimestamp: formatDate(addDays(today, -3)),
    unreadCount: 0,
    subject: 'Grade Posted - Quiz 2',
  },
];

const MESSAGES: Message[] = [
  {
    id: 'm1',
    conversationId: 'conv1',
    senderId: 'f1',
    senderName: 'Dr. Sarah Johnson',
    senderRole: 'faculty',
    body: 'Dear Students, the deadline for the binary tree assignment has been extended by 2 days. Please submit your work through the portal.',
    timestamp: formatDate(addDays(today, 0)),
    status: 'read',
  },
  {
    id: 'm2',
    conversationId: 'conv1',
    senderId: 's1',
    senderName: 'Rahul Sharma',
    senderRole: 'student',
    body: 'Thank you for the extension!',
    timestamp: formatDate(addDays(today, 0)),
    status: 'delivered',
  },
  {
    id: 'm3',
    conversationId: 'conv2',
    senderId: 'a1',
    senderName: 'Admin Office',
    senderRole: 'admin',
    body: 'Dear Students, the mid-term examination schedule for the current semester has been published.',
    timestamp: formatDate(addDays(today, -1)),
    status: 'read',
  },
  {
    id: 'm4',
    conversationId: 'conv3',
    senderId: 'f3',
    senderName: 'Dr. Emily Davis',
    senderRole: 'faculty',
    body: "Dear Students, due to a scheduling conflict, this week's lab session has been moved to Friday at the same time slot.",
    timestamp: formatDate(addDays(today, -2)),
    status: 'read',
  },
  {
    id: 'm5',
    conversationId: 'conv4',
    senderId: 'f2',
    senderName: 'Prof. Michael Chen',
    senderRole: 'faculty',
    body: 'Dear Students, grades for Quiz 2 have been posted. Please check your grades on the portal.',
    timestamp: formatDate(addDays(today, -3)),
    status: 'read',
  },
];

export class SharedMessagingService {
  private getDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getConversations(): Promise<Conversation[]> {
    await this.getDelay(400);
    return [...CONVERSATIONS];
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    await this.getDelay(300);
    return MESSAGES.filter((m) => m.conversationId === conversationId);
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    await this.getDelay(300);
    return CONVERSATIONS.find((c) => c.id === id);
  }

  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'status'>): Promise<Message> {
    await this.getDelay(400);
    const newMessage: Message = {
      ...message,
      id: `m${Date.now()}`,
      timestamp: formatDate(today),
      status: 'sent',
    };
    MESSAGES.push(newMessage);

    const conversation = CONVERSATIONS.find((c) => c.id === message.conversationId);
    if (conversation) {
      conversation.lastMessage = message.body;
      conversation.lastMessageTimestamp = formatDate(today);
    }

    return newMessage;
  }

  async markAsRead(conversationId: string): Promise<Conversation[]> {
    await this.getDelay(200);
    const conversation = CONVERSATIONS.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
    }
    return [...CONVERSATIONS];
  }

  async searchConversations(query: string): Promise<Conversation[]> {
    await this.getDelay(300);
    const lower = query.toLowerCase();
    return CONVERSATIONS.filter(
      (c) =>
        c.participantName.toLowerCase().includes(lower) ||
        c.subject?.toLowerCase().includes(lower) ||
        c.lastMessage.toLowerCase().includes(lower)
    );
  }
}

export const sharedMessagingService = new SharedMessagingService();
