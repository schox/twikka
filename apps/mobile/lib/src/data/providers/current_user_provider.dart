import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/services/convex_subscription.dart';
import '../models/twikka_user.dart';

part 'current_user_provider.g.dart';

@Riverpod(keepAlive: true)
Stream<TwikkaUser?> currentUser(Ref ref) {
  return convexSubscribe<TwikkaUser?>(
    name: 'users:current',
    decode: (json) => json == null
        ? null
        : TwikkaUser.fromJson(json as Map<String, dynamic>),
  );
}
