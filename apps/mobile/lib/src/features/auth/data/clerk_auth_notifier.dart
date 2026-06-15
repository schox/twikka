import 'dart:async';
import 'dart:convert';

import 'package:clerk_auth/clerk_auth.dart';
import 'package:convex_flutter/convex_flutter.dart';
import 'package:flutter/widgets.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/services/clerk_service.dart';
import 'auth_state.dart';

part 'clerk_auth_notifier.g.dart';

/// Outcome of an auth-mutating call — UI uses this to render inline errors.
typedef AuthResult = ({bool ok, String? errorMessage});

/// Outcome of probeEmail — adds [exists] for the morph screen's branch.
typedef EmailProbeResult = ({bool ok, bool exists, String? errorMessage});

const _ok = (ok: true, errorMessage: null);

@Riverpod(keepAlive: true)
class ClerkAuth extends _$ClerkAuth with WidgetsBindingObserver {
  Auth get _auth => ClerkService.auth;
  AuthHandleWrapper? _convexHandle;
  bool _refreshingOnResume = false;
  StreamSubscription<void>? _clerkChangesSub;

  @override
  AuthState build() {
    WidgetsBinding.instance.addObserver(this);
    // Clerk hydrates client/session asynchronously when the cold-start
    // network round-trip exceeds its 1s init timeout. Without this
    // listener we'd take the initial AuthLoggedOut snapshot and miss
    // the later transition to AuthLoggedIn — the user would land on
    // the AuthScreen and get "already signed in" the moment they try
    // to start a sign-in. Dedup'd inside `_onClerkStateChanged` so
    // identity-equal recomputes don't churn the router.
    _clerkChangesSub = ClerkService.authChanges.listen((_) {
      _onClerkStateChanged();
    });
    ref.onDispose(() {
      WidgetsBinding.instance.removeObserver(this);
      _clerkChangesSub?.cancel();
      _clerkChangesSub = null;
      _convexHandle?.dispose();
      _convexHandle = null;
    });
    final initial = _computeState();
    _syncConvexAuth(initial);
    return initial;
  }

  void _onClerkStateChanged() {
    final next = _computeState();
    if (_authStateEquals(state, next)) return;
    _setState(next);
  }

  /// On resume, force-rebind the Convex auth handle so the refresh loop
  /// is re-armed with a fresh JWT. The simulator (and real devices under
  /// memory pressure) can suspend the app long enough that Convex's
  /// "60s before expiry" refresh callback never fires, leaving stale
  /// auth on the wire. Disposing + rebinding triggers an immediate
  /// fetchToken — Clerk's session token cache returns null when expired,
  /// which forces a network refresh against Clerk's API, and we apply
  /// the fresh JWT to Convex before any subscription notices the gap.
  @override
  void didChangeAppLifecycleState(AppLifecycleState lifecycle) {
    if (lifecycle == AppLifecycleState.resumed) {
      unawaited(_refreshConvexAuthOnResume());
    }
  }

  Future<String?> _fetchToken() async {
    final token = await _auth.sessionToken();
    return token.jwt;
  }

  Future<void> _refreshConvexAuthOnResume() async {
    if (_refreshingOnResume) return;
    if (state is! AuthLoggedIn) return;
    if (_convexHandle == null) return;
    _refreshingOnResume = true;
    try {
      // dispose() clears Convex auth and stops the old refresh loop. The
      // brief gap between dispose and the new handle's first fetchToken
      // is covered by convexSubscribe's retry-with-backoff.
      _convexHandle?.dispose();
      _convexHandle = null;
      _convexHandle = await ConvexClient.instance.setAuthWithRefresh(
        fetchToken: _fetchToken,
      );
    } catch (err) {
      // ignore: avoid_print
      print('resume: failed to refresh Convex auth: $err');
    } finally {
      _refreshingOnResume = false;
    }
  }

  AuthState _computeState() {
    final user = _auth.user;
    if (user != null) {
      return AuthLoggedIn(
        email: user.email ?? '',
        displayName: user.firstName ?? user.email ?? '',
        // TODO: persist onboarding state on the Convex user doc.
        onboardingComplete: true,
      );
    }

    final signUp = _auth.signUp;
    if (signUp != null) {
      return AuthAwaitingCode(
        email: signUp.emailAddress ?? '',
        isSignup: true,
        pendingDisplayName: signUp.firstName,
      );
    }

    final signIn = _auth.signIn;
    if (signIn != null) {
      return AuthAwaitingCode(
        email: signIn.identifier ?? '',
        isSignup: false,
      );
    }

    return const AuthLoggedOut();
  }

  bool _authStateEquals(AuthState a, AuthState b) {
    if (a.runtimeType != b.runtimeType) return false;
    if (a is AuthLoggedIn && b is AuthLoggedIn) {
      return a.email == b.email &&
          a.displayName == b.displayName &&
          a.onboardingComplete == b.onboardingComplete;
    }
    if (a is AuthAwaitingCode && b is AuthAwaitingCode) {
      return a.email == b.email &&
          a.isSignup == b.isSignup &&
          a.pendingDisplayName == b.pendingDisplayName;
    }
    return true; // both AuthLoggedOut
  }

