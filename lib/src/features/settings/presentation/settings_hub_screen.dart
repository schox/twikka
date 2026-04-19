import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/branding/abstract_avatar.dart';
import '../../../core/theme/theme_constants.dart';
import '../../../core/widgets/notifications_bell.dart';
import '../../../routing/app_routes.dart';
import '../../auth/data/auth_state.dart';
import '../../auth/data/clerk_auth_notifier.dart';
import '../../coach/data/coach.dart';

class SettingsHubScreen extends ConsumerWidget {
  const SettingsHubScreen({super.key});

  static const _items = <_SettingsItem>[
    _SettingsItem(route: AppRoute.settingsProfile, icon: Icons.person_outline,
        label: 'Profile', subtitle: 'Name, photo, bio'),
    _SettingsItem(route: AppRoute.settingsPreferences, icon: Icons.tune,
        label: 'Preferences', subtitle: 'Theme, notifications, units'),
    _SettingsItem(route: AppRoute.settingsSubscription, icon: Icons.workspace_premium_outlined,
        label: 'Subscription', subtitle: 'Plan, billing'),
    _SettingsItem(route: AppRoute.settingsAbout, icon: Icons.info_outline,
        label: 'About', subtitle: 'Version, legal, support'),
    _SettingsItem(route: AppRoute.settingsDebug, icon: Icons.bug_report_outlined,
        label: 'Debug', subtitle: 'Developer tools'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(clerkAuthProvider);
    final user = auth is AuthLoggedIn ? auth : null;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        actions: const [NotificationsBell()],
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: gap2),
        children: [
          if (user != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(gap4, gap3, gap4, gap3),
              child: Row(
                children: [
                  AbstractAvatar(
                    palette: defaultCoach.palette,
                    monogram: _initials(user.displayName),
                    size: 56,
                    ring: true,
                  ),
                  const SizedBox(width: gap4),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(user.displayName, style: theme.textTheme.titleLarge),
                        const SizedBox(height: 2),
                        Text(user.email, style: theme.textTheme.bodyMedium?.copyWith(color: twMuted)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          const Divider(),
          for (final item in _items)
            ListTile(
              leading: Icon(item.icon),
              title: Text(item.label),
              subtitle: Text(item.subtitle),
              trailing: const Icon(Icons.chevron_right, color: twMuted2),
              onTap: () => context.goNamed(item.route.name),
            ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: twError),
            title: const Text('Sign out', style: TextStyle(color: twError)),
            onTap: () => ref.read(clerkAuthProvider.notifier).signOut(),
          ),
        ],
      ),
    );
  }
}

String _initials(String name) {
  final parts = name.trim().split(RegExp(r'\s+'));
  if (parts.isEmpty) return '?';
  if (parts.length == 1) return parts.first.substring(0, 1).toUpperCase();
  return (parts.first.substring(0, 1) + parts.last.substring(0, 1)).toUpperCase();
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
