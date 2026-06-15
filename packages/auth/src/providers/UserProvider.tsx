import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
  REALTIME_SUBSCRIBE_STATES,
} from '@supabase/supabase-js';
import { UserContext } from '../contexts/UserContext';
import { useAuth } from '../hooks/useAuth';
import { UserProfileError } from '../types';
import type {
  UserContextType,
  UserProviderProps,
  UserProfile,
  UserRole,
  AppName,
  VerificationState,
} from '../types';

/**
 * UserProvider component that manages user profile and permissions
 * Separated from AuthProvider for better performance and caching
 */
export function UserProvider({
  children,
  enableCaching = true,
  cacheTimeout = 300000, // 5 minutes
  onUserProfileChange,
}: UserProviderProps) {
  const { user, session: _session, supabase, signOut } = useAuth(); // Use shared client from auth
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [brands, setBrands] = useState<Array<{ id: number; name: string; account: string }> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // Realtime subscription ref
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);

  // Fetch user brands
  const fetchUserBrands = useCallback(
    async (
      accountId: string,
      profileId?: string,
    ): Promise<Array<{ id: number; name: string; account: string }>> => {
      try {
        let userBrands: Array<{ brand: { id: number; name: string; account: string } | null }> = [];

        // First get brands user has direct access to via brand_user table (only if we have profileId)
        if (profileId) {
          const { data, error: userBrandsError } = await supabase
            .from('brand_user')
            .select(
              `
            brand:brand (
              id,
              name,
              account
            )
          `,
            )
            .eq('user', profileId);

          if (userBrandsError) {
            throw new Error(`Failed to fetch user brands: ${userBrandsError.message}`);
          }

          userBrands = (data ?? []) as Array<{ brand: { id: number; name: string; account: string } | null }>;
        }

        // Then get all brands in the user's account (if they're account owner/admin)
        const { data: accountBrands, error: accountBrandsError } = await supabase
          .from('brand')
          .select('id, name, account')
          .eq('account', accountId);

        if (accountBrandsError) {
          throw new Error(`Failed to fetch account brands: ${accountBrandsError.message}`);
        }

        // Combine and deduplicate brands
        const directBrands = userBrands?.map(ub => ub.brand).filter(Boolean) ?? [];
        const allAccountBrands = accountBrands ?? [];

        const brandMap = new Map();

        // Add direct brands first
        directBrands.forEach(brand => {
          if (brand) {
            brandMap.set(brand.id, brand);
          }
        });

        // Add account brands if user is owner/admin
        if (profile?.account_role && ['owner', 'admin'].includes(profile.account_role)) {
          allAccountBrands.forEach((brand: { id: number; name: string; account: string }) => {
            brandMap.set(brand.id, brand);
          });
        }

        return Array.from(brandMap.values());
      } catch (error) {
        console.error('[@novansa/auth] Error fetching user brands:', error);
        return [];
      }
    },
    [supabase],
  );

  // Main fetch function
  const fetchUserData = useCallback(
    async (force = false) => {
      console.log(
        '[@novansa/auth] UserProvider fetchUserData called - user:',
        user?.email,
        'force:',
        force,
      );

      if (!user || (!force && enableCaching && Date.now() - lastFetch < cacheTimeout)) {
        console.log('[@novansa/auth] UserProvider skipping fetch - no user or cache valid');
        return;
      }

      console.log('[@novansa/auth] UserProvider starting data fetch');
      setLoading(true);
      setError(null);

      try {
        // Use profile from AuthProvider if available and recent
        let currentProfile = null;

        if (!currentProfile || force) {
          console.log('[@novansa/auth] UserProvider fetching profile for auth_id:', user.id);

          // Fetch fresh profile data
          const { data, error: profileError } = await supabase
            .from('v_user_profile_with_account_and_subscription')
            .select('*')
            .eq('auth_id', user.id)
            .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows gracefully

          console.log('[@novansa/auth] UserProvider profile query result:', {
            data: !!data,
            error: profileError,
          });

          if (profileError) {
            console.error('[@novansa/auth] Profile fetch error:', profileError);
            setError(new UserProfileError('Failed to fetch user profile', profileError));
            setLoading(false);
            return;
          }

          if (!data) {
            console.warn('[@novansa/auth] No user profile found for auth_id:', user.id);
            setError(new UserProfileError('User profile not found. Please contact support.'));
            setLoading(false);
            return;
          }

          currentProfile = data as UserProfile;
          console.log('[@novansa/auth] UserProvider profile loaded:', {
            id: currentProfile.id,
            email: currentProfile.email,
            account: currentProfile.account,
            app_access: currentProfile.app_access,
            active: currentProfile.active,
          });

          // Check if user is deactivated (active === false)
          // Note: active defaults to true, so we only sign out if explicitly false
          if (currentProfile.active === false) {
            console.log('[@novansa/auth] User is deactivated:', currentProfile.email);

            // Sign out the deactivated user
            try {
              await signOut();
            } catch (e) {
              console.error('[@novansa/auth] Error signing out deactivated user:', e);
            }

            // Set error state
            setError(
              new UserProfileError(
                'Your account has been deactivated. Please contact your account administrator.',
              ),
            );
            setProfile(null);
            setBrands(null);
            setLoading(false);
            return;
          }
        }

        setProfile(currentProfile);
        onUserProfileChange?.(currentProfile);

        // Fetch brands if user has an account
        if (currentProfile?.account && currentProfile?.id) {
          console.log(
            '[@novansa/auth] UserProvider fetching brands for account:',
            currentProfile.account,
          );
          const userBrands = await fetchUserBrands(currentProfile.account, currentProfile.id);
          console.log('[@novansa/auth] UserProvider brands loaded:', userBrands.length);
          setBrands(userBrands);
        } else {
          console.log('[@novansa/auth] UserProvider no account - setting empty brands');
          setBrands([]);
        }

        setLastFetch(Date.now());
        console.log('[@novansa/auth] UserProvider fetch completed successfully');
      } catch (err) {
        const error =
          err instanceof UserProfileError
            ? err
            : new UserProfileError('Failed to load user data', err as Error);

        console.error('[@novansa/auth] Error fetching user data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [user, enableCaching, cacheTimeout, lastFetch, supabase, signOut, onUserProfileChange, fetchUserBrands],
  );

  // UserProvider now manages profile independently - no sync needed

  // Initial load and user changes
  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setProfile(null);
      setBrands(null);
      setError(null);
      setLoading(false);
    }
  }, [user, fetchUserData]);

  // Realtime subscription for user_profile changes
  useEffect(() => {
    if (!profile?.id) {
      // Cleanup any existing subscription
      if (realtimeChannelRef.current) {
        realtimeChannelRef.current.unsubscribe();
        realtimeChannelRef.current = null;
      }
      return;
    }

    // Subscribe to changes for this user's profile
    const channel = supabase
      .channel(`user_profile:${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profile',
          filter: `id=eq.${profile.id}`,
        },
        async (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          console.log('[@novansa/auth] User profile realtime update:', payload);

          const newProfile = payload.new as UserProfile;

          // Check if user has been deactivated
          if (newProfile.active === false) {
            console.log('[@novansa/auth] User deactivated via realtime - signing out');
            try {
              await signOut();
            } catch (e) {
              console.error('[@novansa/auth] Error signing out deactivated user:', e);
            }
            setError(
              new UserProfileError(
                'Your account has been deactivated. Please contact your account administrator.',
              ),
            );
            setProfile(null);
            setBrands(null);
            return;
          }

          // Update profile with new data
          setProfile(newProfile);
          onUserProfileChange?.(newProfile);
        },
      )
      .subscribe((status: `${REALTIME_SUBSCRIBE_STATES}`) => {
        console.log('[@novansa/auth] Realtime subscription status:', status);
      });

    realtimeChannelRef.current = channel;

    return () => {
      channel.unsubscribe();
      realtimeChannelRef.current = null;
    };
  }, [profile?.id, supabase, signOut, onUserProfileChange]);

  // Compute verification state from profile
  const verificationState: VerificationState | null = useMemo(() => {
    if (!profile) return null;

    return {
      email: {
        value: profile.email ?? null,
        verified: profile.email_verified ?? false,
        pending: profile.email_pending ?? null,
        pendingVerified: profile.email_pending_verified ?? false,
      },
      phone: {
        value: profile.phone ?? null,
        verified: profile.phone_verified ?? false,
        pending: profile.phone_pending ?? null,
        pendingVerified: profile.phone_pending_verified ?? false,
      },
      isFullyVerified: (profile.email_verified ?? false) && (profile.phone_verified ?? false),
    };
  }, [profile]);

  const isFullyVerified = useMemo(() => {
    return verificationState?.isFullyVerified ?? false;
  }, [verificationState]);

  // Verification methods
  const updatePendingEmail = useCallback(
    async (email: string): Promise<void> => {
      if (!profile?.id) {
        throw new UserProfileError('No user profile available');
      }

      const { error } = await supabase
        .from('user_profile')
        .update({ email_pending: email.trim() })
        .eq('id', profile.id);

      if (error) {
        throw new UserProfileError('Failed to update pending email', error);
      }

      // Profile will update via realtime subscription
    },
    [profile?.id, supabase],
  );

  const updatePendingPhone = useCallback(
    async (phone: string): Promise<void> => {
      if (!profile?.id) {
        throw new UserProfileError('No user profile available');
      }

      const { error } = await supabase
        .from('user_profile')
        .update({ phone_pending: phone.trim() })
        .eq('id', profile.id);

      if (error) {
        throw new UserProfileError('Failed to update pending phone', error);
      }

      // Profile will update via realtime subscription
    },
    [profile?.id, supabase],
  );

  const cancelPendingChange = useCallback(
    async (type: 'email' | 'phone'): Promise<void> => {
      if (!profile?.id) {
        throw new UserProfileError('No user profile available');
      }

      const updateData =
        type === 'email'
          ? { email_pending: null, email_pending_verified: false }
          : { phone_pending: null, phone_pending_verified: false };

      const { error } = await supabase.from('user_profile').update(updateData).eq('id', profile.id);

      if (error) {
        throw new UserProfileError(`Failed to cancel pending ${type} change`, error);
      }

      // Profile will update via realtime subscription
    },
    [profile?.id, supabase],
  );

  const markContactVerified = useCallback(
    async (type: 'email' | 'phone' | 'pending_email' | 'pending_phone'): Promise<void> => {
      if (!profile?.id) {
        throw new UserProfileError('No user profile available');
      }

      let updateData: Record<string, boolean>;
      switch (type) {
        case 'email':
          updateData = { email_verified: true };
          break;
        case 'phone':
          updateData = { phone_verified: true };
          break;
        case 'pending_email':
          // Setting pending_verified to true triggers the database trigger
          // which promotes the pending email to current
          updateData = { email_pending_verified: true };
          break;
        case 'pending_phone':
          // Setting pending_verified to true triggers the database trigger
          // which promotes the pending phone to current
          updateData = { phone_pending_verified: true };
          break;
      }

      const { error } = await supabase.from('user_profile').update(updateData).eq('id', profile.id);

      if (error) {
        throw new UserProfileError(`Failed to mark ${type} as verified`, error);
      }

      // Profile will update via realtime subscription
    },
    [profile?.id, supabase],
  );

  const updateSelectedBrand = useCallback(
    async (brandId: number | null): Promise<void> => {
      if (!profile?.id) {
        throw new UserProfileError('No user profile available');
      }

      const { error } = await supabase
        .from('user_profile')
        .update({ selected_brand: brandId })
        .eq('id', profile.id);

      if (error) {
        throw new UserProfileError('Failed to update selected brand', error);
      }

      // Profile will update via realtime subscription
    },
    [profile?.id, supabase],
  );

  // Permission helpers
  const hasAppAccess = useCallback(
    (app: AppName): boolean => {
      if (!profile?.app_access) return false;
      return profile.app_access.includes(app);
    },
    [profile?.app_access],
  );

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!profile?.account_role) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(profile.account_role);
    },
    [profile?.account_role],
  );

  const isAdmin = useMemo(() => {
    return hasRole(['owner', 'admin']) || !!profile?.app_admin;
  }, [hasRole, profile?.app_admin]);

  const isOwner = useMemo(() => {
    return hasRole('owner');
  }, [hasRole]);

  const canEdit = useMemo(() => {
    return hasRole(['owner', 'admin', 'editor']);
  }, [hasRole]);

  const canView = useMemo(() => {
    return hasRole(['owner', 'admin', 'editor', 'viewer']);
  }, [hasRole]);

  // Refresh function
  const refetch = useCallback(async () => {
    await fetchUserData(true);
  }, [fetchUserData]);

  // Context value
  const contextValue: UserContextType = useMemo(
    () => ({
      profile,
      brands,
      loading,
      error,
      refetch,
      hasAppAccess,
      hasRole,
      isAdmin,
      isOwner,
      canEdit,
      canView,
      // Verification state and methods
      verificationState,
      isFullyVerified,
      updatePendingEmail,
      updatePendingPhone,
      cancelPendingChange,
      markContactVerified,
      // Brand selection
      updateSelectedBrand,
    }),
    [
      profile,
      brands,
      loading,
      error,
      refetch,
      hasAppAccess,
      hasRole,
      isAdmin,
      isOwner,
      canEdit,
      canView,
      verificationState,
      isFullyVerified,
      updatePendingEmail,
      updatePendingPhone,
      cancelPendingChange,
      markContactVerified,
      updateSelectedBrand,
    ],
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}
