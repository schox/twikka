'use client';

import React, { useState } from 'react';
import { useReferenceContext, Reference } from '@/contexts/ReferenceContext';
import { Button, Input, Textarea, Label } from '@novansa/ui';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@novansa/ui';

interface EditReferenceFormProps {
  reference: Reference;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const REFERENCE_TYPES = [
  'article',
  'blog_post',
  'research_paper',
  'book',
  'video',
  'podcast',
  'social_media',
  'documentation',
  'other',
];

export function EditReferenceForm({ reference, onSuccess, onCancel }: EditReferenceFormProps) {
  const { updateReference } = useReferenceContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields - initialize with reference data
  const [url, setUrl] = useState(reference.reference_url ?? '');
  const [description, setDescription] = useState(reference.description ?? '');
  const [title, setTitle] = useState(reference.title ?? '');
  const [referenceType, setReferenceType] = useState(reference.reference_type ?? '');
  const [year, setYear] = useState(reference.year?.toString() ?? '');
  const [date, setDate] = useState(reference.date ?? '');
  const [keywords, setKeywords] = useState(
    reference.keywords !== null ? reference.keywords.join(', ') : '',
  );
  const [summary, setSummary] = useState(reference.summary ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Prepare updated data - only include editable fields (URL cannot be changed)
    const updatedData: Partial<Reference> = {
      description: description.trim() || null,
      title: title.trim() || null,
      reference_type: referenceType || null,
      year: year ? parseInt(year, 10) : null,
      date: date || null,
      keywords: keywords
        ? keywords
            .split(',')
            .map(k => k.trim())
            .filter(Boolean)
        : null,
      summary: summary.trim() || null,
      updated_at: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      await updateReference(reference.id, updatedData);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update reference');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error !== null && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={reference.canonical ? 'default' : 'secondary'}>
          {reference.canonical ? 'Canonical' : 'Secondary'}
        </Badge>
        <Badge variant="outline">References: {reference.reference_count}</Badge>
        <Badge variant="outline">Backlinks: {reference.backlink_count}</Badge>
        {reference.process && <Badge variant="secondary">Enrichment Scheduled</Badge>}
        {reference.enrichment_status !== null && reference.enrichment_status !== '' && (
          <Badge
            variant={
              reference.enrichment_status === 'completed'
                ? 'success'
                : reference.enrichment_status === 'failed'
                  ? 'destructive'
                  : reference.enrichment_status === 'processing'
                    ? 'secondary'
                    : 'outline'
            }
          >
            {reference.enrichment_status.charAt(0).toUpperCase() +
              reference.enrichment_status.slice(1)}
          </Badge>
        )}
      </div>

      {/* Editable Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={e => setUrl(e.target.value)}
            disabled={true}
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            URLs cannot be edited. To change the URL, delete this reference and create a new one.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Reference title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the reference..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Reference Type</Label>
            <Select value={referenceType} onValueChange={setReferenceType} disabled={isSubmitting}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {REFERENCE_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              placeholder="2024"
              min="1900"
              max={new Date().getFullYear()}
              value={year}
              onChange={e => setYear(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Input
            id="keywords"
            placeholder="keyword1, keyword2, keyword3"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            placeholder="Detailed summary of the reference..."
            value={summary}
            onChange={e => setSummary(e.target.value)}
            disabled={isSubmitting}
            rows={4}
          />
        </div>
      </div>

      {/* System Fields (Read-only) */}
      <div className="space-y-2 pt-4 border-t">
        <h3 className="text-sm font-medium text-muted-foreground">System Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">ID:</span> {reference.id}
          </div>
          <div>
            <span className="text-muted-foreground">Created:</span>{' '}
            {new Date(reference.created_at).toLocaleDateString()}
          </div>
          {reference.updated_at !== null && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Last Updated:</span>{' '}
              {new Date(reference.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Reference
        </Button>
      </div>
    </form>
  );
}
