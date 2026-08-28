import { useEffect, useState } from 'react';
import { PageHeader } from '@/features/parent';
import { parentApi } from '@/services/api/parentApi';
import type { ParentProfile } from '@/types/parent';

export function ParentProfile() {
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parentApi.getParentProfile().then((data) => {
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

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="View and manage your personal information" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`}
            alt={fullName}
            className="h-16 w-16 rounded-full bg-gray-200"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{fullName}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{profile.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.occupation}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {profile.phone || 'Not set'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Address</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {profile.address || 'Not set'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Children</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {profile.children.map((c) => `${c.firstName} ${c.lastName}`).join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
