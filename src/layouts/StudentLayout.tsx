import { DashboardLayout } from './DashboardLayout';
import { studentNavigation } from '@/config/navigation';

const defaultUser = {
  name: 'Rahul Sharma',
  email: 'rahul@edusphere.demo',
  role: 'STUDENT',
};

export function StudentLayout() {
  return <DashboardLayout navigation={studentNavigation} user={defaultUser} breadcrumbs={[]} />;
}
