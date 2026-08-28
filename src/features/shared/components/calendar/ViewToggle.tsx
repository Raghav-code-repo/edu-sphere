import { Calendar, CalendarDays, CalendarRange, List } from 'lucide-react';
import type { CalendarViewType } from '@/types/shared/calendar';

interface ViewToggleProps {
  view: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
}

interface ViewOption {
  value: CalendarViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const views: ViewOption[] = [
  { value: 'month', label: 'Month', icon: Calendar },
  { value: 'week', label: 'Week', icon: CalendarRange },
  { value: 'day', label: 'Day', icon: CalendarDays },
  { value: 'agenda', label: 'Agenda', icon: List },
];

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
      {views.map((v) => {
        const Icon = v.icon;
        const isActive = view === v.value;
        return (
          <button
            key={v.value}
            onClick={() => onViewChange(v.value)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
