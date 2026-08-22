import { useEffect, useState } from 'react';
import { PageHeader } from '@/features/faculty';
import { facultyMockService } from '@/services/mock/facultyMockService';
import type { FacultyProfile } from '@/types/faculty';
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  Hash,
  Calendar,
  MapPin,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export function FacultyProfile() {
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<FacultyProfile | null>(null);

  useEffect(() => {
    facultyMockService.getProfile().then((data) => {
      setProfile(data);
      setFormData(data);
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

  const handleSave = async () => {
    setLoading(true);
    setEditing(false);
    setProfile(formData);
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        subtitle="View and manage your personal information"
        actions={
          editing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
            >
              Edit Profile
            </button>
          )
        }
      />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Personal Info</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <img
              src={
                profile.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`
              }
              alt={fullName}
              className="h-24 w-24 rounded-full bg-gray-200"
            />
            <div className="text-center sm:text-left">
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData?.firstName || ''}
                    onChange={(e) => setFormData({ ...formData!, firstName: e.target.value })}
                    className="text-lg font-semibold rounded-lg border border-gray-300 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="First name"
                  />
                  <input
                    type="text"
                    value={formData?.lastName || ''}
                    onChange={(e) => setFormData({ ...formData!, lastName: e.target.value })}
                    className="text-lg font-semibold rounded-lg border border-gray-300 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Last name"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{fullName}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{profile.designation}</p>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</p>
                {editing ? (
                  <input
                    type="email"
                    value={formData?.email || ''}
                    onChange={(e) => setFormData({ ...formData!, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.email}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</p>
                {editing ? (
                  <input
                    type="text"
                    value={formData?.phone || ''}
                    onChange={(e) => setFormData({ ...formData!, phone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {profile.phone || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Professional Info</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Department</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.department}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Designation</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.designation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Hash className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Employee ID</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.employeeId}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Hire Date</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(profile.hireDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Office Location
                </p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {profile.officeLocation || 'Not set'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Specialization
                </p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {profile.specialization || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bio</h3>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-4 w-4 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">About</p>
              {editing ? (
                <textarea
                  value={formData?.bio || ''}
                  onChange={(e) => setFormData({ ...formData!, bio: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {profile.bio || 'No bio provided.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
