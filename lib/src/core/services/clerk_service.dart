import 'package:clerk_auth/clerk_auth.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';

import '../config/env.dart';

/// Owns the single [Auth] instance for the app and a small [HttpService]
/// shim that suppresses clerk_auth 0.0.14-beta's doubled-email signup
/// behavior.
///
/// **Why the shim?** [Auth.attemptSignUp] sends two HTTP calls when starting
/// an email-code sign-up:
///   1. `POST /v1/client/sign_ups` with `strategy=email_code` — Clerk
///      auto-prepares a verification and sends an email.
///   2. `POST /v1/client/sign_ups/{id}/prepare_verification` — Clerk
///      creates a *new* verification, rolling the code and sending another
///      email.
/// Two emails arrive, only the second's code is valid.
///
/// We intercept (1) and drop the `strategy` field on the way out — Clerk
/// then creates the SignUp without auto-preparing, and the SDK's (2)
/// becomes the single email. Sign-in is unaffected: [Auth.attemptSignIn]
/// already calls `createSignIn` without a strategy.
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
        httpService: const _StrategyStrippingHttpService(),
      ),
    );
    await a.initialize();
    _auth = a;
  }
}

/// Wraps [DefaultHttpService] and strips `strategy` from
/// `POST /v1/client/sign_ups` request bodies (see [ClerkService] docs).
class _StrategyStrippingHttpService implements HttpService {
  const _StrategyStrippingHttpService();

  static const _impl = DefaultHttpService();

  @override
  Future<void> initialize() => _impl.initialize();

  @override
  void terminate() => _impl.terminate();

  @override
  Future<bool> ping(Uri uri, {required Duration timeout}) =>
      _impl.ping(uri, timeout: timeout);

  @override
  Future<http.Response> send(
    HttpMethod method,
    Uri uri, {
    Map<String, String>? headers,
    Map<String, dynamic>? params,
    String? body,
  }) {
    final isCreateSignUp =
        method == HttpMethod.post && uri.path.endsWith('/v1/client/sign_ups');
    final outParams = isCreateSignUp && params != null
        ? {
            for (final entry in params.entries)
              if (entry.key != 'strategy') entry.key: entry.value,
          }
        : params;
    return _impl.send(method, uri,
        headers: headers, params: outParams, body: body);
  }

  @override
  Future<http.Response> sendByteStream(
    HttpMethod method,
    Uri uri,
    http.ByteStream byteStream,
    int length,
    Map<String, String> headers,
  ) =>
      _impl.sendByteStream(method, uri, byteStream, length, headers);
}
