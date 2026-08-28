# API Integration Guide

This document explains how the EduSphere React frontend is prepared to connect to future ASP.NET Core microservices.

## Architecture Overview

The frontend uses a centralized API architecture located in `src/services/api/`. All HTTP communication flows through a single `ApiClient` instance, and each domain has its own service module with a defined interface.

```
src/services/api/
  apiClient.ts       - Centralized HTTP client with auth, error handling, timeout
  apiTypes.ts        - Shared request/response types
  authApi.ts         - Identity Service endpoints
  studentApi.ts      - Student Service endpoints
  parentApi.ts       - Parent Service endpoints
  facultyApi.ts      - Faculty Service endpoints
  courseApi.ts       - Course Service endpoints
  classApi.ts        - Class Service endpoints
  attendanceApi.ts   - Attendance Service endpoints
  assignmentApi.ts   - Assignment Service endpoints
  examApi.ts         - Exam Service endpoints
  gradeApi.ts        - Grade Service endpoints
  feeApi.ts          - Fee Service endpoints
  notificationApi.ts - Notification Service endpoints
  messageApi.ts      - Messaging Service endpoints
  reportApi.ts       - Reporting Service endpoints
  userApi.ts         - User Service endpoints
```

## Environment Configuration

API configuration is managed through Vite environment variables defined in `src/config/environment.ts`.

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=15000
VITE_USE_MOCK_API=true
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | Base URL for all API requests |
| `VITE_API_TIMEOUT` | `15000` | Request timeout in milliseconds |
| `VITE_USE_MOCK_API` | `true` when `VITE_API_BASE_URL` is unset | Use mock data instead of real API |

## Centralized HTTP Client

`src/services/api/apiClient.ts` provides:

- **GET / POST / PUT / PATCH / DELETE** methods
- **Authentication headers** via `setAuthToken(token)` - adds `Bearer <token>` to every request
- **401 Unauthorized** handling - throws `UnauthorizedError`
- **403 Forbidden** handling - throws `ForbiddenError`
- **Timeout** handling with `AbortController`
- **Request ID / Correlation ID** - generated per request, available on `ApiError.requestId`
- **Common error handling** - all non-2xx responses throw `ApiError`

## Service Interfaces

Each API module exports:

1. A **service interface** (e.g., `StudentApiService`) defining the public contract
2. A **real implementation class** (e.g., `StudentApi`) that calls the backend via `apiClient`
3. A **mock implementation class** (e.g., `MockStudentApi`) that delegates to existing mock services
4. A **singleton export** (e.g., `studentApi`) that selects real or mock based on `environment.useMockApi`

```typescript
export const studentApi: StudentApiService = environment.useMockApi
  ? new MockStudentApi()
  : new StudentApi();
```

This means the UI can always import from `@/services/api/studentApi` and it will work in both development (mock) and production (real API) without any code changes.

## Swapping from Mock to Real API

Currently, UI components import mock services:

```typescript
import { studentMockService } from '@/services/mock/studentMockService';
```

To switch to the centralized API service, change the import to:

```typescript
import { studentApi } from '@/services/api/studentApi';
```

Because `studentApi` implements the same interface as `studentMockService`, **no other UI code needs to change**.

When the backend is ready:

1. Set `VITE_API_BASE_URL=http://localhost:5000` (or your API Gateway URL)
2. Set `VITE_USE_MOCK_API=false`
3. The API services automatically start calling the real backend

## Future Microservices Mapping

The following table maps frontend services to expected ASP.NET Core microservices:

| Frontend Service | Future Microservice | Example Endpoints |
|------------------|---------------------|-------------------|
| `authApi` | Identity Service | `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh-token` |
| `userApi` | User Service | `/api/admin/users`, `/api/admin/students`, `/api/admin/faculty` |
| `studentApi` | Student Service | `/api/student/courses`, `/api/student/assignments`, `/api/student/grades` |
| `parentApi` | Parent Service | `/api/parent/children`, `/api/parent/fees`, `/api/parent/messages` |
| `facultyApi` | Faculty Service | `/api/faculty/courses`, `/api/faculty/assignments`, `/api/faculty/gradebook` |
| `courseApi` | Course Service | `/api/courses`, `/api/faculty/courses` |
| `classApi` | Class Service | `/api/admin/classes`, `/api/faculty/classes` |
| `attendanceApi` | Attendance Service | `/api/student/attendance`, `/api/faculty/attendance/sessions` |
| `assignmentApi` | Assignment Service | `/api/student/assignments`, `/api/faculty/submissions` |
| `examApi` | Exam Service | `/api/student/exams`, `/api/admin/exams` |
| `gradeApi` | Grade Service | `/api/student/grades`, `/api/faculty/gradebook` |
| `feeApi` | Fee Service | `/api/parent/fees`, `/api/admin/fees` |
| `notificationApi` | Notification Service | `/api/notifications`, `/api/notifications/preferences` |
| `messageApi` | Messaging Service | `/api/messages/conversations`, `/api/messages/send` |
| `reportApi` | Reporting Service | `/api/admin/reports`, `/api/admin/analytics` |

## API Gateway Consideration

When deploying microservices, route all requests through an API Gateway (e.g., Ocelot, YARP, or ASP.NET Core reverse proxy). The frontend only needs to know the Gateway URL:

```env
VITE_API_BASE_URL=https://api.edusphere.edu
```

The Gateway handles routing to individual microservices:

```
https://api.edusphere.edu/auth/login          -> Identity Service
https://api.edusphere.edu/student/courses     -> Student Service
https://api.edusphere.edu/admin/users         -> User Service
```

## Authentication Flow

1. User submits credentials to `authApi.login()`
2. Frontend stores the JWT token in `localStorage` or `sessionStorage`
3. `apiClient.setAuthToken(token)` is called on login and token refresh
4. Every subsequent request includes `Authorization: Bearer <token>`
5. On 401 responses, the frontend should redirect to login
6. On 403 responses, the frontend should show an access denied message

## JWT Preparation

The `AuthResponse` type is already defined in `src/types/auth.ts`:

```typescript
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
```

The `AuthService` interface supports the standard ASP.NET Core JWT authentication flow:
- Login returns `user`, `token`, and `refreshToken`
- `refreshToken()` silently refreshes the access token
- `logout()` clears local storage and calls the backend logout endpoint

**No secrets or API keys are stored in the frontend.** The JWT token is stored in browser storage (localStorage/sessionStorage) only.

## Request / Response Types

Common API types are defined in `src/services/api/apiTypes.ts`:

```typescript
export interface PaginatedQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

Each service module also defines domain-specific request/response interfaces.

## Error Handling

All API errors throw `ApiError` with the following properties:

```typescript
class ApiError extends Error {
  status: number;      // HTTP status code (401, 403, 404, 500, etc.)
  body: unknown;       // Raw response body
  requestId: string;   // Correlation ID for tracing
}
```

Error handling in UI components:

```typescript
try {
  const courses = await studentApi.getCourses();
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Redirect to login
    } else if (error.status === 403) {
      // Show access denied
    } else {
      // Show generic error
    }
  }
}
```

## Mock Fallback

When `VITE_USE_MOCK_API=true` (default when `VITE_API_BASE_URL` is not set), each API service automatically delegates to the existing mock services. This ensures:

- The application works without a backend during development
- Mock implementations continue working unchanged
- The same UI code works in both mock and real modes
- Switching to the real backend requires only environment variable changes
