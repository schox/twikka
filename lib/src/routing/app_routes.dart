enum AppRoute {
  auth,
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

  static const auth = '/auth';

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
