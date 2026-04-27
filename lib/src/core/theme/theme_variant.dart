import 'package:flutter/material.dart';

import 'twikka_palette.dart';

/// One Twikka theme variant — both brightness modes.
///
/// Adding a new variant is a single file under `variants/`:
///   1. Compose two [ThemeBrightnessConfig]s (light + dark) holding a
///      [ColorScheme] and a [TwikkaPalette].
///   2. Wrap them in a [ThemeVariant] with id, name, description.
///   3. Register the variant in `theme_registry.dart`.
///
/// The builder takes care of the rest — wiring text styles,
/// component sub-themes, and animations off the palette.
@immutable
class ThemeVariant {
  const ThemeVariant({
    required this.id,
    required this.displayName,
    required this.description,
    required this.light,
    required this.dark,
  });

  /// Stable identifier persisted in SharedPreferences.
  final String id;

  /// Human-friendly name shown in the picker.
  final String displayName;

  /// One-line description shown beneath the name.
  final String description;

  final ThemeBrightnessConfig light;
  final ThemeBrightnessConfig dark;
}

/// The minimum each variant has to declare per brightness.
@immutable
class ThemeBrightnessConfig {
  const ThemeBrightnessConfig({
    required this.colorScheme,
    required this.palette,
    required this.buildTextTheme,
  });

  /// Material 3 [ColorScheme]. The builder consumes this directly.
  final ColorScheme colorScheme;

  /// Twikka-specific tokens layered on top of [colorScheme] via the
  /// [TwikkaPalette] [ThemeExtension].
  final TwikkaPalette palette;

  /// Builds the text theme for this brightness, given the on-surface
  /// colours pulled from [colorScheme]. A function rather than a
  /// const value because some font loaders (e.g. `google_fonts`) are
  /// runtime calls.
  final TwikkaTextThemeBuilder buildTextTheme;
}

/// Signature of a variant's text theme builder. The builder gets the
/// brightness's on-surface and on-surface-muted colours so font
/// styles can default to the right colour without per-style copyWith.
typedef TwikkaTextThemeBuilder = TextTheme Function(
  Color onSurface,
  Color onSurfaceMuted,
);
