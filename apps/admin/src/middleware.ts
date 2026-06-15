import { createAdminAuthMiddleware } from '@novansa/auth/server';

// Configure middleware for twikka-admin with the 'twikka' Supabase instance
export const middleware = createAdminAuthMiddleware({
  instance: 'twikka',
  additionalRoutes: [],
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
