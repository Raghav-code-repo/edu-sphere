import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import type { User, UserRole } from '@/types/auth';
import { mockAuthService } from '@/services/auth/mockAuthService';
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
    console.log('[Dev] refreshAuth called');
    try {
      const response = await mockAuthService.refreshToken();
      console.log('[Dev] refreshAuth response', response);
      if (response) {
        setState(response.user);
        setToken(response.token);
      } else {
        console.log('[Dev] No auth session found');
        setState(null);
        setToken(null);
      }
    } catch {
      setState(null);
      setToken(null);
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
      console.log('[Dev] AuthProvider.login called', { email: credentials.email });
      setIsLoading(true);
      try {
        const response = await mockAuthService.login(credentials);
        console.log('[Dev] Mock auth response', response);
        console.log('[Dev] Authenticated user', response.user);
        console.log('[Dev] Authenticated role', response.user.role);
        setState(response.user);
        setToken(response.token);
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
        const response = await mockAuthService.register(credentials);
        setState(response.user);
        setToken(response.token);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const forgotPassword = useCallback(async (_email: string) => {
    await mockAuthService.forgotPassword({ email: _email });
  }, []);

  const resetPassword = useCallback(
    async (_token: string, _password: string, _confirmPassword: string) => {
      await mockAuthService.resetPassword({
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
      await mockAuthService.logout();
      setState(null);
      setToken(null);
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
