import type { StudentProfile } from '@/types/student';

interface ProfileSectionProps {
  profile: StudentProfile;
}

export function ProfileSection({ profile }: ProfileSectionProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <img
          src={
            profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`
          }
          alt={fullName}
          className="h-16 w-16 rounded-full bg-gray-200"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{fullName}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{profile.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {profile.department} • {profile.year} • {profile.semester}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Enrollment Number</p>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.enrollmentNumber}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</p>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.phone || 'Not set'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Date of Birth</p>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">
            {profile.dateOfBirth || 'Not set'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Address</p>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">
            {profile.address || 'Not set'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Guardian Name</p>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">
            {profile.guardianName || 'Not set'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Guardian Phone</p>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">
            {profile.guardianPhone || 'Not set'}
          </p>
        </div>
      </div>
    </div>
  );
}
