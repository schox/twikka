'use client';

import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../utils';

// Enhanced tabs with optional icon support and flexible styling
export function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn('flex flex-col gap-2', className)} {...props} />;
}

export interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  variant?: 'default' | 'segmented' | 'pills';
}

export function TabsList({ className, variant = 'default', ...props }: TabsListProps) {
  const variantStyles = {
    default:
      'bg-muted text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-lg p-1',
    segmented:
      'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
    pills: 'inline-flex h-10 w-fit items-center justify-center gap-1 p-1',
  };

  return <TabsPrimitive.List className={cn(variantStyles[variant], className)} {...props} />;
}

export interface TabsTriggerProps extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
  icon?: React.ComponentType<{ className?: string }>;
  showIconOnly?: boolean;
  variant?: 'default' | 'segmented' | 'pills';
}

export function TabsTrigger({
  className,
  icon: Icon,
  showIconOnly = false,
  variant = 'default',
  children,
  ...props
}: TabsTriggerProps) {
  const baseStyles =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantStyles = {
    default: {
      base: 'px-3 py-1.5 text-sm font-medium',
      inactive: 'text-muted-foreground hover:text-foreground',
      active:
        'data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-md',
    },
    segmented: {
      base: 'h-[calc(100%-1px)] flex-1 gap-1.5 border border-transparent px-3 py-1 text-sm font-medium',
      inactive: 'text-muted-foreground hover:text-foreground',
      active:
        'data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-semibold',
    },
    pills: {
      base: 'px-3 py-1.5 text-sm font-medium rounded-full',
      inactive: 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
      active: 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
    },
  };

  const styles = variantStyles[variant];

  return (
    <TabsPrimitive.Trigger
      className={cn(baseStyles, styles.base, styles.inactive, styles.active, className)}
      {...props}
    >
      {Icon && <Icon className={cn('h-4 w-4', !showIconOnly && children && 'mr-1.5')} />}
      {!showIconOnly && children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('flex-1 outline-none', className)} {...props} />;
}

// Convenience component for icon-only tab groups (like theme selectors)
export interface IconTabGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  showLabels?: boolean;
  variant?: 'segmented' | 'pills';
  className?: string;
}

export function IconTabGroup({
  value,
  onValueChange,
  options,
  showLabels = false,
  variant = 'segmented',
  className,
}: IconTabGroupProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList variant={variant}>
        {options.map(({ value: optionValue, label, icon }) => (
          <TabsTrigger
            key={optionValue}
            value={optionValue}
            icon={icon}
            showIconOnly={!showLabels}
            variant={variant}
          >
            {showLabels && <span className="hidden sm:inline">{label}</span>}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
