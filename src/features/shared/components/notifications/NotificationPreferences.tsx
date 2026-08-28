import {
  Settings,
  Bell,
  BookOpen,
  CalendarCheck,
  FileText,
  ClipboardList,
  CreditCard,
  Megaphone,
} from 'lucide-react';
import type { NotificationPreference, NotificationCategory } from '@/types/shared/notifications';

const CATEGORY_CONFIG: Record<NotificationCategory, { label: string; Icon: typeof Bell }> = {
  academic: { label: 'Academic', Icon: BookOpen },
  attendance: { label: 'Attendance', Icon: CalendarCheck },
  assignment: { label: 'Assignment', Icon: FileText },
  exam: { label: 'Exam', Icon: ClipboardList },
  fees: { label: 'Fees', Icon: CreditCard },
  announcement: { label: 'Announcement', Icon: Megaphone },
  system: { label: 'System', Icon: Settings },
};

interface NotificationPreferencesProps {
  preferences: NotificationPreference[];
  onChange: (preferences: NotificationPreference[]) => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function NotificationPreferences({ preferences, onChange }: NotificationPreferencesProps) {
  const updatePreference = (
    category: NotificationCategory,
    field: 'enabled' | 'email' | 'push',
    value: boolean
  ) => {
    const updated = preferences.map((pref) =>
      pref.category === category ? { ...pref, [field]: value } : pref
    );
    onChange(updated);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notification Preferences
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage how you receive notifications for each category.
        </p>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {preferences.map((pref) => {
          const config = CATEGORY_CONFIG[pref.category];
          const Icon = config.Icon;
          return (
            <div key={pref.category} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-50 p-2 dark:bg-primary-900/20">
                    <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {config.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {pref.enabled ? 'Notifications enabled' : 'Notifications disabled'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <Toggle
                      checked={pref.enabled}
                      onChange={(value) => updatePreference(pref.category, 'enabled', value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
                    <Toggle
                      checked={pref.email}
                      onChange={(value) => updatePreference(pref.category, 'email', value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Push</span>
                    <Toggle
                      checked={pref.push}
                      onChange={(value) => updatePreference(pref.category, 'push', value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
