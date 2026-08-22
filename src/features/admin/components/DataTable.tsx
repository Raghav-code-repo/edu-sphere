import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
  }>;
  selectedRows?: string[];
  onSelectionChange?: (ids: string[]) => void;
  getRowId: (item: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
}

export function DataTable<T>({
  data,
  columns,
  selectedRows = [],
  onSelectionChange,
  getRowId,
  loading = false,
  emptyMessage = 'No data found',
  pageSize = 10,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null
  );

  const sortedData = [...data].sort((a: unknown, b: unknown) => {
    if (!sortConfig) return 0;
    const aVal = (a as Record<string, unknown>)[sortConfig.key];
    const bVal = (b as Record<string, unknown>)[sortConfig.key];
    if (aVal === bVal) return 0;
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;
    const cmp = aVal < bVal ? -1 : 1;
    return sortConfig.direction === 'desc' ? -cmp : cmp;
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    const newSelection = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];
    onSelectionChange(newSelection);
  };

  const toggleAll = () => {
    if (!onSelectionChange) return;
    const currentPageIds = sortedData.map(getRowId);
    const allSelected = currentPageIds.every((id) => selectedRows.includes(id));
    if (allSelected) {
      onSelectionChange(selectedRows.filter((id) => !currentPageIds.includes(id)));
    } else {
      onSelectionChange([...new Set([...selectedRows, ...currentPageIds])]);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {onSelectionChange && (
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={sortedData.map(getRowId).every((id) => selectedRows.includes(id))}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-gray-400">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((item) => {
              const id = getRowId(item);
              const isSelected = selectedRows.includes(id);
              return (
                <tr
                  key={id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isSelected ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                >
                  {onSelectionChange && (
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {col.render
                        ? col.render(item)
                        : ((item as Record<string, unknown>)[col.key] as string)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
