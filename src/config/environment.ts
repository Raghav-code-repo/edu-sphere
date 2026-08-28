export const environment = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true' || !import.meta.env.VITE_API_BASE_URL,
} as const;

export type Environment = typeof environment;
