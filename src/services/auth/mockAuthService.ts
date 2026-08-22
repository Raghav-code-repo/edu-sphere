import type { AuthService } from '@/types/auth';
import type { User } from '@/types/auth';

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'rahul@edusphere.demo': {
    password: 'Student@123',
    user: {
      id: '1',
      email: 'rahul@edusphere.demo',
      firstName: 'Rahul',
      lastName: 'Sharma',
      role: 'STUDENT',
    },
  },
  'parent@edusphere.demo': {
    password: 'Parent@123',
    user: {
      id: '2',
      email: 'parent@edusphere.demo',
      firstName: 'Jane',
      lastName: 'Parent',
      role: 'PARENT',
    },
  },
  'faculty@edusphere.demo': {
    password: 'Faculty@123',
    user: {
      id: '3',
      email: 'faculty@edusphere.demo',
      firstName: 'Prof.',
      lastName: 'Smith',
      role: 'FACULTY',
    },
  },
  'admin@edusphere.demo': {
    password: 'Admin@123',
    user: {
      id: '4',
      email: 'admin@edusphere.demo',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  },
};

const TOKEN_KEY = 'edusphere_auth_token';
const USER_KEY = 'edusphere_user';

export class MockAuthService implements AuthService {
  private getDelay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async login(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<{ user: User; token: string; refreshToken?: string }> {
    await this.getDelay(800);

    const demoUser = DEMO_USERS[credentials.email.toLowerCase()];
    if (!demoUser || demoUser.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    const token = `mock_jwt_${demoUser.user.id}_${Date.now()}`;
    const response = {
      user: demoUser.user,
      token,
      refreshToken: `mock_refresh_${demoUser.user.id}`,
    };

    if (credentials.rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(demoUser.user));
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(demoUser.user));
    }

    return response;
  }

  async register(credentials: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
  }): Promise<{ user: User; token: string; refreshToken?: string }> {
    await this.getDelay(800);

    if (DEMO_USERS[credentials.email.toLowerCase()]) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email.toLowerCase(),
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      role: 'STUDENT',
    };

    const token = `mock_jwt_${newUser.id}_${Date.now()}`;
    const response = {
      user: newUser,
      token,
      refreshToken: `mock_refresh_${newUser.id}`,
    };

    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(newUser));

    return response;
  }

  async forgotPassword(_credentials: { email: string }): Promise<void> {
    await this.getDelay(800);
  }

  async resetPassword(_credentials: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.getDelay(800);
  }

  async refreshToken(): Promise<{ user: User; token: string; refreshToken?: string } | null> {
    await this.getDelay(300);

    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

    if (!token || !userStr) {
      return null;
    }

    try {
      const user = JSON.parse(userStr) as User;
      return { user, token, refreshToken: `mock_refresh_${user.id}` };
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    await this.getDelay(200);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
}

export const mockAuthService = new MockAuthService();
