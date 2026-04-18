# Twikka — Old Flutter App (`twikka-v1`) Reference

**Status:** Reference document. The old app lives at `/Users/andrew/dev/flutter/twikka-v1/`. It is **not** being migrated — the new Twikka in this repo is a ground-up rebuild on Convex+Clerk (see `01-architecture-patterns.md`). This document captures what the old app **was** so future-me can answer "how did v1 do X?" / "what did the launcher icon look like?" / "what was the brand purple?" without re-spelunking the codebase.

**Generated:** 2026-04-18 from a direct read of `twikka-v1` source. Last-modified version of v1 surveyed: `1.0.0+50` (`pubspec.yaml`), Flutter SDK constraint `>=3.9.0 <4.0.0`. Repo state on disk dated up to 2026-02-28 for source files; build/cache files updated 2026-04-18.

**Companion docs:**
- `01-architecture-patterns.md` — what we're building *now*.
- `02-old-database-schema.md` — the Postgres schema this old app talked to.

---

## Table of contents

- [What Twikka v1 was](#what-twikka-v1-was)
- [Old project's name lineage](#old-projects-name-lineage)
- [Stack & versions](#stack--versions)
- [Project layout](#project-layout)
- [Flavors](#flavors)
- [Bundle IDs and Android package names](#bundle-ids-and-android-package-names)
- [Theme system](#theme-system)
- [Branding assets](#branding-assets)
- [Fonts](#fonts)
- [Feature modules](#feature-modules)
- [Routing](#routing)
- [State management](#state-management)
- [Backend integrations](#backend-integrations)
- [Auth flow](#auth-flow)
- [Environment variables](#environment-variables)
- [CI/CD (Codemagic)](#cicd-codemagic)
- [Supabase folder layout](#supabase-folder-layout)
- [What to carry forward vs leave behind](#what-to-carry-forward-vs-leave-behind)
- [Quirks, known issues, and surprises](#quirks-known-issues-and-surprises)

---

## What Twikka v1 was

Twikka is a personal **fitness-planning + activity-tracking + light-social** mobile app. The core loop:

1. User onboards, sets reasons-to-exercise and barriers.
2. User builds a **plan** — a 28-day programme of cardio + strength sessions, with weekly targets for minutes/sessions per category.
3. Each calendar **day** in the plan is pre-populated with planned activities (`day_plan_activity`); the user marks actual completion (`day_activity`) with effort/mood/note.
4. Stats roll up daily, weekly, monthly across cardio/strength minutes and sessions.
5. Optional social layer: groups, 1:1 chat (encoded as private 2-member groups), challenges, events, connection requests.
6. Subscriptions (RevenueCat: `Personal`, `Plus`, `Mentor`, `Enterprise`); admin/affiliate/corporate organisation accounts; web-form contact capture; transactional email + push notifications.

There's a separate **admin** flavor (`twikkaAdmin` / `twikkaAdminDev`) that surfaces an admin panel for managing users, activity types, organisations, content, etc.

The user-facing pitch (from the README and code comments): "a mobile-first training companion app that helps users build structured fitness plans, track daily progress, and connect with a community."

## Old project's name lineage

The iOS test target bundle IDs are `com.myhealthscript.client.RunnerTests` and `com.myhealthscript.test.RunnerTests`, and the database `public.organisation` table comment refers to "MHS users". So the project was originally **MyHealthScript** before being renamed to Twikka. The Android app IDs and the *production* iOS bundle IDs were already migrated to `com.novansa.twikka*`; only the legacy test-target IDs still carry the old name. Useful when grepping the old repo for cross-cutting refactor history.

---

## Stack & versions

Pinned from `pubspec.yaml` (`/Users/andrew/dev/flutter/twikka-v1/pubspec.yaml`). Exact carets shown.

**Runtime / Flutter version constraint:** Dart SDK `>=3.9.0 <4.0.0`.

**State, models, code-gen**
- `flutter_riverpod: ^3.0.0`
- `riverpod_annotation: ^4.0.0`
- `riverpod_generator: ^4.0.0+1` *(dev)*
- `riverpod_lint: ^3.0.0` *(dev)*
- `freezed_annotation: ^3.1.0` + `freezed: ^3.2.3` *(dev)*
- `json_annotation: ^4.9.0` + `json_serializable: ^6.9.0` *(dev)*
- `build_runner: ^2.7.1` *(dev)*
- `custom_lint: ^0.8.0` *(dev)*

**Routing & navigation**
- `go_router: ^17.2.1`
- `app_links: ^7.0.0`
- `url_launcher: ^6.3.0`

**Backend**
- `supabase_flutter: ^2.10.1` (no PowerSync, no offline layer)

**Auth/payments/notifications/observability**
- `purchases_flutter: ^10.0.1` (RevenueCat)
- `purchases_ui_flutter: ^10.0.1` (RevenueCat paywall)
- `onesignal_flutter: ^5.3.0`
- `sentry_flutter: ^9.0.0`
- `mixpanel_flutter: ^2.3.3`

**Config & flavors**
- `envied: ^1.1.1` + `envied_generator: ^1.3.0` *(dev)*
- `flutter_flavor: ^3.1.4`
- `logger: ^2.5.0`
- `shared_preferences: ^2.3.3`
- `package_info_plus: ^9.0.0`

**UI / widgets**
- `flex_color_scheme: ^8.2.0` *(present but the project uses a hand-built `ColorScheme`; see [Theme system](#theme-system))*
- `flutter_native_splash: ^2.4.4`
- `flutter_launcher_icons: ^0.14.3` *(dev)*
- `flutter_spinkit: ^5.2.1`
- `animations: ^2.0.11`
- `custom_sliding_segmented_control: ^1.8.4`
- `table_calendar: ^3.2.0`
- `flutter_slidable: ^4.0.0`
- `emoji_picker_flutter: ^4.3.0`
- `fl_chart: ^1.1.1`
- `font_awesome_flutter: ^11.0.0`
- `image_cropper: ^12.2.1`, `image_picker: ^1.2.0`, `image: ^4.2.0`
- `flutter_markdown_plus: ^1.0.5`
- `auto_size_text: ^3.0.0`
- `fluttertoast: ^9.0.0`
- `flutter_typeahead: ^6.0.0`
- `file_picker: ^11.0.2`
- `intl: ^0.20.1`
- `cupertino_icons: ^1.0.2`

**Notably absent vs. the new stack:** no Convex, no Clerk, no Postmark client, no Cloudflare R2, no PowerSync, no KMP. Mixpanel is present in v1 — **the new stack has no analytics by default**; revisit when needed.

---

## Project layout

```
twikka-v1/
├── lib/
│   ├── main.dart                 # twikka prod entry
│   ├── main_dev.dart             # twikkaDev entry (yellow banner)
│   ├── main_admin.dart           # twikkaAdmin entry
│   ├── main_admin_dev.dart       # twikkaAdminDev entry (red banner)
│   ├── app.dart                  # root ConsumerStatefulWidget
│   ├── config/
│   │   ├── app_config.dart       # singleton flavor + env config
│   │   ├── app_bootstrap.dart    # init Supabase, OneSignal, RevenueCat, Sentry, Mixpanel
│   │   ├── environment_config.dart
│   │   ├── init_error_handler.dart
│   │   ├── logger.dart
│   │   └── release_flavor.dart
│   ├── env/
│   │   ├── envied.dart           # @Envied class declarations
│   │   └── envied.g.dart         # generated, gitignored
│   └── src/
│       ├── common_widgets/       # ~36 shared UI components
│       ├── constants/
│       │   ├── theme_constants.dart      # colors, sizes, breakpoints
│       │   ├── revenuecat_constants.dart
│       │   ├── storage_constants.dart
│       │   └── uri_constants.dart
│       ├── features/             # 18 feature folders (see below)
│       ├── localization/         # extension methods on String — no ARB / i18n framework
│       ├── routing/
│       │   ├── app_router.dart
│       │   └── page_not_found_screen.dart
│       ├── theme/
│       │   └── app_theme.dart    # light + dark ThemeData, AppDecorations
│       └── utils/                # auth perf monitor, date helpers, validators, etc.
├── assets/
│   ├── icons/                    # app launcher icons (per flavor)
│   └── images/                   # splash + onboarding intro slides
├── fonts/                        # Nunito family (16 TTFs)
├── supabase/                     # data_structure refs, functions, migrations
├── ios/, android/, macos/, linux/, windows/, web/   # platform shells
├── codemagic.yaml                # CI for Android (iOS workflows commented out)
└── flutter_launcher_icons_*.yaml # one per flavor
```

**Pattern:** feature-first with `data/` (repositories + Riverpod notifiers), `domain/` (Freezed models, DTOs), `presentation/` (screens + widgets) per feature. `app/` is also a feature folder (theme/settings/user state). The earlier README mentions an `application/` layer for cross-provider business logic, but in practice most features just use `data/domain/presentation`.

This is **the same shape couple-tools uses** and the same shape we're carrying into the new repo (see `01-architecture-patterns.md` § Project Layout). The folder names match, so feature ports will read mostly 1:1 at the directory level.

---

## Flavors

Four flavors, each with a separate `lib/main_*.dart` entry point:

| Flavor | Entry | Banner | Purpose |
|---|---|---|---|
| `twikka` | `lib/main.dart` | none (production) | End-user prod app |
| `twikkaDev` | `lib/main_dev.dart` | yellow | End-user dev app — points at dev Supabase |
| `twikkaAdmin` | `lib/main_admin.dart` | none (production) | Admin/operator prod app |
| `twikkaAdminDev` | `lib/main_admin_dev.dart` | red | Admin/operator dev app |

Each flavor pulls a separate envied-injected set of API keys (Supabase, RevenueCat, OneSignal, Sentry, Mixpanel) — see [Environment variables](#environment-variables). The colored debug banner in non-prod flavors is a visual safeguard to prevent accidentally testing production data on a dev binary.

**Run commands** (from `CLAUDE.md`):
```bash
flutter run -t lib/main_dev.dart        --flavor twikkaDev
flutter run -t lib/main.dart            --flavor twikka
flutter run -t lib/main_admin_dev.dart  --flavor twikkaAdminDev
flutter run -t lib/main_admin.dart      --flavor twikkaAdmin
```

> **The new Twikka has only two flavors** (`twikka` consumer + `twikkaAdmin`), not four — see the project_rebuild memory. Dev/prod environment switching in the new stack happens via Convex deployments, not Flutter flavors.

---

## Bundle IDs and Android package names

From `ios/Runner.xcodeproj/project.pbxproj` and `android/app/build.gradle`:

| Flavor | iOS bundle ID | Android applicationId |
|---|---|---|
| `twikka` | `com.novansa.twikka` | `com.novansa.twikka` |
| `twikkaDev` | `com.novansa.twikka.dev` | `com.novansa.twikka.dev` |
| `twikkaAdmin` | `com.novansa.twikka.admin` | `com.novansa.twikka.admin` |
| `twikkaAdminDev` | `com.novansa.twikka.admin.dev` | `com.novansa.twikka.admin.dev` |

Each iOS variant also has a OneSignal Notification Service Extension target with `<bundle>.onesignalnotificationserviceextension` (e.g. `com.novansa.twikka.onesignalnotificationserviceextension`).

**Legacy / lineage:** the iOS test targets still carry `com.myhealthscript.client.RunnerTests` and `com.myhealthscript.test.RunnerTests` — vestiges of the project's previous name "MyHealthScript" / "MHS". Don't propagate.

> **Decision needed for the new app:** keep `com.novansa.twikka` (drop-in replacement, the user already owns the App Store / Play Console listings) or take a fresh ID. Reusing makes it possible to ship the rebuild as an *update* rather than a new install; that may or may not be desirable depending on data-migration plans.

---

## Theme system

The full source of truth is `lib/src/constants/theme_constants.dart` (303 lines) for raw values and `lib/src/theme/app_theme.dart` (395 lines) for `ThemeData` assembly. Light and dark Material 3 schemes are both fully populated — no `ColorScheme.fromSeed()` shortcut. `Typography.material2021()` is the base.

### Brand colors (the three you'll actually use)

| Role | Hex | Notes |
|---|---|---|
| **Primary** (purple) | `#5F27CD` | Brand colour. There is a commented-out `#5A4FCF` predecessor — `#5F27CD` won. |
| **Secondary** (amber/gold) | `#FFA000` | Reused as `dataYellow`. Same value in light and dark schemes. |
| **Tertiary** (green) | `#21C478` | Reused as `dataGreen`. Same value in light and dark schemes. |
| **Light surface** | `#FFFFFF` | |
| **Dark surface** | `#201425` | Deep purple-black. Also used as `onPrimaryDark` and `textPrimaryLight`. |

### Light scheme (Material 3 — exact `ColorScheme` values)

| Slot | Hex |
|---|---|
| `primary` | `#5F27CD` |
| `onPrimary` | `#FFFFFF` |
| `primaryContainer` | `#E3DFFF` |
| `onPrimaryContainer` | `#2D1E5F` |
| `primaryFixed` | `#C5B8FF` |
| `primaryFixedDim` | `#9B89E6` |
| `onPrimaryFixed` | `#1F144B` |
| `onPrimaryFixedVariant` | `#473D96` |
| `secondary` | `#FFA000` |
| `onSecondary` | `#3A2200` |
| `secondaryContainer` | `#FFE27A` |
| `onSecondaryContainer` | `#5D3B00` |
| `secondaryFixed` | `#FFE7A8` |
| `secondaryFixedDim` | `#E0BF60` |
| `onSecondaryFixed` | `#473A00` |
| `onSecondaryFixedVariant` | `#6B5500` |
| `tertiary` | `#21C478` |
| `onTertiary` | `#003C1F` |
| `tertiaryContainer` | `#99E6BD` |
| `onTertiaryContainer` | `#00230E` |
| `tertiaryFixed` | `#B2F2CD` |
| `tertiaryFixedDim` | `#81C998` |
| `onTertiaryFixed` | `#003D1E` |
| `onTertiaryFixedVariant` | `#00572A` |
| `surface` | `#FFFFFF` |
| `onSurface` | `#201425` |
| `surfaceDim` | `#E0E0E0` |
| `surfaceBright` | `#F5F5F5` |
| `surfaceContainerLowest` | `#FFFFFF` |
| `surfaceContainerLow` | `#F9F9F9` |
| `surfaceContainer` | `#F5F5F5` |
| `surfaceContainerHigh` | `#ECEFF1` |
| `surfaceContainerHighest` | `#E0E0E0` |
| `onSurfaceVariant` | `#757575` |
| `outline` | `#BDBDBD` |
| `outlineVariant` | `#9E9E9E` |
| `inverseSurface` | `#303030` |
| `onInverseSurface` | `#ECEFF1` |
| `inversePrimary` | `#D1C4E9` |
| `error` | `#CC0000` |
| `onError` | `#FFFFFF` |
| `errorContainer` | `#FFD9D9` |
| `onErrorContainer` | `#8C0000` |
| `shadow` / `scrim` | `#000000` |

### Dark scheme

| Slot | Hex |
|---|---|
| `primary` | `#8276D9` |
| `onPrimary` | `#201425` |
| `primaryContainer` | `#3E3670` |
| `onPrimaryContainer` | `#D1C4E9` |
| `primaryFixed` | `#6D60BF` |
| `primaryFixedDim` | `#5548A8` |
| `onPrimaryFixed` | `#F2ECFF` |
| `onPrimaryFixedVariant` | `#CFC2FF` |
| `secondary` | `#FFA000` |
| `onSecondary` | `#3A2200` |
| `secondaryContainer` | `#8A6B00` |
| `onSecondaryContainer` | `#FFE27A` |
| `secondaryFixed` | `#CBA44D` |
| `secondaryFixedDim` | `#9F7F3A` |
| `onSecondaryFixed` | `#FFF5D2` |
| `onSecondaryFixedVariant` | `#F4D68C` |
| `tertiary` | `#21C478` |
| `onTertiary` | `#002A14` |
| `tertiaryContainer` | `#3F7D5D` |
| `onTertiaryContainer` | `#C8F8DC` |
| `tertiaryFixed` | `#328F68` |
| `tertiaryFixedDim` | `#1E6F4E` |
| `onTertiaryFixed` | `#D5FCE5` |
| `onTertiaryFixedVariant` | `#7CBA97` |
| `surface` | `#201425` |
| `onSurface` | `#ECEFF1` |
| `surfaceDim` | `#121212` |
| `surfaceBright` | `#303030` |
| `surfaceContainerLowest` | `#1C1C1C` |
| `surfaceContainerLow` | `#222222` |
| `surfaceContainer` | `#2A1D30` |
| `surfaceContainerHigh` | `#382642` |
| `surfaceContainerHighest` | `#43314D` |
| `onSurfaceVariant` | `#B0BEC5` |
| `outline` | `#757575` |
| `outlineVariant` | `#616161` |
| `inverseSurface` | `#FAFAFA` |
| `onInverseSurface` | `#212121` |
| `inversePrimary` | `#7C4DFF` |
| `error` | `#FF8A80` |
| `onError` | `#8C0000` |
| `errorContainer` | `#D32F2F` |
| `onErrorContainer` | `#FF5252` |

### Data-visualization palette (chart colors)

Used by `fl_chart` widgets in `features/stats/`:

| Name | Hex | Used for |
|---|---|---|
| `dataOrange` | `#FF9F43` | engagement metrics |
| `dataBlue` | `#54A0FF` | time-based metrics |
| `dataPink` | `#FF6B81` | highlights |
| `dataYellow` | `#FFA000` | (= secondary) |
| `dataGreen` | `#21C478` | (= tertiary) — success |
| `dataPurple` | `#5F27CD` | (= primary) — main metrics |
| `dataRed` | `#FF4757` | alerts, favourites |

Lighter / darker tints exist for chart gradients: `dataOrangeLight #FFBE76` / `dataOrangeDark #E77E24`, `dataBlueLight #81BCFF` / `dataBlueDark #2E7DD1`, `dataPinkLight #FF8FA3` / `dataPinkDark #D1475C`.

### Text colors

| Slot | Light hex | Dark hex |
|---|---|---|
| `textPrimary` | `#201425` | `#ECEFF1` |
| `textSecondary` | `#3F3A60` *(muted indigo)* | `#B3A8F5` *(soft pastel of the primary)* |
| `textDisabled` | `#9E9E9E` | `#757575` |

### Typography

Single bundled family: **Nunito**. The text theme is a single helper `_customTextTheme(Color onSurfaceColor)` that re-uses the same on-surface colour for every style:

| Style | Size | Weight |
|---|--:|--:|
| `displayLarge` | 57 | 900 |
| `displayMedium` | 45 | 800 |
| `displaySmall` | 36 | 700 |
| `headlineLarge` | 32 | 700 |
| `headlineMedium` | 28 | 600 |
| `headlineSmall` | 24 | 600 |
| `titleLarge` | 32 | 700 |
| `titleMedium` | 22 | 700 |
| `titleSmall` | 16 | 700 |

`bodyLarge`, `bodyMedium`, `bodySmall`, `labelLarge`, `labelMedium`, `labelSmall` fall through to `Typography.material2021()` defaults.

### Spacing, sizes, breakpoints (semantic constants)

```
SPACING_XS   = 4    // also "small gap"
SPACING_SM   = 8    // also "medium gap"
SPACING_MD   = 12   // also "large gap" / dialog padding
SPACING_LG   = 16   // also "extra large gap" / horizontal page padding
SPACING_XL   = 24   // page side margin / page bottom margin / dialog content padding
SPACING_XXL  = 32   // dialog horizontal margin

BORDER_RADIUS        = 10   // standard
BORDER_RADIUS_LARGE  = 16
ICON_SIZE_SMALL/MEDIUM/LARGE = 16 / 24 / 32
AVATAR_THUMBNAIL_SIZE = 48    AVATAR_PROFILE_SIZE = 100   AVATAR_MAX_W/H = 300

PROGRESS_INDICATOR_TINY/SMALL/MEDIUM/LARGE/XLARGE = 16 / 24 / 36 / 50 / 64

DIALOG_HORIZONTAL_MARGIN  = 32     DIALOG_CONTENT_PADDING = 24
DIALOG_MAX_WIDTH_PERCENTAGE = 0.85  DIALOG_MIN_WIDTH_PERCENTAGE = 0.65

mobileBreakpoint  = 600
tabletBreakpoint  = 1024
desktopBreakpoint = 1440

listPageSize  = 30
tagListLimit  = 10
```

There's also a **legacy** `Sizes.p4 / p8 / p12 …` class plus paired `gapW*` and `gapH*` `SizedBox` constants (4–64 px). Marked "will be phased out". Don't reproduce; the SPACING_* constants are the preferred form.

### Bottom sheet / dialog defaults

From `AppDecorations` in `lib/src/theme/app_theme.dart`:
- Bottom sheet border radius: **20**.
- Bottom sheet outer padding: 16 horizontal, 20 vertical.
- Bottom sheet content padding: 16 (= `SPACING_LG`).
- Dialog shape: rounded rectangle, radius `BORDER_RADIUS` (10).
- Dialog padding: `SPACING_MD` (12).

### Per-component theming

The `ThemeData` assemblers (`customLightTheme()`, `customDarkTheme()`) explicitly customise:
- `elevatedButtonTheme` — primary background, onPrimary foreground.
- `inputDecorationTheme` — filled with `surfaceContainerHighest`, all-state borders use `BORDER_RADIUS`, focus ring is 2-px primary.
- `appBarTheme` — surface background, onSurface foreground, `titleLarge` text style.
- `tabBarTheme` — `onPrimaryContainer` for active labels, 0.7 alpha for inactive.
- `chipTheme` — `surfaceContainerHighest` background, primary when selected, 0.2-alpha outline border, `BORDER_RADIUS` rounded.

> **For the rebuild:** all of the above is straightforward to lift into the new app's `theme/` directory. The hex values, spacing constants, and decoration patterns are the most reusable parts of v1; do not waste cycles re-deciding them. The brand colour is `#5F27CD` and that is not up for re-litigation.

---

## Branding assets

### Launcher icons

Source images live in `assets/icons/`. Each flavor has a separate `flutter_launcher_icons_*.yaml` config at the repo root:

| Flavor | Config file | Source PNG | Notes |
|---|---|---|---|
| `twikka` | `flutter_launcher_icons_twikka.yaml` | `assets/icons/twikka_icon_wbg.png` | Adaptive Android: foreground `twikka_icon_fg.png`, background `twikka_icon_bkg.png`. iOS: `remove_alpha_ios: true`. |
| `twikkaDev` | `flutter_launcher_icons_twikka_dev.yaml` | `assets/icons/twikka_icon_dev_wbg.png` | Single image, both platforms. No adaptive. |
| `twikkaAdmin` | `flutter_launcher_icons_twikka_admin.yaml` | `assets/icons/twikka_admin_icon_wbg.png` | |
| `twikkaAdminDev` | `flutter_launcher_icons_twikka_admin_dev.yaml` | `assets/icons/twikka_admin_dev_icon_wbg.png` | |

The `pubspec.yaml` also has an inline `flutter_launcher_icons:` block pointing at `assets/icons/twikka_icon_wbg.png` — this is the default for `flutter pub run flutter_launcher_icons` invoked without `-f`. The flavor-specific YAMLs are the actual sources for the four flavors.

**File naming convention:**
- `*_wbg.png` — "with background" (white or coloured, full square — used for iOS where the OS rounds corners).
- `*_nbg.png` — "no background" (transparent — used for splash dark mode etc).
- `*_fg.png` / `*_bkg.png` — adaptive-icon foreground / background layers (Android 8+).

Full file listing of `assets/icons/`:
```
twikka_icon_wbg.png             # prod, with background (master icon)
twikka_icon_nbg.png             # prod, transparent
twikka_icon_fg.png              # prod, adaptive foreground
twikka_icon_bkg.png             # prod, adaptive background
twikka_icon_dev_wbg.png         # dev
twikka_icon_dev_nbg.png         # dev, transparent
twikka_admin_icon_wbg.png       # admin prod
twikka_admin_icon_nbg.png       # admin prod, transparent
twikka_admin_dev_icon_wbg.png   # admin dev
twikka_admin_dev_icon_nbg.png   # admin dev, transparent
```

> **For the rebuild:** copy `assets/icons/twikka_icon_wbg.png`, `twikka_icon_fg.png`, `twikka_icon_bkg.png`, and `twikka_admin_icon_wbg.png` into the new repo's `assets/icons/` once you scaffold it. The dev variants are not needed in the new project (no separate dev flavor).

### Splash screen

Configured in `flutter_native_splash.yaml`:
- **iOS only** — Android splash explicitly disabled (`android: false`); web disabled too.
- Light mode: image `assets/images/ios_startup_image_1290x2796.png`, background `#ffffff`.
- Dark mode: image `assets/images/ios_startup_image_1290x2796_nbg.png` (transparent), background `#000000`.
- `ios_content_mode: scaleAspectFit`; `fullscreen: true` (hides status bar during splash).

The `1290x2796` resolution is the iPhone 14 Pro Max / 15 Pro Max etc. native portrait. The splash assets are pre-rendered for that one device size and Flutter scales for everything else.

### Onboarding intro images

`assets/images/` also holds:
```
app_intro_1.png
app_intro_2.png
app_intro_3.png
app_intro_4.png
app_intro_5.png
```
Used by the `intro` feature module — the welcome carousel shown to new users. Five-page slide deck.

---

## Fonts

`fonts/` directory contains the full Nunito family as static TTFs (16 files):

```
Nunito-ExtraLight.ttf       (200)   Nunito-ExtraLightItalic.ttf
Nunito-Light.ttf            (300)   Nunito-LightItalic.ttf
Nunito-Regular.ttf          (400)   Nunito-Italic.ttf
Nunito-Medium.ttf           (500)   Nunito-MediumItalic.ttf
Nunito-SemiBold.ttf         (600)   Nunito-SemiBoldItalic.ttf
Nunito-Bold.ttf             (700)   Nunito-BoldItalic.ttf
Nunito-ExtraBold.ttf        (800)   Nunito-ExtraBoldItalic.ttf
Nunito-Black.ttf            (900)   Nunito-BlackItalic.ttf
```

Declared in `pubspec.yaml` under `flutter.fonts.[].family: Nunito` with explicit weight + style for each TTF.

> **Why static and not variable?** Per `CLAUDE.md`: "Variable Fonts don't seem to work as far as showing different weights (building for iOS 13 at present). I have used static ones instead which seems to work." If we drop iOS 13 support in the rebuild we can move to `Nunito-VariableFont_wght.ttf` and halve the asset weight.

> **For the rebuild:** copy the entire `fonts/` directory across. Decide on variable-vs-static early — it's a one-time decision that needs to match the iOS deployment target.

---

## Feature modules

`lib/src/features/` contains 18 directories. Approximate file counts and one-line summaries (file counts via the original audit; treat as ballpark):

| Folder | Files | What it does |
|---|--:|---|
| `daily/` | ~50 | The daily plan view — today's planned activities, completion tracking, calendar widget, activity sheet, mood/effort capture. |
| `plans/` | ~50 | Plan creation/editing, plan-day templates, weekly target editor, deep+shallow loading helpers. |
| `settings/` | ~34 | Settings hub: profile, preferences, notifications, subscription, plans-list, admin sub-screens, debug screens. |
| `auth/` | ~20 | Login, signup, password reset (deep-link), email-change OTP, auth state stream. |
| `social/` | ~10 | Social/connection hub, 1:1 chat, user discovery. **Partially built.** |
| `avatar/` | ~9 | Profile avatar upload + cropping (uses `image_cropper`, `image_picker`). |
| `info/` | ~9 | In-app info / content cards. |
| `stats/` | ~8 | Charts and analytics — uses `fl_chart` with the `data*` palette. |
| `test_debug/` | ~8 | Dev-only debug screens (probably gated to dev flavors). |
| `onboarding/` | ~7 | Post-signup profile completion ("force complete profile"). |
| `home/` | ~6 | Tab-based hub (daily / stats / info / social / settings entry). |
| `intro/` | ~6 | Pre-signup intro carousel using `app_intro_*.png`. |
| `app/` | ~7 | Cross-cutting app state: theme notifier, settings notifier, user data provider. |
| `interests/` | ~3 | Reference data layer for the interests / interest_category tables. |
| `user_interests/` | ~4 | The user-side join with interests (data only). |
| `admin/` | ~4 | Admin-flavor-only features (data + domain layers; presentation lives in `settings/`). |
| `notifications/` | 1 | A single `onesignal.dart` stub. Most notification work happens in `app_bootstrap.dart`. |
| `subscription/` | 1 | Paywall trigger only — entitlement logic lives in `app/` providers and the auth flow. |

Read this list as **what scope was attempted in v1**, not **what was production-ready** — `social`, `notifications`, and `subscription` are explicitly noted as partial.

---

## Routing

Single router at `lib/src/routing/app_router.dart` (~370 lines), `go_router: ^17.2.1`. Pattern: a single `AppRoute` enum names every route; `GoRouter` config uses a global navigator key + a `redirect` function for auth gating. Nested route trees: `/home` has children for daily/stats/social/info; `/settings` has children for profile/plans/admin/etc.

**Public (pre-auth) paths:**
- `/` (welcome)
- `/intro`
- `/login`, `/login/forgot_password`
- `/reset_password` *(deep link from email)*
- `/change_email_otp` *(deep link from email)*
- `/access_denied`

**Authenticated:**
- `/home`, `/home/daily`, `/home/stats`, `/home/info`, `/home/social`, `/home/social/chat/:id`
- `/settings`, `/settings/profile`, `/settings/preferences`, `/settings/notifications`, `/settings/subscription`
- `/settings/plans`, `/settings/plans/create`, `/settings/plans/edit/:planID`
- `/settings/admin/...`, `/settings/debug`
- `/onboard_user` *(forced if `user_data.onboarding = true`)*

**Redirect rules** (paraphrased from `app_router.dart`):
1. If unauthenticated and not on a public path → redirect to `/`.
2. If authenticated, deleted, or `app_access = false` → redirect to `/access_denied`.
3. If authenticated and `onboarding = true` → redirect to `/onboard_user`.
4. Otherwise allow.

Deep links use **Custom URL Schemes** (not Universal Links / App Links). `CLAUDE.md` notes a planned migration to HTTPS schemes via `.well-known/apple-app-site-association` at `https://twikka.com/`, deferred.

---

## State management

**Riverpod 3** with the code-gen annotation API.

- **~95 notifier classes** declared with `@riverpod`, generating `.g.dart` files alongside.
- **No `autoDispose`** anywhere — providers persist until explicitly invalidated.
- **~19 `keepAlive: true` providers** for long-lived state: `authState`, `userData`, `currentPlanNotifier`, `planRepository`, `dayPackageNotifier`, `dayPackageRepository`, `themeNotifier`, `appSettingsNotifier`, `avatarRepository`, `avatarNotifier`, etc.
- Standard pattern: `AsyncNotifier` → `Repository` → Supabase client. Unidirectional flow.
- `Result<T>` pattern is used in repository layers (mentioned in `CLAUDE.md`).
- Provider overrides happen in each `main_*.dart` to inject flavor-specific service instances.

Entry-point pattern (representative):
```dart
@riverpod(keepAlive: true)
AuthRepository authRepository(Ref _) => AuthRepository();

final authStateProvider = StreamProvider<AuthStateWithSession>((ref) {
  return ref.watch(authRepositoryProvider).authState;
});
```

> **For the rebuild:** the new app uses Riverpod 3 + `riverpod_generator` too (per `01-architecture-patterns.md`). The provider-naming and keepAlive conventions are worth carrying over wholesale; the *contents* of the providers change because the data source is Convex, not Supabase.

---

## Backend integrations

All initialised in `lib/config/app_bootstrap.dart` with flavor-specific keys pulled from `lib/env/envied.dart`.

### Supabase (`supabase_flutter: ^2.10.1`)
- **Auth:** PKCE flow, email/password + magic-link password recovery + email-change OTP.
- **Database:** direct REST + realtime subscriptions; RLS enabled on all tables (mostly permissive — see `02-old-database-schema.md` § RLS posture).
- **Server logic:** Postgres functions like `save_plan_package`, `get_day_package`, `get_plan_package`. The database also has 19 triggers and a Make.com / Zoho HTTP-fanout layer (also in `02-old-database-schema.md`).
- **No PowerSync, no offline-first** — every interaction is a live network call. Acknowledged gap.

### RevenueCat (`purchases_flutter: ^10.0.1` + `purchases_ui_flutter: ^10.0.1`)
- Distinct API keys per flavor, per platform: `RC_GOOG_API_KEY_TWIKKA[_DEV/_ADMIN/_ADMIN_DEV]`, `RC_APPL_API_KEY_TWIKKA[_DEV/_ADMIN/_ADMIN_DEV]` (8 keys total).
- Login/logout synced with Supabase auth state changes.
- Paywall UI from `purchases_ui_flutter`.

### OneSignal (`onesignal_flutter: ^5.3.0`)
- Per-flavor app IDs (`ONESIGNAL_APP_ID_TWIKKA*`).
- iOS Notification Service Extension target per flavor (the `*.onesignalnotificationserviceextension` bundle IDs above).
- User segmentation via tags.

### Sentry (`sentry_flutter: ^9.0.0`)
- Per-flavor DSNs (`SENTRY_DSN_TWIKKA*`).
- Wraps `runApp` so all uncaught errors are captured.
- "Sophisticated Sentry filtering to prevent noise in production" is mentioned in `WARP.md` — check `app_bootstrap.dart` if reproducing.

### Mixpanel (`mixpanel_flutter: ^2.3.3`)
- Per-flavor tokens (`MIXPANEL_TOKEN_TWIKKA*`).
- Super properties: app flavor, environment, admin status registered on init.
- **Not in the new stack by default** — analytics is deferred.

### Custom: AuthPerformanceMonitor
- A bespoke utility in `lib/src/utils/` measures sign-in / sign-up / Supabase-init durations. Not using Sentry's APM directly. Worth lifting the *idea* (perf instrumentation around critical paths) into the new app even if the implementation is bespoke again.

---

## Auth flow

Source: `lib/src/features/auth/data/auth_repository.dart` and the redirect logic in `app_router.dart`.

**Email + password** as the primary mechanism; **magic link** for password reset; **email-change OTP** for email updates. No social auth, no passkeys.

1. **Sign-up** — `Supabase.auth.signUp(email, password)` with `username` in metadata. A trigger creates the `public.user_data` row from `auth.users` (see `02-old-database-schema.md`). RevenueCat `logIn(userId)` follows.
2. **Sign-in** — `signInWithPassword(email, password)`. Redirect to `/onboard_user` if the user_data row has `onboarding = true`, else `/home`.
3. **Password reset** — user requests via `/login/forgot_password`, gets a Supabase-issued email with a token URL that opens the app at `/reset_password?token=...`; the app calls `verifyOtp(token=…, type=recovery)` and then `updateUser(password=…)`.
4. **Email change** — user submits new email from settings; deep link to `/change_email_otp?token=...` confirms.
5. **Auth state stream** — `authStateProvider` listens to `Supabase.auth.onAuthStateChange`, mapping to `loggedIn` / `loggedOut`. RevenueCat login state syncs on transitions.
6. **Access denied** — if `user_data.deleted = true` or `app_access = false`, redirect to `/access_denied`.

> **In the new stack** Clerk replaces all of this. The translation: Supabase `auth_id (uuid)` → Clerk `user.id (string)` stored as `users.clerkUserId` in Convex. The "force-onboarding-when-flag-set" pattern translates 1:1 — gate on a `onboardingComplete` field in the Convex `users` document and redirect from the same router-redirect hook.

---

## Environment variables

Managed by `envied: ^1.1.1`. Definitions in `lib/env/envied.dart`; values come from `.env.dev` and `.env.prod` (which the `CLAUDE.md` calls `.env.development` and `.env` — the actual file names on disk are `.env.dev` and `.env.prod`). Generated `lib/env/envied.g.dart` is gitignored.

Full list of variable names (extracted from `.env.dev`):

**Supabase (per environment, dev/prod):**
- `SUPABASE_URL_DEV`, `SUPABASE_URL_PROD`
- `SUPABASE_ANON_KEY_DEV`, `SUPABASE_ANON_KEY_PROD`
- `SUPABASE_BASE_URL_DEV`, `SUPABASE_BASE_URL_PROD`
- `SUPABASE_PUBLISHABLE_KEY_DEV`, `SUPABASE_PUBLISHABLE_KEY_PROD`
- `SUPABASE_SECRET_KEY_DEV`, `SUPABASE_SECRET_KEY_PROD`
- `SUPABASE_JWT_SIGNING_KEY_DEV`, `SUPABASE_JWT_SIGNING_KEY_PROD`

**Per-flavor keys (4 each — `_TWIKKA`, `_TWIKKA_DEV`, `_TWIKKA_ADMIN`, `_TWIKKA_ADMIN_DEV`):**
- `ONESIGNAL_APP_ID_*`
- `RC_GOOG_API_KEY_*` (Google/Play)
- `RC_APPL_API_KEY_*` (Apple/App Store)
- `SENTRY_DSN_*`
- `MIXPANEL_TOKEN_*`

**Other:**
- `GH_TOKEN` (presumably for some build-time dependency on a private package or GitHub release)

**Note:** `CLAUDE.md` (line 126 of v1) acknowledges "Secrets are still embedded in this project. This will need to be fixed using one of the standard methods for Flutter and then maybe transfer to a new repo." The `.env.dev` and `.env.prod` files are committed to git in v1. **The new repo should never commit env files** — `envied` obfuscates them at compile time but the source files remain a leak risk.

---

## CI/CD (Codemagic)

`codemagic.yaml` defines four Android-only workflows (iOS workflows present but commented out):

| Workflow | Flavor | Entry | Output |
|---|---|---|---|
| `twikka-prod-android` | `twikka` | `lib/main.dart` | `app-twikka-release.aab` → Play Store internal track |
| `twikka-dev-android` | `twikkaDev` | `lib/main_dev.dart` | `app-twikkaDev-release.aab` |
| `twikka-admin-android` | `twikkaAdmin` | `lib/main_admin.dart` | `app-twikkaAdmin-release.aab` |
| `twikka-admin-dev-android` | `twikkaAdminDev` | `lib/main_admin_dev.dart` | `app-twikkaAdminDev-release.aab` |

Each workflow runs `flutter pub get` → `flutter pub run build_runner build --delete-conflicting-outputs` → `flutter clean` → `flutter build appbundle --flavor X -t Y`. iOS builds were apparently done locally (Xcode → App Store Connect) rather than via CI.

A separate `codemagic_test.yaml` exists; assume legacy / experimental.

---

## Supabase folder layout

`supabase/` in v1 is **not** a deployable Supabase project — it's a documentation + ad-hoc-migration directory:

```
supabase/
├── data_structure/           # SQL CREATE TABLE files for documentation only
│   ├── public/  (15 SQL files — day, plan, user_data, etc.)
│   └── social/  (16 SQL files — message, group, member, etc., plus social_policies.sql)
├── functions/
│   └── update_user_interests.sql
└── migrations/
    ├── 20240000000000_fix_save_plan_package.sql
    ├── 20240000000000_update_group_member_count.sql
    ├── 20240000000000_update_plan_activity_done.sql
    ├── 20240000000001_fix_get_day_package.sql
    └── 20240000000002_fix_day_triggers.sql
```

The actual canonical schema is in the live Supabase database — `supabase/data_structure/` is a hand-maintained SQL mirror that may or may not be current. **Treat the live DB (and `02-old-database-schema.md`) as the truth, not these files.**

The five `migrations/*.sql` files all use the placeholder timestamp `20240000000000` (clearly not real timestamps). They are bug-fix patches applied retroactively after the initial schema was built (probably) in FlutterFlow + the Supabase dashboard.

---

## What to carry forward vs leave behind

### Carry forward
- **Brand colour `#5F27CD`** and the full M3 light + dark `ColorScheme` values. Don't re-decide.
- **Nunito** font family.
- **Spacing constants** (`SPACING_XS…XXL`, `BORDER_RADIUS`, etc.) and the breakpoint values (600 / 1024 / 1440).
- **`AppDecorations`** patterns for bottom sheets, dialogs, list items.
- **Launcher icon master images** (`twikka_icon_wbg.png`, `_fg.png`, `_bkg.png`, plus `twikka_admin_icon_wbg.png`).
- **Onboarding intro slides** (`app_intro_1..5.png`) — assuming the intro carousel survives the redesign.
- **Splash images** (`ios_startup_image_1290x2796.png` light + nbg dark).
- **Routing structure** — top-level paths, redirect logic, deep-link patterns.
- **Riverpod conventions** — `keepAlive` for long-lived state, `AsyncNotifier` + Repository pattern, no `autoDispose` by default.
- **The `*_package` query shapes** (`get_day_package`, `get_plan_package`) — they are the de-facto contract for what the UI needs in one round-trip; lift the *shape* into Convex queries.

### Leave behind
- **Supabase / PowerSync / Postgres triggers** — replaced by Convex.
- **`auth.users` ↔ `user_data` bridge** — replaced by Clerk + Convex.
- **Mixpanel, MailerSend, Make.com, Zoho** — analytics deferred; email moves to Postmark; CRM/automation TBD.
- **Four flavors** — collapse to two (`twikka` consumer, `twikkaAdmin`).
- **Custom URL schemes for deep links** — go straight to Universal/App Links via `https://twikka.com/.well-known/...`.
- **The legacy `Sizes.pXX` + `gapW*` / `gapH*` constants** — already marked for removal in v1; don't replicate.
- **`com.myhealthscript.*` test bundle IDs** — historical name; rename when copying iOS project files.
- **Scratch tables and dead RLS policies** in the database — see `02-old-database-schema.md` § Known oddities.

### Consciously-decided
- **Variable vs static fonts.** v1 uses static because of iOS 13 issues. Decide in the rebuild.
- **DM modeling.** v1 encodes DMs as private 2-member groups (see `02-old-database-schema.md` § Views). Consider first-class DMs vs preserving the encoding.
- **Admin in same binary or separate?** v1 ships a separate `twikkaAdmin` binary. The new project plans the same (two flavors). Consider whether a web admin via Convex dashboard could replace the mobile admin app entirely.

---

## Quirks, known issues, and surprises

Catalogued from `CLAUDE.md`, `WARP.md`, and code-reading. Document so we don't accidentally reintroduce them.

1. **No tests.** Zero unit/widget/integration tests in v1. `flutter test` finds nothing.
2. **No offline support.** Direct Supabase calls only. A user with intermittent connectivity loses captured activity data. The new app should make a deliberate decision here — Convex has live queries but is still online-first.
3. **Cascade deletes are manual** — bottom-up (activities → days → plan), not wrapped in transactions. `CLAUDE.md` flags this as a TODO. The new app should handle relational cleanup atomically in Convex mutations.
4. **`save_plan_package` / `get_day_package` SQL functions** are the de-facto API contract between the Flutter app and the data layer. Read those functions before designing Convex equivalents.
5. **Plan creation creates 28 PlanDays via trigger.** If the user backs out, the empty plan needs explicit deletion. "Not super efficient, but plans are not created that often" — quote from `CLAUDE.md`.
6. **StreamController errors on iOS Simulator** when the app idles — likely Supabase realtime cleanup. Sporadic, not seen on device. Probably moot once Supabase is gone.
7. **Sentry filtering is "sophisticated"** but undocumented; if you need to reproduce it, dig in `app_bootstrap.dart`.
8. **Riverpod 2.0 is mentioned in `CLAUDE.md`** but `pubspec.yaml` actually pins `flutter_riverpod: ^3.0.0`. The doc is stale on this point.
9. **`flex_color_scheme: ^8.2.0`** is listed in `pubspec.yaml` but the actual theme code uses a hand-built `ColorScheme` with `Typography.material2021()`. The dep is dead weight unless something uses it incidentally.
10. **Trigger function name `revenucat_c_b`** in the database has the typo "revenucat" — the AFTER variant is correctly spelled `revenuecat_c_a`. The Flutter side doesn't care, but worth knowing if you grep across both layers.
11. **Two `created_at` conventions** in the database: most use `timestamptz`, a few use `timestamp without time zone`, `messages` uses `created`. The Flutter models normalize this — see `lib/src/features/*/domain/*.dart`.
12. **The `lib/src/localization/` folder uses string-extensions, not ARB / `flutter_localizations`.** No real i18n in v1. The new app's i18n plan (deferred) starts from zero.

---

## Where to look in v1 when you have a specific question

| Question | File |
|---|---|
| Brand colour, full theme | `lib/src/constants/theme_constants.dart`, `lib/src/theme/app_theme.dart` |
| Auth gating logic | `lib/src/routing/app_router.dart` (redirect function) |
| Service initialization order | `lib/config/app_bootstrap.dart` |
| Flavor / env resolution | `lib/config/app_config.dart`, `lib/config/release_flavor.dart`, `lib/env/envied.dart` |
| What a "plan" looks like in code | `lib/src/features/plans/domain/` (Freezed models) |
| What `get_day_package` returns | `lib/src/features/daily/domain/` + the SQL in `supabase/migrations/20240000000001_fix_get_day_package.sql` |
| Auth flow specifics | `lib/src/features/auth/data/auth_repository.dart` |
| Performance instrumentation | `lib/src/utils/auth_performance_monitor.dart` (or similarly-named) |
| Any UI primitive | `lib/src/common_widgets/` |
| Supabase RPC calls | grep `supabase.rpc(` across `lib/src/features/*/data/` |

If a future question can't be answered from this doc + `02-old-database-schema.md` + `01-architecture-patterns.md`, it's worth extending one of them rather than re-spelunking each time.
