import 'package:clerk_auth/clerk_auth.dart';
import 'package:path_provider/path_provider.dart';

import '../config/env.dart';

/// Owns the single [Auth] instance for the app.
///
/// [initialise] must be called exactly once, before [runApp]. After that,
/// consumers reach the [Auth] via [ClerkService.auth].
class ClerkService {
  ClerkService._();

  static Auth? _auth;

  static Auth get auth {
    final a = _auth;
    if (a == null) {
      throw StateError(
        'ClerkService.initialise() must be called before ClerkService.auth.',
      );
    }
    return a;
  }

  static Future<void> initialise() async {
    if (_auth != null) return;

    final a = Auth(
      config: AuthConfig(
        publishableKey: AppEnv.clerkPublishableKey,
        persistor: DefaultPersistor(
          getCacheDirectory: getApplicationDocumentsDirectory,
        ),
      ),
    );
    await a.initialize();
    _auth = a;
  }
}
