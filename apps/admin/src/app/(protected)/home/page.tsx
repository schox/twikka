'use client';

import { useAuth, useUser } from '@novansa/auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Twikka Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {profile?.email || profile?.first_name || 'User'}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Welcome to Twikka Admin
            </h2>
            <p className="text-muted-foreground">
              You have successfully logged in and verified your identity.
            </p>
            <p className="text-muted-foreground mt-2">
              This is a placeholder for the admin dashboard. Add your content here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
