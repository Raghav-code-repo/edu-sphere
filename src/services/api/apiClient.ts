export class ApiError extends Error {
  public readonly status: number;
  public readonly body: unknown;
  public readonly requestId: string;

  constructor(status: number, message: string, body?: unknown, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.requestId =
      requestId || crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly timeout: number;
  private authToken: string | null = null;

  constructor(baseUrl: string, timeout: number) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const fullUrl = `${this.baseUrl}${path}`;
    const url = fullUrl.startsWith('http')
      ? new URL(fullUrl)
      : new URL(fullUrl, window.location.origin);

    if (options.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? this.timeout);

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    const requestId =
      (typeof crypto !== 'undefined' && crypto.randomUUID?.()) ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      let body: unknown;
      if (response.status !== 204 && isJson) {
        body = await response.json();
      } else if (response.status !== 204) {
        body = await response.text();
      }

      if (!response.ok) {
        const message =
          isJson && body && typeof body === 'object' && 'message' in body
            ? String((body as Record<string, unknown>).message)
            : response.statusText;

        const err = new ApiError(
          response.status,
          message,
          body,
          response.headers.get('x-request-id') || requestId
        );
        if (response.status === 401) {
          err.name = 'UnauthorizedError';
        } else if (response.status === 403) {
          err.name = 'ForbiddenError';
        }
        throw err;
      }

      return body as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout');
        }
        throw new ApiError(0, error.message);
      }
      throw new ApiError(0, 'An unknown error occurred');
    }
  }

  get<T>(path: string, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>('GET', path, options);
  }

  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>('POST', path, { ...options, body });
  }

  put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>('PUT', path, { ...options, body });
  }

  patch<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>('PATCH', path, { ...options, body });
  }

  delete<T>(path: string, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>('DELETE', path, options);
  }
}

import { environment } from '@/config/environment';

let apiClientInstance: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient(environment.apiBaseUrl, environment.apiTimeout);
  }
  return apiClientInstance;
}
