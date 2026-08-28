import type { Course } from '@/types/student';
import { environment } from '@/config/environment';
import { studentMockService } from '@/services/mock/studentMockService';
import { facultyMockService } from '@/services/mock/facultyMockService';
import { getApiClient } from './apiClient';

export interface CourseApiService {
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  getFacultyCourses(): Promise<import('@/types/faculty').FacultyCourse[]>;
  getFacultyCourse(id: string): Promise<import('@/types/faculty').FacultyCourse | undefined>;
}

class CourseApi implements CourseApiService {
  private readonly client = getApiClient();

  async getCourses(): Promise<Course[]> {
    return this.client.get<Course[]>('/api/courses');
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.client.get<Course>(`/api/courses/${id}`);
  }

  async getFacultyCourses(): Promise<import('@/types/faculty').FacultyCourse[]> {
    return this.client.get<import('@/types/faculty').FacultyCourse[]>('/api/faculty/courses');
  }

  async getFacultyCourse(id: string): Promise<import('@/types/faculty').FacultyCourse | undefined> {
    return this.client.get<import('@/types/faculty').FacultyCourse>(`/api/faculty/courses/${id}`);
  }
}

class MockCourseApi implements CourseApiService {
  async getCourses() {
    return studentMockService.getCourses();
  }
  async getCourse(id: string) {
    return studentMockService.getCourse(id);
  }
  async getFacultyCourses() {
    return facultyMockService.getCourses();
  }
  async getFacultyCourse(id: string) {
    return facultyMockService.getCourse(id);
  }
}

export const courseApi: CourseApiService = environment.useMockApi
  ? new MockCourseApi()
  : new CourseApi();
