import { DashboardLayout } from './DashboardLayout';
import { adminNavigation } from '@/config/navigation';

const defaultUser = {
  name: 'Admin User',
  email: 'admin@edusphere.com',
  role: 'admin',
};

export function AdminLayout() {
  return <DashboardLayout navigation={adminNavigation} user={defaultUser} breadcrumbs={[]} />;
}
