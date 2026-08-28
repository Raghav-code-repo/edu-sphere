import type { AuthResponse } from '@/types/auth';
import { environment } from '@/config/environment';
import { mockAuthService } from '@/services/auth/mockAuthService';
import { getApiClient } from './apiClient';

export interface AuthApiService {
  login(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<AuthResponse>;
  register(credentials: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
  }): Promise<AuthResponse>;
  forgotPassword(credentials: { email: string }): Promise<void>;
  resetPassword(credentials: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<void>;
  refreshToken(): Promise<AuthResponse | null>;
  logout(): Promise<void>;
}

class AuthApi implements AuthApiService {
  private readonly client = getApiClient();

  async login(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/api/auth/login', credentials);
  }

  async register(credentials: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
  }): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/api/auth/register', credentials);
  }

  async forgotPassword(credentials: { email: string }): Promise<void> {
    await this.client.post('/api/auth/forgot-password', credentials);
  }

  async resetPassword(credentials: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.client.post('/api/auth/reset-password', credentials);
  }

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      return await this.client.post<AuthResponse>('/api/auth/refresh-token', {});
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    await this.client.post('/api/auth/logout', {});
  }
}

class MockAuthApi implements AuthApiService {
  async login(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<AuthResponse> {
    return mockAuthService.login(credentials);
  }

  async register(credentials: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
  }): Promise<AuthResponse> {
    return mockAuthService.register(credentials);
  }

  async forgotPassword(credentials: { email: string }): Promise<void> {
    return mockAuthService.forgotPassword(credentials);
  }

  async resetPassword(credentials: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    return mockAuthService.resetPassword(credentials);
  }

  async refreshToken(): Promise<AuthResponse | null> {
    return mockAuthService.refreshToken();
  }

  async logout(): Promise<void> {
    return mockAuthService.logout();
  }
}

export const authApi: AuthApiService = environment.useMockApi ? new MockAuthApi() : new AuthApi();
