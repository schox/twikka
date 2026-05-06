import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Full-screen dimmed overlay showing a single avatar at a comfortable
/// size. Tap anywhere to dismiss; pinch-zoom for closer inspection.
///
/// Pass the same [cacheKey] used by the source avatar so the preview
/// hits the same cached bytes (no re-download from R2).
Future<void> showAvatarPreview(
  BuildContext context, {
  required String imageUrl,
  required String? cacheKey,
  required String name,
}) {
  return Navigator.of(context, rootNavigator: true).push<void>(
    PageRouteBuilder<void>(
      opaque: false,
      barrierColor: Colors.black.withValues(alpha: 0.88),
      barrierDismissible: true,
      barrierLabel: name,
      transitionDuration: const Duration(milliseconds: 200),
      reverseTransitionDuration: const Duration(milliseconds: 150),
      pageBuilder: (_, __, ___) =>
          _AvatarPreview(imageUrl: imageUrl, cacheKey: cacheKey, name: name),
      transitionsBuilder: (_, anim, __, child) =>
          FadeTransition(opacity: anim, child: child),
    ),
  );
}

class _AvatarPreview extends StatelessWidget {
  const _AvatarPreview({
    required this.imageUrl,
    required this.cacheKey,
    required this.name,
  });

  final String imageUrl;
  final String? cacheKey;
  final String name;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () => Navigator.of(context).maybePop(),
        child: SafeArea(
          child: Stack(
            children: [
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(gap5),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 480),
                    child: AspectRatio(
                      aspectRatio: 1,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(radiusXl),
                        child: InteractiveViewer(
                          minScale: 1,
                          maxScale: 4,
                          child: CachedNetworkImage(
                            imageUrl: imageUrl,
                            cacheKey: cacheKey,
                            fit: BoxFit.cover,
                            placeholder: (_, _) => const ColoredBox(
                              color: Colors.black26,
                              child: Center(
                                child: SizedBox(
                                  width: progressIndicatorMedium,
                                  height: progressIndicatorMedium,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.4,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      Colors.white70,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            errorWidget: (_, _, _) => const ColoredBox(
                              color: Colors.black26,
                              child: Center(
                                child: Icon(
                                  Icons.broken_image_outlined,
                                  color: Colors.white70,
                                  size: 48,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: gap5,
                left: 0,
                right: 0,
                child: Center(
                  child: Text(
                    name,
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
