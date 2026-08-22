import { DashboardLayout } from './DashboardLayout';
import { facultyNavigation } from '@/config/navigation';

const defaultUser = {
  name: 'Prof. Smith',
  email: 'faculty@edusphere.com',
  role: 'FACULTY',
};

export function FacultyLayout() {
  return <DashboardLayout navigation={facultyNavigation} user={defaultUser} breadcrumbs={[]} />;
}
