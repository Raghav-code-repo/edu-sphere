import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Send,
  Archive,
} from 'lucide-react';
import { PageHeader, DataTable, Drawer, FilterPanel, StatusBadge } from '@/features/admin';
import { adminMockService } from '@/services/mock/adminMockService';
import type { AdminAnnouncement, FilterOptions } from '@/types/admin';

const categories = [
  { value: 'general', label: 'General' },
  { value: 'academic', label: 'Academic' },
  { value: 'event', label: 'Event' },
  { value: 'urgent', label: 'Urgent' },
];

const audiences = [
  { value: 'all', label: 'All' },
  { value: 'students', label: 'Students' },
  { value: 'parents', label: 'Parents' },
  { value: 'faculty', label: 'Faculty' },
];

export function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    role: '',
    status: '',
    department: '',
    classId: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    pageSize: 10,
    sortBy: '',
    sortOrder: 'asc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AdminAnnouncement | null>(null);
  const [bulkAction, setBulkAction] = useState('');
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState<Partial<AdminAnnouncement>>({
    title: '',
    content: '',
    category: 'general',
    targetAudience: ['all'],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const response = await adminMockService.getAnnouncements(filters);
      setAnnouncements(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setLoading(false);
    }
    loadData();
  }, [filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters({ ...newFilters, page: 1 });
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    setPage(1);
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedRows.length === 0) return;
    for (const id of selectedRows) {
      if (bulkAction === 'delete') {
        await adminMockService.deleteAnnouncement(id);
      } else if (bulkAction === 'publish') {
        await adminMockService.publishAnnouncement(id);
      }
    }
    setSelectedRows([]);
    setBulkAction('');
    const response = await adminMockService.getAnnouncements(filters);
    setAnnouncements(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
  };

  const handleView = async (announcement: AdminAnnouncement) => {
    const full = await adminMockService.getAnnouncement(announcement.id);
    if (full) {
      setSelectedAnnouncement(full);
      setDrawerOpen(true);
    }
    setActionMenu(null);
  };

  const handleEdit = (announcement: AdminAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      targetAudience: announcement.targetAudience,
    });
    setDrawerOpen(true);
    setActionMenu(null);
  };

  const handleDelete = async (announcement: AdminAnnouncement) => {
    await adminMockService.deleteAnnouncement(announcement.id);
    const response = await adminMockService.getAnnouncements(filters);
    setAnnouncements(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
    setActionMenu(null);
  };

  const handlePublish = async (announcement: AdminAnnouncement) => {
    await adminMockService.publishAnnouncement(announcement.id);
    const response = await adminMockService.getAnnouncements(filters);
    setAnnouncements(response.data);
    setActionMenu(null);
  };

  const handleArchive = async (announcement: AdminAnnouncement) => {
    await adminMockService.updateAnnouncement(announcement.id, { status: 'archived' });
    const response = await adminMockService.getAnnouncements(filters);
    setAnnouncements(response.data);
    setActionMenu(null);
  };

  const handleCreateNew = () => {
    setSelectedAnnouncement(null);
    setFormData({ title: '', content: '', category: 'general', targetAudience: ['all'] });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (selectedAnnouncement) {
      await adminMockService.updateAnnouncement(selectedAnnouncement.id, formData);
    } else {
      await adminMockService.createAnnouncement(formData);
    }
    const response = await adminMockService.getAnnouncements(filters);
    setAnnouncements(response.data);
    setDrawerOpen(false);
    setSaving(false);
  };

  const toggleAudience = (audience: 'all' | 'students' | 'parents' | 'faculty') => {
    setFormData((prev) => {
      if (audience === 'all') {
        return { ...prev, targetAudience: ['all'] };
      }
      const filtered = (prev.targetAudience || []).filter((a) => a !== 'all');
      if (filtered.includes(audience)) {
        return {
          ...prev,
          targetAudience: filtered.filter(
            (a) => a !== audience
          ) as AdminAnnouncement['targetAudience'],
        };
      }
      return {
        ...prev,
        targetAudience: [...filtered, audience] as AdminAnnouncement['targetAudience'],
      };
    });
  };

  const columns = [
    {
      key: 'select',
      label: '',
      render: (announcement: AdminAnnouncement) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(announcement.id)}
          onChange={() => {
            if (selectedRows.includes(announcement.id)) {
              setSelectedRows(selectedRows.filter((id) => id !== announcement.id));
            } else {
              setSelectedRows([...selectedRows, announcement.id]);
            }
          }}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
      width: '40px',
    },
    {
      key: 'title',
      label: 'Title',
      render: (announcement: AdminAnnouncement) => (
        <span className="font-medium text-gray-900 dark:text-white">{announcement.title}</span>
      ),
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
      render: (announcement: AdminAnnouncement) => (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {announcement.category}
        </span>
      ),
    },
    {
      key: 'targetAudience',
      label: 'Target Audience',
      render: (announcement: AdminAnnouncement) => announcement.targetAudience.join(', '),
    },
    {
      key: 'status',
      label: 'Status',
      render: (announcement: AdminAnnouncement) => <StatusBadge status={announcement.status} />,
    },
    {
      key: 'publishedAt',
      label: 'Published Date',
      render: (announcement: AdminAnnouncement) => announcement.publishedAt || '-',
    },
    {
      key: 'authorName',
      label: 'Author',
      render: (announcement: AdminAnnouncement) => announcement.authorName,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (announcement: AdminAnnouncement) => (
        <div className="relative">
          <button
            onClick={() => setActionMenu(actionMenu === announcement.id ? null : announcement.id)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {actionMenu === announcement.id && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => handleView(announcement)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" /> View
              </button>
              <button
                onClick={() => handleEdit(announcement)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </button>
              {announcement.status !== 'published' && (
                <button
                  onClick={() => handlePublish(announcement)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Send className="h-4 w-4" /> Publish
                </button>
              )}
              {announcement.status === 'published' && (
                <button
                  onClick={() => handleArchive(announcement)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Archive className="h-4 w-4" /> Archive
                </button>
              )}
              <button
                onClick={() => handleDelete(announcement)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      ),
      width: '80px',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="Manage all announcements"
        action={
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleCreateNew();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Announcement
          </Link>
        }
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${showFilters ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/20 dark:border-primary-700 dark:text-primary-300' : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              disabled={selectedRows.length === 0}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Bulk Actions</option>
              <option value="publish">Publish</option>
              <option value="delete">Delete</option>
            </select>
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction || selectedRows.length === 0}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="mt-4">
            <FilterPanel
              open={showFilters}
              onClose={() => setShowFilters(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
              roles={[
                { value: 'all', label: 'All' },
                { value: 'students', label: 'Students' },
                { value: 'parents', label: 'Parents' },
                { value: 'faculty', label: 'Faculty' },
              ]}
              departments={['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Business']}
            />
          </div>
        )}
      </div>

      <DataTable
        data={announcements}
        columns={columns}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        getRowId={(announcement) => announcement.id}
        loading={loading}
        emptyMessage="No announcements found"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {(page - 1) * filters.pageSize + 1} to {Math.min(page * filters.pageSize, total)}{' '}
          of {total} results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              setFilters((prev) => ({ ...prev, page: Math.max(1, page - 1) }));
            }}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPage(p);
                setFilters((prev) => ({ ...prev, page: p }));
              }}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-primary-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              setFilters((prev) => ({ ...prev, page: Math.min(totalPages, page + 1) }));
            }}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
        width="max-w-2xl"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as AdminAnnouncement['category'],
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Audience
            </label>
            <div className="flex flex-wrap gap-2">
              {audiences.map((audience) => (
                <button
                  key={audience.value}
                  type="button"
                  onClick={() =>
                    toggleAudience(audience.value as 'all' | 'students' | 'parents' | 'faculty')
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${(formData.targetAudience || []).includes(audience.value as 'all' | 'students' | 'parents' | 'faculty') ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/20 dark:border-primary-700 dark:text-primary-300' : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                  {audience.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDrawerOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !formData.title}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : selectedAnnouncement ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
