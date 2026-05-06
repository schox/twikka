// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coach_avatar_preloader.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
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

@ProviderFor(CoachAvatarPreloader)
final coachAvatarPreloaderProvider = CoachAvatarPreloaderProvider._();

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
final class CoachAvatarPreloaderProvider
    extends $NotifierProvider<CoachAvatarPreloader, void> {
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
  CoachAvatarPreloaderProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'coachAvatarPreloaderProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$coachAvatarPreloaderHash();

  @$internal
  @override
  CoachAvatarPreloader create() => CoachAvatarPreloader();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(void value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<void>(value),
    );
  }
}

String _$coachAvatarPreloaderHash() =>
    r'fb526eae57f65803a1ff24b8b85f1a263b2f95cd';

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

abstract class _$CoachAvatarPreloader extends $Notifier<void> {
  void build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<void, void>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<void, void>,
              void,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
