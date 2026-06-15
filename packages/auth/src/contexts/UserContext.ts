import { createContext } from 'react';
import type { UserContextType } from '../types';

/**
 * Context for user profile and permission data
 * Separated from AuthContext for better performance
 */
export const UserContext = createContext<UserContextType | undefined>(undefined);

UserContext.displayName = 'UserContext';
