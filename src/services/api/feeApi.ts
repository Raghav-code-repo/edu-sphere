import type { AdminFee } from '@/types/admin';
import type { FeeRecord, PaymentIntent, PaymentHistoryItem } from '@/types/parent';
import { environment } from '@/config/environment';
import { parentMockService } from '@/services/mock/parentMockService';
import { adminMockService } from '@/services/mock/adminMockService';
import { getApiClient } from './apiClient';

export interface FeeApiService {
  getFees(): Promise<FeeRecord[]>;
  getFeeById(id: string): Promise<FeeRecord | undefined>;
  initiatePayment(amount: number, childId: string): Promise<PaymentIntent>;
  getPaymentHistory(childId: string): Promise<PaymentHistoryItem[]>;
  getAdminFees(filters?: unknown): Promise<unknown>;
  getAdminFee(id: string): Promise<AdminFee | undefined>;
  updateFeeStatus(id: string, status: string): Promise<AdminFee>;
}

class FeeApi implements FeeApiService {
  private readonly client = getApiClient();

  async getFees(): Promise<FeeRecord[]> {
    return this.client.get<FeeRecord[]>('/api/parent/fees');
  }

  async getFeeById(id: string): Promise<FeeRecord | undefined> {
    return this.client.get<FeeRecord>(`/api/parent/fees/${id}`);
  }

  async initiatePayment(amount: number, childId: string): Promise<PaymentIntent> {
    return this.client.post<PaymentIntent>('/api/parent/payments/initiate', { amount, childId });
  }

  async getPaymentHistory(childId: string): Promise<PaymentHistoryItem[]> {
    return this.client.get<PaymentHistoryItem[]>('/api/parent/payments/history', {
      params: { childId },
    });
  }

  async getAdminFees(_filters?: unknown): Promise<unknown> {
    return this.client.get<unknown>('/api/admin/fees');
  }

  async getAdminFee(id: string): Promise<AdminFee | undefined> {
    return this.client.get<AdminFee>(`/api/admin/fees/${id}`);
  }

  async updateFeeStatus(id: string, status: string): Promise<AdminFee> {
    return this.client.patch<AdminFee>(`/api/admin/fees/${id}/status`, { status });
  }
}

class MockFeeApi implements FeeApiService {
  async getFees() {
    return parentMockService.getFees();
  }
  async getFeeById(id: string) {
    return parentMockService.getFeeById(id);
  }
  async initiatePayment(amount: number, childId: string) {
    return parentMockService.initiatePayment(amount, childId);
  }
  async getPaymentHistory(childId: string) {
    return parentMockService.getPaymentHistory(childId);
  }
  async getAdminFees() {
    return adminMockService.getFees();
  }
  async getAdminFee(id: string) {
    return adminMockService.getFee(id);
  }
  async updateFeeStatus(id: string, status: string) {
    return adminMockService.updateFeeStatus(id, status);
  }
}

export const feeApi: FeeApiService = environment.useMockApi ? new MockFeeApi() : new FeeApi();
