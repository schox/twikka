import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/extensions/responsive.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/twikka_icons.dart';
import '../../../routing/app_routes.dart';

/// Bottom-nav / rail wrapper around the four StatefulShellRoute
/// branches. The shell itself just renders the navigationShell — the
/// directional slide animation lives in DirectionalShellStack which
/// go_router calls via navigatorContainerBuilder.
class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  static const _destinations = <_NavDestination>[
    _NavDestination(
      route: AppRoute.coach,
      label: 'Coach',
      icon: TwikkaIcons.chatOutline,
      selectedIcon: TwikkaIcons.chatSelected,
    ),
    _NavDestination(
      route: AppRoute.stats,
      label: 'Progress',
      icon: TwikkaIcons.chartOutline,
      selectedIcon: TwikkaIcons.chartSelected,
    ),
    _NavDestination(
      route: AppRoute.social,
      label: 'Social',
      icon: TwikkaIcons.peopleOutline,
      selectedIcon: TwikkaIcons.peopleSelected,
    ),
    _NavDestination(
      route: AppRoute.settings,
      label: 'Settings',
      icon: TwikkaIcons.settingsOutline,
      selectedIcon: TwikkaIcons.settingsSelected,
    ),
  ];

  void _onSelect(int index) {
    // initialLocation: true on a re-tap pops the branch's stack back to
    // its root (e.g. tapping Settings while you're inside Settings →
    // Debug returns to the hub). Standard tab UX.
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isExpanded = context.isExpanded;
    final selected = navigationShell.currentIndex;

    if (isExpanded) {
      return Scaffold(
        body: Row(
          children: [
            NavigationRail(
              selectedIndex: selected,
              onDestinationSelected: _onSelect,
              labelType: NavigationRailLabelType.all,
              destinations: [
                for (final d in _destinations)
                  NavigationRailDestination(
                    icon: Icon(d.icon),
                    selectedIcon: Icon(d.selectedIcon),
                    label: Text(d.label),
                  ),
              ],
              leading: Padding(
                padding: const EdgeInsets.symmetric(vertical: gap4),
                child: Image.asset(
                  'assets/icons/twikka_icon_nbg.png',
                  width: kRailIconSize,
                  height: kRailIconSize,
                  semanticLabel: 'Twikka',
                ),
              ),
            ),
            VerticalDivider(width: 0.5, color: theme.colorScheme.outline),
            Expanded(child: navigationShell),
          ],
        ),
      );
    }

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: selected,
        onDestinationSelected: _onSelect,
        destinations: [
          for (final d in _destinations)
            NavigationDestination(
              icon: Icon(d.icon),
              selectedIcon: Icon(d.selectedIcon),
              label: d.label,
            ),
        ],
      ),
    );
  }
}

class _NavDestination {
  const _NavDestination({
    required this.route,
    required this.label,
    required this.icon,
    required this.selectedIcon,
  });

  final AppRoute route;
  final String label;
  final IconData icon;
  final IconData selectedIcon;
}
