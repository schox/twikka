import 'package:convex_flutter/convex_flutter.dart';

import '../config/env.dart';

class ConvexService {
  ConvexService._();

  static Future<void> initialise() async {
    await ConvexClient.initialize(
      ConvexConfig(
        deploymentUrl: AppEnv.convexUrl,
        clientId: AppEnv.clientId,
        operationTimeout: const Duration(seconds: 30),
      ),
    );
  }

  static ConvexClient get client => ConvexClient.instance;
}
