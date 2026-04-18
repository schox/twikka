// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'theme_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(sharedPreferences)
final sharedPreferencesProvider = SharedPreferencesProvider._();

final class SharedPreferencesProvider
    extends
        $FunctionalProvider<
          SharedPreferences,
          SharedPreferences,
          SharedPreferences
        >
    with $Provider<SharedPreferences> {
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

@ProviderFor(ThemeNotifier)
final themeProvider = ThemeNotifierProvider._();

final class ThemeNotifierProvider
    extends $NotifierProvider<ThemeNotifier, Appearance> {
  ThemeNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'themeProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$themeNotifierHash();

  @$internal
  @override
  ThemeNotifier create() => ThemeNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(Appearance value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<Appearance>(value),
    );
  }
}

String _$themeNotifierHash() => r'07044d234c15e753b75f350d461c36b592a9ec80';

abstract class _$ThemeNotifier extends $Notifier<Appearance> {
  Appearance build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<Appearance, Appearance>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<Appearance, Appearance>,
              Appearance,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
