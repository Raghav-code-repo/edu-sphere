import { useEffect, useReducer, useState } from 'react';
import { Plus } from 'lucide-react';
import { AnnouncementList, AnnouncementForm } from '@/features/shared';
import { announcementApi } from '@/services/api/announcementApi';
import { announcementReducer } from '@/types/shared/announcements';
import type { Announcement } from '@/types/shared/announcements';

const initialState = {
  announcements: [] as Announcement[],
  selectedAnnouncement: null as Announcement | null,
  filters: {
    search: '',
    category: 'all',
    status: 'all',
  },
};

export function SharedAnnouncements() {
  const [state, dispatch] = useReducer(announcementReducer, initialState);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    async function loadData() {
      const announcements = await announcementApi.getAnnouncements(state.filters);
      dispatch({ type: 'setAnnouncements', announcements });
      setLoading(false);
    }
    loadData();
  }, [state.filters]);

  const handleCreateNew = () => {
    setEditingAnnouncement(null);
    setShowForm(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await announcementApi.deleteAnnouncement(id);
    const announcements = await announcementApi.getAnnouncements(state.filters);
    dispatch({ type: 'setAnnouncements', announcements });
  };

  const handleSave = async (data: {
    title: string;
    content: string;
    category: Announcement['category'];
    targetAudience: string[];
  }) => {
    if (editingAnnouncement) {
      await announcementApi.updateAnnouncement(editingAnnouncement.id, data);
    } else {
      await announcementApi.createAnnouncement({
        ...data,
        status: 'draft',
        targetAudience: data.targetAudience,
        authorId: 'currentUser',
        authorName: 'Current User',
      });
    }
    const announcements = await announcementApi.getAnnouncements(state.filters);
    dispatch({ type: 'setAnnouncements', announcements });
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {state.announcements.length} announcement{state.announcements.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </button>
      </div>

      <AnnouncementList
        announcements={state.announcements}
        onCreate={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAnnouncement(null);
                }}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus className="h-4 w-4 rotate-45" />
              </button>
            </div>
            <AnnouncementForm
              initialData={editingAnnouncement || undefined}
              onSubmit={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingAnnouncement(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
