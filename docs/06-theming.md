# Theming

Twikka supports multiple visual variants (Classic, Warm Coach) layered on top of a shared design system. The theme system is built so that adding a new variant is a single-file change, and so that the active variant fully drives every colour and spacing the user sees — there is **zero hardcoded theme data anywhere outside `lib/src/core/theme/`**.

This document explains the architecture, the rules feature code must follow, and the recipe for adding a new variant.

---

## Goals

1. **One variant change re-tints the whole app.** The user picks a theme in Settings → Preferences and every colour, every component flips immediately. No screen-by-screen sweep.
2. **Adding a variant is trivial.** A new file under `variants/` plus one entry in the registry — that's it.
3. **Sizing and motion stay consistent across variants.** Gaps, radii, font scale, transition durations don't change with the theme.
4. **Light / dark / system mode is independent of variant.** Each variant ships both brightnesses; the user picks them separately.

---

## File layout

```
lib/src/core/theme/
├── app_theme.dart            # Single import surface for feature code (re-exports the rest)
├── theme_constants.dart      # Design tokens — sizes, gaps, radii, type scale, motion
├── twikka_palette.dart       # ThemeExtension carrying Twikka-specific colours
├── theme_variant.dart        # Value type for one variant (light + dark configs)
├── theme_builder.dart        # buildTwikkaTheme(palette) → ThemeData
├── theme_registry.dart       # List of all variants + default
├── theme_controller.dart     # Riverpod controller for {variant, mode}
└── variants/
    ├── classic.dart          # Classic — purple / amber / mint (default)
    └── warm_coach.dart       # Warm Coach — terracotta / sage / clay
```

### `theme_constants.dart` — design tokens

Pure sizing, layout, and motion. **No colours.** Anything in here is shared by every variant:

- Type scale (`kFontDisplayLarge` … `kFontLabelSmall`)
- Type families (`kSerifFamily`, `kSansFamily`)
- Gaps (`gap1` … `gap6`, `gapHair`, `gapTight`)
- Radii (`radiusSm`, `radiusMd`, …, `radiusPill`)
- Component sizing (icon sizes, avatar sizes, progress indicators)
- Responsive caps (`kFormMaxWidth`, `kContentMaxWidth`)
- Motion durations (`kMotionFast`, `kMotionMedium`, `kMotionSlow`)
- Layout breakpoints

If you need a new design-system token (e.g., a new spacing rhythm or hero font size), add it here.

### `twikka_palette.dart` — Twikka-specific colour tokens

A `ThemeExtension<TwikkaPalette>` with all the Twikka colours that don't have a clean home in Material 3's `ColorScheme`:

- Surfaces beyond `surface*`: `paperDeep`, `cream`, `creamDeep`
- Ink ladder: `ink2` (between `onSurface` and `onSurfaceVariant`), `muted2` (quieter than `onSurfaceVariant`)
- Accent variations: `accentSoft`, `accentTint`
- Semantic colours Material 3 doesn't ship: `success`, `warning`, `info` (plus `on*` and `*Container`)

Feature code reads them via the `BuildContext` extension:

```dart
context.tw.cream
context.tw.successContainer
```

That sugars `Theme.of(context).extension<TwikkaPalette>()!.<token>`. It crashes loud if no `TwikkaPalette` is registered — which would mean the builder forgot to register it, and we want to know early.

### `theme_variant.dart` — what a variant declares

Two records:

- `ThemeBrightnessConfig` — a `ColorScheme` (Material 3) and a `TwikkaPalette` (Twikka-specific).
- `ThemeVariant` — id, displayName, description, plus a light + dark `ThemeBrightnessConfig`.

That's everything the system needs from a variant. The builder turns those raw colours into a fully-styled `ThemeData`.

### `theme_builder.dart` — the only place sub-themes live

`buildTwikkaTheme(ThemeBrightnessConfig)` returns a `ThemeData` with every sub-theme wired up: buttons, inputs, AppBar, NavigationBar, NavigationRail, dividers, list tiles, chips, snackbars, dialogs. All colours come from the palette; all sizing comes from `theme_constants.dart`.

If you need to tweak how *every* button looks, you change it here. If you want one button to look different, you do that at the call site (overriding the theme is fine; redefining a sub-theme per screen is not).

### `theme_registry.dart` — list of variants

```dart
const List<ThemeVariant> twikkaThemeVariants = [
  classicVariant,
  warmCoachVariant,
];

const ThemeVariant defaultThemeVariant = classicVariant;
```

Order in the list = order shown in the picker. The default is the variant a fresh user lands on.

### `theme_controller.dart` — state

A Riverpod controller (`themeControllerProvider`) holding `{variant, mode}`. Mode is `AppThemeMode.{light, dark, system}`. Both are persisted to SharedPreferences under `theme_variant_id` and `theme_mode`. The controller exposes `setVariant(variant)`, `setMode(mode)`, and `resetToDefaults()`.

`lib/app.dart` watches the controller and feeds the active variant + mode into `MaterialApp.router`:

```dart
final themeState = ref.watch(themeControllerProvider);
return MaterialApp.router(
  theme: buildTwikkaTheme(themeState.variant.light),
  darkTheme: buildTwikkaTheme(themeState.variant.dark),
  themeMode: themeState.mode.materialMode,
  ...
);
```

---

## Rules for feature code

These exist because every leak makes "switch theme" not actually re-tint the whole app. Hold the line.

### 1. Never hardcode colours.

```dart
// ❌
Container(color: Color(0xFFC97B5E))
Icon(Icons.warning, color: Colors.orange)

// ✅
Container(color: Theme.of(context).colorScheme.primary)
Icon(TwikkaIcons.warning, color: context.tw.warning)
```

