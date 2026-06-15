import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

import '../theme/app_theme.dart';

/// Twikka avatar primitives.
///
/// Three explicit shapes, all theme-aware, all photo-ready:
/// - [CoachAvatar]   — circle, primary brand colour, sparkle badge
/// - [PersonAvatar]  — circle, deterministic theme-tinted palette
/// - [GroupAvatar]   — rounded square, deterministic theme-tinted palette,
///                      Phosphor `usersThree` glyph
///
/// Each accepts an optional `photoUrl`. When present, the photo
/// replaces the default; otherwise the painted/initials/glyph
/// fallback renders. Once R2 is wired, fill in the photoUrl.

// ── Background bucket palette (person / group) ───────────────────────
// Avoids primaryContainer so people can never accidentally look
// coach-like in a list. Sits on Material 3 secondary/tertiary plus the
// Twikka semantic success/info containers.
class _AvatarBucket {
  const _AvatarBucket(this.bg, this.fg);
  final Color bg;
  final Color fg;
}

List<_AvatarBucket> _buckets(BuildContext context) {
  final scheme = Theme.of(context).colorScheme;
  final tw = context.tw;
  return [
    _AvatarBucket(scheme.secondaryContainer, scheme.onSecondaryContainer),
    _AvatarBucket(scheme.tertiaryContainer, scheme.onTertiaryContainer),
    _AvatarBucket(tw.successContainer, tw.onSuccessContainer),
    _AvatarBucket(tw.infoContainer, tw.onInfoContainer),
  ];
}

/// FNV-1a 32-bit hash. Deterministic and good enough for picking a
/// bucket from an id or name.
int _hash(String key) {
  var hash = 0x811C9DC5;
  for (final c in key.codeUnits) {
    hash = (hash ^ c) * 0x01000193;
    hash &= 0xFFFFFFFF;
  }
  return hash;
}

/// Up to two upper-case initials from a free-form name.
/// `'Andrew Schox' → 'AS'`, `'Margaret' → 'M'`, `''` → `'?'`.
String avatarInitials(String name) {
  final parts = name.trim().split(RegExp(r'\s+'));
  if (parts.isEmpty || parts.first.isEmpty) return '?';
  final first = parts.first.substring(0, 1).toUpperCase();
  if (parts.length == 1) return first;
  final last = parts.last.substring(0, 1).toUpperCase();
  return first + last;
}

// ── CoachAvatar ──────────────────────────────────────────────────────

/// Distinct from a person via:
/// - solid `colorScheme.primary` background (no hash variation —
///   one strong brand colour for "this is your coach")
/// - Phosphor `sparkle` badge in the bottom-right
class CoachAvatar extends StatelessWidget {
  const CoachAvatar({
    super.key,
    required this.name,
    this.photoUrl,
    this.cacheKey,
    this.size = avatarRow,
    this.showBadge = true,
  });

  final String name;
  final String? photoUrl;
  // Stable identifier for the underlying image (e.g. R2 object key).
  // Lets CachedNetworkImage survive URL rotations — if the URL is a
  // signed URL with a TTL, the signature changes on each refresh, but
  // bytes only need re-downloading when the image itself changes.
  // Falls back to imageUrl when null.
  final String? cacheKey;
  final double size;
  final bool showBadge;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final fallback = Container(
      color: scheme.primary,
      alignment: Alignment.center,
      child: _Initials(
        text: avatarInitials(name),
        size: size,
        color: scheme.onPrimary,
      ),
    );
    final body = ClipOval(
      child: SizedBox.square(
        dimension: size,
        child: photoUrl != null
            ? CachedNetworkImage(
                imageUrl: photoUrl!,
                cacheKey: cacheKey,
                fit: BoxFit.cover,
                placeholder: (_, __) => fallback,
                errorWidget: (_, __, ___) => fallback,
                fadeInDuration: kMotionFast,
              )
            : fallback,
      ),
    );

    if (!showBadge) return SizedBox.square(dimension: size, child: body);

    final badgeSize = (size * 0.36).clamp(14.0, 22.0);
    return SizedBox.square(
      dimension: size,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          body,
          Positioned(
            left: -2,
            top: -2,
            child: Container(
              width: badgeSize,
              height: badgeSize,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: scheme.primaryContainer,
                border: Border.all(color: scheme.surface, width: 1.5),
              ),
              alignment: Alignment.center,
              child: Icon(
                PhosphorIconsFill.sparkle,
                size: badgeSize * 0.6,
                color: scheme.onPrimaryContainer,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── PersonAvatar ─────────────────────────────────────────────────────

/// Circle, theme-tinted background hashed deterministically from
/// [id] (so the same person always lands in the same colour). Initials
/// from [name] until [photoUrl] arrives.
class PersonAvatar extends StatelessWidget {
  const PersonAvatar({
    super.key,
    required this.id,
    required this.name,
    this.photoUrl,
    this.cacheKey,
    this.size = avatarRow,
  });

  final String id;
  final String name;
  final String? photoUrl;
  // See [CoachAvatar.cacheKey].
  final String? cacheKey;
  final double size;

  @override
  Widget build(BuildContext context) {
    final buckets = _buckets(context);
    final bucket = buckets[_hash(id) % buckets.length];
    final fallback = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(shape: BoxShape.circle, color: bucket.bg),
      alignment: Alignment.center,
      child: _Initials(
        text: avatarInitials(name),
        size: size,
        color: bucket.fg,
      ),
    );
    if (photoUrl == null) return fallback;
    return ClipOval(
      child: SizedBox.square(
        dimension: size,
        child: CachedNetworkImage(
          imageUrl: photoUrl!,
          cacheKey: cacheKey,
          fit: BoxFit.cover,
          placeholder: (_, __) => fallback,
          errorWidget: (_, __, ___) => fallback,
          fadeInDuration: kMotionFast,
        ),
      ),
    );
  }
}

// ── GroupAvatar ──────────────────────────────────────────────────────

/// Rounded-square, theme-tinted background hashed from [id]. Phosphor
/// `usersThree` glyph centred — instant shape distinction from
/// [PersonAvatar] and [CoachAvatar] in mixed lists.
class GroupAvatar extends StatelessWidget {
  const GroupAvatar({
    super.key,
    required this.id,
    this.photoUrl,
    this.size = avatarRow,
  });

  final String id;
  final String? photoUrl;
  final double size;

  @override
  Widget build(BuildContext context) {
    final radius = BorderRadius.circular(size * 0.22);
    final buckets = _buckets(context);
    final bucket = buckets[_hash(id) % buckets.length];
    final fallback = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(borderRadius: radius, color: bucket.bg),
      alignment: Alignment.center,
      child: Icon(
        PhosphorIconsRegular.usersThree,
        size: size * 0.5,
        color: bucket.fg,
      ),
    );
    if (photoUrl == null) return fallback;
    return ClipRRect(
      borderRadius: radius,
      child: SizedBox.square(
        dimension: size,
        child: CachedNetworkImage(
          imageUrl: photoUrl!,
          fit: BoxFit.cover,
          placeholder: (_, __) => fallback,
          errorWidget: (_, __, ___) => fallback,
          fadeInDuration: kMotionFast,
        ),
      ),
    );
  }
}

// ── Internals ────────────────────────────────────────────────────────

class _Initials extends StatelessWidget {
  const _Initials({required this.text, required this.size, required this.color});
  final String text;
  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontSize: size * 0.4,
            color: color,
            fontWeight: FontWeight.w600,
            height: 1,
          ),
    );
  }
}
