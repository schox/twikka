import 'package:clerk_auth/clerk_auth.dart';
import 'package:convex_flutter/convex_flutter.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/services/clerk_service.dart';
import 'auth_state.dart';

part 'clerk_auth_notifier.g.dart';

// Name of the JWT template configured in the Clerk dashboard that mints
// Convex-compatible tokens (claims.aud === "convex"). Must match
// convex/auth.config.ts's applicationID.
const _convexJwtTemplate = 'convex';

@Riverpod(keepAlive: true)
class ClerkAuth extends _$ClerkAuth {
  Auth get _auth => ClerkService.auth;
  AuthHandleWrapper? _convexHandle;

  @override
  AuthState build() {
    ref.onDispose(() {
      _convexHandle?.dispose();
      _convexHandle = null;
    });
    final initial = _computeState();
    // Hook up the Convex token binding if we came back with an existing
    // Clerk session (e.g., persistor restored a signed-in user on launch).
    _syncConvexAuth(initial);
    return initial;
  }

  AuthState _computeState() {
    final user = _auth.user;
    if (user != null) {
      return AuthLoggedIn(
        email: user.email ?? '',
        displayName: user.firstName ?? user.email ?? '',
        // TODO: persist onboarding state on the Convex user doc (next session).
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

  Future<void> _syncConvexAuth(AuthState newState) async {
    final signedIn = newState is AuthLoggedIn;
    final bound = _convexHandle != null;

    if (signedIn && !bound) {
      _convexHandle = await ConvexClient.instance.setAuthWithRefresh(
        fetchToken: () async {
          final token = await _auth.sessionToken(
            templateName: _convexJwtTemplate,
          );
          return token.jwt;
        },
      );
    } else if (!signedIn && bound) {
      _convexHandle?.dispose();
      _convexHandle = null;
    }
  }

  void _setState(AuthState next) {
    state = next;
    // Convex binding is a side-effect; don't await.
    _syncConvexAuth(next);
  }

  Future<void> requestLoginCode(String email) async {
    try {
      await _auth.attemptSignIn(
        strategy: Strategy.emailCode,
        identifier: email.trim(),
      );
    } on ClerkError {
      // Errors flow through Auth.errorStream; UI surface in a later session.
    }
    _setState(_computeState());
  }

  Future<void> requestSignupCode({
    required String email,
    required String displayName,
  }) async {
    try {
      await _auth.attemptSignUp(
        strategy: Strategy.emailCode,
        emailAddress: email.trim(),
        firstName: displayName.trim(),
      );
    } on ClerkError {
      // See requestLoginCode.
    }
    _setState(_computeState());
  }

  Future<bool> verifyCode(String code) async {
    final current = state;
    if (current is! AuthAwaitingCode) return false;
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
    } on ClerkError {
      _setState(_computeState());
      return false;
    }
    _setState(_computeState());
    return state is AuthLoggedIn;
  }

  Future<void> cancelCodeEntry() async {
    await _auth.resetClient();
    _setState(_computeState());
  }

  Future<void> completeOnboarding() async {
    final current = state;
    if (current is! AuthLoggedIn) return;
    // TODO: persist to Convex user doc in next session.
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
