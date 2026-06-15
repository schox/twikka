import React from 'react';
import { cn } from '../utils';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

interface MobileCardViewProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  className?: string;
}

export function MobileCardView<T>({
  items,
  renderCard,
  keyExtractor,
  className,
}: MobileCardViewProps<T>) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)} className="bg-card rounded-lg border p-4 space-y-3">
          {renderCard(item, index)}
        </div>
      ))}
    </div>
  );
}

interface ResponsiveTableContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
}

export function ResponsiveTableContainer({
  children,
  className,
  mobileBreakpoint = 'md',
}: ResponsiveTableContainerProps) {
  const breakpointClass = {
    sm: 'sm:block',
    md: 'md:block',
    lg: 'lg:block',
  }[mobileBreakpoint];

  return (
    <div className={cn('bg-background rounded-lg shadow-sm border', className)}>
      <div className={cn('hidden', breakpointClass)}>{children}</div>
    </div>
  );
}

// Table components with responsive styling
export function ResponsiveTableHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <thead className={cn('bg-muted', className)}>{children}</thead>;
}

export function ResponsiveTableBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <tbody className={className}>{children}</tbody>;
}

export function ResponsiveTableRow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('border-t transition-colors hover:bg-muted/50', className)} {...props}>
      {children}
    </tr>
  );
}

export function ResponsiveTableHead({
  children,
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn('p-3 text-left font-medium', className)} {...props}>
      {children}
    </th>
  );
}

export function ResponsiveTableCell({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('p-3', className)} {...props}>
      {children}
    </td>
  );
}

// Helper component for mobile-friendly field display
export function MobileField({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
