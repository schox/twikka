import 'package:flutter/material.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'theme_notifier.g.dart';

const _kAppearanceKey = 'appearance';

enum Appearance { light, dark, system }

extension AppearanceX on Appearance {
  ThemeMode get themeMode => switch (this) {
        Appearance.light => ThemeMode.light,
        Appearance.dark => ThemeMode.dark,
        Appearance.system => ThemeMode.system,
      };

  String get label => switch (this) {
        Appearance.light => 'Light',
        Appearance.dark => 'Dark',
        Appearance.system => 'System',
      };
}

@Riverpod(keepAlive: true)
SharedPreferences sharedPreferences(Ref ref) {
  throw UnimplementedError('Override in main() with the resolved instance');
}

@Riverpod(keepAlive: true)
class ThemeNotifier extends _$ThemeNotifier {
  @override
  Appearance build() {
    final prefs = ref.read(sharedPreferencesProvider);
    final stored = prefs.getString(_kAppearanceKey);
    return Appearance.values.firstWhere(
      (a) => a.name == stored,
      orElse: () => Appearance.system,
    );
  }

  Future<void> set(Appearance appearance) async {
    state = appearance;
    final prefs = ref.read(sharedPreferencesProvider);
    await prefs.setString(_kAppearanceKey, appearance.name);
  }
}
