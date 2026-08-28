import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Users } from 'lucide-react';
import { PageHeader } from '@/features/parent';
import { parentApi } from '@/services/api/parentApi';
import type { ParentProfile, Child } from '@/types/parent';

export function ParentChildren() {
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

  return (
    <div className="space-y-6">
      <PageHeader title="My Children" subtitle="Manage and view your children's profiles" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Parent Information
        </h2>
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xl font-medium">
            {profile.firstName.charAt(0)}
            {profile.lastName.charAt(0)}
          </div>
          <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.phone || 'Not set'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.address || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {profile.children.map((child: Child) => (
          <div
            key={child.id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start gap-4">
              <img
                src={
                  child.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${child.email}`
                }
                alt={`${child.firstName} ${child.lastName}`}
                className="h-16 w-16 rounded-full bg-gray-200"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {child.firstName} {child.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{child.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                    {child.department}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {child.year}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {child.semester}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Enrollment: {child.enrollmentNumber}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Link
                to={`/parent/children/${child.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Users className="h-4 w-4" />
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
