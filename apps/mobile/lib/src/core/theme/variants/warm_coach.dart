import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme_constants.dart';
import '../theme_variant.dart';
import '../twikka_palette.dart';

// ── Typography — Fraunces serif (display) + Plus Jakarta Sans (body) ─

TextTheme _buildTextTheme(Color onSurface, Color onSurfaceMuted) {
  TextStyle serif({
    required double size,
    FontWeight weight = FontWeight.w500,
    double? height,
    double letterSpacing = -0.01,
    Color? color,
  }) =>
      GoogleFonts.fraunces(
        fontSize: size,
        fontWeight: weight,
        height: height,
        letterSpacing: letterSpacing * size,
        color: color ?? onSurface,
      );

  TextStyle sans({
    required double size,
    FontWeight weight = FontWeight.w400,
    double? height,
    double letterSpacing = 0,
    Color? color,
  }) =>
      GoogleFonts.plusJakartaSans(
        fontSize: size,
        fontWeight: weight,
        height: height,
        letterSpacing: letterSpacing,
        color: color ?? onSurface,
      );

  return TextTheme(
    displayLarge: serif(size: kFontDisplayLarge, weight: FontWeight.w400, height: 1.05),
    displayMedium: serif(size: kFontDisplayMedium, weight: FontWeight.w400, height: 1.10),
    displaySmall: serif(size: kFontDisplaySmall, weight: FontWeight.w400, height: 1.15),
    headlineLarge: serif(size: kFontHeadlineLarge, weight: FontWeight.w400, height: 1.20),
    headlineMedium: serif(size: kFontHeadlineMedium, weight: FontWeight.w500, height: 1.25),
    headlineSmall: serif(size: kFontHeadlineSmall, weight: FontWeight.w500, height: 1.30),
    titleLarge: serif(size: kFontTitleLarge, weight: FontWeight.w500, height: 1.20),
    titleMedium: serif(size: kFontTitleMedium, weight: FontWeight.w500, height: 1.30),
    titleSmall: sans(
      size: kFontTitleSmall,
      weight: FontWeight.w600,
      letterSpacing: 0.6,
      color: onSurfaceMuted,
    ),
    bodyLarge: sans(size: kFontBodyLarge, weight: FontWeight.w400, height: 1.45),
    bodyMedium: sans(size: kFontBodyMedium, weight: FontWeight.w400, height: 1.45),
    bodySmall: sans(size: kFontBodySmall, weight: FontWeight.w400, height: 1.40, color: onSurfaceMuted),
    labelLarge: sans(size: kFontLabelLarge, weight: FontWeight.w500),
    labelMedium: sans(size: kFontLabelMedium, weight: FontWeight.w500),
    labelSmall: sans(size: kFontLabelSmall, weight: FontWeight.w600, letterSpacing: 1.0, color: onSurfaceMuted),
  );
}

// ── Warm Coach palette source-of-truth ───────────────────────────────
// Light surfaces — warm, paper-coloured.
const Color _bg = Color(0xFFFAF8F5); // app background
const Color _paper = Color(0xFFFFFDF9); // raised surfaces (cards, headers)
const Color _paperDeep = Color(0xFFF6F2EB); // canvas behind device
const Color _cream = Color(0xFFF3EEE6); // coach bubble / cream cards
const Color _creamDeep = Color(0xFFECE5D8); // card inner
const Color _hairline = Color(0xFFE7E0D5);

// Ink + muted (light)
const Color _ink = Color(0xFF1F2A2E);
const Color _ink2 = Color(0xFF3D4A4F);
const Color _muted = Color(0xFF6B6560);
const Color _muted2 = Color(0xFF938B84);

// Brand
const Color _terracotta = Color(0xFFC97B5E);
const Color _terracottaSoft = Color(0xFFE9CDBE);
const Color _terracottaTint = Color(0xFFF5E4D9);
const Color _sage = Color(0xFF8FA48C);
const Color _sageSoft = Color(0xFFD4DCCF);
const Color _clay = Color(0xFFB89072);
const Color _claySoft = Color(0xFFE6D3C0);

