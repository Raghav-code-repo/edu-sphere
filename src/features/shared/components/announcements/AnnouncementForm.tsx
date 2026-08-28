import { useState } from 'react';
import type { Announcement, AnnouncementCategory } from '@/types/shared/announcements';
import { X, Save } from 'lucide-react';

interface AnnouncementFormProps {
  initialData?: Partial<Announcement>;
  onSubmit: (data: {
    title: string;
    content: string;
    category: AnnouncementCategory;
    targetAudience: string[];
  }) => void;
  onCancel: () => void;
}

const CATEGORIES: AnnouncementCategory[] = [
  'academic',
  'attendance',
  'assignment',
  'exam',
  'fees',
  'announcement',
  'system',
];

const AUDIENCE_OPTIONS = ['all', 'students', 'parents', 'faculty'];

export function AnnouncementForm({ initialData, onSubmit, onCancel }: AnnouncementFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [category, setCategory] = useState<AnnouncementCategory>(
    initialData?.category ?? 'announcement'
  );
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(
    initialData?.targetAudience ?? ['all']
  );

  const toggleAudience = (audience: string) => {
    if (audience === 'all') {
      setSelectedAudiences(['all']);
      return;
    }
    setSelectedAudiences((prev: string[]) => {
      const filtered = prev.filter((a: string) => a !== 'all');
      if (filtered.includes(audience)) {
        return filtered.filter((a: string) => a !== audience);
      }
      return [...filtered, audience];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      category,
      targetAudience: selectedAudiences,
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {initialData ? 'Edit Announcement' : 'Create Announcement'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Enter announcement title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Enter announcement content"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
            className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Audience
          </label>
          <div className="flex flex-wrap gap-2">
            {AUDIENCE_OPTIONS.map((audience) => {
              const isActive = selectedAudiences.includes(audience);
              return (
                <button
                  key={audience}
                  type="button"
                  onClick={() => toggleAudience(audience)}
                  className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {audience.charAt(0).toUpperCase() + audience.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
