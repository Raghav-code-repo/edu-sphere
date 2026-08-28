import { DashboardLayout } from './DashboardLayout';
import { adminNavigation } from '@/config/navigation';
import { useAuth } from '@/features/auth';

export function AdminLayout() {
  const { user } = useAuth();
  const layoutUser = user
    ? {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      }
    : { name: '', email: '', role: 'ADMIN' as const };
  return <DashboardLayout navigation={adminNavigation} user={layoutUser} breadcrumbs={[]} />;
}
