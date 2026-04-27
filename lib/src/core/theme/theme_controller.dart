import 'package:flutter/material.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'theme_registry.dart';
import 'theme_variant.dart';

part 'theme_controller.g.dart';

/// Light / dark / system selection. Stored under [_kModeKey] in
/// SharedPreferences as the enum's `name`.
enum AppThemeMode {
  light,
  dark,
  system;

  String get displayName => switch (this) {
        AppThemeMode.light => 'Light',
        AppThemeMode.dark => 'Dark',
        AppThemeMode.system => 'System',
      };

  IconData get icon => switch (this) {
        AppThemeMode.light => PhosphorIconsRegular.sun,
        AppThemeMode.dark => PhosphorIconsRegular.moon,
        AppThemeMode.system => PhosphorIconsRegular.devices,
      };

  ThemeMode get materialMode => switch (this) {
        AppThemeMode.light => ThemeMode.light,
        AppThemeMode.dark => ThemeMode.dark,
        AppThemeMode.system => ThemeMode.system,
      };

  static AppThemeMode fromName(String? name) {
    return AppThemeMode.values.firstWhere(
      (m) => m.name == name,
      orElse: () => AppThemeMode.system,
    );
  }
}

/// Combined theme state. Persisted across app launches.
@immutable
class ThemeState {
  const ThemeState({required this.variant, required this.mode});

  final ThemeVariant variant;
  final AppThemeMode mode;

  ThemeState copyWith({ThemeVariant? variant, AppThemeMode? mode}) =>
      ThemeState(
        variant: variant ?? this.variant,
        mode: mode ?? this.mode,
      );
}

const _kVariantKey = 'theme_variant_id';
const _kModeKey = 'theme_mode';

/// Re-exported from theme_notifier for backwards-compatibility with
/// callers that still inject SharedPreferences via overrideWithValue.
@Riverpod(keepAlive: true)
SharedPreferences sharedPreferences(Ref ref) {
  throw UnimplementedError('Override in main() with the resolved instance');
}

/// Theme controller. State exposes the active variant and the
/// chosen mode. Persisted to SharedPreferences on every change so the
/// next launch picks up where we left off.
@Riverpod(keepAlive: true)
class ThemeController extends _$ThemeController {
  @override
  ThemeState build() {
    final prefs = ref.read(sharedPreferencesProvider);
    final variantId = prefs.getString(_kVariantKey);
    final modeName = prefs.getString(_kModeKey);
    return ThemeState(
      variant: themeVariantById(variantId),
      mode: AppThemeMode.fromName(modeName),
    );
  }

  Future<void> setVariant(ThemeVariant variant) async {
    state = state.copyWith(variant: variant);
    final prefs = ref.read(sharedPreferencesProvider);
    await prefs.setString(_kVariantKey, variant.id);
  }

  Future<void> setMode(AppThemeMode mode) async {
    state = state.copyWith(mode: mode);
    final prefs = ref.read(sharedPreferencesProvider);
    await prefs.setString(_kModeKey, mode.name);
  }

  Future<void> resetToDefaults() async {
    state = ThemeState(
      variant: defaultThemeVariant,
      mode: AppThemeMode.system,
    );
    final prefs = ref.read(sharedPreferencesProvider);
    await prefs.remove(_kVariantKey);
    await prefs.remove(_kModeKey);
  }
}
