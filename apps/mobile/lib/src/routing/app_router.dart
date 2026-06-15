import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../data/models/coach_persona.dart';
import '../data/models/system_config.dart';
import '../data/providers/current_coach_provider.dart' as convex_coach;
import '../data/providers/system_config_provider.dart';
import '../features/auth/data/auth_state.dart';
import '../features/auth/data/clerk_auth_notifier.dart';
import '../features/auth/presentation/auth_screen.dart';
import '../features/coach/presentation/coach_screen.dart';
import '../features/gating/presentation/offline_screen.dart';
import '../features/gating/presentation/update_required_screen.dart';
import '../features/onboarding/presentation/coach_picker_screen.dart';
import '../features/settings/presentation/settings_about_screen.dart';
import '../features/settings/presentation/settings_debug_screen.dart';
import '../features/settings/presentation/settings_health_screen.dart';
import '../features/settings/presentation/settings_hub_screen.dart';
import '../features/settings/presentation/settings_preferences_screen.dart';
import '../features/settings/presentation/settings_profile_screen.dart';
import '../features/settings/presentation/settings_subscription_screen.dart';
import '../features/shell/presentation/app_shell.dart';
import '../features/shell/presentation/directional_shell_stack.dart';
import '../features/social/presentation/social_screen.dart';
import '../features/stats/presentation/stats_screen.dart';
import 'app_routes.dart';

part 'app_router.g.dart';

final _rootKey = GlobalKey<NavigatorState>(debugLabel: 'root');
final _coachBranchKey = GlobalKey<NavigatorState>(debugLabel: 'coach-branch');
final _statsBranchKey = GlobalKey<NavigatorState>(debugLabel: 'stats-branch');
final _socialBranchKey = GlobalKey<NavigatorState>(debugLabel: 'social-branch');
final _settingsBranchKey =
    GlobalKey<NavigatorState>(debugLabel: 'settings-branch');

@Riverpod(keepAlive: true)
GoRouter appRouter(Ref ref) {
  // Build the router exactly once. Changes to auth / system_config poke
  // refreshListenable so go_router re-runs redirect against freshly
  // read state — rebuilding the GoRouter itself would collide on the
  // top-level navigator keys.
  final refresh = ValueNotifier<int>(0);
  ref.listen(clerkAuthProvider, (_, _) => refresh.value++);
  ref.listen(systemConfigProvider, (_, _) => refresh.value++);
  ref.listen(convex_coach.currentCoachPersonaProvider, (_, _) => refresh.value++);
  ref.onDispose(refresh.dispose);

  return GoRouter(
    navigatorKey: _rootKey,
    initialLocation: AppPaths.coach,
    debugLogDiagnostics: true,
    refreshListenable: refresh,
    redirect: (context, state) {
      final auth = ref.read(clerkAuthProvider);
      final systemConfig = ref.read(systemConfigProvider).asData?.value;
      // currentCoachPersona loads asynchronously; while it's still in
      // `loading` we hold the user where they are rather than bouncing.
      final coachAsync = ref.read(convex_coach.currentCoachPersonaProvider);
      return _redirect(auth, systemConfig, coachAsync, state);
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
      GoRoute(
        path: AppPaths.onboardingCoach,
        name: AppRoute.onboardingCoach.name,
        builder: (context, _) => CoachPickerScreen(
          onPicked: (_) => context.goNamed(AppRoute.coach.name),
        ),
      ),
      // Each tab is its own branch with its own Navigator. State (e.g.
      // a deep link into Settings → Debug) survives tab switches; tab
      // transitions can render both branches at once because they share
      // no widget keys.
      StatefulShellRoute(
        builder: (_, _, navigationShell) =>
            AppShell(navigationShell: navigationShell),
        navigatorContainerBuilder: (_, navigationShell, children) =>
            DirectionalShellStack(
          currentIndex: navigationShell.currentIndex,
          children: children,
        ),
        branches: [
          StatefulShellBranch(
            navigatorKey: _coachBranchKey,
            routes: [
              GoRoute(
                path: AppPaths.coach,
                name: AppRoute.coach.name,
                builder: (_, _) => const CoachScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _statsBranchKey,
            routes: [
              GoRoute(
                path: AppPaths.stats,
                name: AppRoute.stats.name,
                builder: (_, _) => const StatsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _socialBranchKey,
            routes: [
              GoRoute(
                path: AppPaths.social,
                name: AppRoute.social.name,
                builder: (_, _) => const SocialScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _settingsBranchKey,
            routes: [
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
                    path: AppPaths.settingsCoach,
                    name: AppRoute.settingsCoach.name,
                    builder: (_, _) => const CoachPickerScreen(),
                  ),
                  GoRoute(
                    path: AppPaths.settingsHealth,
                    name: AppRoute.settingsHealth.name,
                    builder: (_, _) => const SettingsHealthScreen(),
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
      ),
    ],
  );
}

String? _redirect(
  AuthState auth,
  SystemConfig? systemConfig,
  AsyncValue<CoachPersona?> coachAsync,
  GoRouterState state,
) {
  final loc = state.matchedLocation;

  if (systemConfig != null && !systemConfig.available) {
    return loc == AppPaths.offline ? null : AppPaths.offline;
  }

  final onAuthScreen = loc == AppPaths.auth;
  final onOnboardingCoach = loc == AppPaths.onboardingCoach;

  switch (auth) {
    case AuthLoggedOut():
    case AuthAwaitingCode():
      return onAuthScreen ? null : AppPaths.auth;
    case AuthLoggedIn():
      // Hold position while currentCoach is still loading — don't bounce.
      if (coachAsync is! AsyncData<CoachPersona?>) return null;
      final coach = coachAsync.value;
      if (coach == null) {
        // Logged in but no coach assignment yet → onboarding.
        return onOnboardingCoach ? null : AppPaths.onboardingCoach;
      }
      // Has a coach: keep auth/onboarding/offline/update-required from
      // sticking around.
      if (onAuthScreen ||
          onOnboardingCoach ||
          loc == AppPaths.offline ||
          loc == AppPaths.updateRequired) {
        return AppPaths.coach;
      }
      return null;
  }
}
