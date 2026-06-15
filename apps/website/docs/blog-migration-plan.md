# Blog Migration Plan: blog_import_posts → blog_post

## Table Structure Analysis

### blog_import_posts (Source Table)

```
- id: bigint (primary key)
- Slug: text (nullable)
- Title: text (nullable)
- Image: text (nullable) - External URLs like framerusercontent.com
- Image:alt: text (nullable)
- Image Source: text (nullable)
- Excerpt: text (nullable)
- Content: text (nullable) - HTML format content
- Published: boolean (nullable)
- Date Published: timestamp with time zone (nullable)
- Published Date Text: text (nullable)
- Featured: boolean (nullable)
- Stage: text (nullable)
- Blog Posts: text (nullable) - Unknown purpose
- Author: text (nullable) - Text name, not ID
- Blog Categories: text (nullable) - Comma-separated: "tips,conditions"
- Blog Tags: text (nullable) - Currently empty in samples
```

### blog_post (Target Table - Current)

```
- id: bigint (auto-increment)
- title: text (NOT NULL)
- slug: text (NOT NULL)
- content: text (NOT NULL) - Markdown format
- excerpt: text (NOT NULL)
- cover_image_url: text (nullable) - Supabase storage URLs
- author_id: bigint (NOT NULL) - Foreign key
- category_id: bigint (nullable) - Foreign key
- brand: bigint (NOT NULL) - Fixed to 1 for FALL
- published_at: timestamp (default now())
- updated_at: timestamp (default now())
- status: text (default 'published')
- embedding: vector (nullable) - AI embeddings
- search_vector: tsvector (nullable) - Full text search
- created_at: timestamp (default now())
```

### blog_post (Recommended Enhanced Structure)

```sql
-- Add Lexical content columns (already planned)
ALTER TABLE blog_post
ADD COLUMN IF NOT EXISTS lexical_content JSONB,
ADD COLUMN IF NOT EXISTS content_html TEXT;

-- Add migration tracking
ALTER TABLE blog_post
ADD COLUMN IF NOT EXISTS migrated_from_import_id BIGINT,
ADD COLUMN IF NOT EXISTS migration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add featured flag
ALTER TABLE blog_post
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Add image metadata
ALTER TABLE blog_post
ADD COLUMN IF NOT EXISTS cover_image_alt TEXT,
ADD COLUMN IF NOT EXISTS cover_image_source TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_post_migrated_from ON blog_post (migrated_from_import_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_featured ON blog_post (featured);
```

## Migration Requirements Overview

**Total Posts to Migrate**: 113 posts
**Current blog_post entries**: 3 (will be replaced with migrated data)

## Detailed Migration Steps

### 1. Image Migration Strategy

**Challenge**: External URLs need to be downloaded and stored in Supabase Storage

- Source: `https://framerusercontent.com/images/...`
- Target: Supabase Storage bucket `blog-images` (public read, auth required for CUD)

```typescript
async function migrateImages(importPostId: number, imageUrl: string): Promise<string | null> {
  try {
    // Download image from external URL
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();

    // Generate filename: post-{id}-cover.{ext}
    const ext = imageUrl.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `post-${importPostId}-cover.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filename, imageBuffer, {
        contentType: response.headers.get('content-type') || 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    // Return public URL
    return supabase.storage.from('blog-images').getPublicUrl(filename).data.publicUrl;
  } catch (error) {
    console.error(`Failed to migrate image for post ${importPostId}:`, error);
    return null;
  }
}
```

### 2. Content Conversion Pipeline

**HTML → Markdown → Lexical JSON**

```typescript
import { convertContent } from '@/lib/contentConverters';

async function convertPostContent(htmlContent: string) {
  // Use existing utility to convert HTML to all formats
  const converted = convertContent(htmlContent, 'html');

  if (!converted) {
    throw new Error('Failed to convert content');
  }

  return {
    markdown: converted.markdownContent,
    lexical: converted.lexicalContent,
    html: converted.htmlContent,
    plainText: converted.plainTextContent,
  };
}
```

### 3. Category Mapping System

**Challenge**: Map comma-separated strings to existing category IDs

```sql
-- Category mapping reference
tips → Tips (id: 13)
conditions → Conditions (id: 14)
questions → Questions (id: 17)
treatments → Treatments (id: 15)
```

```typescript
const CATEGORY_MAPPING = {
  tips: 13,
  conditions: 14,
  questions: 17,
  treatments: 15,
  'case-histories': 16,
  'common-conditions': 1,
  'diabetic-foot-care': 3,
  'patient-education': 6,
  'preventive-care': 2,
  'sports-injuries': 4,
  'surgical-procedures': 5,
};

