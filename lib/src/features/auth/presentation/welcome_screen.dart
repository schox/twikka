import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/theme_constants.dart';
import '../../../routing/app_routes.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: gap5, vertical: gap6),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Center(
                child: Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: twAccentTint,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    't',
                    style: theme.textTheme.displayMedium?.copyWith(
                      color: twAccent,
                      fontWeight: FontWeight.w400,
                      height: 1,
                      fontSize: 56,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: gap5),
              Text(
                'Twikka',
                textAlign: TextAlign.center,
                style: theme.textTheme.displayMedium?.copyWith(color: twInk),
              ),
              const SizedBox(height: gap2),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: gap3),
                child: Text(
                  'A coach in your corner. Quietly there. No streaks, no shouting.',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.bodyLarge?.copyWith(color: twInk2, height: 1.5),
                ),
              ),
              const Spacer(flex: 2),
              FilledButton(
                onPressed: () => context.goNamed(AppRoute.signup.name),
                child: const Text('Create an account'),
              ),
              const SizedBox(height: gap2),
              OutlinedButton(
                onPressed: () => context.goNamed(AppRoute.login.name),
                child: const Text('I already have an account'),
              ),
              const SizedBox(height: gap5),
            ],
          ),
        ),
      ),
    );
  }
}
