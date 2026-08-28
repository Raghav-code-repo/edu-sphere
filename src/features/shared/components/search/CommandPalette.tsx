import { useEffect, useRef } from 'react';
import { useReducer } from 'react';
import {
  Search,
  X,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  User,
  Briefcase,
  BookOpen,
  ClipboardList,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
} from 'lucide-react';
import type { SearchState, SearchResult } from '@/types/shared/search';
import { searchReducer } from '@/types/shared/search';
import { searchApi } from '@/services/api/searchApi';

interface CommandPaletteProps {
  onSelect?: (result: SearchResult) => void;
}

const categoryConfig: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  student: { label: 'Students', icon: User },
  faculty: { label: 'Faculty', icon: Briefcase },
  course: { label: 'Courses', icon: BookOpen },
  assignment: { label: 'Assignments', icon: ClipboardList },
  exam: { label: 'Exams', icon: FileText },
  message: { label: 'Messages', icon: MessageSquare },
  report: { label: 'Reports', icon: BarChart3 },
  settings: { label: 'Settings', icon: Settings },
};

const categoryOrder = [
  'student',
  'faculty',
  'course',
  'assignment',
  'exam',
  'message',
  'report',
  'settings',
];

export function CommandPalette({ onSelect }: CommandPaletteProps) {
  const initialState: SearchState = {
    query: '',
    results: [],
    isOpen: false,
    selectedIndex: 0,
  };

  const [state, dispatch] = useReducer(searchReducer, initialState);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  const stateRef = useRef(state);

  stateRef.current = state;
  onSelectRef.current = onSelect;

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: 'toggle', isOpen: !stateRef.current.isOpen });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!state.isOpen) return;
    const timer = setTimeout(async () => {
      const results = await searchApi.search(state.query);
      dispatch({ type: 'setResults', results });
    }, 150);
    return () => clearTimeout(timer);
  }, [state.query, state.isOpen]);

  useEffect(() => {
    if (!state.isOpen) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch({ type: 'close' });
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const current = stateRef.current;
        dispatch({
          type: 'setSelectedIndex',
          index: Math.min(current.selectedIndex + 1, current.results.length - 1),
        });
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const current = stateRef.current;
        dispatch({ type: 'setSelectedIndex', index: Math.max(current.selectedIndex - 1, 0) });
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const current = stateRef.current;
        const result = current.results[current.selectedIndex];
        if (result) {
          onSelectRef.current?.(result);
          dispatch({ type: 'close' });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isOpen]);

  useEffect(() => {
    if (!state.isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        dispatch({ type: 'close' });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [state.isOpen]);

  useEffect(() => {
    if (state.isOpen) {
      inputRef.current?.focus();
    }
  }, [state.isOpen]);

  const handleSelect = (result: SearchResult) => {
    onSelectRef.current?.(result);
    dispatch({ type: 'close' });
  };

  const grouped = state.results.reduce<Record<string, SearchResult[]>>((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {});

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch({ type: 'close' })}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        ref={containerRef}
        className="relative w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800 transition-all"
      >
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={state.query}
            onChange={(e) => dispatch({ type: 'setQuery', query: e.target.value })}
            placeholder="Search students, faculty, courses..."
            aria-label="Search"
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
          />
          <button
            onClick={() => dispatch({ type: 'close' })}
            aria-label="Close search"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {state.results.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              {state.query ? 'No results found' : 'Type to search...'}
            </div>
          ) : (
            <div className="space-y-4">
              {categoryOrder.map((type) => {
                const items = grouped[type];
                if (!items || items.length === 0) return null;
                const config = categoryConfig[type];
                if (!config) return null;
                const Icon = config.icon;
                return (
                  <div key={type}>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <Icon className="h-3.5 w-3.5" />
                      {config.label}
                    </div>
                    <div className="space-y-1">
                      {items.map((item) => {
                        const globalIndex = state.results.indexOf(item);
                        const isSelected = globalIndex === state.selectedIndex;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() =>
                              dispatch({ type: 'setSelectedIndex', index: globalIndex })
                            }
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                              isSelected
                                ? 'bg-primary-50 text-primary-900 dark:bg-primary-900/20 dark:text-primary-100'
                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                isSelected
                                  ? 'bg-primary-100 dark:bg-primary-800/30'
                                  : 'bg-gray-100 dark:bg-gray-700'
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">{item.title}</p>
                              {item.description && (
                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {state.results.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" /> <ArrowDown className="h-3 w-3" /> to navigate
              </span>
              <span className="flex items-center gap-1">
                <span className="rounded border border-gray-300 px-1 dark:border-gray-600">↵</span>{' '}
                to select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <span className="rounded border border-gray-300 px-1 dark:border-gray-600">esc</span>{' '}
              to close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
