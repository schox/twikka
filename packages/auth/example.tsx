/**
 * Example usage of @novansa/auth package
 * This file demonstrates how to use the auth package in a Next.js app
 */

import React from 'react';
import { AuthProvider, UserProvider, useAuth, useUser, useClaims } from '@novansa/auth';

// Example: Main App Setup
function App({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider 
      enableAutoRefresh={true}
      refreshInterval={60000}
    >
      <UserProvider
        enableCaching={true}
        cacheTimeout={300000}
      >
        {children}
      </UserProvider>
    </AuthProvider>
  );
}

// Example: Login Form
function LoginForm() {
  const { signIn, loading, error, clearError } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await signIn(email, password);
      // User will be automatically redirected on success
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <div className="error">
          {error.message}
        </div>
      )}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

// Example: Protected Dashboard
function Dashboard() {
  const { user, signOut } = useAuth();
  const { profile, hasAppAccess, isAdmin, brands, loading } = useUser();
  const { accountId, claims } = useClaims();

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!user || !profile) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome {profile.first_name}!</h1>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.account_role}</p>
      <p>Account ID: {accountId}</p>
      
      {/* App Access Control */}
      {hasAppAccess('fall-admin') && (
        <div>
          <h2>Fall Admin Access</h2>
          <p>You can access the Fall Admin panel</p>
        </div>
      )}
      
      {hasAppAccess('ripplebase') && (
        <div>
          <h2>Ripplebase Access</h2>
          <p>You can access the Ripplebase SaaS platform</p>
        </div>
      )}
      
      {/* Role-based Content */}
      {isAdmin && (
        <div>
          <h2>Admin Panel</h2>
          <p>Administrative functions available</p>
        </div>
      )}
      
      {/* User's Brands */}
      {brands && brands.length > 0 && (
        <div>
          <h2>Your Brands</h2>
          <ul>
            {brands.map((brand) => (
              <li key={brand.id}>
                {brand.name} (Account: {brand.account})
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* JWT Claims Debug (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <details>
          <summary>JWT Claims (Debug)</summary>
          <pre>{JSON.stringify(claims, null, 2)}</pre>
        </details>
      )}
      
      <button onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}

// Example: Permission-based Component
function AdminOnlyComponent() {
  const { profile, isAdmin } = useUser();
  
  if (!isAdmin) {
    return <div>Access denied: Admin role required</div>;
  }
  
  return (
    <div>
      <h3>Admin-only content</h3>
      <p>This component is only shown to admins</p>
    </div>
  );
}

// Example: App-specific Component  
function FallAdminComponent() {
  const { hasAppAccess } = useUser();
  
  if (!hasAppAccess('fall-admin')) {
    return <div>Fall Admin access required</div>;
  }
  
  return (
    <div>
      <h3>Fall Admin Features</h3>
      <p>Content specific to Fall Admin users</p>
    </div>
  );
}

// Example: Using Guards
import { useAuth, useUser, authGuard, permissionGuard } from '@novansa/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, session } = useAuth();
  const { profile } = useUser();
  
  // Check authentication
  const authResult = authGuard(user, session);
  if (!authResult.allowed) {
    return <div>Please sign in to continue</div>;
  }
  
  // Check permissions
  const permissionResult = permissionGuard(profile, {
    apps: ['fall-admin'],
    roles: ['admin', 'owner']
  });
  
  if (!permissionResult.allowed) {
    return <div>Access denied: {permissionResult.reason}</div>;
  }
  
  return <>{children}</>;
}

// Example: Server-side Usage (API Route)
/*
import { createServerClientWithCookies, serverAuthGuard, getClaimsFromSession } from '@novansa/auth';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClientWithCookies(cookieStore);
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check authentication
  const authResult = serverAuthGuard(session?.user || null, session);
  if (!authResult.authenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get claims for RLS
  const claims = getClaimsFromSession(session?.access_token);
  const accountId = claims?.account_id;
  
  if (!accountId) {
    return Response.json({ error: 'Account not found' }, { status: 400 });
  }
  
  // Use accountId for data fetching with RLS
  const { data } = await supabase
    .from('content')
    .select('*')
    .eq('account_id', accountId); // This uses JWT claims with RLS
  
  return Response.json({ data });
}
*/

export {
  App,
  LoginForm,
  Dashboard,
  AdminOnlyComponent,
  FallAdminComponent,
  ProtectedRoute,
};