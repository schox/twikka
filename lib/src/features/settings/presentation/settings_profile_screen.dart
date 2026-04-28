import 'package:convex_flutter/convex_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/branding/twikka_avatars.dart';
import '../../../core/services/media_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/twikka_icons.dart';
import '../../../core/widgets/centered.dart';
import '../../../data/providers/current_user_provider.dart';
import '../../auth/data/auth_state.dart';
import '../../auth/data/clerk_auth_notifier.dart';
import 'city_picker_sheet.dart';

class SettingsProfileScreen extends ConsumerStatefulWidget {
  const SettingsProfileScreen({super.key});

  @override
  ConsumerState<SettingsProfileScreen> createState() =>
      _SettingsProfileScreenState();
}

class _SettingsProfileScreenState extends ConsumerState<SettingsProfileScreen> {
  bool _uploading = false;

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(clerkAuthProvider);
    final authUser = auth is AuthLoggedIn ? auth : null;
    final convexUser = ref.watch(currentUserProvider).asData?.value;
    final city = convexUser?.city;
    final timezone = convexUser?.timezone;
    final photoUrl = convexUser?.photoUrl;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Centered.content(
        child: ListView(
          padding: const EdgeInsets.all(gap4),
          children: [
            Center(
              child: _ProfilePhoto(
                id: authUser?.email ?? 'unknown',
                name: authUser?.displayName ?? '?',
                photoUrl: photoUrl,
                uploading: _uploading,
                onTap: _uploading ? null : _changePhoto,
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

  Future<void> _changePhoto() async {
    setState(() => _uploading = true);
    try {
      await MediaService.pickAndUploadUserPhoto();
      // No manual refresh — currentUserProvider reactively re-fires
      // with the new photoUrl when finalizeUpload patches the user.
    } catch (err) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Couldn\u2019t upload photo: $err')),
      );
    } finally {
      if (mounted) setState(() => _uploading = false);
    }
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

/// The avatar with a tap-to-change affordance: a small Phosphor pencil
/// glyph in a circle at the bottom-right (hidden during upload), and
/// a centred progress indicator overlay while uploading.
class _ProfilePhoto extends StatelessWidget {
  const _ProfilePhoto({
    required this.id,
    required this.name,
    required this.photoUrl,
    required this.uploading,
    required this.onTap,
  });

  final String id;
  final String name;
  final String? photoUrl;
  final bool uploading;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    const editBadgeSize = 32.0;
    return GestureDetector(
      onTap: onTap,
      child: SizedBox(
        width: avatarProfile,
        height: avatarProfile,
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            PersonAvatar(
              id: id,
              name: name,
              photoUrl: photoUrl,
              size: avatarProfile,
            ),
            if (uploading)
              Positioned.fill(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: scheme.scrim.withValues(alpha: 0.35),
                  ),
                  child: Center(
                    child: SizedBox(
                      width: progressIndicatorMedium,
                      height: progressIndicatorMedium,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.4,
                        valueColor:
                            AlwaysStoppedAnimation<Color>(scheme.onPrimary),
                      ),
                    ),
                  ),
                ),
              )
            else
              Positioned(
                right: 0,
                bottom: 0,
                child: Container(
                  width: editBadgeSize,
                  height: editBadgeSize,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: scheme.primary,
                    border: Border.all(color: scheme.surface, width: 2),
                  ),
                  alignment: Alignment.center,
                  child: Icon(
                    TwikkaIcons.edit,
                    size: 16,
                    color: scheme.onPrimary,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
