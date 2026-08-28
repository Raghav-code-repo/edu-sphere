import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import type { User, UserRole } from '@/types/auth';
import { authApi } from '@/services/api/authApi';
import { getApiClient } from '@/services/api/apiClient';
import type { AuthContextValue } from '@/types/auth';

export { useAuth } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const response = await authApi.refreshToken();
      if (response) {
        setState(response.user);
        setToken(response.token);
        getApiClient().setAuthToken(response.token);
      } else {
        setState(null);
        setToken(null);
        getApiClient().setAuthToken(null);
      }
    } catch {
      setState(null);
      setToken(null);
      getApiClient().setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = useCallback(
    async (credentials: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }): Promise<User> => {
      setIsLoading(true);
      try {
        const response = await authApi.login(credentials);
        setState(response.user);
        setToken(response.token);
        getApiClient().setAuthToken(response.token);
        return response.user;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (credentials: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      agreeTerms: boolean;
    }) => {
      setIsLoading(true);
      try {
        const response = await authApi.register(credentials);
        setState(response.user);
        setToken(response.token);
        getApiClient().setAuthToken(response.token);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const forgotPassword = useCallback(async (_email: string) => {
    await authApi.forgotPassword({ email: _email });
  }, []);

  const resetPassword = useCallback(
    async (_token: string, _password: string, _confirmPassword: string) => {
      await authApi.resetPassword({
        token: _token,
        password: _password,
        confirmPassword: _confirmPassword,
      });
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setState(null);
      setToken(null);
      getApiClient().setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasRole = useCallback(
    (roles: UserRole[]) => {
      if (!state) return false;
      return roles.includes(state.role);
    },
    [state]
  );

  const value: AuthContextValue = {
    user: state,
    token,
    isAuthenticated: !!state && !!token,
    isLoading,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
