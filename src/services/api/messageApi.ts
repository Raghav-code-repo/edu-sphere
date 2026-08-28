import type { Message, Conversation } from '@/types/shared/messaging';
import type { Message as StudentMessage } from '@/types/student';
import type { FacultyMessage } from '@/types/faculty';
import type { ParentMessage } from '@/types/parent';
import { environment } from '@/config/environment';
import { studentMockService } from '@/services/mock/studentMockService';
import { facultyMockService } from '@/services/mock/facultyMockService';
import { parentMockService } from '@/services/mock/parentMockService';
import { sharedMessagingService } from '@/services/mock/sharedMessagingService';
import { getApiClient } from './apiClient';

export interface MessageApiService {
  getStudentMessages(): Promise<StudentMessage[]>;
  getStudentMessage(id: string): Promise<StudentMessage | undefined>;
  getFacultyMessages(): Promise<FacultyMessage[]>;
  getFacultyMessage(id: string): Promise<FacultyMessage | undefined>;
  sendFacultyMessage(message: Omit<FacultyMessage, 'id' | 'timestamp'>): Promise<FacultyMessage>;
  getParentMessages(): Promise<ParentMessage[]>;
  getConversations(): Promise<Conversation[]>;
  getMessages(conversationId: string): Promise<Message[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'status'>): Promise<Message>;
  markAsRead(conversationId: string): Promise<Conversation[]>;
  searchConversations(query: string): Promise<Conversation[]>;
}

class MessageApi implements MessageApiService {
  private readonly client = getApiClient();

  async getStudentMessages(): Promise<StudentMessage[]> {
    return this.client.get<StudentMessage[]>('/api/student/messages');
  }

  async getStudentMessage(id: string): Promise<StudentMessage | undefined> {
    return this.client.get<StudentMessage>(`/api/student/messages/${id}`);
  }

  async getFacultyMessages(): Promise<FacultyMessage[]> {
    return this.client.get<FacultyMessage[]>('/api/faculty/messages');
  }

  async getFacultyMessage(id: string): Promise<FacultyMessage | undefined> {
    return this.client.get<FacultyMessage>(`/api/faculty/messages/${id}`);
  }

  async sendFacultyMessage(
    message: Omit<FacultyMessage, 'id' | 'timestamp'>
  ): Promise<FacultyMessage> {
    return this.client.post<FacultyMessage>('/api/faculty/messages', message);
  }

  async getParentMessages(): Promise<ParentMessage[]> {
    return this.client.get<ParentMessage[]>('/api/parent/messages');
  }

  async getConversations(): Promise<Conversation[]> {
    return this.client.get<Conversation[]>('/api/messages/conversations');
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.client.get<Message[]>(`/api/messages/conversations/${conversationId}/messages`);
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.client.get<Conversation>(`/api/messages/conversations/${id}`);
  }

  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'status'>): Promise<Message> {
    return this.client.post<Message>('/api/messages/send', message);
  }

  async markAsRead(conversationId: string): Promise<Conversation[]> {
    return this.client.patch<Conversation[]>(
      `/api/messages/conversations/${conversationId}/read`,
      {}
    );
  }

  async searchConversations(query: string): Promise<Conversation[]> {
    return this.client.get<Conversation[]>('/api/messages/search', {
      params: { query },
    });
  }
}

class MockMessageApi implements MessageApiService {
  async getStudentMessages() {
    return studentMockService.getMessages();
  }
  async getStudentMessage(id: string) {
    return studentMockService.getMessage(id);
  }
  async getFacultyMessages() {
    return facultyMockService.getMessages();
  }
  async getFacultyMessage(id: string) {
    return facultyMockService.getMessage(id);
  }
  async sendFacultyMessage(message: Omit<FacultyMessage, 'id' | 'timestamp'>) {
    return facultyMockService.sendMessage(message);
  }
  async getParentMessages() {
    return parentMockService.getMessages();
  }
  async getConversations() {
    return sharedMessagingService.getConversations();
  }
  async getMessages(conversationId: string) {
    return sharedMessagingService.getMessages(conversationId);
  }
  async getConversation(id: string) {
    return sharedMessagingService.getConversation(id);
  }
  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'status'>) {
    return sharedMessagingService.sendMessage(message);
  }
  async markAsRead(conversationId: string) {
    return sharedMessagingService.markAsRead(conversationId);
  }
  async searchConversations(query: string) {
    return sharedMessagingService.searchConversations(query);
  }
}

export const messageApi: MessageApiService = environment.useMockApi
  ? new MockMessageApi()
  : new MessageApi();
