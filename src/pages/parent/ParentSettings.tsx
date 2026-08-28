import { useEffect, useState } from 'react';
import { PageHeader } from '@/features/parent';
import { parentApi } from '@/services/api/parentApi';
import type { ParentSettings } from '@/types/parent';

export function ParentSettings() {
  const [settings, setSettings] = useState<ParentSettings>({
    notifications: true,
    emailNotifications: true,
    smsNotifications: false,
    language: 'en',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    parentApi.getSettings().then((data) => setSettings(data));
  }, []);

  const handleToggle = async (key: keyof ParentSettings) => {
    setSaving(true);
    setSaved(false);
    const updated = await parentApi.updateSettings({ [key]: !settings[key] });
    setSettings(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = async (key: keyof ParentSettings, value: string) => {
    setSaving(true);
    setSaved(false);
    const updated = await parentApi.updateSettings({ [key]: value });
    setSettings(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Settings" subtitle="Manage your preferences" />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Push Notifications
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Receive push notifications for updates
              </p>
            </div>
            <button
              onClick={() => handleToggle('notifications')}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'} ${saving ? 'opacity-50' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Email Notifications
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Receive email notifications for important updates
              </p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'} ${saving ? 'opacity-50' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">SMS Notifications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Receive SMS notifications for urgent updates
              </p>
            </div>
            <button
              onClick={() => handleToggle('smsNotifications')}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.smsNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'} ${saving ? 'opacity-50' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Preferences</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Language</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Select your preferred language
              </p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>
      </div>

      {saved && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
          Settings saved successfully!
        </div>
      )}
    </div>
  );
}
