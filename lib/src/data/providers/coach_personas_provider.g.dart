// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coach_personas_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(coachPersonas)
final coachPersonasProvider = CoachPersonasProvider._();

final class CoachPersonasProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<CoachPersona>>,
          List<CoachPersona>,
          Stream<List<CoachPersona>>
        >
    with
        $FutureModifier<List<CoachPersona>>,
        $StreamProvider<List<CoachPersona>> {
  CoachPersonasProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'coachPersonasProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$coachPersonasHash();

  @$internal
  @override
  $StreamProviderElement<List<CoachPersona>> $createElement(
    $ProviderPointer pointer,
  ) => $StreamProviderElement(pointer);

  @override
  Stream<List<CoachPersona>> create(Ref ref) {
    return coachPersonas(ref);
  }
}

String _$coachPersonasHash() => r'd37aa64d55926c3740aa6e559152b3ca97637c68';
