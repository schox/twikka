// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'current_user_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(currentUser)
final currentUserProvider = CurrentUserProvider._();

final class CurrentUserProvider
    extends
        $FunctionalProvider<
          AsyncValue<TwikkaUser?>,
          TwikkaUser?,
          Stream<TwikkaUser?>
        >
    with $FutureModifier<TwikkaUser?>, $StreamProvider<TwikkaUser?> {
  CurrentUserProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'currentUserProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$currentUserHash();

  @$internal
  @override
  $StreamProviderElement<TwikkaUser?> $createElement(
    $ProviderPointer pointer,
  ) => $StreamProviderElement(pointer);

  @override
  Stream<TwikkaUser?> create(Ref ref) {
    return currentUser(ref);
  }
}

String _$currentUserHash() => r'439974394ca7e7326c5ad36a2f2a0d1c00fb9441';
