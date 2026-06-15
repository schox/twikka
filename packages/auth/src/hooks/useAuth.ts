import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AuthenticationError } from '../types';

/**
 * Hook to access authentication state and actions
 * Must be used within an AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new AuthenticationError(
      'useAuth must be used within an AuthProvider. ' +
        'Make sure your component is wrapped in <AuthProvider>.',
    );
  }

  return context;
}
