import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, Settings } from 'lucide-react';
import { NotificationPreferences } from '@/features/shared';
import { notificationApi } from '@/services/api/notificationApi';
import { notificationReducer } from '@/types/shared/notifications';
import type { Notification, NotificationPreference } from '@/types/shared/notifications';

const initialState = {
  notifications: [] as Notification[],
  unreadCount: 0,
  preferences: [] as NotificationPreference[],
};

export function SharedNotifications() {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const [showPreferences, setShowPreferences] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [notifications, preferences] = await Promise.all([
        notificationApi.getNotifications(),
        notificationApi.getPreferences(),
      ]);
      dispatch({ type: 'setNotifications', notifications });
      dispatch({ type: 'updatePreferences', preferences });
      setLoading(false);
    }
    loadData();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    dispatch({ type: 'markAsRead', id });
  };

  const handleMarkAllAsRead = async () => {
    await notificationApi.markAllAsRead();
    dispatch({ type: 'markAllAsRead' });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  const unreadNotifications = state.notifications.filter((n) => !n.read);
  const readNotifications = state.notifications.filter((n) => n.read);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {state.unreadCount} unread notification{state.unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Preferences
          </button>
          {unreadNotifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {showPreferences && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notification Preferences
          </h2>
          <NotificationPreferences
            preferences={state.preferences}
            onChange={(prefs: NotificationPreference[]) => {
              notificationApi.updatePreferences(prefs);
              dispatch({ type: 'updatePreferences', preferences: prefs });
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Categories</h3>
            </div>
            <div className="p-2">
              <Link
                to="/notifications"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 dark:text-primary-300 dark:bg-primary-900/20"
              >
                All Notifications
                <span className="ml-auto rounded-full bg-primary-100 px-2 py-0.5 text-xs dark:bg-primary-800 dark:text-primary-200">
                  {state.notifications.length}
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {unreadNotifications.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Unread</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 capitalize">
                            {notification.category}
                          </span>
                          <span className="h-2 w-2 rounded-full bg-primary-500" />
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCheck className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Earlier</h3>
            </div>
            {readNotifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No read notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {readNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors opacity-75"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 capitalize">
                          {notification.category}
                        </span>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