Reach order: try `Theme.of(context).colorScheme.<token>` first (Material 3 standard); if there's no fitting role, use `context.tw.<token>` (Twikka extension). If neither has a fit, **add a token to `TwikkaPalette` rather than hardcoding**.

### 2. Never hardcode font sizes / weights inline.

```dart
// ❌
TextStyle(fontSize: 18, fontWeight: FontWeight.w500)

// ✅
Theme.of(context).textTheme.titleMedium  // already w500, 18px
// or for an off-scale value:
TextStyle(fontSize: kFontBrandMark, fontWeight: FontWeight.w400)
```

If you need a font size outside the standard scale, add a token like `kFontBrandMark = 42` to `theme_constants.dart`.

### 3. Never hardcode paddings / radii.

```dart
// ❌
EdgeInsets.all(12)
BorderRadius.circular(8)

// ✅
EdgeInsets.all(gap3)
BorderRadius.circular(radiusSm)
```

The `gap1`..`gap6` scale plus `gapHair` (2) and `gapTight` (4) covers everything we have. If you reach for a number that isn't in there, that's a smell — check whether the existing scale has the right value.

### 4. Custom painters take colours via constructor, not via lookup.

`CustomPainter` doesn't have access to `BuildContext`. Pass the colours in:

```dart
class _AreaChartPainter extends CustomPainter {
  _AreaChartPainter({required this.lineColor});
  final Color lineColor;
  // ...
}

// At the call site:
CustomPaint(
  painter: _AreaChartPainter(lineColor: theme.colorScheme.primary),
)
```

Painters that re-paint frequently should also include any theme-derived colours in their `shouldRepaint` comparison.

### 5. `const` widgets vs. theme: drop `const` when the theme is needed.

When `Theme.of(context)` (or `context.tw.x`) is used inside what *was* a const widget tree, drop the `const`. The compiler will tell you. A non-const widget that re-tints with the theme is better than a const widget with a hardcoded colour.

---

## Adding a new variant

Three steps. None of them touch feature code.

### 1. Create the variant file

`lib/src/core/theme/variants/<id>.dart`:

```dart
import 'package:flutter/material.dart';

import '../theme_variant.dart';
import '../twikka_palette.dart';

const ColorScheme _lightScheme = ColorScheme(
  brightness: Brightness.light,
  primary: Color(0xFF...),
  // ... fill in the full ColorScheme. Use Material's Theme Builder
  // (m3.material.io/theme-builder) to generate from a seed colour.
);

const ColorScheme _darkScheme = ColorScheme(
  brightness: Brightness.dark,
  primary: Color(0xFF...),
  // ...
);

const TwikkaPalette _lightPalette = TwikkaPalette(
  paperDeep: ...,
  cream: ...,
  // ... every TwikkaPalette field, light values
);

const TwikkaPalette _darkPalette = TwikkaPalette(
  paperDeep: ...,
  // ... every TwikkaPalette field, dark values
);

const ThemeVariant myNewVariant = ThemeVariant(
  id: 'my_new_variant',                        // stable, persisted to SharedPreferences
  displayName: 'My New Variant',               // shown in the picker
  description: 'One-line description.',
  light: ThemeBrightnessConfig(colorScheme: _lightScheme, palette: _lightPalette),
  dark: ThemeBrightnessConfig(colorScheme: _darkScheme, palette: _darkPalette),
);
```

### 2. Register it

In `theme_registry.dart`:

```dart
import 'variants/my_new_variant.dart';

const List<ThemeVariant> twikkaThemeVariants = [
  classicVariant,
  warmCoachVariant,
  myNewVariant,    // ← add here
];
```

Order in the list is the order in the picker.

### 3. Done

The picker reads from the registry, so the new variant shows up automatically. The `ThemeController` will load it when the user selects it. Nothing else needs to change.

To make it the default: change `defaultThemeVariant` in `theme_registry.dart`. (This only affects fresh installs — existing users keep their stored choice.)

---

## Picking colours for a new variant

A `ColorScheme` has ~30 fields. Don't try to fill them by hand. Use Material's [Theme Builder](https://material-foundation.github.io/material-theme-builder/) — give it a seed colour, get a fully-derived light + dark scheme. Paste the values into the variant file.

For the `TwikkaPalette` fields (the non-Material-3 tokens):

- `paperDeep` — one step deeper than `surface`
- `cream` / `creamDeep` — the "warm" surfaces; in non-warm variants, often map back to `surfaceContainer` / `surfaceContainerHigh`
- `ink2` — between `onSurface` and `onSurfaceVariant` (~70-80% opacity feel)
- `muted2` — quieter than `onSurfaceVariant`
- `accentSoft` — like `primaryContainer` but a touch richer
- `accentTint` — a thin wash of the primary colour, used for callouts
- `success` / `warning` / `info` — pick semantic hues that play with the variant's primary; sage/amber/blue is the default playbook
- The `*Container` versions are tinted backgrounds; `on*Container` is the legible-on-it text colour

When in doubt, copy a working variant's TwikkaPalette and adjust one field at a time on simulator.

---

## Quick reference: where to look

| Question | File |
|---|---|
| What gaps / radii / font sizes are available? | `theme_constants.dart` |
| What Twikka-specific colour tokens exist? | `twikka_palette.dart` |
| Which variants are registered, and which is default? | `theme_registry.dart` |
| Where is the colour palette of variant X defined? | `variants/<id>.dart` |
| How does an AppBar / button / input look? | `theme_builder.dart` |
| How is the active theme persisted? | `theme_controller.dart` |
| How does the picker UI work? | `lib/src/features/settings/presentation/settings_preferences_screen.dart` |
| How does the light/dark/system toggle work? | `lib/src/core/widgets/theme_mode_toggle.dart` |
