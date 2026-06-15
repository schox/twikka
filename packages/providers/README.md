# @novansa/providers

Shared React providers and contexts for Novansa Apps monorepo.

## Purpose

This package consolidates duplicate provider implementations across all Novansa applications, eliminating code duplication and ensuring consistency in state management patterns.

## Installation

This package is part of the Novansa Apps monorepo workspace:

```bash
npm install @novansa/providers
```

## Usage

### Basic Provider Usage

Most providers require a Supabase client to be passed as a prop:

```tsx
import { TagProvider, LightbulbProvider } from '@novansa/providers';
import { createClient } from '@/lib/supabase/client';

function App() {
  const supabase = createClient();
  
  return (
    <TagProvider supabaseClient={supabase}>
      <LightbulbProvider supabaseClient={supabase}>
        {/* Your app content */}
      </LightbulbProvider>
    </TagProvider>
  );
}
```

### Client-Independent Providers

Some providers don't require external dependencies:

```tsx
import { QueryProvider, AuthErrorBoundary } from '@novansa/providers';

function App() {
  return (
    <AuthErrorBoundary>
      <QueryProvider>
        {/* Your app content */}
      </QueryProvider>
    </AuthErrorBoundary>
  );
}
```

### Using Contexts

Import and use contexts with custom hooks:

```tsx
import { TagContext, LightbulbContext } from '@novansa/providers';
import { useContext } from 'react';

function useTag() {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTag must be used within TagProvider');
  }
  return context;
}

function MyComponent() {
  const { tags, loading, error, refresh } = useTag();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {tags.map(tag => (
        <li key={tag.id}>{tag.tag}</li>
      ))}
    </ul>
  );
}
```

## Available Providers

### Data Providers (require Supabase client)
- `TagProvider` - Manages tag lookup data
- `LightbulbProvider` - Manages lightbulb idea data

### Infrastructure Providers (no dependencies)
- `QueryProvider` - TanStack Query client configuration
- `AuthErrorBoundary` - Global authentication error handling

## Architecture

### Supabase Client Injection

To support different Supabase client patterns across apps, providers accept the client as a prop:

```tsx
// ripplebase pattern
import { supabase } from '@/lib/supabaseClient';
<TagProvider supabaseClient={supabase}>

// fall-admin pattern  
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
<TagProvider supabaseClient={supabase}>
```

### Type Safety

All providers include full TypeScript support with exported types:

```tsx
import type { Tag, TagContextType } from '@novansa/providers';
```

## Migration Guide

### From App-Specific Providers

1. **Replace imports:**
   ```tsx
   // Before
   import { TagProvider } from '../providers/TagProvider';
   
   // After
   import { TagProvider } from '@novansa/providers';
   ```

2. **Add supabaseClient prop:**
   ```tsx
   // Before
   <TagProvider>
   
   // After
   <TagProvider supabaseClient={supabase}>
   ```

3. **Remove old provider files** from your app's `src/providers/` directory

## Development

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run typecheck
```

## Contributing

When adding new shared providers:

1. Ensure the provider is truly identical across apps
2. Use Supabase client injection pattern for data providers
3. Export all types and interfaces
4. Add comprehensive TypeScript support
5. Update this README with usage examples

## Consolidation Impact

This package eliminates duplicate code:

- **Before**: 8 identical providers × 3 apps = 24 files
- **After**: 8 shared providers = 8 files  
- **Reduction**: 67% fewer files to maintain

Additional benefits:
- Consistent behavior across apps
- Single source of truth for provider logic
- Easier testing and debugging
- Simplified onboarding for new developers