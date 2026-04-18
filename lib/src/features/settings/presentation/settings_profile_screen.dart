import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/branding/abstract_avatar.dart';
import '../../../core/theme/theme_constants.dart';
import '../../auth/data/auth_state.dart';
import '../../auth/data/fake_auth_notifier.dart';
import '../../coach/data/coach.dart';

class SettingsProfileScreen extends ConsumerWidget {
  const SettingsProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(fakeAuthProvider);
    final user = auth is AuthLoggedIn ? auth : null;
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(gap4),
        children: [
          Center(
            child: AbstractAvatar(
              palette: defaultCoach.palette,
              size: avatarProfile,
              ring: true,
            ),
          ),
          const SizedBox(height: gap4),
          ListTile(
            leading: const Icon(Icons.badge_outlined),
            title: const Text('Display name'),
            subtitle: Text(user?.displayName ?? '—'),
          ),
          ListTile(
            leading: const Icon(Icons.email_outlined),
            title: const Text('Email'),
            subtitle: Text(user?.email ?? '—'),
          ),
          const ListTile(
            leading: Icon(Icons.notes_outlined),
            title: Text('Bio'),
            subtitle: Text('Add a short bio so people know who you are.'),
          ),
        ],
      ),
    );
  }
}
