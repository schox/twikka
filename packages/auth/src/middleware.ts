import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseInstance } from './types';

export interface AuthMiddlewareConfig {
  /** Array of protected route patterns (e.g., ['/home', '/admin']) */
  protectedRoutes: string[];
  /** Optional public routes that should never redirect to login */
  publicRoutes?: string[];
  /** Enable special logout route handling with cookie clearing */
  enableLogoutHandler?: boolean;
  /** Custom redirect paths */
  redirects?: {
    /** Where to redirect after login (default: '/home') */
    afterLogin?: string;
    /** Where to redirect when not authenticated (default: '/login') */
    loginPage?: string;
  };
  /** Project-specific Supabase auth cookie names for logout cleanup */
  authCookieNames?: string[];
  /** Supabase instance to use (default: 'novansa') */
  instance?: SupabaseInstance;
}

/**
 * Supabase project references for each instance
 * Used to construct auth cookie names (sb-{project-ref}-auth-token)
 */
const SUPABASE_PROJECT_REFS: Record<SupabaseInstance, string> = {
  novansa: 'cpgapeppncrhrfoubqvh',
  'couple-tools': 'vltuinbdgrxygkluhajy',
  twikka: 'twikka', // Update with actual twikka project ref
  // Self-hosted Supabase: cookie ref derived from URL hostname's first label
  // (e.g. https://api.supabase.novansa.com → 'api'). Apps can override via
  // `customCookieNames` in AuthMiddlewareConfig if their setup differs.
  'self-hosted': 'api',
};

/**
 * Get Supabase credentials for middleware based on instance
 */
function getMiddlewareCredentials(instance: SupabaseInstance): { url: string; key: string } {
  switch (instance) {
    case 'novansa':
      return {
        url: process.env.NOVANSA_SUPABASE_URL ?? process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_URL ?? '',
        key: process.env.NOVANSA_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY ?? '',
      };
    case 'couple-tools':
      return {
        url: process.env.COUPLE_TOOLS_SUPABASE_URL ?? process.env.NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_URL ?? '',
        key: process.env.COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY ?? '',
      };
    case 'twikka':
      return {
        url: process.env.TWIKKA_SUPABASE_URL ?? process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_URL ?? '',
        key: process.env.TWIKKA_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY ?? '',
      };
    case 'self-hosted':
      return {
        url: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        key: process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
      };
  }
}

/**
 * Get auth cookie names for a Supabase instance
 */
function getAuthCookieNames(instance: SupabaseInstance): string[] {
  const projectRef = SUPABASE_PROJECT_REFS[instance];
  return [
    `sb-${projectRef}-auth-token`,
    `sb-${projectRef}-auth-token-code-verifier`,
  ];
}

/**
 * Creates a configurable authentication middleware for Next.js apps
 * Handles Supabase SSR authentication, protected routes, and session management
 */
export function createAuthMiddleware(config: AuthMiddlewareConfig) {
  const {
    protectedRoutes,
    publicRoutes = [],
    enableLogoutHandler = false,
    redirects = {},
    authCookieNames: customCookieNames,
    instance = 'novansa',
  } = config;

  const loginPage = redirects.loginPage ?? '/login';
  const afterLoginPage = redirects.afterLogin ?? '/home';

  // Use custom cookie names if provided, otherwise derive from instance
  const authCookieNames = customCookieNames ?? getAuthCookieNames(instance);

  return async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const credentials = getMiddlewareCredentials(instance);
    const supabaseUrl = credentials.url;
    const supabaseKey = credentials.key;

    // Skip auth if Supabase config is missing
    if (supabaseUrl.trim() === '' || supabaseKey.trim() === '') {
      console.warn(`[auth middleware] Missing Supabase credentials for instance: ${instance}`);
      return supabaseResponse;
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    // Validate user via server-side JWT verification
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Handle logout route if enabled
    if (enableLogoutHandler && request.nextUrl.pathname === '/logout') {
      const response = NextResponse.redirect(new URL(loginPage, request.url));

      // Clear project-specific auth cookies if provided
      authCookieNames.forEach(cookieName => {
        response.cookies.delete(cookieName);
      });

      return response;
    }

    // Check if current path is explicitly public
    const isPublicRoute = publicRoutes.some(
      route =>
        request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/'),
    );

    if (isPublicRoute) {
      return supabaseResponse;
    }

    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.some(
      route =>
        request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/'),
    );

    // Redirect to login if accessing protected route without valid user
    if (isProtectedRoute && !user) {
      return NextResponse.redirect(new URL(loginPage, request.url));
    }

    // Redirect to home if accessing login page with valid user
    if (request.nextUrl.pathname === loginPage && user) {
      return NextResponse.redirect(new URL(afterLoginPage, request.url));
    }

    return supabaseResponse;
  };
}

/**
 * Standard matcher configuration for Next.js middleware
 * Excludes static files, images, and Next.js internal routes
 */
export const standardMiddlewareMatcher = [
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - Static assets (svg, png, jpg, etc.)
   */
  '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
];

// Pre-configured middleware factories for common app patterns

interface AdminAuthMiddlewareOptions {
  /** Additional protected routes beyond the defaults */
  additionalRoutes?: string[];
  /** Supabase instance to use (default: 'novansa') */
  instance?: SupabaseInstance;
}

/**
 * Standard auth middleware for admin/dashboard apps
 * @param options - Configuration options or an array of additional routes (for backward compatibility)
 */
export function createAdminAuthMiddleware(
  options: AdminAuthMiddlewareOptions | string[] = [],
): ReturnType<typeof createAuthMiddleware> {
  // Support backward compatibility: if array is passed, treat as additionalRoutes
  const resolvedOptions: AdminAuthMiddlewareOptions = Array.isArray(options)
    ? { additionalRoutes: options }
    : options;

  const { additionalRoutes = [], instance = 'novansa' } = resolvedOptions;

  return createAuthMiddleware({
    protectedRoutes: [
      '/home',
      '/content',
      '/topics',
      '/messaging',
      '/media',
      '/settings',
      '/accounts',
      ...additionalRoutes,
    ],
    enableLogoutHandler: true,
    instance,
  });
}

/**
 * Public website middleware with minimal protected routes
 */
export function createWebsiteAuthMiddleware(protectedRoutes: string[] = []) {
  return createAuthMiddleware({
    protectedRoutes,
    publicRoutes: [
      '/',
      '/about',
      '/services',
      '/team',
      '/contact',
      '/blog',
      '/faq',
      '/privacy-policy',
      '/terms-conditions',
      '/policies',
    ],
  });
}
