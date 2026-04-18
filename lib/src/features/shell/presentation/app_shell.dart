import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/extensions/responsive.dart';
import '../../../core/theme/theme_constants.dart';
import '../../../routing/app_routes.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.child});

  final Widget child;

  static const _destinations = <_NavDestination>[
    _NavDestination(
      route: AppRoute.coach,
      path: AppPaths.coach,
      label: 'Coach',
      icon: Icons.chat_bubble_outline,
      selectedIcon: Icons.chat_bubble,
    ),
    _NavDestination(
      route: AppRoute.stats,
      path: AppPaths.stats,
      label: 'Progress',
      icon: Icons.show_chart_outlined,
      selectedIcon: Icons.show_chart,
    ),
    _NavDestination(
      route: AppRoute.social,
      path: AppPaths.social,
      label: 'Social',
      icon: Icons.people_outline,
      selectedIcon: Icons.people,
    ),
    _NavDestination(
      route: AppRoute.settings,
      path: AppPaths.settings,
      label: 'Settings',
      icon: Icons.settings_outlined,
      selectedIcon: Icons.settings,
    ),
  ];

  int _selectedIndex(BuildContext context) {
    final loc = GoRouterState.of(context).uri.path;
    final idx = _destinations.indexWhere((d) => loc.startsWith(d.path));
    return idx == -1 ? 0 : idx;
  }

  void _onSelect(BuildContext context, int index) {
    context.goNamed(_destinations[index].route.name);
  }

  @override
  Widget build(BuildContext context) {
    final isExpanded = context.isExpanded;
    final selected = _selectedIndex(context);

    if (isExpanded) {
      return Scaffold(
        body: Row(
          children: [
            NavigationRail(
              selectedIndex: selected,
              onDestinationSelected: (i) => _onSelect(context, i),
              labelType: NavigationRailLabelType.all,
              destinations: [
                for (final d in _destinations)
                  NavigationRailDestination(
                    icon: Icon(d.icon),
                    selectedIcon: Icon(d.selectedIcon),
                    label: Text(d.label),
                  ),
              ],
              leading: const Padding(
                padding: EdgeInsets.symmetric(vertical: gap4),
                child: Text(
                  'Twikka',
                  style: TextStyle(
                    fontFamily: 'Fraunces',
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                    color: twAccent,
                  ),
                ),
              ),
            ),
            const VerticalDivider(width: 0.5, color: twHairline),
            Expanded(child: child),
          ],
        ),
      );
    }

    return Scaffold(
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: selected,
        onDestinationSelected: (i) => _onSelect(context, i),
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
    required this.path,
    required this.label,
    required this.icon,
    required this.selectedIcon,
  });

  final AppRoute route;
  final String path;
  final String label;
  final IconData icon;
  final IconData selectedIcon;
}
