import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'theme_constants.dart';

// Twikka uses two type families:
//   • Fraunces — display serif (warm, soft optical settings)
//   • Plus Jakarta Sans — UI / body
// `display*`, `headline*`, `title*` lean on Fraunces; the rest is Plus Jakarta.

TextStyle _serif({
  required double size,
  FontWeight weight = FontWeight.w500,
  double? height,
  double letterSpacing = -0.01,
  Color color = twInk,
  FontStyle style = FontStyle.normal,
}) =>
    GoogleFonts.fraunces(
      fontSize: size,
      fontWeight: weight,
      height: height,
      letterSpacing: letterSpacing * size,
      color: color,
      fontStyle: style,
    );

TextStyle _sans({
  required double size,
  FontWeight weight = FontWeight.w400,
  double? height,
  double letterSpacing = 0,
  Color color = twInk,
}) =>
    GoogleFonts.plusJakartaSans(
      fontSize: size,
      fontWeight: weight,
      height: height,
      letterSpacing: letterSpacing,
      color: color,
    );

TextTheme _buildTextTheme({required Color onSurface, required Color onSurfaceMuted}) {
  return TextTheme(
    // Display + headline + title — Fraunces serif
    displayLarge:   _serif(size: 44, weight: FontWeight.w400, height: 1.05, color: onSurface),
    displayMedium:  _serif(size: 36, weight: FontWeight.w400, height: 1.10, color: onSurface),
    displaySmall:   _serif(size: 30, weight: FontWeight.w400, height: 1.15, color: onSurface),
    headlineLarge:  _serif(size: 28, weight: FontWeight.w400, height: 1.20, color: onSurface),
    headlineMedium: _serif(size: 24, weight: FontWeight.w500, height: 1.25, color: onSurface),
    headlineSmall:  _serif(size: 20, weight: FontWeight.w500, height: 1.30, color: onSurface),
    titleLarge:     _serif(size: 22, weight: FontWeight.w500, height: 1.20, color: onSurface),
    titleMedium:    _serif(size: 18, weight: FontWeight.w500, height: 1.30, color: onSurface),
    titleSmall:     _sans(size: 13, weight: FontWeight.w600, color: onSurfaceMuted, letterSpacing: 0.6),

    // Body + label — Plus Jakarta Sans
    bodyLarge:  _sans(size: 17, weight: FontWeight.w400, height: 1.45, color: onSurface),
    bodyMedium: _sans(size: 15, weight: FontWeight.w400, height: 1.45, color: onSurface),
    bodySmall:  _sans(size: 13, weight: FontWeight.w400, height: 1.40, color: onSurfaceMuted),

    labelLarge:  _sans(size: 15, weight: FontWeight.w500, color: onSurface),
    labelMedium: _sans(size: 13, weight: FontWeight.w500, color: onSurface),
    labelSmall:  _sans(size: 11, weight: FontWeight.w600, color: onSurfaceMuted, letterSpacing: 1.0),
  );
}

const ColorScheme _lightScheme = ColorScheme(
  brightness: Brightness.light,
  primary: twAccent,
  onPrimary: twPaper,
  primaryContainer: twAccentTint,
  onPrimaryContainer: twInk,
  secondary: twSage,
  onSecondary: twPaper,
  secondaryContainer: twSageSoft,
  onSecondaryContainer: twInk,
  tertiary: twClay,
  onTertiary: twPaper,
  tertiaryContainer: twClaySoft,
  onTertiaryContainer: twInk,
  surface: twBg,
  onSurface: twInk,
  surfaceDim: twPaperDeep,
  surfaceBright: twPaper,
  surfaceContainerLowest: twPaper,
  surfaceContainerLow: twPaperDeep,
  surfaceContainer: twCream,
  surfaceContainerHigh: twCreamDeep,
  surfaceContainerHighest: twCreamDeep,
  onSurfaceVariant: twMuted,
  outline: twHairline,
  outlineVariant: twHairline,
  shadow: Color(0x141F2A2E),
  scrim: Color(0x401F2A2E),
  inverseSurface: twInk,
  onInverseSurface: twPaper,
  inversePrimary: twAccentSoft,
  error: twError,
  onError: twPaper,
  errorContainer: twErrorSoft,
  onErrorContainer: twInk,
);

