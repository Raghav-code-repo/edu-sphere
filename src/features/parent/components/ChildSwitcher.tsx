import type { Child } from '@/types/parent';

interface ChildSwitcherProps {
  items: Child[];
  selectedChildId: string;
  onSelect: (childId: string) => void;
}

export function ChildSwitcher({ items, selectedChildId, onSelect }: ChildSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((child) => {
        const isSelected = child.id === selectedChildId;
        return (
          <button
            key={child.id}
            onClick={() => onSelect(child.id)}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
              isSelected
                ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/10'
                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
            }`}
          >
            <img
              src={
                child.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${child.email}`
              }
              alt={`${child.firstName} ${child.lastName}`}
              className="h-10 w-10 rounded-full bg-gray-200"
            />
            <div>
              <p
                className={`text-sm font-medium ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}
              >
                {child.firstName} {child.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {child.department} • {child.year}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
