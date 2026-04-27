import 'package:flutter/material.dart';

import '../theme_variant.dart';
import '../twikka_palette.dart';

// ── Typography — Nunito everywhere, heavier weights ─────────────────
// Ported from Twikka v1: Nunito as a single family, big display sizes
// at w900/w800/w700, w600+ for titles. Lands punchier than the Warm
// Coach's Fraunces serif at lighter weights.

TextStyle _nunito({
  required double size,
  required FontWeight weight,
  required Color color,
  double? height,
  double letterSpacing = 0,
}) =>
    TextStyle(
      fontFamily: 'Nunito',
      fontSize: size,
      fontWeight: weight,
      height: height,
      letterSpacing: letterSpacing,
      color: color,
    );

TextTheme _buildTextTheme(Color onSurface, Color onSurfaceMuted) {
  TextStyle ink({
    required double size,
    required FontWeight weight,
    double? height,
    double letterSpacing = 0,
  }) =>
      _nunito(
        size: size,
        weight: weight,
        color: onSurface,
        height: height,
        letterSpacing: letterSpacing,
      );

  TextStyle muted({
    required double size,
    required FontWeight weight,
    double? height,
    double letterSpacing = 0,
  }) =>
      _nunito(
        size: size,
        weight: weight,
        color: onSurfaceMuted,
        height: height,
        letterSpacing: letterSpacing,
      );

  return TextTheme(
    displayLarge: ink(size: 57, weight: FontWeight.w900, height: 1.05),
    displayMedium: ink(size: 45, weight: FontWeight.w800, height: 1.10),
    displaySmall: ink(size: 36, weight: FontWeight.w700, height: 1.15),
    headlineLarge: ink(size: 32, weight: FontWeight.w700, height: 1.20),
    headlineMedium: ink(size: 28, weight: FontWeight.w600, height: 1.25),
    headlineSmall: ink(size: 24, weight: FontWeight.w600, height: 1.30),
    titleLarge: ink(size: 22, weight: FontWeight.w700, height: 1.20),
    titleMedium: ink(size: 18, weight: FontWeight.w700, height: 1.30),
    titleSmall: muted(size: 14, weight: FontWeight.w600, letterSpacing: 0.4),
    bodyLarge: ink(size: 17, weight: FontWeight.w400, height: 1.45),
    bodyMedium: ink(size: 15, weight: FontWeight.w400, height: 1.45),
    bodySmall: muted(size: 13, weight: FontWeight.w400, height: 1.40),
    labelLarge: ink(size: 15, weight: FontWeight.w600),
    labelMedium: ink(size: 13, weight: FontWeight.w600),
    labelSmall: muted(size: 11, weight: FontWeight.w700, letterSpacing: 1.0),
  );
}

// ── Classic palette source-of-truth ──────────────────────────────────
// Ported from the original Twikka v1 app (Nunito + purple/yellow/green
// brand). Less moody than warm_coach — cleaner whites in light mode,
// deep aubergine canvas in dark mode.

// Brand
const Color _primary = Color(0xFF5F27CD); // signature purple
const Color _primaryDark = Color(0xFF8276D9);
const Color _secondary = Color(0xFFFFA000); // amber yellow
const Color _tertiary = Color(0xFF21C478); // mint green
const Color _accent = Color(0xFFFFA000); // alias for the warm signal hue

// Light surfaces — clean whites, near-neutral paper.
const Color _lightSurface = Color(0xFFFFFFFF);
const Color _lightSurfaceDim = Color(0xFFE0E0E0);
const Color _lightSurfaceBright = Color(0xFFF5F5F5);
const Color _lightSurfaceLowest = Color(0xFFFFFFFF);
const Color _lightSurfaceLow = Color(0xFFF9F9F9);
const Color _lightSurfaceContainer = Color(0xFFF5F5F5);
const Color _lightSurfaceHigh = Color(0xFFECEFF1);
const Color _lightSurfaceHighest = Color(0xFFE0E0E0);
const Color _lightInk = Color(0xFF201425);
const Color _lightInk2 = Color(0xFF3A2C44);
const Color _lightMuted = Color(0xFF6E627A);
const Color _lightMuted2 = Color(0xFF9A8FA6);
const Color _lightOutline = Color(0xFFD8D2DE);
const Color _lightOutlineVariant = Color(0xFFE8E2EC);

