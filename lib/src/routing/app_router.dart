import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../features/auth/data/auth_state.dart';
import '../features/auth/data/fake_auth_notifier.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/signup_screen.dart';
import '../features/auth/presentation/verify_code_screen.dart';
import '../features/auth/presentation/welcome_screen.dart';
import '../features/coach/presentation/coach_screen.dart';
import '../features/settings/presentation/settings_about_screen.dart';
import '../features/settings/presentation/settings_debug_screen.dart';
import '../features/settings/presentation/settings_hub_screen.dart';
import '../features/settings/presentation/settings_preferences_screen.dart';
import '../features/settings/presentation/settings_profile_screen.dart';
import '../features/settings/presentation/settings_subscription_screen.dart';
import '../features/shell/presentation/app_shell.dart';
import '../features/social/presentation/social_screen.dart';
import '../features/stats/presentation/stats_screen.dart';
import 'app_routes.dart';

part 'app_router.g.dart';

final _rootKey = GlobalKey<NavigatorState>(debugLabel: 'root');
final _shellKey = GlobalKey<NavigatorState>(debugLabel: 'shell');

@Riverpod(keepAlive: true)
GoRouter appRouter(Ref ref) {
  final auth = ref.watch(fakeAuthProvider);

  return GoRouter(
    navigatorKey: _rootKey,
    initialLocation: AppPaths.coach,
    debugLogDiagnostics: true,
    redirect: (context, state) => _redirect(auth, state),
    routes: [
      GoRoute(
        path: AppPaths.welcome,
        name: AppRoute.welcome.name,
        builder: (_, _) => const WelcomeScreen(),
      ),
      GoRoute(
        path: AppPaths.login,
        name: AppRoute.login.name,
        builder: (_, _) => const LoginScreen(),
      ),
      GoRoute(
        path: AppPaths.signup,
        name: AppRoute.signup.name,
        builder: (_, _) => const SignupScreen(),
      ),
      GoRoute(
        path: AppPaths.verifyCode,
        name: AppRoute.verifyCode.name,
        builder: (_, _) => const VerifyCodeScreen(),
      ),
      ShellRoute(
        navigatorKey: _shellKey,
        builder: (_, _, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: AppPaths.coach,
            name: AppRoute.coach.name,
            builder: (_, _) => const CoachScreen(),
          ),
          GoRoute(
            path: AppPaths.stats,
            name: AppRoute.stats.name,
            builder: (_, _) => const StatsScreen(),
          ),
          GoRoute(
            path: AppPaths.social,
            name: AppRoute.social.name,
            builder: (_, _) => const SocialScreen(),
          ),
          GoRoute(
            path: AppPaths.settings,
            name: AppRoute.settings.name,
            builder: (_, _) => const SettingsHubScreen(),
            routes: [
              GoRoute(
                path: AppPaths.settingsProfile,
                name: AppRoute.settingsProfile.name,
                builder: (_, _) => const SettingsProfileScreen(),
              ),
              GoRoute(
                path: AppPaths.settingsPreferences,
                name: AppRoute.settingsPreferences.name,
                builder: (_, _) => const SettingsPreferencesScreen(),
              ),
              GoRoute(
                path: AppPaths.settingsSubscription,
                name: AppRoute.settingsSubscription.name,
                builder: (_, _) => const SettingsSubscriptionScreen(),
              ),
              GoRoute(
                path: AppPaths.settingsAbout,
                name: AppRoute.settingsAbout.name,
                builder: (_, _) => const SettingsAboutScreen(),
              ),
              GoRoute(
                path: AppPaths.settingsDebug,
                name: AppRoute.settingsDebug.name,
                builder: (_, _) => const SettingsDebugScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
}

String? _redirect(AuthState auth, GoRouterState state) {
  final loc = state.matchedLocation;
  final onAuthScreen = loc == AppPaths.welcome ||
      loc == AppPaths.login ||
      loc == AppPaths.signup ||
      loc == AppPaths.verifyCode;

  switch (auth) {
    case AuthLoggedOut():
      return onAuthScreen ? null : AppPaths.welcome;
    case AuthAwaitingCode():
      return loc == AppPaths.verifyCode ? null : AppPaths.verifyCode;
    case AuthLoggedIn():
      return onAuthScreen ? AppPaths.coach : null;
  }
}
