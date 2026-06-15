import { Inbox, Search, FileText, Users, Plus } from 'lucide-react';
import { Button } from './button';
import { cn } from '../utils';
import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      {icon !== undefined && icon !== null ? (
        <div className="mb-4 text-muted-foreground">{icon}</div>
      ) : null}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {action !== undefined ? (
        <Button onClick={action.onClick}>
          {action.icon !== undefined ? <span className="mr-2">{action.icon}</span> : null}
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

// Preset empty states for common scenarios
export function NoResultsState({
  onClear,
  searchTerm,
}: {
  onClear?: () => void;
  searchTerm?: string;
}) {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12" />}
      title="No results found"
      message={
        typeof searchTerm === 'string' && searchTerm.length > 0
          ? `We couldn't find anything matching "${searchTerm}"`
          : 'Try adjusting your search or filters'
      }
      action={
        onClear !== undefined
          ? {
              label: 'Clear search',
              onClick: onClear,
            }
          : undefined
      }
    />
  );
}

export function NoContentState({
  onCreate,
  contentType = 'items',
}: {
  onCreate?: () => void;
  contentType?: string;
}) {
  return (
    <EmptyState
      icon={<Inbox className="h-12 w-12" />}
      title={`No ${contentType} yet`}
      message={`Get started by creating your first ${contentType.slice(0, -1)}`}
      action={
        onCreate !== undefined
          ? {
              label: `Create ${contentType.slice(0, -1)}`,
              onClick: onCreate,
              icon: <Plus className="h-4 w-4" />,
            }
          : undefined
      }
    />
  );
}

export function NoAccessState() {
  return (
    <EmptyState
      icon={<Users className="h-12 w-12" />}
      title="No access"
      message="You don't have permission to view this content. Please contact your administrator."
    />
  );
}

export function ComingSoonState({ feature }: { feature: string }) {
  return (
    <EmptyState
      icon={<FileText className="h-12 w-12" />}
      title="Coming soon"
      message={`${feature} is currently under development and will be available soon.`}
    />
  );
}