// Containers (light)
const Color _primaryContainer = Color(0xFFE3DFFF);
const Color _onPrimaryContainer = Color(0xFF2D1E5F);
const Color _secondaryContainer = Color(0xFFFFE27A);
const Color _onSecondaryContainer = Color(0xFF5D3B00);
const Color _tertiaryContainer = Color(0xFF99E6BD);
const Color _onTertiaryContainer = Color(0xFF00230E);
const Color _primaryTint = Color(0xFFEEEAFF);

// Errors (light)
const Color _error = Color(0xFFBA1A1A);
const Color _errorContainer = Color(0xFFFFDAD6);

// Semantic light
const Color _successContainer = Color(0xFFCDF1DB);
const Color _onSuccessContainer = Color(0xFF003D1E);
const Color _warningContainer = Color(0xFFFFE7A8);
const Color _onWarningContainer = Color(0xFF6B5500);
const Color _info = Color(0xFF54A0FF);
const Color _infoContainer = Color(0xFFD3E5FF);
const Color _onInfoContainer = Color(0xFF002A60);

// Dark surfaces — aubergine canvas.
const Color _darkSurface = Color(0xFF201425);
const Color _darkSurfaceDim = Color(0xFF121212);
const Color _darkSurfaceBright = Color(0xFF303030);
const Color _darkSurfaceLowest = Color(0xFF1C1C1C);
const Color _darkSurfaceLow = Color(0xFF222222);
const Color _darkSurfaceContainer = Color(0xFF2A1D30);
const Color _darkSurfaceHigh = Color(0xFF302036);
const Color _darkSurfaceHighest = Color(0xFF3A2A40);
const Color _darkInk = Color(0xFFF2ECFF);
const Color _darkInk2 = Color(0xFFD8CFEC);
const Color _darkMuted = Color(0xFFBAA8D0);
const Color _darkMuted2 = Color(0xFF8E7E9E);
const Color _darkOutline = Color(0xFF433952);
const Color _darkOutlineVariant = Color(0xFF332A40);

// Containers (dark)
const Color _darkPrimaryContainer = Color(0xFF3E3670);
const Color _darkOnPrimaryContainer = Color(0xFFD1C4E9);
const Color _darkSecondaryContainer = Color(0xFF8A6B00);
const Color _darkTertiaryContainer = Color(0xFF3F7D5D);
const Color _darkOnTertiaryContainer = Color(0xFFC8F8DC);
const Color _darkPrimaryTint = Color(0xFF2A1F45);

// Semantic dark
const Color _darkSuccess = Color(0xFF7CD2A4);
const Color _darkSuccessContainer = Color(0xFF1E6F4E);
const Color _darkOnSuccessContainer = Color(0xFFD5FCE5);
const Color _darkWarning = Color(0xFFE0BF60);
const Color _darkWarningContainer = Color(0xFF6B5500);
const Color _darkOnWarningContainer = Color(0xFFFFE27A);
const Color _darkInfo = Color(0xFF7CB6FF);
const Color _darkInfoContainer = Color(0xFF1A4080);
const Color _darkOnInfoContainer = Color(0xFFD3E5FF);

// ── Color schemes ────────────────────────────────────────────────────
const ColorScheme _lightScheme = ColorScheme(
  brightness: Brightness.light,
  primary: _primary,
  onPrimary: Color(0xFFFFFFFF),
  primaryContainer: _primaryContainer,
  onPrimaryContainer: _onPrimaryContainer,
  secondary: _secondary,
  onSecondary: Color(0xFF3A2200),
  secondaryContainer: _secondaryContainer,
  onSecondaryContainer: _onSecondaryContainer,
  tertiary: _tertiary,
  onTertiary: Color(0xFF003C1F),
  tertiaryContainer: _tertiaryContainer,
  onTertiaryContainer: _onTertiaryContainer,
  surface: _lightSurface,
  onSurface: _lightInk,
  surfaceDim: _lightSurfaceDim,
  surfaceBright: _lightSurfaceBright,
  surfaceContainerLowest: _lightSurfaceLowest,
  surfaceContainerLow: _lightSurfaceLow,
  surfaceContainer: _lightSurfaceContainer,
  surfaceContainerHigh: _lightSurfaceHigh,
  surfaceContainerHighest: _lightSurfaceHighest,
  onSurfaceVariant: _lightMuted,
  outline: _lightOutline,
  outlineVariant: _lightOutlineVariant,
  shadow: Color(0x14000000),
  scrim: Color(0x40000000),
  inverseSurface: _lightInk,
  onInverseSurface: Color(0xFFFFFFFF),
  inversePrimary: Color(0xFFC5B8FF),
  error: _error,
  onError: Color(0xFFFFFFFF),
  errorContainer: _errorContainer,
  onErrorContainer: Color(0xFF410002),
);

