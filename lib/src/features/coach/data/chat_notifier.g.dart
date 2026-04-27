// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Local presentational coach (palette + monogram + sample) for the chat
/// widgets. Derived from the Convex-backed `currentCoachPersonaProvider`
/// — when the user picks a coach in the picker, this provider rebuilds
/// and the chat re-renders. Falls back to Margaret while the assignment
/// loads or hasn't been made.

@ProviderFor(currentCoach)
final currentCoachProvider = CurrentCoachProvider._();

/// Local presentational coach (palette + monogram + sample) for the chat
/// widgets. Derived from the Convex-backed `currentCoachPersonaProvider`
/// — when the user picks a coach in the picker, this provider rebuilds
/// and the chat re-renders. Falls back to Margaret while the assignment
/// loads or hasn't been made.

final class CurrentCoachProvider
    extends $FunctionalProvider<Coach, Coach, Coach>
    with $Provider<Coach> {
  /// Local presentational coach (palette + monogram + sample) for the chat
  /// widgets. Derived from the Convex-backed `currentCoachPersonaProvider`
  /// — when the user picks a coach in the picker, this provider rebuilds
  /// and the chat re-renders. Falls back to Margaret while the assignment
  /// loads or hasn't been made.
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

String _$currentCoachHash() => r'6bd798042bbcd1f02411fd10018f15746f77c27a';

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

String _$chatHash() => r'98a179effb4160f130f7132fe3620dcbe077c83c';

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
