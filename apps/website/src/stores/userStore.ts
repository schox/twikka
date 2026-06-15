import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';
import type { UserProfile, SubscriptionType } from '@/contexts/UserContext';
import { createClient } from '@/lib/supabase/client';
import log from 'loglevel';

const logger = log;
logger.setLevel('debug');

// Add a type for the RPC result
export type UserProfileRpc = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  account: string;
  account_name: string;
  account_role: 'owner' | 'admin' | 'editor' | 'viewer';
  app_admin: boolean;
  created_at: string;
  auth_id: string;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  subscription_type: SubscriptionType | null;
};

// Type guard for UserProfileRpc
function isUserProfileRpc(data: unknown): data is UserProfileRpc {
  return data !== null && typeof data === 'object' && 'id' in data && 'email' in data;
}

export interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUserProfile: (authUser: User | null) => Promise<void>;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  subscribeWithSelector(set => ({
    user: null,
    isLoading: false,
    error: null,

    setUser: (user: UserProfile | null) => {
      set({ user, error: null });
    },

    setLoading: (isLoading: boolean) => {
      set({ isLoading });
    },

    setError: (error: string | null) => {
      set({ error });
    },

    fetchUserProfile: async (authUser: User | null) => {
      set({ isLoading: true, error: null });

      if (!authUser || typeof authUser.email !== 'string' || authUser.email.trim() === '') {
        set({ user: null, isLoading: false });
        return;
      }

      try {
        const supabase = createClient();
        const result = await supabase.rpc('get_user_profile_by_email', { p_email: authUser.email });

        const userData = isUserProfileRpc(result.data) ? result.data : null;
        const error = result.error;

        if (error !== null || userData === null) {
          set({
            user: null,
            isLoading: false,
            error: error?.message ?? 'Failed to load user profile',
          });
          return;
        }

        // Build name safely
        let name = userData.email;
        if (
          (typeof userData.first_name === 'string' && userData.first_name.trim() !== '') ||
          (typeof userData.last_name === 'string' && userData.last_name.trim() !== '')
        ) {
          name = `${userData.first_name ?? ''} ${userData.last_name ?? ''}`.trim();
        }

        const userProfile: UserProfile = {
          id: userData.id,
          name,
          email: userData.email,
          account: {
            id: userData.account,
            name: userData.account_name,
          },
          account_role: userData.account_role,
          app_admin: userData.app_admin,
          created_at: userData.created_at,
          auth_id: userData.auth_id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          subscription: {
            start_date: userData.subscription_start_date,
            end_date: userData.subscription_end_date,
            subscription_type: userData.subscription_type,
          },
        };

        set({ user: userProfile, isLoading: false, error: null });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        set({
          user: null,
          isLoading: false,
          error: errorMessage,
        });
      }
    },

    reset: () => {
      set({ user: null, isLoading: false, error: null });
    },
  })),
);
