# @novansa/auth

Modern Supabase authentication package for Next.js applications with multi-tenant support, JWT claims integration, and role-based permissions.

## Features

- ✅ **Modern Supabase Integration**: Support for both new RS256 keys and legacy keys with automatic fallback
- ✅ **JWT Claims**: Direct access to `account_id` and custom claims from JWT tokens for optimal RLS performance
- ✅ **Multi-Tenant Architecture**: Built-in account isolation and brand-based permissions
- ✅ **Role-Based Access Control**: Owner, Admin, Editor, Viewer, Client roles with fine-grained permissions
- ✅ **App Access Control**: Granular control over which apps users can access
- ✅ **TypeScript Support**: Fully typed with strict TypeScript definitions
- ✅ **React Hooks**: Modern hooks-based API with optimized performance
- ✅ **Auth Guards**: Comprehensive permission checking and route protection
- ✅ **Server Support**: SSR and API route compatibility
- ✅ **Error Boundaries**: Robust error handling with custom error types

## Installation

```bash
npm install @novansa/auth
```

## Quick Start

### 1. Environment Variables

Set up your Supabase environment variables. The package supports both new RS256 keys (recommended) and legacy keys:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# New RS256 key (recommended)
NEXT_SUPABASE_PUBLISHABLE_KEY=eyJ...

# OR Legacy key (will show warning in development)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 2. Provider Setup

Wrap your app with the auth providers:

```tsx
import { AuthProvider, UserProvider } from '@novansa/auth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 3. Using Auth Hooks

```tsx
import { useAuth, useUser, useClaims } from '@novansa/auth';

