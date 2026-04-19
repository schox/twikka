import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/services/convex_subscription.dart';
import '../models/coach_persona.dart';

part 'coach_personas_provider.g.dart';

@Riverpod(keepAlive: true)
Stream<List<CoachPersona>> coachPersonas(Ref ref) {
  return convexSubscribe<List<CoachPersona>>(
    name: 'coachPersonas:listActive',
    decode: (json) => (json as List<dynamic>)
        .map((e) => CoachPersona.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
}
