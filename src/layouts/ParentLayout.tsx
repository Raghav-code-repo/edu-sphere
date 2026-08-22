import { DashboardLayout } from './DashboardLayout';
import { parentNavigation } from '@/config/navigation';

const defaultUser = {
  name: 'Jane Parent',
  email: 'parent@edusphere.com',
  role: 'PARENT',
};

export function ParentLayout() {
  return <DashboardLayout navigation={parentNavigation} user={defaultUser} breadcrumbs={[]} />;
}
