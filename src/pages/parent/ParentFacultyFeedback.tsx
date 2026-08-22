import { useEffect, useState } from 'react';
import { PageHeader, ChildSwitcher, FeedbackCard, EmptyState } from '@/features/parent';
import { parentMockService } from '@/services/mock/parentMockService';
import type { Child, FacultyFeedback } from '@/types/parent';

export function ParentFacultyFeedback() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [feedback, setFeedback] = useState<FacultyFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [childrenData, feedbackData] = await Promise.all([
        parentMockService.getChildren(),
        parentMockService.getFacultyFeedback(),
      ]);
      setChildren(childrenData);
      setSelectedChildId(childrenData[0]?.id || '');
      setFeedback(feedbackData);
      setLoading(false);
    }
    loadData();
  }, []);

  const childFeedback = feedback.filter((f) => f.childId === selectedChildId);

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
        title="Faculty Feedback"
        subtitle="View feedback from teachers for your children"
      />

      <ChildSwitcher
        items={children}
        selectedChildId={selectedChildId}
        onSelect={setSelectedChildId}
      />

      {childFeedback.length === 0 ? (
        <EmptyState
          title="No feedback found"
          description="Faculty feedback will appear here when available."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {childFeedback.map((item) => (
            <FeedbackCard key={item.id} feedback={item} />
          ))}
        </div>
      )}
    </div>
  );
}
