import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../data/models/system_config.dart';
import '../data/providers/system_config_provider.dart';
import '../features/auth/data/auth_state.dart';
import '../features/auth/data/clerk_auth_notifier.dart';
import '../features/auth/presentation/auth_screen.dart';
import '../features/coach/presentation/coach_screen.dart';
import '../features/gating/presentation/offline_screen.dart';
import '../features/gating/presentation/update_required_screen.dart';
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
  // Build the router exactly once. Changes to auth / system_config poke
  // refreshListenable so go_router re-runs redirect against freshly read state
  // — rebuilding the GoRouter itself would collide on _rootKey/_shellKey.
  final refresh = ValueNotifier<int>(0);
  ref.listen(clerkAuthProvider, (_, _) => refresh.value++);
  ref.listen(systemConfigProvider, (_, _) => refresh.value++);
  ref.onDispose(refresh.dispose);

  return GoRouter(
    navigatorKey: _rootKey,
    initialLocation: AppPaths.coach,
    debugLogDiagnostics: true,
    refreshListenable: refresh,
    redirect: (context, state) {
      final auth = ref.read(clerkAuthProvider);
      final systemConfig = ref.read(systemConfigProvider).asData?.value;
      return _redirect(auth, systemConfig, state);
    },
    routes: [
      GoRoute(
        path: AppPaths.offline,
        name: AppRoute.offline.name,
        builder: (_, _) => const OfflineScreen(),
      ),
      GoRoute(
        path: AppPaths.updateRequired,
        name: AppRoute.updateRequired.name,
        builder: (_, _) => const UpdateRequiredScreen(),
      ),
      GoRoute(
        path: AppPaths.auth,
        name: AppRoute.auth.name,
        builder: (_, _) => const AuthScreen(),
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

String? _redirect(
  AuthState auth,
  SystemConfig? systemConfig,
  GoRouterState state,
) {
  final loc = state.matchedLocation;

  if (systemConfig != null && !systemConfig.available) {
    return loc == AppPaths.offline ? null : AppPaths.offline;
  }

  final onAuthScreen = loc == AppPaths.auth;

  switch (auth) {
    case AuthLoggedOut():
    case AuthAwaitingCode():
      return onAuthScreen ? null : AppPaths.auth;
    case AuthLoggedIn():
      if (onAuthScreen ||
          loc == AppPaths.offline ||
          loc == AppPaths.updateRequired) {
        return AppPaths.coach;
      }
      return null;
  }
}
