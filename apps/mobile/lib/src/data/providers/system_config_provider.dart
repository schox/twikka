import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../core/services/convex_subscription.dart';
import '../models/system_config.dart';

part 'system_config_provider.g.dart';

@Riverpod(keepAlive: true)
Stream<SystemConfig?> systemConfig(Ref ref) {
  return convexSubscribe<SystemConfig?>(
    name: 'systemConfig:get',
    decode: (json) => json == null
        ? null
        : SystemConfig.fromJson(json as Map<String, dynamic>),
  );
}
