import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  items?: { title: string; href?: string }[];
}

export function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300">
        Home
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link to={item.href} className="hover:text-gray-700 dark:hover:text-gray-300">
              {item.title}
            </Link>
          ) : (
            <span className="font-medium text-gray-900 dark:text-white">{item.title}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
