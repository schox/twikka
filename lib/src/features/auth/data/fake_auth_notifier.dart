import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/theme/theme_notifier.dart';
import 'auth_state.dart';

part 'fake_auth_notifier.g.dart';

const _kEmailKey = 'auth.email';
const _kDisplayNameKey = 'auth.displayName';
const _kOnboardingCompleteKey = 'auth.onboardingComplete';

@Riverpod(keepAlive: true)
class FakeAuth extends _$FakeAuth {
  SharedPreferences get _prefs => ref.read(sharedPreferencesProvider);

  @override
  AuthState build() {
    final email = _readString(_kEmailKey);
    final name = _readString(_kDisplayNameKey);
    if (email == null || name == null) return const AuthLoggedOut();
    return AuthLoggedIn(
      email: email,
      displayName: name,
      onboardingComplete: _readBool(_kOnboardingCompleteKey),
    );
  }

  String? _readString(String key) {
    try {
      return _prefs.getString(key);
    } catch (_) {
      return null;
    }
  }

  bool _readBool(String key) {
    try {
      return _prefs.getBool(key) ?? false;
    } catch (_) {
      // Tolerate legacy values stored as String/int by older versions.
      final raw = _prefs.get(key);
      if (raw is bool) return raw;
      if (raw is num) return raw != 0;
      if (raw is String) return raw == '1' || raw.toLowerCase() == 'true';
      return false;
    }
  }

  Future<void> requestLoginCode(String email) async {
    state = AuthAwaitingCode(email: email.trim(), isSignup: false);
  }

  Future<void> requestSignupCode({required String email, required String displayName}) async {
    state = AuthAwaitingCode(
      email: email.trim(),
      isSignup: true,
      pendingDisplayName: displayName.trim(),
    );
  }

  Future<bool> verifyCode(String code) async {
    final current = state;
    if (current is! AuthAwaitingCode) return false;
    if (code.trim().length != 6) return false;

    final email = current.email;
    final displayName = current.pendingDisplayName ??
        _prefs.getString(_kDisplayNameKey) ??
        email.split('@').first;

    await _prefs.setString(_kEmailKey, email);
    await _prefs.setString(_kDisplayNameKey, displayName);

    final onboardingComplete = current.isSignup
        ? false
        : (_prefs.getBool(_kOnboardingCompleteKey) ?? false);
    await _prefs.setBool(_kOnboardingCompleteKey, onboardingComplete);

    state = AuthLoggedIn(
      email: email,
      displayName: displayName,
      onboardingComplete: onboardingComplete,
    );
    return true;
  }

  Future<void> cancelCodeEntry() async {
    state = const AuthLoggedOut();
  }

  Future<void> completeOnboarding() async {
    final current = state;
    if (current is! AuthLoggedIn) return;
    await _prefs.setBool(_kOnboardingCompleteKey, true);
    state = current.copyWith(onboardingComplete: true);
  }

  Future<void> signOut() async {
    await _prefs.remove(_kEmailKey);
    await _prefs.remove(_kDisplayNameKey);
    await _prefs.remove(_kOnboardingCompleteKey);
    state = const AuthLoggedOut();
  }
}
