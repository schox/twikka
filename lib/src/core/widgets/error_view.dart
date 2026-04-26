import 'package:flutter/material.dart';

import '../theme/theme_constants.dart';
import '../theme/twikka_icons.dart';

class ErrorView extends StatelessWidget {
  const ErrorView({super.key, required this.message, this.onRetry});

  final String message;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(gap5),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(TwikkaIcons.errorCircle, size: 36, color: twError),
            const SizedBox(height: gap4),
            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: gap4),
              FilledButton.tonal(onPressed: onRetry, child: const Text('Try again')),
            ],
          ],
        ),
      ),
    );
  }
}
