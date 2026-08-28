import { useEffect, useState } from 'react';
import { Search, Plus, FileText, Play, Presentation, BookOpen, Paperclip } from 'lucide-react';
import { PageHeader, EmptyState } from '@/features/faculty';
import { facultyApi } from '@/services/api/facultyApi';
import type { CourseMaterial, FacultyCourse } from '@/types/faculty';

type MaterialType = 'all' | 'pdf' | 'video' | 'presentation' | 'assignment' | 'other';

const typeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-5 w-5 text-red-500" />,
  video: <Play className="h-5 w-5 text-blue-500" />,
  presentation: <Presentation className="h-5 w-5 text-amber-500" />,
  assignment: <BookOpen className="h-5 w-5 text-green-500" />,
  other: <Paperclip className="h-5 w-5 text-gray-500" />,
};

export function FacultyMaterials() {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [courses, setCourses] = useState<FacultyCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<MaterialType>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([facultyApi.getMaterials(), facultyApi.getCourses()]).then(([mats, crs]) => {
      setMaterials(mats);
      setCourses(crs);
      setLoading(false);
    });
  }, []);

  const filtered = materials.filter((m) => {
    const matchesCourse = selectedCourse === 'all' || m.courseId === selectedCourse;
    const matchesType = selectedType === 'all' || m.type === selectedType;
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.courseName.toLowerCase().includes(search.toLowerCase());
    return matchesCourse && matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Materials"
        subtitle={`${materials.length} materials uploaded`}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
            <Plus className="h-4 w-4" />
            Upload
          </button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as MaterialType)}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
          <option value="presentation">Presentation</option>
          <option value="assignment">Assignment</option>
          <option value="other">Other</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No materials found" description="Try adjusting your search or filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((material) => (
            <div
              key={material.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-gray-50 p-2 dark:bg-gray-700">
                  {typeIcons[material.type] || typeIcons.other}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {material.title}
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300 capitalize">
                      {material.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {material.courseName} ({material.courseCode})
                  </p>
                  {material.description && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {material.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {material.fileSize && <span>{material.fileSize}</span>}
                    <span>Uploaded: {material.uploadedAt}</span>
                    <span>By: {material.uploadedBy}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
