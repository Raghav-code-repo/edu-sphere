import { ChartCard } from '@/features/student';
import type { ReactNode } from 'react';

interface ChildSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function ChildSection({ title, description, children, action }: ChildSectionProps) {
  return (
    <ChartCard title={title} description={description} action={action}>
      {children}
    </ChartCard>
  );
}
