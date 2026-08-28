export type SearchEntityType =
  'student' | 'faculty' | 'course' | 'assignment' | 'exam' | 'message' | 'report' | 'settings';

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  description: string;
  href: string;
  icon?: string;
  metadata?: Record<string, string>;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isOpen: boolean;
  selectedIndex: number;
}

export type SearchAction =
  | { type: 'setQuery'; query: string }
  | { type: 'setResults'; results: SearchResult[] }
  | { type: 'toggle'; isOpen: boolean }
  | { type: 'setSelectedIndex'; index: number }
  | { type: 'close' };

export function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'setQuery':
      return { ...state, query: action.query, selectedIndex: 0 };
    case 'setResults':
      return { ...state, results: action.results, selectedIndex: 0 };
    case 'toggle':
      return { ...state, isOpen: action.isOpen };
    case 'setSelectedIndex':
      return { ...state, selectedIndex: action.index };
    case 'close':
      return { ...state, isOpen: false, query: '', results: [], selectedIndex: 0 };
    default:
      return state;
  }
}
