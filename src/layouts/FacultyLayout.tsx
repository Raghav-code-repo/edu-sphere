import { DashboardLayout } from './DashboardLayout';
import { facultyNavigation } from '@/config/navigation';
import { useAuth } from '@/features/auth';

export function FacultyLayout() {
  const { user } = useAuth();
  const layoutUser = user
    ? {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      }
    : { name: '', email: '', role: 'FACULTY' as const };
  return <DashboardLayout navigation={facultyNavigation} user={layoutUser} breadcrumbs={[]} />;
}