  Future<void> _syncConvexAuth(AuthState newState) async {
    final signedIn = newState is AuthLoggedIn;
    final bound = _convexHandle != null;

    if (signedIn && !bound) {
      // Clerk's Convex integration injects aud:"convex" into the default
      // session token — no dedicated JWT template — so we request the
      // default token (no templateName) and Convex validates the aud
      // claim against applicationID: "convex" in auth.config.ts.
      _convexHandle = await ConvexClient.instance.setAuthWithRefresh(
        fetchToken: _fetchToken,
      );
      // setAuthWithRefresh returns before the Convex server has finished
      // latching the token, so an immediate authenticated mutation races and
      // gets rejected. Retry with backoff until the token propagates — this
      // is idempotent, so subsequent successful attempts are no-ops.
      unawaited(_ensureFromIdentityWithRetry());
    } else if (!signedIn && bound) {
      _convexHandle?.dispose();
      _convexHandle = null;
    }
  }

  Future<void> _ensureFromIdentityWithRetry() async {
    const delays = [
      Duration(milliseconds: 150),
      Duration(milliseconds: 300),
      Duration(milliseconds: 600),
      Duration(milliseconds: 1200),
      Duration(milliseconds: 2000),
    ];
    for (var attempt = 0; attempt <= delays.length; attempt++) {
      try {
        await ConvexClient.instance.mutation(
          name: 'users:ensureFromIdentity',
          args: const {},
        );
        return;
      } catch (err) {
        if (attempt == delays.length) {
          // ignore: avoid_print
          print('ensureFromIdentity failed after $attempt retries: $err');
          return;
        }
        await Future<void>.delayed(delays[attempt]);
      }
    }
  }

  void _setState(AuthState next) {
    state = next;
    _syncConvexAuth(next);
  }

  String _readableClerkError(ClerkError err) =>
      err.argument?.isNotEmpty == true
          ? err.argument!
          : (err.message.isNotEmpty
              ? err.message
              : 'Something went wrong. Please try again.');

  /// Asks Clerk's Backend API (via a Convex action) whether the email already
  /// has a user. Drives the morph screen's sign-in vs sign-up branch.
  Future<EmailProbeResult> probeEmail(String email) async {
    try {
      final raw = await ConvexClient.instance.action(
        name: 'auth:probeEmail',
        args: {'email': email.trim()},
      );
      final decoded = jsonDecode(raw) as Map<String, dynamic>;
      return (
        ok: true,
        exists: decoded['exists'] as bool,
        errorMessage: null,
      );
    } catch (err) {
      return (
        ok: false,
        exists: false,
        errorMessage: 'Could not check that email. Try again.',
      );
    }
  }

  Future<AuthResult> requestLoginCode(String email) async {
    try {
      await _auth.attemptSignIn(
        strategy: Strategy.emailCode,
        identifier: email.trim(),
      );
    } on ClerkError catch (err) {
      return (ok: false, errorMessage: _readableClerkError(err));
    }
    _setState(_computeState());
    return _ok;
  }

  Future<AuthResult> requestSignupCode({
    required String email,
    required String displayName,
  }) async {
    try {
      await _auth.attemptSignUp(
        strategy: Strategy.emailCode,
        emailAddress: email.trim(),
        firstName: displayName.trim(),
      );
    } on ClerkError catch (err) {
      return (ok: false, errorMessage: _readableClerkError(err));
    }
    _setState(_computeState());
    return _ok;
  }

  Future<AuthResult> verifyCode(String code) async {
    final current = state;
    if (current is! AuthAwaitingCode) {
      return (ok: false, errorMessage: 'No verification in progress.');
    }
    final trimmed = code.trim();
    try {
      if (current.isSignup) {
        await _auth.attemptSignUp(
          strategy: Strategy.emailCode,
          code: trimmed,
        );
      } else {
        await _auth.attemptSignIn(
          strategy: Strategy.emailCode,
          code: trimmed,
        );
      }
    } on ClerkError catch (err) {
      _setState(_computeState());
      return (ok: false, errorMessage: _readableClerkError(err));
    }
    _setState(_computeState());
    return state is AuthLoggedIn
        ? _ok
        : (ok: false, errorMessage: 'Verification did not complete.');
  }

  Future<AuthResult> resendCode() async {
    final current = state;
    if (current is! AuthAwaitingCode) {
      return (ok: false, errorMessage: 'Nothing to resend.');
    }
    // Re-invoke attemptSignIn / attemptSignUp without a code; with the
    // strategy-stripping HttpService shim in place, both paths resolve to
    // exactly one prepare-verification call (see clerk_service.dart).
    try {
      if (current.isSignup) {
        await _auth.attemptSignUp(
          strategy: Strategy.emailCode,
          emailAddress: current.email,
          firstName: current.pendingDisplayName,
        );
      } else {
        await _auth.attemptSignIn(
          strategy: Strategy.emailCode,
          identifier: current.email,
        );
      }
      return _ok;
    } on ClerkError catch (err) {
      return (ok: false, errorMessage: _readableClerkError(err));
    }
  }

  Future<void> cancelCodeEntry() async {
    await _auth.resetClient();
    _setState(_computeState());
  }

  Future<void> completeOnboarding() async {
    final current = state;
    if (current is! AuthLoggedIn) return;
    state = current.copyWith(onboardingComplete: true);
  }

  /// Debug-only. Flips onboardingComplete back to false without touching
  /// Clerk. Used by Settings → Debug to toggle the coach greeting seed.
  Future<void> resetOnboarding() async {
    final current = state;
    if (current is! AuthLoggedIn) return;
    state = current.copyWith(onboardingComplete: false);
  }

  Future<void> signOut() async {
    await _auth.signOut();
    _setState(_computeState());
  }
}
