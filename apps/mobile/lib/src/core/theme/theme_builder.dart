import 'package:flutter/material.dart';

import 'theme_constants.dart';
import 'theme_variant.dart';

/// Build a [ThemeData] from a variant's brightness config.
///
/// All sub-themes — buttons, inputs, AppBar, navigation, dividers,
/// list tiles, chips, snackbars — derive their colours from
/// [ThemeBrightnessConfig.colorScheme]. Sizing comes from
/// `theme_constants.dart`. The Twikka-specific extension is registered
/// so feature code can read it via `context.tw.<token>`.
ThemeData buildTwikkaTheme(ThemeBrightnessConfig config) {
  final scheme = config.colorScheme;
  final isLight = scheme.brightness == Brightness.light;
  final textTheme = config.buildTextTheme(
    scheme.onSurface,
    scheme.onSurfaceVariant,
  );

  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: scheme.surface,
    canvasColor: scheme.surface,
    textTheme: textTheme,
    splashFactory: NoSplash.splashFactory,
    extensions: [config.palette],
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
        foregroundColor: scheme.onPrimary,
        textStyle: textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w600),
        shape: const StadiumBorder(),
        padding: const EdgeInsets.symmetric(horizontal: gap5, vertical: gap3),
        minimumSize: const Size(0, kButtonMinHeight),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: scheme.primary,
        foregroundColor: scheme.onPrimary,
        elevation: 0,
        shape: const StadiumBorder(),
        textStyle: textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w600),
        padding: const EdgeInsets.symmetric(horizontal: gap5, vertical: gap3),
        minimumSize: const Size(0, kButtonMinHeight),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: scheme.onSurface,
        side: BorderSide(color: scheme.outline),
        shape: const StadiumBorder(),
        textStyle: textTheme.labelLarge,
        padding: const EdgeInsets.symmetric(horizontal: gap5, vertical: gap3),
        minimumSize: const Size(0, kButtonMinHeight),
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
      fillColor:
          isLight ? scheme.surfaceContainer : scheme.surfaceContainerHigh,
      contentPadding:
          const EdgeInsets.symmetric(horizontal: gap4, vertical: gap3),
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
      labelStyle:
          textTheme.bodyMedium?.copyWith(color: scheme.onSurfaceVariant),
      floatingLabelStyle:
          textTheme.bodySmall?.copyWith(color: scheme.primary),
      hintStyle:
          textTheme.bodyMedium?.copyWith(color: scheme.onSurfaceVariant),
    ),

    // App bar — flat, surface background, serif title.
    appBarTheme: AppBarTheme(
      backgroundColor:
          isLight ? scheme.surfaceContainerLowest : scheme.surfaceContainer,
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

    // Bottom + rail navigation. Selection is communicated by the icon
    // colour swap — Material's indicator pill is suppressed so we
    // don't shade-tint behind the icon.
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor:
          isLight ? scheme.surfaceContainerLowest : scheme.surfaceContainer,
      indicatorColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return textTheme.labelMedium?.copyWith(
          fontWeight: FontWeight.w600,
          color: selected ? scheme.primary : scheme.onSurfaceVariant,
        );
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return IconThemeData(
          color: selected ? scheme.primary : scheme.onSurfaceVariant,
          size: kNavigationIconSize,
        );
      }),
      height: kNavigationBarHeight,
    ),
    navigationRailTheme: NavigationRailThemeData(
      backgroundColor:
          isLight ? scheme.surfaceContainerLowest : scheme.surfaceContainer,
      indicatorColor: Colors.transparent,
      useIndicator: true,
      selectedIconTheme:
          IconThemeData(color: scheme.primary, size: kNavigationIconSize),
      unselectedIconTheme: IconThemeData(
        color: scheme.onSurfaceVariant,
        size: kNavigationIconSize,
      ),
      selectedLabelTextStyle: textTheme.labelMedium?.copyWith(
        fontWeight: FontWeight.w600,
        color: scheme.primary,
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
      contentPadding:
          const EdgeInsets.symmetric(horizontal: gap4, vertical: gap1),
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
      contentTextStyle:
          textTheme.bodyMedium?.copyWith(color: scheme.onInverseSurface),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusMd),
      ),
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: scheme.surface,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusLg),
      ),
      titleTextStyle: textTheme.titleMedium,
      contentTextStyle: textTheme.bodyMedium,
    ),
  );
}

