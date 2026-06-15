// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'theme_controller.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Re-exported from theme_notifier for backwards-compatibility with
/// callers that still inject SharedPreferences via overrideWithValue.

@ProviderFor(sharedPreferences)
final sharedPreferencesProvider = SharedPreferencesProvider._();

/// Re-exported from theme_notifier for backwards-compatibility with
/// callers that still inject SharedPreferences via overrideWithValue.

final class SharedPreferencesProvider
    extends
        $FunctionalProvider<
          SharedPreferences,
          SharedPreferences,
          SharedPreferences
        >
    with $Provider<SharedPreferences> {
  /// Re-exported from theme_notifier for backwards-compatibility with
  /// callers that still inject SharedPreferences via overrideWithValue.
  SharedPreferencesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'sharedPreferencesProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$sharedPreferencesHash();

  @$internal
  @override
  $ProviderElement<SharedPreferences> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  SharedPreferences create(Ref ref) {
    return sharedPreferences(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SharedPreferences value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<SharedPreferences>(value),
    );
  }
}

String _$sharedPreferencesHash() => r'973eb999cefd0fe1fbe5d81b243316e29c628d3b';

/// Theme controller. State exposes the active variant and the
/// chosen mode. Persisted to SharedPreferences on every change so the
/// next launch picks up where we left off.

@ProviderFor(ThemeController)
final themeControllerProvider = ThemeControllerProvider._();

/// Theme controller. State exposes the active variant and the
/// chosen mode. Persisted to SharedPreferences on every change so the
/// next launch picks up where we left off.
final class ThemeControllerProvider
    extends $NotifierProvider<ThemeController, ThemeState> {
  /// Theme controller. State exposes the active variant and the
  /// chosen mode. Persisted to SharedPreferences on every change so the
  /// next launch picks up where we left off.
  ThemeControllerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'themeControllerProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$themeControllerHash();

  @$internal
  @override
  ThemeController create() => ThemeController();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ThemeState value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ThemeState>(value),
    );
  }
}

String _$themeControllerHash() => r'c0b1152becc8a6bed66016b7f86b1af340daacc4';

/// Theme controller. State exposes the active variant and the
/// chosen mode. Persisted to SharedPreferences on every change so the
/// next launch picks up where we left off.

abstract class _$ThemeController extends $Notifier<ThemeState> {
  ThemeState build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<ThemeState, ThemeState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<ThemeState, ThemeState>,
              ThemeState,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
