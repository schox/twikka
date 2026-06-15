// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'current_coach_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The Convex-backed CoachPersona the user is currently assigned to,
/// or null if they haven't picked yet. Drives the router's onboarding
/// redirect and the chat header's coach name + monogram. Distinct from
/// `currentCoachProvider` in chat_notifier.dart, which exposes the local
/// presentational `Coach` (palette + monogram) — that one will be
/// derived from this once Phase C makes the chat real.

@ProviderFor(currentCoachPersona)
final currentCoachPersonaProvider = CurrentCoachPersonaProvider._();

/// The Convex-backed CoachPersona the user is currently assigned to,
/// or null if they haven't picked yet. Drives the router's onboarding
/// redirect and the chat header's coach name + monogram. Distinct from
/// `currentCoachProvider` in chat_notifier.dart, which exposes the local
/// presentational `Coach` (palette + monogram) — that one will be
/// derived from this once Phase C makes the chat real.

final class CurrentCoachPersonaProvider
    extends
        $FunctionalProvider<
          AsyncValue<CoachPersona?>,
          CoachPersona?,
          Stream<CoachPersona?>
        >
    with $FutureModifier<CoachPersona?>, $StreamProvider<CoachPersona?> {
  /// The Convex-backed CoachPersona the user is currently assigned to,
  /// or null if they haven't picked yet. Drives the router's onboarding
  /// redirect and the chat header's coach name + monogram. Distinct from
  /// `currentCoachProvider` in chat_notifier.dart, which exposes the local
  /// presentational `Coach` (palette + monogram) — that one will be
  /// derived from this once Phase C makes the chat real.
  CurrentCoachPersonaProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'currentCoachPersonaProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$currentCoachPersonaHash();

  @$internal
  @override
  $StreamProviderElement<CoachPersona?> $createElement(
    $ProviderPointer pointer,
  ) => $StreamProviderElement(pointer);

  @override
  Stream<CoachPersona?> create(Ref ref) {
    return currentCoachPersona(ref);
  }
}

String _$currentCoachPersonaHash() =>
    r'4a76cd66b61806022627b733a2857e41614f03cb';
