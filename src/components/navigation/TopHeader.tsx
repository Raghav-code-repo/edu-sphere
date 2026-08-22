import { Menu, Search } from 'lucide-react';
import { ThemeSwitcher } from '@/components/navigation/ThemeSwitcher';
import { NotificationButton } from '@/components/navigation/NotificationButton';
import { UserMenu } from '@/components/navigation/UserMenu';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

interface TopHeaderProps {
  onMenuClick: () => void;
  user: {
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  breadcrumbs?: { title: string; href?: string }[];
}

export function TopHeader({ onMenuClick, user, breadcrumbs }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:flex items-center gap-2">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border border-gray-300 bg-gray-50 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="md:hidden">
          <ThemeSwitcher />
        </div>
        <NotificationButton />
        <div className="hidden md:flex">
          <ThemeSwitcher />
        </div>
        <UserMenu {...user} />
      </div>
    </header>
  );
}
