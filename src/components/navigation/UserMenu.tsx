import { MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';

interface UserMenuProps {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export function UserMenu({ name, email, role, avatarUrl }: UserMenuProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getProfilePath = () => {
    if (role === 'STUDENT') return '/student/profile';
    if (role === 'PARENT') return '/parent/profile';
    return '#';
  };

  const getSettingsPath = () => {
    if (role === 'STUDENT') return '/student/settings';
    if (role === 'PARENT') return '/parent/settings';
    return '#';
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-medium">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
        </div>
        <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400 hidden md:block" />
      </button>

      <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 z-50">
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
        </div>
        <Link
          to={getProfilePath()}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <span>Profile</span>
        </Link>
        <Link
          to={getSettingsPath()}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <span>Settings</span>
        </Link>
        <div className="border-t border-gray-100 dark:border-gray-700 mt-1">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700 w-full text-left"
          >
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