// Dark scheme — kept warm. Same hue family, deeper neutrals.
const ColorScheme _darkScheme = ColorScheme(
  brightness: Brightness.dark,
  primary: twAccentSoft,
  onPrimary: Color(0xFF2A1A12),
  primaryContainer: Color(0xFF3F261A),
  onPrimaryContainer: twAccentSoft,
  secondary: twSageSoft,
  onSecondary: Color(0xFF1A2117),
  secondaryContainer: Color(0xFF2D3A2C),
  onSecondaryContainer: twSageSoft,
  tertiary: twClaySoft,
  onTertiary: Color(0xFF2A1F15),
  tertiaryContainer: Color(0xFF3F2F22),
  onTertiaryContainer: twClaySoft,
  surface: Color(0xFF1B1815),
  onSurface: Color(0xFFEFEAE0),
  surfaceDim: Color(0xFF14110F),
  surfaceBright: Color(0xFF2A2521),
  surfaceContainerLowest: Color(0xFF14110F),
  surfaceContainerLow: Color(0xFF1F1B18),
  surfaceContainer: Color(0xFF24201C),
  surfaceContainerHigh: Color(0xFF2A2521),
  surfaceContainerHighest: Color(0xFF332D28),
  onSurfaceVariant: Color(0xFFB8B0A4),
  outline: Color(0xFF433D36),
  outlineVariant: Color(0xFF332D28),
  shadow: Colors.black,
  scrim: Color(0x80000000),
  inverseSurface: Color(0xFFEFEAE0),
  onInverseSurface: Color(0xFF1B1815),
  inversePrimary: twAccent,
  error: Color(0xFFEDA38F),
  onError: Color(0xFF2A1A12),
  errorContainer: Color(0xFF4A2A1F),
  onErrorContainer: Color(0xFFEDA38F),
);

