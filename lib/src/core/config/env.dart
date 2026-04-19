class AppEnv {
  AppEnv._();

  static const convexUrl = String.fromEnvironment(
    'CONVEX_URL',
    defaultValue: 'https://impressive-hamster-42.eu-west-1.convex.cloud',
  );

  static const clientId = String.fromEnvironment(
    'CONVEX_CLIENT_ID',
    defaultValue: 'twikka-flutter-dev',
  );

  static const clerkPublishableKey = String.fromEnvironment(
    'CLERK_PUBLISHABLE_KEY',
  );
}
