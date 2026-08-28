import { DashboardLayout } from './DashboardLayout';
import { parentNavigation } from '@/config/navigation';
import { useAuth } from '@/features/auth';

export function ParentLayout() {
  const { user } = useAuth();
  const layoutUser = user
    ? {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      }
    : { name: '', email: '', role: 'PARENT' as const };
  return <DashboardLayout navigation={parentNavigation} user={layoutUser} breadcrumbs={[]} />;
}
