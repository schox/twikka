import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/data/auth_state.dart';
import '../../auth/data/fake_auth_notifier.dart';
import '../../coach/data/chat_notifier.dart';

class SettingsDebugScreen extends ConsumerWidget {
  const SettingsDebugScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(fakeAuthProvider);
    final onboardingComplete = auth is AuthLoggedIn ? auth.onboardingComplete : false;
    return Scaffold(
      appBar: AppBar(title: const Text('Debug')),
      body: ListView(
        children: [
          SwitchListTile(
            value: onboardingComplete,
            onChanged: (v) async {
              if (v) {
                await ref.read(fakeAuthProvider.notifier).completeOnboarding();
              } else {
                final current = ref.read(fakeAuthProvider);
                if (current is AuthLoggedIn) {
                  await ref.read(fakeAuthProvider.notifier).signOut();
                  await ref.read(fakeAuthProvider.notifier).requestSignupCode(
                        email: current.email,
                        displayName: current.displayName,
                      );
                  await ref.read(fakeAuthProvider.notifier).verifyCode('000000');
                }
              }
              ref.read(chatProvider.notifier).reset();
            },
            title: const Text('Onboarding complete'),
            subtitle: const Text(
              'Toggle to switch the coach greeting between onboarding and the daily check-in conversation.',
            ),
          ),
          ListTile(
            leading: const Icon(Icons.refresh),
            title: const Text('Reset chat'),
            onTap: () => ref.read(chatProvider.notifier).reset(),
          ),
        ],
      ),
    );
  }
}
