import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust tracesSampleRate for production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Integrations
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Filter out development errors
  beforeSend(event, hint) {
    // Filter out errors from browser extensions
    if (
      event.exception?.values?.[0]?.stacktrace?.frames?.some(
        frame =>
          frame.filename?.includes('chrome-extension://') ||
          frame.filename?.includes('moz-extension://'),
      )
    ) {
      return null;
    }

    // Filter out ResizeObserver errors
    if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
      return null;
    }

    return event;
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
});
