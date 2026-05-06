import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/branding/twikka_avatars.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/twikka_icons.dart';
import '../../../core/widgets/centered.dart';
import '../../../core/widgets/notifications_bell.dart';
import '../../../data/providers/current_user_provider.dart';
import '../../../routing/app_routes.dart';
import '../../auth/data/auth_state.dart';
import '../../auth/data/clerk_auth_notifier.dart';

class SettingsHubScreen extends ConsumerWidget {
  const SettingsHubScreen({super.key});

  static const _items = <_SettingsItem>[
    _SettingsItem(route: AppRoute.settingsProfile, icon: TwikkaIcons.profile,
        label: 'Profile', subtitle: 'Name, photo, bio'),
    _SettingsItem(route: AppRoute.settingsCoach, icon: TwikkaIcons.coach,
        label: 'Coach', subtitle: 'Pick or change your coach'),
    _SettingsItem(route: AppRoute.settingsHealth, icon: TwikkaIcons.timezone,
        label: 'Health', subtitle: 'Connect Apple Health / Health Connect'),
    _SettingsItem(route: AppRoute.settingsPreferences, icon: TwikkaIcons.preferences,
        label: 'Preferences', subtitle: 'Theme, notifications, units'),
    _SettingsItem(route: AppRoute.settingsSubscription, icon: TwikkaIcons.subscription,
        label: 'Subscription', subtitle: 'Plan, billing'),
    _SettingsItem(route: AppRoute.settingsAbout, icon: TwikkaIcons.about,
        label: 'About', subtitle: 'Version, legal, support'),
  ];

  // Tester-only entry. Operator flips users.tester = true in Convex
  // dashboard for accounts that should see the Debug panel.
  static const _testerItem = _SettingsItem(
    route: AppRoute.settingsDebug,
    icon: TwikkaIcons.debug,
    label: 'Debug',
    subtitle: 'Tester tools',
  );

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(clerkAuthProvider);
    final user = auth is AuthLoggedIn ? auth : null;
    final convexUser = ref.watch(currentUserProvider).asData?.value;
    final showDebug = convexUser?.tester == true;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        actions: const [NotificationsBell()],
      ),
      body: Centered.content(
        child: ListView(
        padding: const EdgeInsets.symmetric(vertical: gap2),
        children: [
          if (user != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(gap4, gap3, gap4, gap3),
              child: Row(
                children: [
                  PersonAvatar(
                    id: user.email,
                    name: user.displayName,
                    photoUrl: convexUser?.photoUrl,
                    cacheKey: convexUser?.photoCacheKey,
                    size: avatarPortrait,
                  ),
                  const SizedBox(width: gap4),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(user.displayName, style: theme.textTheme.titleLarge),
                        const SizedBox(height: 2),
                        Text(user.email, style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          const Divider(),
          for (final item in [..._items, if (showDebug) _testerItem])
            ListTile(
              leading: Icon(item.icon),
              title: Text(item.label),
              subtitle: Text(item.subtitle),
              trailing: Icon(
                TwikkaIcons.chevronRight,
                color: context.tw.muted2,
              ),
              onTap: () => context.goNamed(item.route.name),
            ),
          const Divider(),
          ListTile(
            leading: Icon(
              TwikkaIcons.signOut,
              color: theme.colorScheme.error,
            ),
            title: Text(
              'Sign out',
              style: TextStyle(color: theme.colorScheme.error),
            ),
            onTap: () => ref.read(clerkAuthProvider.notifier).signOut(),
          ),
        ],
        ),
      ),
    );
  }
}

class _SettingsItem {
  const _SettingsItem({
    required this.route,
    required this.icon,
    required this.label,
    required this.subtitle,
  });

  final AppRoute route;
  final IconData icon;
  final String label;
  final String subtitle;
}
