import 'package:flutter/material.dart';

import '../theme/theme_constants.dart';

class EmptyState extends StatelessWidget {
  const EmptyState({
    super.key,
    required this.icon,
    required this.title,
    this.description,
    this.action,
  });

  final IconData icon;
  final String title;
  final String? description;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(gap5),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 36, color: twMuted2),
            const SizedBox(height: gap4),
            Text(title, style: theme.textTheme.titleMedium, textAlign: TextAlign.center),
            if (description != null) ...[
              const SizedBox(height: gap1),
              Text(
                description!,
                style: theme.textTheme.bodyMedium?.copyWith(color: twMuted),
                textAlign: TextAlign.center,
              ),
            ],
            if (action != null) ...[
              const SizedBox(height: gap4),
              action!,
            ],
          ],
        ),
      ),
    );
  }
}
