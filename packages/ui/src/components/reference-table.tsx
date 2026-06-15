'use client';

import { useState } from 'react';
import {
  Button,
  Badge,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../index';
import {
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  Search,
  Database,
  Link2,
  Loader2,
} from 'lucide-react';

// Generic reference type that apps can extend or map to
export interface ReferenceTableItem {
  id: number | string;
  title: string | null;
  description: string | null;
  reference_url: string | null;
  reference_type: string | null;
  canonical: boolean;
  enrichment_status: string | null;
  reference_count: number;
  year: number | null;
  created_at: string | null;
  keywords?: string[] | null;
}

export interface ReferenceTableProps<T extends ReferenceTableItem = ReferenceTableItem> {
  references: T[];
  onView?: (reference: T) => void;
  onEdit?: (reference: T) => void;
  onDelete?: (reference: T) => void;
  loading?: boolean;
}

export function ReferenceTable<T extends ReferenceTableItem = ReferenceTableItem>({
  references,
  onView,
  onEdit,
  onDelete,
  loading = false,
}: ReferenceTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<T | null>(null);

  // Filter references based on search
  const filteredReferences = references.filter(ref => {
    const query = searchQuery.toLowerCase();
    return (
      (ref.title?.toLowerCase() ?? '').includes(query) ||
      (ref.description?.toLowerCase() ?? '').includes(query) ||
      (ref.reference_url?.toLowerCase() ?? '').includes(query) ||
      (ref.keywords?.some(k => k.toLowerCase().includes(query)) ?? false)
    );
  });

  const formatDate = (dateString: string | null) => {
    if (dateString === null) return '—';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm && onDelete) {
      onDelete(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  // Mobile Card Component
  const ReferenceCard = ({ reference }: { reference: T }) => (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <h3 className="font-medium line-clamp-2">{reference.title ?? 'Untitled'}</h3>
          {reference.reference_url !== null && (
            <a
              href={reference.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              {new URL(reference.reference_url).hostname}
            </a>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={() => onView(reference)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(reference)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => setDeleteConfirm(reference)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {reference.description !== null && (
        <p className="text-sm text-muted-foreground line-clamp-2">{reference.description}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Badge variant={reference.canonical ? 'default' : 'secondary'}>
          {reference.canonical ? 'Canonical' : 'Secondary'}
        </Badge>
        {reference.reference_type !== null && (
          <Badge variant="outline">{reference.reference_type}</Badge>
        )}
        {reference.reference_count > 0 && (
          <Badge variant="outline" className="gap-1">
            <Link2 className="h-3 w-3" />
            {reference.reference_count}
          </Badge>
        )}
        {reference.enrichment_status === 'completed' && (
          <Badge variant="success">
            <Database className="h-3 w-3 mr-1" />
            Enriched
          </Badge>
        )}
        {reference.enrichment_status === 'processing' && (
          <Badge variant="secondary">Processing</Badge>
        )}
        {reference.enrichment_status === 'failed' && <Badge variant="destructive">Failed</Badge>}
      </div>

      <div className="text-xs text-muted-foreground">
        {reference.year !== null && <span>Year: {reference.year} • </span>}
        Created: {formatDate(reference.created_at)}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search references..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>References</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">Loading...</div>
                </TableCell>
              </TableRow>
            )}
            {!loading && filteredReferences.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchQuery
                      ? 'No references found matching your search.'
                      : 'No references found. Add your first reference to get started.'}
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              filteredReferences.map(reference => (
                <TableRow key={reference.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium line-clamp-1">
                        {reference.title ?? 'Untitled'}
                      </div>
                      {reference.reference_url !== null && (
                        <a
                          href={reference.reference_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {new URL(reference.reference_url).hostname}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {reference.reference_type !== null ? (
                      <Badge variant="outline">{reference.reference_type}</Badge>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge variant={reference.canonical ? 'default' : 'secondary'}>
                        {reference.canonical ? 'Canonical' : 'Secondary'}
                      </Badge>
                      {reference.enrichment_status === 'completed' && (
                        <Badge variant="success" className="gap-1">
                          <Database className="h-3 w-3" />
                        </Badge>
                      )}
                      {reference.enrichment_status === 'processing' && (
                        <Badge variant="secondary">
                          <Loader2 className="h-3 w-3 animate-spin" />
                        </Badge>
                      )}
                      {reference.enrichment_status === 'failed' && (
                        <Badge variant="destructive">!</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Link2 className="h-3 w-3" />
                      {reference.reference_count}
                    </Badge>
                  </TableCell>
                  <TableCell>{reference.year ?? '—'}</TableCell>
                  <TableCell>{formatDate(reference.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(reference)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(reference)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm(reference)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading && <div className="text-center py-8 text-muted-foreground">Loading...</div>}
        {!loading && filteredReferences.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery
              ? 'No references found matching your search.'
              : 'No references found. Add your first reference to get started.'}
          </div>
        )}
        {!loading &&
          filteredReferences.map(reference => (
            <ReferenceCard key={reference.id} reference={reference} />
          ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={open => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reference?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteConfirm?.title ?? 'this reference'}
              &quot;?
              {deleteConfirm !== null && deleteConfirm.reference_count > 0 && (
                <span className="block mt-2 font-medium text-amber-600">
                  Warning: This reference is cited by {deleteConfirm.reference_count} other
                  reference{deleteConfirm.reference_count > 1 ? 's' : ''}.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
