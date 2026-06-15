import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/services/convex_subscription.dart';
import '../models/coach_persona.dart';

part 'current_coach_provider.g.dart';

/// The Convex-backed CoachPersona the user is currently assigned to,
/// or null if they haven't picked yet. Drives the router's onboarding
/// redirect and the chat header's coach name + monogram. Distinct from
/// `currentCoachProvider` in chat_notifier.dart, which exposes the local
/// presentational `Coach` (palette + monogram) — that one will be
/// derived from this once Phase C makes the chat real.
@Riverpod(keepAlive: true)
Stream<CoachPersona?> currentCoachPersona(Ref ref) {
  return convexSubscribe<CoachPersona?>(
    name: 'coachPersonas:currentForUser',
    decode: (json) => json == null
        ? null
        : CoachPersona.fromJson(json as Map<String, dynamic>),
  );
}
