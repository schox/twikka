import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { UserProfileError } from '../types';

/**
 * Hook to access user profile and permissions
 * Must be used within a UserProvider
 */
export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new UserProfileError(
      'useUser must be used within a UserProvider. ' +
        'Make sure your component is wrapped in <UserProvider>.',
    );
  }

  return context;
}