// Errors (kept calm)
const Color _error = Color(0xFFB05A45);
const Color _errorSoft = Color(0xFFEED4CB);

// Semantic light
const Color _successContainer = Color(0xFFD4E3D0);
const Color _onSuccessContainer = Color(0xFF2E4A2A);
const Color _warningContainer = Color(0xFFF5DCBE);
const Color _onWarningContainer = Color(0xFF6B4A1A);
const Color _infoContainer = Color(0xFFD3E0EA);
const Color _onInfoContainer = Color(0xFF2A4A60);

// Dark surfaces
const Color _darkSurface = Color(0xFF1B1815);
const Color _darkSurfaceDim = Color(0xFF14110F);
const Color _darkSurfaceLow = Color(0xFF1F1B18);
const Color _darkSurfaceCream = Color(0xFF24201C);
const Color _darkSurfaceCreamDeep = Color(0xFF2A2521);
const Color _darkSurfaceHigh = Color(0xFF332D28);
const Color _darkInk = Color(0xFFEFEAE0);
const Color _darkInk2 = Color(0xFFD8D2C4);
const Color _darkMuted = Color(0xFFB8B0A4);
const Color _darkMuted2 = Color(0xFF8C8478);
const Color _darkOutline = Color(0xFF433D36);
const Color _darkOutlineVariant = Color(0xFF332D28);

// Dark brand
const Color _darkAccent = Color(0xFFEDC4B2);
const Color _darkAccentContainer = Color(0xFF3F261A);
const Color _darkAccentSoft = Color(0xFF6B3F2A);
const Color _darkAccentTint = Color(0xFF2A1A12);
const Color _darkSecondary = Color(0xFFC8D6C4);
const Color _darkSecondaryContainer = Color(0xFF2D3A2C);
const Color _darkTertiary = Color(0xFFD8C4AE);
const Color _darkTertiaryContainer = Color(0xFF3F2F22);

// Semantic dark
const Color _darkSuccess = Color(0xFFA8C4A4);
const Color _darkSuccessContainer = Color(0xFF2E4A2A);
const Color _darkOnSuccess = Color(0xFF1A2A18);
const Color _darkOnSuccessContainer = Color(0xFFD4E3D0);
const Color _darkWarning = Color(0xFFE6BC8E);
const Color _darkWarningContainer = Color(0xFF6B4A1A);
const Color _darkOnWarning = Color(0xFF2A1F0F);
const Color _darkOnWarningContainer = Color(0xFFF5DCBE);
const Color _darkInfo = Color(0xFFA8C0D0);
const Color _darkInfoContainer = Color(0xFF2A4A60);
const Color _darkOnInfo = Color(0xFF112030);
const Color _darkOnInfoContainer = Color(0xFFD3E0EA);

// ── Color schemes ────────────────────────────────────────────────────
const ColorScheme _lightScheme = ColorScheme(
  brightness: Brightness.light,
  primary: _terracotta,
  onPrimary: _paper,
  primaryContainer: _terracottaTint,
  onPrimaryContainer: _ink,
  secondary: _sage,
  onSecondary: _paper,
  secondaryContainer: _sageSoft,
  onSecondaryContainer: _ink,
  tertiary: _clay,
  onTertiary: _paper,
  tertiaryContainer: _claySoft,
  onTertiaryContainer: _ink,
  surface: _bg,
  onSurface: _ink,
  surfaceDim: _paperDeep,
  surfaceBright: _paper,
  surfaceContainerLowest: _paper,
  surfaceContainerLow: _paperDeep,
  surfaceContainer: _cream,
  surfaceContainerHigh: _creamDeep,
  surfaceContainerHighest: _creamDeep,
  onSurfaceVariant: _muted,
  outline: _hairline,
  outlineVariant: _hairline,
  shadow: Color(0x141F2A2E),
  scrim: Color(0x401F2A2E),
  inverseSurface: _ink,
  onInverseSurface: _paper,
  inversePrimary: _terracottaSoft,
  error: _error,
  onError: _paper,
  errorContainer: _errorSoft,
  onErrorContainer: _ink,
);

