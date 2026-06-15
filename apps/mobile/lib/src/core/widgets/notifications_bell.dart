import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import '../theme/twikka_icons.dart';

/// Bell icon shown in every shell tab's header. Tapping it currently shows a
/// stub snackbar — wire to a real notifications surface later.
class NotificationsBell extends StatelessWidget {
  const NotificationsBell({super.key, this.hasUnread = false});

  final bool hasUnread;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: gap1),
      child: IconButton(
        tooltip: 'Notifications',
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Nothing new — we’ll bring things here when they matter.'),
              duration: Duration(seconds: 2),
            ),
          );
        },
        icon: Stack(
          clipBehavior: Clip.none,
          children: [
            const Icon(TwikkaIcons.notifications),
            if (hasUnread)
              Positioned(
                right: -1,
                top: -1,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.primary,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