ThemeData _buildTheme(ColorScheme scheme) {
  final isLight = scheme.brightness == Brightness.light;
  final textTheme = _buildTextTheme(
    onSurface: scheme.onSurface,
    onSurfaceMuted: scheme.onSurfaceVariant,
  );

  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: scheme.surface,
    canvasColor: scheme.surface,
    textTheme: textTheme,
    splashFactory: NoSplash.splashFactory,
    pageTransitionsTheme: const PageTransitionsTheme(
      builders: {
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        TargetPlatform.android: ZoomPageTransitionsBuilder(),
        TargetPlatform.macOS: CupertinoPageTransitionsBuilder(),
      },
    ),

    // Buttons
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: scheme.primary,
        foregroundColor: isLight ? twPaper : Colors.black,
        textStyle: textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w600),
        shape: const StadiumBorder(),
        padding: const EdgeInsets.symmetric(horizontal: gap5, vertical: gap3),
        minimumSize: const Size(0, 48),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: scheme.primary,
        foregroundColor: isLight ? twPaper : Colors.black,
        elevation: 0,
        shape: const StadiumBorder(),
        textStyle: textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w600),
        padding: const EdgeInsets.symmetric(horizontal: gap5, vertical: gap3),
        minimumSize: const Size(0, 48),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: scheme.onSurface,
        side: BorderSide(color: scheme.outline),
        shape: const StadiumBorder(),
        textStyle: textTheme.labelLarge,
        padding: const EdgeInsets.symmetric(horizontal: gap5, vertical: gap3),
        minimumSize: const Size(0, 48),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: scheme.primary,
        textStyle: textTheme.labelLarge,
      ),
    ),

    // Inputs
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: isLight ? twCream : scheme.surfaceContainerHigh,
      contentPadding: const EdgeInsets.symmetric(horizontal: gap4, vertical: gap3),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: BorderSide(color: scheme.outline),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: BorderSide(color: scheme.outline),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: BorderSide(color: scheme.primary, width: 1.5),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: BorderSide(color: scheme.error),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: BorderSide(color: scheme.error, width: 1.5),
      ),
      labelStyle: textTheme.bodyMedium?.copyWith(color: scheme.onSurfaceVariant),
      floatingLabelStyle: textTheme.bodySmall?.copyWith(color: scheme.primary),
      hintStyle: textTheme.bodyMedium?.copyWith(color: scheme.onSurfaceVariant),
    ),

    // App bar — flat, paper background, serif title
    appBarTheme: AppBarTheme(
      backgroundColor: isLight ? twPaper : scheme.surfaceContainer,
      foregroundColor: scheme.onSurface,
      elevation: 0,
      scrolledUnderElevation: 0,
      surfaceTintColor: Colors.transparent,
      centerTitle: false,
      // gap4 (18) leading inset matches the body content padding on
      // every screen — keeps the title aligned with the list/heading
      // beneath it. Per-screen overrides should be rare.
      titleSpacing: gap4,
      titleTextStyle: textTheme.titleLarge,
      iconTheme: IconThemeData(color: scheme.onSurfaceVariant, size: 22),
      shape: Border(
        bottom: BorderSide(color: scheme.outline, width: 0.5),
      ),
    ),

    // Bottom + rail navigation — paper background, terracotta accent.
    // Selection is communicated by the icon swap (Phosphor Regular →
    // Fill) plus a colour shift to twAccent. The Material indicator
    // pill is suppressed (transparent) so we don't shade-tint behind
    // the icon.
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: isLight ? twPaper : scheme.surfaceContainer,
      indicatorColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return textTheme.labelMedium?.copyWith(
          fontWeight: FontWeight.w600,
          color: selected ? twAccent : scheme.onSurfaceVariant,
        );
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return IconThemeData(
          color: selected ? twAccent : scheme.onSurfaceVariant,
          size: 26,
        );
      }),
      height: 72,
    ),
    navigationRailTheme: NavigationRailThemeData(
      backgroundColor: isLight ? twPaper : scheme.surfaceContainer,
      // Match the bottom NavigationBar: selection is the icon swap +
      // accent-coloured glyph, no pill behind it.
      indicatorColor: Colors.transparent,
      useIndicator: true,
      selectedIconTheme: const IconThemeData(color: twAccent, size: 26),
      unselectedIconTheme: IconThemeData(
        color: scheme.onSurfaceVariant,
        size: 26,
      ),
      selectedLabelTextStyle: textTheme.labelMedium?.copyWith(
        fontWeight: FontWeight.w600,
        color: twAccent,
      ),
      unselectedLabelTextStyle: textTheme.labelMedium?.copyWith(
        color: scheme.onSurfaceVariant,
      ),
    ),

    // Dividers / lists
    dividerTheme: DividerThemeData(
      color: scheme.outline,
      space: 0,
      thickness: 0.5,
    ),
    listTileTheme: ListTileThemeData(
      iconColor: scheme.onSurfaceVariant,
      titleTextStyle: textTheme.bodyLarge,
      subtitleTextStyle: textTheme.bodySmall,
      contentPadding: const EdgeInsets.symmetric(horizontal: gap4, vertical: gap1),
    ),

    // Misc
    chipTheme: ChipThemeData(
      backgroundColor: scheme.surfaceContainer,
      selectedColor: scheme.primaryContainer,
      labelStyle: textTheme.labelMedium,
      side: BorderSide(color: scheme.outline),
      padding: const EdgeInsets.symmetric(horizontal: gap2),
      shape: const StadiumBorder(),
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: scheme.inverseSurface,
      contentTextStyle: textTheme.bodyMedium?.copyWith(color: scheme.onInverseSurface),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(radiusMd)),
    ),
  );
}

ThemeData lightTheme() => _buildTheme(_lightScheme);
ThemeData darkTheme() => _buildTheme(_darkScheme);
