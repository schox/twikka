// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The currently-selected coach. For now: always Margaret. Changing coaches
/// is a future settings flow.

@ProviderFor(currentCoach)
final currentCoachProvider = CurrentCoachProvider._();

/// The currently-selected coach. For now: always Margaret. Changing coaches
/// is a future settings flow.

final class CurrentCoachProvider
    extends $FunctionalProvider<Coach, Coach, Coach>
    with $Provider<Coach> {
  /// The currently-selected coach. For now: always Margaret. Changing coaches
  /// is a future settings flow.
  CurrentCoachProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'currentCoachProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$currentCoachHash();

  @$internal
  @override
  $ProviderElement<Coach> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  Coach create(Ref ref) {
    return currentCoach(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(Coach value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<Coach>(value),
    );
  }
}

String _$currentCoachHash() => r'a4631e779af6ecdbfaf4ddb802d633cd0acf7f89';

/// Fake chat state for the Coach screen. Mirrors the sample mid-conversation
/// from the design's `buildInitialMessages()`.

@ProviderFor(Chat)
final chatProvider = ChatProvider._();

/// Fake chat state for the Coach screen. Mirrors the sample mid-conversation
/// from the design's `buildInitialMessages()`.
final class ChatProvider extends $NotifierProvider<Chat, List<ChatMessage>> {
  /// Fake chat state for the Coach screen. Mirrors the sample mid-conversation
  /// from the design's `buildInitialMessages()`.
  ChatProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'chatProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$chatHash();

  @$internal
  @override
  Chat create() => Chat();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(List<ChatMessage> value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<List<ChatMessage>>(value),
    );
  }
}

String _$chatHash() => r'fd43afd11289d16c849f12652e28d043fefd36ca';

/// Fake chat state for the Coach screen. Mirrors the sample mid-conversation
/// from the design's `buildInitialMessages()`.

abstract class _$Chat extends $Notifier<List<ChatMessage>> {
  List<ChatMessage> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<List<ChatMessage>, List<ChatMessage>>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<List<ChatMessage>, List<ChatMessage>>,
              List<ChatMessage>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
