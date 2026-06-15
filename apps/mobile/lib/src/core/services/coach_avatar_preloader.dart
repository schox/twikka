import 'dart:async';

import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../data/providers/coach_personas_provider.dart';

part 'coach_avatar_preloader.g.dart';

/// Warms `flutter_cache_manager`'s disk cache for every active coach
/// avatar as soon as the persona list loads. Same cache backs
/// CachedNetworkImage, so by the time the user lands on the picker /
/// chat header, the bytes are already on disk and the avatars render
/// without a network round-trip.
///
/// Fire-and-forget: failures are swallowed (the avatar widget falls
/// back to monogram + brand colour). Re-runs cheaply when personas
/// re-emit — `getSingleFile` is idempotent on the cacheKey, and we
/// dedupe locally so each key only fires once unless it failed.
///
/// Activated by reading the provider somewhere top-level (e.g. in
/// `TwikkaApp.build`). With `keepAlive: true` it stays subscribed for
/// the life of the app.
@Riverpod(keepAlive: true)
class CoachAvatarPreloader extends _$CoachAvatarPreloader {
  final _seen = <String>{};

  @override
  void build() {
    ref.listen(coachPersonasProvider, (_, next) {
      final personas = next.asData?.value;
      if (personas == null) return;
      for (final p in personas) {
        final url = p.avatarUrl;
        final key = p.avatarCacheKey ?? url;
        if (url == null || key == null) continue;
        if (!_seen.add(key)) continue;
        unawaited(_warm(url, key));
      }
    });
  }

  Future<void> _warm(String url, String key) async {
    try {
      await DefaultCacheManager().getSingleFile(url, key: key);
    } catch (_) {
      // Allow a retry on the next personas emit.
      _seen.remove(key);
    }
  }
}
