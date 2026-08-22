import { useEffect, useState } from 'react';
import { PageHeader } from '@/features/student';
import { studentMockService } from '@/services/mock/studentMockService';
import type { StudentProfile } from '@/types/student';
import { ProfileSection } from '@/features/student';

export function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentMockService.getProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="View and manage your personal information" />

      <ProfileSection profile={profile} />
    </div>
  );
}