const ColorScheme _darkScheme = ColorScheme(
  brightness: Brightness.dark,
  primary: _darkAccent,
  onPrimary: _darkAccentTint,
  primaryContainer: _darkAccentContainer,
  onPrimaryContainer: _darkAccent,
  secondary: _darkSecondary,
  onSecondary: Color(0xFF1A2117),
  secondaryContainer: _darkSecondaryContainer,
  onSecondaryContainer: _darkSecondary,
  tertiary: _darkTertiary,
  onTertiary: Color(0xFF2A1F15),
  tertiaryContainer: _darkTertiaryContainer,
  onTertiaryContainer: _darkTertiary,
  surface: _darkSurface,
  onSurface: _darkInk,
  surfaceDim: _darkSurfaceDim,
  surfaceBright: _darkSurfaceCreamDeep,
  surfaceContainerLowest: _darkSurfaceDim,
  surfaceContainerLow: _darkSurfaceLow,
  surfaceContainer: _darkSurfaceCream,
  surfaceContainerHigh: _darkSurfaceCreamDeep,
  surfaceContainerHighest: _darkSurfaceHigh,
  onSurfaceVariant: _darkMuted,
  outline: _darkOutline,
  outlineVariant: _darkOutlineVariant,
  shadow: Colors.black,
  scrim: Color(0x80000000),
  inverseSurface: _darkInk,
  onInverseSurface: _darkSurface,
  inversePrimary: _terracotta,
  error: Color(0xFFEDA38F),
  onError: _darkAccentTint,
  errorContainer: Color(0xFF4A2A1F),
  onErrorContainer: Color(0xFFEDA38F),
);

// ── Twikka palettes (extension data) ─────────────────────────────────
const TwikkaPalette _lightPalette = TwikkaPalette(
  paperDeep: _paperDeep,
  cream: _cream,
  creamDeep: _creamDeep,
  ink2: _ink2,
  muted2: _muted2,
  accentSoft: _terracottaSoft,
  accentTint: _terracottaTint,
  success: _sage,
  onSuccess: _paper,
  successContainer: _successContainer,
  onSuccessContainer: _onSuccessContainer,
  warning: _clay,
  onWarning: _paper,
  warningContainer: _warningContainer,
  onWarningContainer: _onWarningContainer,
  info: Color(0xFF7EA0B5),
  onInfo: _paper,
  infoContainer: _infoContainer,
  onInfoContainer: _onInfoContainer,
);

const TwikkaPalette _darkPalette = TwikkaPalette(
  paperDeep: _darkSurfaceDim,
  cream: _darkSurfaceCream,
  creamDeep: _darkSurfaceCreamDeep,
  ink2: _darkInk2,
  muted2: _darkMuted2,
  accentSoft: _darkAccentSoft,
  accentTint: _darkAccentContainer,
  success: _darkSuccess,
  onSuccess: _darkOnSuccess,
  successContainer: _darkSuccessContainer,
  onSuccessContainer: _darkOnSuccessContainer,
  warning: _darkWarning,
  onWarning: _darkOnWarning,
  warningContainer: _darkWarningContainer,
  onWarningContainer: _darkOnWarningContainer,
  info: _darkInfo,
  onInfo: _darkOnInfo,
  infoContainer: _darkInfoContainer,
  onInfoContainer: _darkOnInfoContainer,
);

// ── Variant ──────────────────────────────────────────────────────────
const ThemeVariant warmCoachVariant = ThemeVariant(
  id: 'warm_coach',
  displayName: 'Warm Coach',
  description: 'Terracotta and sage. Fraunces serif headlines.',
  light: ThemeBrightnessConfig(
    colorScheme: _lightScheme,
    palette: _lightPalette,
    buildTextTheme: _buildTextTheme,
  ),
  dark: ThemeBrightnessConfig(
    colorScheme: _darkScheme,
    palette: _darkPalette,
    buildTextTheme: _buildTextTheme,
  ),
);
