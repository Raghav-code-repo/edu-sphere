import type { NavigationConfig } from '@/types/navigation';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { MobileSidebar } from '@/components/navigation/MobileSidebar';
import { TopHeader } from '@/components/navigation/TopHeader';

interface DashboardLayoutProps {
  navigation: NavigationConfig;
  user: {
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  breadcrumbs?: { title: string; href?: string }[];
}

export function DashboardLayout({ navigation, user, breadcrumbs }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <Sidebar
        navigation={navigation}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
      />

      <MobileSidebar
        navigation={navigation}
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
      />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <TopHeader
          onMenuClick={() => setMobileMenuOpen(true)}
          user={user}
          breadcrumbs={breadcrumbs}
        />

        <main id="main-content" className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
