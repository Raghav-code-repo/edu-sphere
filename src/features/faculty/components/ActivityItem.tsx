interface ActivityItemProps {
  title: string;
  description?: string;
  timestamp?: string;
}

export function ActivityItem({ title, description, timestamp }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-750">
      <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
        {timestamp && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{timestamp}</p>}
      </div>
    </div>
  );
}
