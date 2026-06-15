'use client';

import React, { useState } from 'react';
import { useReferenceContext, Reference } from '@/contexts/ReferenceContext';
import { Button, Input, Textarea, Label, Switch } from '@novansa/ui';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@novansa/ui';
import { normalizeUrl, isValidUrl } from '@/lib/urlUtils';

interface AddReferenceFormProps {
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

export function AddReferenceForm({ onSuccess, onCancel }: AddReferenceFormProps) {
  const { addReference } = useReferenceContext();
  const [isFullMode, setIsFullMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [referenceType, setReferenceType] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [summary, setSummary] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate URL
    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    // Normalize URL (strip parameters, add protocol if needed)
    const normalizedUrl = normalizeUrl(url);

    if (!isValidUrl(normalizedUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    // Prepare reference data
    const referenceData: Partial<Reference> = {
      reference_url: normalizedUrl,
      description: description.trim() || null,
      canonical: true, // User-added references are canonical
      process: true, // Schedule for enrichment
      reference_count: 0,
      backlink_count: 0,
      enrichment_status: 'pending', // New references start as pending
    };

    // Add full mode fields if enabled
    if (isFullMode) {
      referenceData.title = title.trim() || null;
      referenceData.reference_type = referenceType || null;
      referenceData.year = year ? parseInt(year, 10) : null;
      referenceData.date = date || null;
      referenceData.keywords = keywords
        ? keywords
            .split(',')
            .map(k => k.trim())
            .filter(Boolean)
        : null;
      referenceData.summary = summary.trim() || null;
    }

    setIsSubmitting(true);
    try {
      await addReference(referenceData);
      // Reset form
      setUrl('');
      setDescription('');
      setTitle('');
      setReferenceType('');
      setYear('');
      setDate('');
      setKeywords('');
      setSummary('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reference');
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

      {/* Quick Mode Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">URL *</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onBlur={e => {
              const currentValue = e.target.value.trim();
              if (currentValue && isValidUrl(normalizeUrl(currentValue))) {
                setUrl(normalizeUrl(currentValue));
              }
            }}
            disabled={isSubmitting}
            required
          />
          <p className="text-xs text-muted-foreground">
            Note: URL parameters (e.g., ?utm_source=...) will be automatically stripped to keep
            references clean.
          </p>
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
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center justify-between py-2">
        <Label htmlFor="full-mode" className="cursor-pointer">
          Show all fields
        </Label>
        <Switch
          id="full-mode"
          checked={isFullMode}
          onCheckedChange={setIsFullMode}
          disabled={isSubmitting}
        />
      </div>

      {/* Full Mode Fields */}
      {isFullMode && (
        <div className="space-y-4 pt-4 border-t">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Reference Type</Label>
              <Select
                value={referenceType}
                onValueChange={setReferenceType}
                disabled={isSubmitting}
              >
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
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Reference
        </Button>
      </div>
    </form>
  );
}
