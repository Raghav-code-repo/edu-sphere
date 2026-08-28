import { DashboardLayout } from './DashboardLayout';
import { studentNavigation } from '@/config/navigation';
import { useAuth } from '@/features/auth';

export function StudentLayout() {
  const { user } = useAuth();
  const layoutUser = user
    ? {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      }
    : { name: '', email: '', role: 'STUDENT' as const };
  return <DashboardLayout navigation={studentNavigation} user={layoutUser} breadcrumbs={[]} />;
}
