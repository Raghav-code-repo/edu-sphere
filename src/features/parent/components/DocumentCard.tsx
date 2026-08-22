import type { Document } from '@/types/parent';
import { FileText, Download } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
}

const typeColors = {
  report_card: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  certificate: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  invoice: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
  other: 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300',
};

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 rounded-lg p-2 ${typeColors[document.type]}`}>
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {document.name}
            </h4>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[document.type]}`}
            >
              {document.type.replace('_', ' ')}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {document.childName} • {document.date} • {document.size}
          </p>
        </div>
        <button className="flex-shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
