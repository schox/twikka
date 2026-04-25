// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'clerk_auth_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(ClerkAuth)
final clerkAuthProvider = ClerkAuthProvider._();

final class ClerkAuthProvider extends $NotifierProvider<ClerkAuth, AuthState> {
  ClerkAuthProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'clerkAuthProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$clerkAuthHash();

  @$internal
  @override
  ClerkAuth create() => ClerkAuth();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(AuthState value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<AuthState>(value),
    );
  }
}

String _$clerkAuthHash() => r'75bcae897249ee7a16cde745b422c8dc80bf79a1';

abstract class _$ClerkAuth extends $Notifier<AuthState> {
  AuthState build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AuthState, AuthState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AuthState, AuthState>,
              AuthState,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
