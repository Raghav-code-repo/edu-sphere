export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
  roles?: string[];
}

export interface NavigationConfig {
  label: string;
  items: NavItem[];
}
