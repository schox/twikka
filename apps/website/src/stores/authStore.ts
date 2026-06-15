import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export interface AuthState {
  user: User | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    user: null,
    isInitialized: false,

    setUser: (user: User | null) => {
      set({ user });
    },

    initialize: async () => {
      if (get().isInitialized) return;

      try {
        // Get initial session
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        set({
          user: data.session?.user ?? null,
          isInitialized: true,
        });

        // Listen for auth state changes
        const supabase2 = createClient();
        supabase2.auth.onAuthStateChange((_, session) => {
          set({ user: session?.user ?? null });
        });
      } catch (error) {
        console.error('Auth initialization failed:', error);
        set({ user: null, isInitialized: true });
      }
    },

    signOut: async () => {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
        // The auth state change listener will handle setting user to null
      } catch (error) {
        console.error('Sign out failed:', error);
        // Force reset user state even if sign out fails
        set({ user: null });
      }
    },
  })),
);
