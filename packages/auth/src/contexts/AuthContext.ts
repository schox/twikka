import { createContext } from 'react';
import type { AuthContextType } from '../types';

/**
 * Context for authentication state and actions
 * Contains user, session, profile, and auth operations
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

AuthContext.displayName = 'AuthContext';
