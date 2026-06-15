/// Twikka theme system entry-point.
///
/// All callers should import *this* file and read theme data from
/// `Theme.of(context)` — never from a variant directly. To switch
/// themes, use [ThemeController.setVariant] / [ThemeController.setMode].
///
/// Layout:
///   • theme_constants.dart     — design tokens (gaps, radii, sizes, motion)
///   • twikka_palette.dart      — ThemeExtension carrying Twikka-specific colours
///   • theme_variant.dart       — value type for one variant (light + dark configs)
///   • theme_builder.dart       — buildTwikkaTheme(palette) → ThemeData
///   • variants/<id>.dart       — palette + ThemeVariant per variant
///   • theme_registry.dart      — list of all variants + default
///   • theme_controller.dart    — Riverpod controller for {variant, mode}
///
/// To add a new variant: create `variants/<id>.dart` exporting a
/// `const ThemeVariant`, then add it to `twikkaThemeVariants` in
/// `theme_registry.dart`.
library;

export 'theme_builder.dart';
export 'theme_constants.dart';
export 'theme_controller.dart';
export 'theme_registry.dart';
export 'theme_variant.dart';
export 'twikka_palette.dart';
