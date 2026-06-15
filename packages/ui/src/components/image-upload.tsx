'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../utils';

export interface ImageUploadProps {
  value?: string;
  altText?: string;
  onChange: (url: string) => void;
  onAltTextChange?: (alt: string) => void;
  bucket: string;
  pathPrefix?: string;
  supabaseClient: any;
  supabaseUrl: string;
  showAltText?: boolean;
  accept?: string;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  altText,
  onChange,
  onAltTextChange,
  bucket,
  pathPrefix = '',
  supabaseClient,
  supabaseUrl,
  showAltText = false,
  accept = 'image/*',
  label,
  className,
}: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const ext = file.name.split('.').pop();
        const fileName = `${pathPrefix}${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        const { error } = await supabaseClient.storage.from(bucket).upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

        if (error) throw error;

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
        onChange(publicUrl);
      } catch (err) {
        console.error('Upload error:', err);
      } finally {
        setUploading(false);
      }
    },
    [bucket, pathPrefix, supabaseClient, supabaseUrl, onChange],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        uploadFile(file);
      }
    },
    [uploadFile],
  );

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  const handleRemove = () => {
    onChange('');
    if (onAltTextChange) onAltTextChange('');
  };

  // Resolve display URL for preview
  const displayUrl = value || '';

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="text-sm font-medium leading-none">{label}</label>}

      {/* Preview */}
      {displayUrl && (
        <div className="relative group">
          <div className="relative w-full h-32 rounded-md overflow-hidden border bg-muted">
            <img
              src={displayUrl}
              alt={altText ?? ''}
              className="w-full h-full object-cover"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Alt text */}
      {showAltText && displayUrl && (
        <div className="space-y-1">
        <label className="text-sm font-medium leading-none">Alt Text</label>
        <input
          type="text"
          value={altText ?? ''}
          onChange={e => onAltTextChange?.(e.target.value)}
          placeholder="Alt text for accessibility"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        </div>
      )}

      {/* Tabs */}
      {!displayUrl && (
        <>
          <div className="flex border-b">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'upload'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <Upload className="h-3.5 w-3.5" />
              Upload
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'url'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <Link className="h-3.5 w-3.5" />
              URL
            </button>
          </div>

          {activeTab === 'upload' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors',
                dragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50',
                uploading && 'opacity-50 pointer-events-none',
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
              />
              {uploading ? (
                <div className="text-sm text-muted-foreground">Uploading...</div>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground text-center">
                    Drop an image here or click to browse
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 bg-primary text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
