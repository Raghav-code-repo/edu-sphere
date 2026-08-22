import { useEffect, useState } from 'react';
import { PageHeader, ChildSwitcher, DocumentCard, EmptyState } from '@/features/parent';
import { parentMockService } from '@/services/mock/parentMockService';
import type { Child, Document } from '@/types/parent';

export function ParentDocuments() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [childrenData, documentsData] = await Promise.all([
        parentMockService.getChildren(),
        parentMockService.getDocuments(),
      ]);
      setChildren(childrenData);
      setSelectedChildId(childrenData[0]?.id || '');
      setDocuments(documentsData);
      setLoading(false);
    }
    loadData();
  }, []);

  const childDocuments = documents.filter((d) => d.childId === selectedChildId);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" subtitle="View and download your children's documents" />

      <ChildSwitcher
        items={children}
        selectedChildId={selectedChildId}
        onSelect={setSelectedChildId}
      />

      {childDocuments.length === 0 ? (
        <EmptyState
          title="No documents found"
          description="Documents will appear here when available."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {childDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
