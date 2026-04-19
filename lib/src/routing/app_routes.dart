enum AppRoute {
  welcome,
  login,
  signup,
  verifyCode,
  coach,
  stats,
  social,
  settings,
  settingsProfile,
  settingsPreferences,
  settingsSubscription,
  settingsAbout,
  settingsDebug,
  offline,
  updateRequired,
}

class AppPaths {
  AppPaths._();

  static const welcome = '/welcome';
  static const login = '/login';
  static const signup = '/signup';
  static const verifyCode = '/verify-code';

  static const coach = '/coach';
  static const stats = '/stats';
  static const social = '/social';
  static const settings = '/settings';

  static const settingsProfile = 'profile';
  static const settingsPreferences = 'preferences';
  static const settingsSubscription = 'subscription';
  static const settingsAbout = 'about';
  static const settingsDebug = 'debug';

  static const offline = '/offline';
  static const updateRequired = '/update-required';
}
