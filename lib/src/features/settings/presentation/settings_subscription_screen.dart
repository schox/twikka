import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/centered.dart';

class SettingsSubscriptionScreen extends StatelessWidget {
  const SettingsSubscriptionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Subscription')),
      body: Centered.content(
        child: Padding(
        padding: const EdgeInsets.all(gap4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(gap4),
              decoration: BoxDecoration(
                color: context.tw.accentTint,
                borderRadius: BorderRadius.circular(radiusLg),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Free plan', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 4),
                  Text(
                    'Unlimited coach chat. We’ll let you know if there’s ever a reason to pay.',
                    style: theme.textTheme.bodyMedium?.copyWith(color: context.tw.ink2, height: 1.45),
                  ),
                ],
              ),
            ),
            const SizedBox(height: gap5),
            FilledButton(
              onPressed: () {},
              child: const Text('Manage subscription'),
            ),
          ],
        ),
        ),
      ),
    );
  }
}
