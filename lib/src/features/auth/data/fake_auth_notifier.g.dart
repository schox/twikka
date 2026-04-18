// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fake_auth_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(FakeAuth)
final fakeAuthProvider = FakeAuthProvider._();

final class FakeAuthProvider extends $NotifierProvider<FakeAuth, AuthState> {
  FakeAuthProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'fakeAuthProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$fakeAuthHash();

  @$internal
  @override
  FakeAuth create() => FakeAuth();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(AuthState value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<AuthState>(value),
    );
  }
}

String _$fakeAuthHash() => r'a3706b658fee5b54a60257f59bfeb248ce98bd55';

abstract class _$FakeAuth extends $Notifier<AuthState> {
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