function mapCategories(categoriesString: string): number[] {
  if (!categoriesString) return [];

  return categoriesString
    .split(',')
    .map(cat => cat.trim().toLowerCase())
    .map(cat => CATEGORY_MAPPING[cat])
    .filter(Boolean);
}
```

### 4. Author Handling

**Challenge**: Text names need to map to author_id

**Options**:

1. Create default "FALL Podiatrists" author (recommended)
2. Parse text names and create/match author records

```sql
-- Create default author if not exists
INSERT INTO author (name, email, brand, created_at, updated_at)
VALUES ('FALL Podiatrists', 'info@footanklelowerlimb.com.au', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;
```

### 5. Complete Migration Script Structure

```typescript
interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: Array<{ postId: number; error: string }>;
  imageFailures: Array<{ postId: number; originalUrl: string }>;
}

async function migrateBlogPosts(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migratedCount: 0,
    errors: [],
    imageFailures: [],
  };

  try {
    // 1. Clear existing blog_post entries for brand = 1
    await supabase.from('blog_post').delete().eq('brand', 1);

    // 2. Get default author ID
    const defaultAuthorId = await getOrCreateDefaultAuthor();

    // 3. Fetch all import posts
    const { data: importPosts } = await supabase.from('blog_import_posts').select('*').order('id');

    // 4. Process each post
    for (const importPost of importPosts) {
      try {
        // Migrate image
        let coverImageUrl = null;
        if (importPost.Image) {
          coverImageUrl = await migrateImages(importPost.id, importPost.Image);
          if (!coverImageUrl) {
            result.imageFailures.push({
              postId: importPost.id,
              originalUrl: importPost.Image,
            });
          }
        }

        // Convert content
        const convertedContent = await convertPostContent(importPost.Content || '');

        // Map categories
        const categoryIds = mapCategories(importPost['Blog Categories']);
        const primaryCategoryId = categoryIds[0] || null;

        // Create blog post
        const { data: newPost, error } = await supabase
          .from('blog_post')
          .insert({
            title: importPost.Title || 'Untitled',
            slug: importPost.Slug || `post-${importPost.id}`,
            content: convertedContent.markdown,
            lexical_content: convertedContent.lexical,
            content_html: convertedContent.html,
            excerpt: importPost.Excerpt || convertedContent.plainText?.substring(0, 200) || '',
            cover_image_url: coverImageUrl,
            cover_image_alt: importPost['Image:alt'],
            cover_image_source: importPost['Image Source'],
            author_id: defaultAuthorId,
            category_id: primaryCategoryId,
            brand: 1,
            status: importPost.Published ? 'published' : 'draft',
            published_at: importPost['Date Published'],
            featured: importPost.Featured || false,
            migrated_from_import_id: importPost.id,
            migration_date: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        // Create category relationships for multiple categories
        if (categoryIds.length > 1) {
          const categoryRelations = categoryIds.slice(1).map(catId => ({
            post_id: newPost.id,
            category_id: catId,
          }));

          await supabase.from('blog_post_category').insert(categoryRelations);
        }

        result.migratedCount++;
      } catch (error) {
        result.errors.push({
          postId: importPost.id,
          error: error.message,
        });
      }
    }

    result.success = result.errors.length === 0;
    return result;
  } catch (error) {
    result.errors.push({ postId: -1, error: error.message });
    return result;
  }
}
```

## Post-Migration Tasks

### 1. Content Validation

- Verify Lexical rendering matches original HTML
- Check image loading and accessibility
- Validate category relationships

### 2. SEO Migration

- Update search vectors
- Generate AI embeddings for semantic search
- Verify meta descriptions and structured data

### 3. URL Redirects

- Map old URLs to new slug-based URLs
- Implement 301 redirects for SEO preservation

### 4. Performance Optimization

- Optimize images (WebP conversion, multiple sizes)
- Update CDN cache policies
- Monitor database performance with new volume

## Risk Mitigation

### Data Backup

```sql
-- Backup current blog_post data before migration
CREATE TABLE blog_post_backup AS SELECT * FROM blog_post WHERE brand = 1;
```

### Rollback Strategy

```sql
-- Rollback procedure if migration fails
DELETE FROM blog_post WHERE migrated_from_import_id IS NOT NULL;
INSERT INTO blog_post SELECT * FROM blog_post_backup;
```

### Error Handling

- Image download failures: Keep original URLs as fallback
- Content conversion errors: Store original HTML in separate field
- Category mapping failures: Use default "General" category

## Timeline Estimate

1. **Schema Updates**: 30 minutes
2. **Migration Script Development**: 2-3 hours
3. **Testing on Subset**: 1 hour
4. **Full Migration Execution**: 1 hour (113 posts)
5. **Validation & Cleanup**: 1 hour

**Total Estimated Time**: 5-6 hours

## Success Criteria

- [ ] All 113 posts migrated successfully
- [ ] Images stored in Supabase Storage with public URLs
- [ ] Content renders correctly in Lexical components
- [ ] Category relationships preserved
- [ ] SEO metadata maintained
- [ ] No broken links or missing images
- [ ] Performance acceptable with new content volume