const ColorScheme _darkScheme = ColorScheme(
  brightness: Brightness.dark,
  primary: _primaryDark,
  onPrimary: _darkSurface,
  primaryContainer: _darkPrimaryContainer,
  onPrimaryContainer: _darkOnPrimaryContainer,
  secondary: _secondary,
  onSecondary: Color(0xFF3A2200),
  secondaryContainer: _darkSecondaryContainer,
  onSecondaryContainer: Color(0xFFFFE27A),
  tertiary: _tertiary,
  onTertiary: Color(0xFF002A14),
  tertiaryContainer: _darkTertiaryContainer,
  onTertiaryContainer: _darkOnTertiaryContainer,
  surface: _darkSurface,
  onSurface: _darkInk,
  surfaceDim: _darkSurfaceDim,
  surfaceBright: _darkSurfaceBright,
  surfaceContainerLowest: _darkSurfaceLowest,
  surfaceContainerLow: _darkSurfaceLow,
  surfaceContainer: _darkSurfaceContainer,
  surfaceContainerHigh: _darkSurfaceHigh,
  surfaceContainerHighest: _darkSurfaceHighest,
  onSurfaceVariant: _darkMuted,
  outline: _darkOutline,
  outlineVariant: _darkOutlineVariant,
  shadow: Colors.black,
  scrim: Color(0x80000000),
  inverseSurface: _darkInk,
  onInverseSurface: _darkSurface,
  inversePrimary: _primary,
  error: Color(0xFFFFB4AB),
  onError: Color(0xFF690005),
  errorContainer: Color(0xFF93000A),
  onErrorContainer: Color(0xFFFFDAD6),
);

// ── Twikka palettes ──────────────────────────────────────────────────
const TwikkaPalette _lightPalette = TwikkaPalette(
  paperDeep: _lightSurfaceHigh,
  cream: _primaryTint,
  creamDeep: _primaryContainer,
  ink2: _lightInk2,
  muted2: _lightMuted2,
  accentSoft: _primaryContainer,
  accentTint: _primaryTint,
  success: _tertiary,
  onSuccess: Color(0xFFFFFFFF),
  successContainer: _successContainer,
  onSuccessContainer: _onSuccessContainer,
  warning: _accent,
  onWarning: Color(0xFF3A2200),
  warningContainer: _warningContainer,
  onWarningContainer: _onWarningContainer,
  info: _info,
  onInfo: Color(0xFFFFFFFF),
  infoContainer: _infoContainer,
  onInfoContainer: _onInfoContainer,
);

const TwikkaPalette _darkPalette = TwikkaPalette(
  paperDeep: _darkSurfaceDim,
  cream: _darkSurfaceContainer,
  creamDeep: _darkSurfaceHigh,
  ink2: _darkInk2,
  muted2: _darkMuted2,
  accentSoft: _darkPrimaryContainer,
  accentTint: _darkPrimaryTint,
  success: _darkSuccess,
  onSuccess: Color(0xFF002A14),
  successContainer: _darkSuccessContainer,
  onSuccessContainer: _darkOnSuccessContainer,
  warning: _darkWarning,
  onWarning: Color(0xFF3A2200),
  warningContainer: _darkWarningContainer,
  onWarningContainer: _darkOnWarningContainer,
  info: _darkInfo,
  onInfo: Color(0xFF002A60),
  infoContainer: _darkInfoContainer,
  onInfoContainer: _darkOnInfoContainer,
);

// ── Variant ──────────────────────────────────────────────────────────
const ThemeVariant classicVariant = ThemeVariant(
  id: 'classic',
  displayName: 'Classic',
  description: 'The original Twikka — Nunito, purple, amber, mint.',
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
