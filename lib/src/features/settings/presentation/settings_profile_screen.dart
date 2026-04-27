import 'package:convex_flutter/convex_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/branding/abstract_avatar.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/twikka_icons.dart';
import '../../../core/widgets/centered.dart';
import '../../../data/providers/current_user_provider.dart';
import '../../auth/data/auth_state.dart';
import '../../auth/data/clerk_auth_notifier.dart';
import '../../coach/data/coach.dart';
import 'city_picker_sheet.dart';

class SettingsProfileScreen extends ConsumerWidget {
  const SettingsProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(clerkAuthProvider);
    final authUser = auth is AuthLoggedIn ? auth : null;
    final convexUser = ref.watch(currentUserProvider).asData?.value;
    final city = convexUser?.city;
    final timezone = convexUser?.timezone;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Centered.content(
        child: ListView(
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
            leading: const Icon(TwikkaIcons.displayName),
            title: const Text('Display name'),
            subtitle: Text(authUser?.displayName ?? '\u2014'),
          ),
          ListTile(
            leading: const Icon(TwikkaIcons.email),
            title: const Text('Email'),
            subtitle: Text(authUser?.email ?? '\u2014'),
          ),
          ListTile(
            leading: const Icon(TwikkaIcons.city),
            title: const Text('City'),
            subtitle: Text(
              city == null
                  ? 'Not set yet'
                  : '${city.name} \u00b7 ${city.countryCode}',
            ),
            trailing: const Icon(TwikkaIcons.chevronRight),
            onTap: () => _pickCity(context),
          ),
          ListTile(
            leading: const Icon(TwikkaIcons.timezone),
            title: const Text('Time zone'),
            subtitle: Text(timezone ?? 'Set when you pick a city'),
          ),
        ],
        ),
      ),
    );
  }

  Future<void> _pickCity(BuildContext context) async {
    final cityId = await showCityPickerSheet(context);
    if (cityId == null) return;
    try {
      await ConvexClient.instance.mutation(
        name: 'cities:setForCurrentUser',
        args: {'cityId': cityId},
      );
    } catch (err) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Couldn\u2019t save your city: $err')),
      );
    }
  }
}
