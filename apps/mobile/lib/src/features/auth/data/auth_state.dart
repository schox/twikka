sealed class AuthState {
  const AuthState();
}

class AuthLoggedOut extends AuthState {
  const AuthLoggedOut();
}

class AuthAwaitingCode extends AuthState {
  const AuthAwaitingCode({
    required this.email,
    required this.isSignup,
    this.pendingDisplayName,
  });

  final String email;
  final bool isSignup;
  final String? pendingDisplayName;
}

class AuthLoggedIn extends AuthState {
  const AuthLoggedIn({
    required this.email,
    required this.displayName,
    required this.onboardingComplete,
  });

  final String email;
  final String displayName;
  final bool onboardingComplete;

  AuthLoggedIn copyWith({
    String? email,
    String? displayName,
    bool? onboardingComplete,
  }) =>
      AuthLoggedIn(
        email: email ?? this.email,
        displayName: displayName ?? this.displayName,
        onboardingComplete: onboardingComplete ?? this.onboardingComplete,
      );
}