function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const { profile, hasAppAccess, isAdmin } = useUser();
  const { accountId, claims } = useClaims();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return (
    <div>
      <h1>Welcome {profile?.first_name}!</h1>
      <p>Account ID: {accountId}</p>
      {hasAppAccess('fall-admin') && <AdminPanel />}
      {isAdmin && <OwnerPanel />}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

## Core Concepts

### Authentication State

The `useAuth()` hook provides access to:

- `user`: Current Supabase user object
- `session`: Current session with tokens
- `profile`: Enhanced user profile with account/subscription data
- `claims`: JWT claims including `account_id`
- `loading`: Loading state
- `error`: Any auth errors
- Auth actions: `signIn`, `signUp`, `signOut`, etc.

### User Permissions

The `useUser()` hook provides user profile and permission helpers:

- `profile`: Full user profile with account details
- `brands`: User's accessible brands
- `hasAppAccess(app)`: Check access to specific apps
- `hasRole(roles)`: Check user roles
- `isAdmin`, `isOwner`, `canEdit`, `canView`: Permission shortcuts

### JWT Claims

The `useClaims()` hook provides direct access to JWT claims:

- `claims`: All JWT claims
- `accountId`: Account ID from token (for RLS)
- `role`: User role from token
- `isValid`: Token validation status
- `getClaim(key)`: Get specific claim value

## Authentication

### Sign In

```tsx
import { useAuth } from '@novansa/auth';

function LoginForm() {
  const { signIn, loading, error } = useAuth();
  
  const handleSubmit = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      // User will be automatically redirected on success
    } catch (err) {
      console.error('Login failed:', err.message);
    }
  };
  
  // ... rest of component
}
```

### Sign Up

```tsx
const { signUp } = useAuth();

await signUp(email, password, {
  first_name: 'John',
  last_name: 'Doe'
});
```

### Password Reset

```tsx
const { resetPassword } = useAuth();

await resetPassword(email);
```

## Permissions & Guards

### Permission Checking

```tsx
import { useUser } from '@novansa/auth';

function ProtectedContent() {
  const { hasAppAccess, hasRole, isAdmin } = useUser();
  
  if (!hasAppAccess('fall-admin')) {
    return <div>Access denied</div>;
  }
  
  return (
    <div>
      <h1>Admin Content</h1>
      {hasRole(['owner', 'admin']) && <AdminSettings />}
      {isAdmin && <SuperAdminPanel />}
    </div>
  );
}
```

### Route Guards

```tsx
import { authGuard, permissionGuard } from '@novansa/auth';

// In middleware or API routes
export function middleware(request: NextRequest) {
  const { user, session, profile } = getAuthFromRequest(request);
  
  // Check authentication
  const authResult = authGuard(user, session);
  if (!authResult.allowed) {
    return redirect(authResult.redirectTo);
  }
  
  // Check permissions
  const permissionResult = permissionGuard(profile, {
    apps: ['fall-admin'],
    roles: ['admin', 'owner']
  });
  
  if (!permissionResult.allowed) {
    return redirect('/unauthorized');
  }
  
  return NextResponse.next();
}
```

### Guard Presets

```tsx
import { guardPresets } from '@novansa/auth';

const { profile } = useUser();

// Pre-configured guards for common scenarios
const fallAdminAccess = guardPresets.fallAdmin(profile);
const canEditContent = guardPresets.canEdit(profile);
const multiAppAccess = guardPresets.multiApp(profile);

if (!fallAdminAccess.allowed) {
  return <div>No access to Fall Admin</div>;
}
```

## Multi-Tenant Support

### Account Isolation

The package automatically handles account isolation through JWT claims:

```tsx
const { accountId } = useClaims();

// This account_id is embedded in the JWT token for performant RLS
// Use it for filtering queries without additional DB calls
const { data } = await supabase
  .from('content')
  .select('*')
  .eq('account_id', accountId); // This uses RLS with JWT claims
```

### Brand Access

```tsx
const { brands } = useUser();

// User's accessible brands based on their permissions
brands?.forEach(brand => {
  console.log(`${brand.name} (Account: ${brand.account})`);
});
```

## App Access Control

Control which apps users can access:

```tsx
const { hasAppAccess } = useUser();

// Check access to specific apps
if (hasAppAccess('fall-admin')) {
  // User can access fall-admin
}

if (hasAppAccess('ripplebase')) {
  // User can access ripplebase
}

if (hasAppAccess('fall-website')) {
  // User can access website admin
}
```

## Server-Side Usage

### API Routes

```tsx
import { createServerClientWithCookies, serverAuthGuard } from '@novansa/auth';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClientWithCookies(cookieStore);
  
  const { data: { session } } = await supabase.auth.getSession();
  
  const authResult = serverAuthGuard(session?.user || null, session);
  if (!authResult.authenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Proceed with authenticated request
  return Response.json({ user: authResult.user });
}
```

### Server Components

```tsx
import { createServerClientWithCookies, getClaimsFromSession } from '@novansa/auth';
import { cookies } from 'next/headers';

export default async function ServerPage() {
  const cookieStore = cookies();
  const supabase = createServerClientWithCookies(cookieStore);
  
  const { data: { session } } = await supabase.auth.getSession();
  const claims = getClaimsFromSession(session?.access_token);
  
  if (!claims?.account_id) {
    return <div>Please sign in</div>;
  }
  
  // Use account_id for server-side data fetching
  const { data } = await supabase
    .from('content')
    .select('*')
    .eq('account_id', claims.account_id);
  
  return <div>Content: {data?.length} items</div>;
}
```

## Error Handling

The package provides custom error types:

```tsx
import { AuthenticationError, PermissionError, UserProfileError } from '@novansa/auth';

try {
  await signIn(email, password);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Auth failed:', error.message);
  } else if (error instanceof PermissionError) {
    console.error('Permission denied:', error.requiredPermissions);
  } else if (error instanceof UserProfileError) {
    console.error('Profile error:', error.cause);
  }
}
```

## Configuration

### Custom Configuration

```tsx
import { AuthProvider, createAuthConfig } from '@novansa/auth';

const authConfig = createAuthConfig({
  enableAutoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  enableDevMode: true
});

function App({ children }) {
  return (
    <AuthProvider {...authConfig}>
      {children}
    </AuthProvider>
  );
}
```

### Per-App Configuration

```tsx
import { createProviderConfig } from '@novansa/auth';

// Get optimized config for specific app
const config = createProviderConfig('fall-admin');

<AuthProvider {...config}>
  {children}
</AuthProvider>
```

## TypeScript Support

The package is fully typed with strict TypeScript definitions:

```tsx
import type { 
  UserRole, 
  AppName, 
  UserProfile, 
  PermissionConfig,
  GuardResult 
} from '@novansa/auth';

const checkAccess = (
  profile: UserProfile | null, 
  config: PermissionConfig
): GuardResult => {
  // Fully typed parameters and return values
};
```

## Development & Debugging

### Debug Mode

Enable debug mode in development:

```tsx
import { debugClaims } from '@novansa/auth';

// Debug JWT claims
const { session } = useAuth();
debugClaims(session?.access_token);
```

### Configuration Validation

```tsx
import { validateSupabaseConfig } from '@novansa/auth';

const validation = validateSupabaseConfig();
if (!validation.isValid) {
  console.error('Supabase config errors:', validation.errors);
  console.log('Key type:', validation.keyType);
}
```

## Migration from Legacy Auth

If you're migrating from existing auth implementations:

1. **Environment Variables**: Add `NEXT_SUPABASE_PUBLISHABLE_KEY` for RS256 support
2. **Provider Migration**: Replace existing auth providers with `AuthProvider` and `UserProvider`  
3. **Hook Migration**: Update auth hooks to use `useAuth`, `useUser`, `useClaims`
4. **Permission Checks**: Use built-in permission helpers instead of manual checks
5. **Guard Migration**: Replace route protection with auth guards

The package maintains backward compatibility with `NEXT_PUBLIC_SUPABASE_ANON_KEY` during transition.

## Contributing

This package is part of the Novansa Apps monorepo. See the main repository for contribution guidelines.

## License

Part of the Novansa Apps monorepo.