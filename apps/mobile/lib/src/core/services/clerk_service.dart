import 'dart:async';

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

  static _NotifyingAuth? _auth;

  static Auth get auth {
    final a = _auth;
    if (a == null) {
      throw StateError(
        'ClerkService.initialise() must be called before ClerkService.auth.',
      );
    }
    return a;
  }

  /// Fires whenever Clerk's internal `Auth.update()` hook is invoked —
  /// i.e. whenever client/env/session state mutates. Used by
  /// `ClerkAuth` to recompute its public AuthState when Clerk hydrates
  /// asynchronously after `initialize()` returns (e.g. cold start with
  /// a slow network: the 1s API timeout fires, the persisted client
  /// is loaded from disk shortly after, and `update()` gets called
  /// from the refetch timer on the next successful network round-trip
  /// — without this stream we'd miss the transition and surface the
  /// AuthScreen even though Clerk has a live session).
  static Stream<void> get authChanges {
    final a = _auth;
    if (a == null) {
      throw StateError(
        'ClerkService.initialise() must be called before ClerkService.authChanges.',
      );
    }
    return a.changes;
  }

  static Future<void> initialise() async {
    if (_auth != null) return;

    final a = _NotifyingAuth(
      config: AuthConfig(
        publishableKey: AppEnv.clerkPublishableKey,
        persistor: DefaultPersistor(
          getCacheDirectory: getApplicationDocumentsDirectory,
        ),
        httpService: const _StrategyStrippingHttpService(),
        // Disable the SDK's built-in session-token polling. clerk_auth
        // 0.0.14-beta has a bug where its refresh call sometimes omits
        // the `expired_token` parameter and Clerk replies 422, which
        // bubbles up as a thrown ExternalError every poll cycle and
        // throws our Convex auth handle into a reconnect loop. We
        // don't need polling anyway — Convex's setAuthWithRefresh
        // calls our fetchToken callback ~60s before expiry on demand.
        sessionTokenPolling: false,
      ),
    );
    await a.initialize();
    _auth = a;
  }
}

/// Subclass of [Auth] that exposes `update()` invocations as a broadcast
/// stream. clerk_auth's base [Auth.update] is a no-op hook intended to
/// be overridden by mixins like [ChangeNotifier] in the official
/// clerk_flutter package; we don't use that package, so we surface the
/// signal directly.
class _NotifyingAuth extends Auth {
  _NotifyingAuth({required super.config});

  final _changes = StreamController<void>.broadcast();
  Stream<void> get changes => _changes.stream;

  @override
  void update() {
    super.update();
    if (!_changes.isClosed) _changes.add(null);
  }

  @override
  void terminate() {
    _changes.close();
    super.terminate();
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
