# Twikka — Flutter Architecture & Patterns

**Status:** Planning reference, written during initial scaffolding (2026-04-18).
**Purpose:** Capture the architectural decisions and patterns we're borrowing from `couple-tools` so that (a) whoever scaffolds the project next has a concrete blueprint, and (b) six months from now we can answer "why is it set up this way?" without archaeology.

Twikka is a **ground-up rebuild** of an older Supabase-backed Flutter app of the same name. The old codebase lives at a separate path and is reference-only — we are not migrating code. The pattern reference is `/Users/andrew/dev/flutter/couple-tools/`, a sibling Flutter project by the same author that has production-proven integrations for most of the services we need.

---

## Confirmed Stack

| Layer | Choice | Notes |
|---|---|---|
| UI framework | Flutter | iOS + Android, phones + tablets |
| Routing | `go_router` | declarative with auth-aware redirect |
| State | `flutter_riverpod` + `riverpod_generator` (Riverpod 3) | code-gen by default |
| Env vars | `envied` | compile-time constants from `.env` |
| Backend | **Convex** | replaces the old Supabase + PowerSync stack |
| Auth | **Clerk** | replaces Supabase auth |
| Push | OneSignal | |
| Error tracking | Sentry (`sentry_flutter`) | |
| Subscriptions | RevenueCat | |
| Transactional email | Postmark | server-side only, called from Convex |
| File storage | Cloudflare R2 | server-side only, called from Convex |
| Convex components | use wherever applicable | prefer components over custom server code |

### Targets
- iOS + Android native apps
- Phone and tablet form factors — responsive layouts required at both scales
- Multi-lingual (i18n) — not implemented in the first pass, but the scaffolding must not paint us into a corner

### Not in this stack (noted so nobody adds them by reflex)
- No Mixpanel (couple-tools uses it; we are not committed to it yet — revisit when analytics need arises)
- No web / desktop build targets in the first pass

---

## Project Layout

Feature-first, with a shared `core` layer and a central `data/providers` registry. Borrowed as-is from couple-tools.

```
lib/
├── main.dart                  # entry, Sentry wrapper, runApp
├── app.dart                   # root MaterialApp.router widget, theme, locale
├── routing/
│   ├── app_router.dart        # GoRouter config + redirect logic
│   └── app_routes.dart        # string path constants (AppRoutes class)
├── core/
│   ├── config/
│   │   ├── env.dart           # Envied @Envied class
│   │   └── env.g.dart         # generated (gitignored? confirm in couple-tools)
│   ├── services/
│   │   ├── bootstrap_service.dart   # phased init orchestrator
│   │   ├── error_handler.dart       # dual-mode (dev/user) error surface
│   │   ├── clerk_service.dart       # auth facade (was supabase_service.dart)
│   │   ├── convex_service.dart      # backend facade (was powersync_service.dart)
│   │   ├── revenuecat_service.dart
│   │   └── onesignal_config.dart
│   ├── theme/                 # FlexColorScheme + design tokens
│   ├── utils/
│   │   ├── logger.dart        # logger pkg + MinimalPrinter
│   │   └── responsive.dart    # ResponsiveLayout + breakpoints
│   └── widgets/               # AppButton, AppTextField, AppCard, AppListView, etc.
├── data/
│   ├── models/                # domain models
│   └── providers/
│       ├── repository_providers.dart  # central Provider instances
│       ├── auth_providers.dart        # Clerk session/user state
│       ├── data_providers.dart        # Convex query providers
│       └── feature_providers.dart     # feature flags, remote config
├── features/
│   ├── <feature>/
│   │   ├── presentation/      # screens + feature-only widgets
│   │   ├── providers/         # feature-scoped Riverpod providers
│   │   └── widgets/
│   └── ...
└── l10n/                      # ARB files (scaffolded but not active — see i18n section)
```

**Rule of thumb:** if a provider is used by more than one feature, it belongs in `data/providers/`. Feature-local state stays in `features/<name>/providers/`.

---

## Flavors: two, not four

The old Twikka had four flavors (dev/staging/prod + admin). We're consolidating to **two**:

1. `twikka` — production consumer app
2. `twikkaAdmin` — admin tooling (internal)

Couple-tools takes a different approach: **no flavors at all**, just one `.env` file and Codemagic workflows that swap envs before `flutter build`. For Twikka we need two **separate app IDs** (admin is a distinct app), so we will use proper Flutter flavors:

- Two entry points: `lib/main_twikka.dart`, `lib/main_admin.dart` — each calls the same `bootstrap()` with a different `Flavor` enum
- Android: `productFlavors` in `android/app/build.gradle.kts`
- iOS: separate Xcode schemes + bundle IDs
- `.env` files per flavor: `.env.twikka`, `.env.admin`; `envied` reads whichever is active

We intentionally skip a separate `dev` or `staging` flavor — Convex dev deployments handle environment separation at the backend, and we set the Convex deployment URL via env.

---

## Bootstrap Sequence (`main.dart`)

Borrow couple-tools' phased bootstrap pattern (`lib/core/services/bootstrap_service.dart:32-183`). The shape:

```dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Phase 1: foundational (synchronous / fast)
  await BootstrapService.initializeFoundation();
  // - AppMetadata (version, build, platform)
  // - SharedPreferences
  // - ErrorHandler

  // Phase 2: parallel service init
  await BootstrapService.initializeServices();
  // - Clerk
  // - Convex client
  // - RevenueCat
  // (run in parallel via Future.wait)

  // Phase 3: provider container + auth-dependent init
  final container = ProviderContainer(overrides: [...]);

  // Phase 4: post-container (needs providers to exist)
  await BootstrapService.initializePostContainer(container);
  // - OneSignal (needs to know user id if already authed)
  // - DeepLinkService

  // Phase 5: Sentry wrap + runApp
  await SentryFlutter.init(
    (options) {
      options.dsn = Env.sentryDsn;
      options.sendDefaultPii = false;
      options.tracesSampleRate = kDebugMode ? 0.0 : 0.2;
      options.beforeSend = _filterExpectedExceptions;
    },
    appRunner: () => runApp(
      SentryWidget(
        UncontrolledProviderScope(
          container: container,
          child: const TwikkaApp(),
        ),
      ),
    ),
  );
}
```

Notes:
- `UncontrolledProviderScope` (vs `ProviderScope`) lets us pass a pre-built container that bootstrap has populated. This is the couple-tools pattern and is worth preserving.
- Sentry is the outermost wrapper so it catches errors from everything inside, including Flutter framework errors.
- Couple-tools samples Sentry traces at 100%; we're dialing that down to 20% in prod to control quota — revisit if we need more.

---

## Routing — GoRouter

Couple-tools reference: `lib/routing/app_router.dart:60-337`.

Pattern to borrow:
- **One `GoRouter` instance** configured in `app_router.dart`
- **`AppRoutes` class** with `static const` string paths — no stringly-typed routes scattered through the app
- **Auth-aware redirect** via a `routerStateProvider` that aggregates (auth state, current user, current account) into a single object the router listens to
- **Shell routes** for the main tab scaffold (bottom nav on phone, side nav on tablet — see responsive section)
- **Deep link handling** via `app_links` + a `PendingDeepLinkService` that holds unauth'd links until login completes

Adaptations for Clerk:
- Replace `appAuthState` (Supabase enum) with a Clerk-backed equivalent. Clerk's Flutter SDK exposes a `ClerkAuth` stream — wrap it in a Riverpod provider and derive an enum (`unknown | signedOut | signedIn | needsOnboarding | deleted`) from it.
- The redirect function's shape stays the same; only the data source changes.

Explicitly skip: typed routes via `go_router_builder`. Couple-tools doesn't use them and the string-constants approach has held up fine.

---

## State — Riverpod

- Riverpod 3 with `riverpod_generator` (`@riverpod` annotation + codegen) as the default
- Manual `Provider` / `NotifierProvider` only when codegen is awkward (e.g., composite providers that watch several sources)
- `AsyncNotifier` for mutable async state, `FutureProvider` for one-shot reads
- Central registry in `lib/data/providers/` for anything cross-feature; feature-scoped providers live in `features/<name>/providers/`

Couple-tools reference: `lib/data/providers/repository_providers.dart:1-295` for the registry pattern.

For Convex: we'll write a thin `ConvexClient` wrapper provider, then expose query/mutation builders as generated providers. The exact Convex+Riverpod bridge will be designed during scaffolding — `convex-flutter` package shape and Riverpod best practices need a quick validation pass.

---

## Env Vars — Envied

- Single `@Envied(path: '.env.$flavor')` class at `lib/core/config/env.dart`
- All env values exposed as `static const` (compile-time, no runtime parsing overhead)
- `.env*` files gitignored; `.env.example` committed with all required keys and inline comments
- Platform-specific keys (e.g., RevenueCat's separate iOS/Android API keys) are separate named fields, not a runtime `Platform.isIOS` switch

Couple-tools reference: `lib/core/config/env.dart:1-54`.

Secrets in CI: each Codemagic workflow injects env vars from encrypted groups and materializes them into `.env.$flavor` before `flutter build`.

---

## Auth — Clerk (not Supabase)

The old project used Supabase auth. Clerk is a full auth platform with pre-built UI (sign-in, sign-up, user profile) and a Flutter SDK.

- Init in Phase 2 of bootstrap
- Wrap Clerk's session stream in a `clerkAuthStateProvider` — shape it into the same `AppAuthState` enum we use in routing, so the router logic is backend-agnostic
- On sign-in success: call `OneSignalConfig.loginUser(clerkUserId)` and `RevenueCatService.ensureIdentified(clerkUserId, email)` — both use the Clerk user ID as the external identifier
- Convex: authenticate the Convex client with Clerk JWTs. Convex has first-class Clerk support — this is one of the reasons for the stack choice.

Open question for scaffolding: does Clerk's Flutter SDK give us hosted UI or do we build our own sign-in screens against Clerk APIs? Resolve in first scaffolding session.

---

## Backend — Convex (not Supabase)

Convex is the system of record. All persistent state and business logic should live server-side. Specifically:

- Data model + queries + mutations in `convex/` directory (TypeScript)
- Scheduled jobs via Convex cron
- File uploads proxied through Convex → Cloudflare R2 (Convex gives us signed-URL flow)
- Email sends via Postmark triggered from Convex actions
- Prefer **Convex components** over hand-rolled server code wherever one fits (auth helpers, rate limiting, feature flags, etc.). Reference: <https://www.convex.dev/components>

The Flutter client should be a thin consumer: react to Convex query streams, call mutations, render. Business rules do not live in Dart.

Old Twikka followed "maximize server-side logic" as a principle with Supabase (edge functions, cron, etc.). That principle carries over verbatim to Convex.

---

## Transactional Email — Postmark (server-side)

Not a Flutter dependency. Postmark API is called from Convex actions (Node runtime). The Flutter app has no Postmark code.

## File Storage — Cloudflare R2 (server-side)

Not a Flutter dependency. Client uploads files by:
1. Calling a Convex action to get a presigned upload URL
2. `PUT`ing the file to R2 directly from Flutter
3. Calling a Convex mutation with the resulting R2 key

The presigning and bucket access live server-side.

---

## Subscriptions — RevenueCat

Couple-tools reference: `lib/core/services/revenuecat_service.dart:1-265`.

- Singleton service with `initialize()`, `ensureIdentified(userId, email)`, `logOut()`
- Init in Phase 2 of bootstrap
- Call `ensureIdentified` on Clerk sign-in success
- **Entitlement state lives in Convex, not RevenueCat.** RevenueCat webhooks fire into a Convex HTTP action that updates the user's subscription row. The Flutter app reads subscription state from a Convex query provider, not directly from RevenueCat.
- Optimistic post-purchase update: after `purchasePackage()` succeeds, extract entitlements from the returned `CustomerInfo` and seed the Convex query cache — avoids the webhook-latency window where the UI would show "not subscribed."

Platform-specific API keys (`REVENUECAT_IOS_API_KEY`, `REVENUECAT_ANDROID_API_KEY`) are separate envied fields.

Paywall: use `RevenueCatUI.presentPaywall()` from `purchases_ui_flutter` rather than hand-rolling the UI initially. Revisit if design needs outgrow it.

---

## Push — OneSignal

Couple-tools reference: `lib/core/config/onesignal_config.dart:1-200`.

- Static config class with `initialize()`, `loginUser(userId)`, `logoutUser()`
- **External User ID = Clerk user ID** (so Convex can send notifications by looking up the Clerk id)
- Notification tap handler: parse the `type` field in `additionalData`, route to the matching screen via the router
- Email channel attached via `addEmail()` for cross-channel campaigns — though with Postmark in the stack, we may push transactional email through Postmark and use OneSignal only for push; worth a decision during scaffolding.
- Keep tag usage minimal (OneSignal free plan caps tags; pattern from couple-tools)

---

## Error Tracking — Sentry

- Init wraps `runApp` via `appRunner` (shown in bootstrap section)
- Wrap widget tree in `SentryWidget` for navigation/interaction tracking
- `beforeSend` filter drops known-benign exceptions; the couple-tools filter list is Supabase/PowerSync-specific, so we start ours from scratch and grow it as we observe noise
- Release tag from `Env.appVersion` + build number; environment tag from `Env.appEnvironment` (set per flavor)
- `sentry_dart_plugin` in dev deps auto-uploads dSYMs and Proguard mappings after `flutter build` — wire it in during scaffolding

Set Clerk user context on auth state change: `Sentry.configureScope((scope) => scope.setUser(SentryUser(id: clerkUserId)))`.

---

## Responsive Design

Couple-tools reference: `lib/core/utils/responsive.dart:1-51`.

Simple and dependency-free:

```dart
class ResponsiveBreakpoints {
  static const mobile = 600.0;
  static const tablet = 1200.0;

  static bool isMobile(BuildContext c) => MediaQuery.sizeOf(c).width < mobile;
  static bool isTablet(BuildContext c) => /* 600..1200 */;
  static bool isTabletOrLarger(BuildContext c) => MediaQuery.sizeOf(c).width >= mobile;
}

class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;
  // LayoutBuilder branches on width
}
```

- Phone: bottom nav bar in the main shell
- Tablet: navigation rail (or side nav) in the main shell; content pane wider
- No `flutter_screenutil`, no `responsive_framework`. Plain `MediaQuery` and `LayoutBuilder` are sufficient.

Every new screen should be reviewed on both form factors before merge.

---

## Theming & Design System

Couple-tools reference: `lib/core/theme/` + `lib/core/widgets/`.

**Day-one product requirements (confirmed):**
- Multiple selectable themes (palettes) shipped at launch
- Light and dark mode shipped at launch, with system-follows-OS as the default
- Both selections are persisted per-user and must survive app restart

**Implementation:**
- `flex_color_scheme` with Material 3 enabled — the multi-theme and light/dark pair generation is why we pick it over stock `ColorScheme.fromSeed`
- Theme catalog defined in `lib/core/theme/app_themes.dart` as an enum + a `FlexScheme` (or custom `FlexSchemeData`) per entry. Start with 3–4 palettes; the catalog is easy to grow later.
- Design tokens in `lib/core/theme/`: `app_radius.dart`, `app_spacing.dart`, theme extensions for any non-M3 colors (brand accents, semantic colors)
- `themeControllerProvider` (Riverpod, codegen) holds `(selectedTheme, themeMode)` and exposes setters. Root `MaterialApp.router` watches it and rebuilds with the new theme.
- Persistence: SharedPreferences keys `theme.palette` and `theme.mode` (values: `system` / `light` / `dark`). Read on bootstrap, written on change.
- Theme picker UI: a screen under Settings that shows palette swatches + a light/dark/system segmented control. Live preview on selection; no "save" button needed since the provider writes through.
- Component library in `lib/core/widgets/`: `AppButton`, `AppTextField`, `AppCard`, `AppListView` — always reach for these in feature code so theme changes propagate consistently instead of bleeding raw Material widgets with hand-set colors.
- Fonts: Google Fonts (Nunito in couple-tools; Twikka's font choice is TBD — resolve during scaffolding once brand direction is set).

Use `.withValues(alpha: x)` (Flutter ≥3.27) — `.withOpacity()` is deprecated.

---

## i18n — deferred, but scaffold for it

Not live in v1. But we want the cost of adding it later to be low. Actions at scaffold time:

1. Keep `intl` in `dependencies`
2. Add `flutter_localizations` to `dependencies` (cheap)
3. Create `lib/l10n/app_en.arb` with a single placeholder message
4. Add `l10n.yaml` config so `flutter gen-l10n` runs
5. Do **not** yet add `localizationsDelegates` / `supportedLocales` to `MaterialApp` — no runtime cost until we flip this on
6. Write feature strings as constants in a `strings.dart` per feature initially — easy to find-and-replace into ARB keys later

Evaluate `slang` vs stock `intl` when we actually activate i18n — `slang` has nicer codegen but adds a dependency.

---

## Error Handling & Logging

Couple-tools reference: `lib/core/utils/logger.dart:1-25`, `lib/core/services/error_handler.dart`.

- `logger` package with a custom `MinimalPrinter` (no timestamps, clean output)
- Log level: `Level.debug` in debug, `Level.warning` in release
- `ErrorHandler` singleton surfaces errors in two modes:
  - **Developer mode** (debug builds) — full stack in a dialog or snackbar
  - **User mode** (release) — friendly message, details shipped to Sentry
- Error UI widgets: `ErrorSnackBar`, `ErrorDialog`, `ErrorStateWidget` — include in the component library

Never `print()`. Never swallow a caught exception without either rethrowing, logging, or explicitly explaining (in a comment) why it's ignored.

---

## Testing

Start modest. Grow coverage with features.

- `flutter_test` for widget tests; one smoke test that `runApp`s the root widget
- Unit tests for:
  - Router redirect logic (couple-tools has `test/routing/app_router_test.dart` — similar fixture)
  - Core services
  - Any non-trivial pure Dart logic in features
- `ProviderContainer` with overrides for Riverpod-dependent tests
- `mockito` available when needed, not required by default
- No E2E / integration tests in v1 — revisit after feature-complete MVP

---

## CI/CD

Use Codemagic + Fastlane, matching couple-tools' proven setup.

- `codemagic.yaml` with four workflows to start: `twikka-ios`, `twikka-android`, `admin-ios`, `admin-android`
- Each workflow: materialize `.env.$flavor`, `flutter build`, Fastlane upload (TestFlight / Play internal track)
- Build number source of truth: `ci-cd/build_number.txt`, auto-incremented by the deploy script
- `sentry_dart_plugin` uploads symbols post-build
- No automatic builds on push — manual trigger only (same as couple-tools)

---

## What we're explicitly **not** borrowing from couple-tools

- **Supabase client, auth, storage, edge functions** → replaced by Convex + Clerk + R2
- **PowerSync** → replaced by Convex's native reactivity (queries are already live-updating)
- **Mixpanel** → not in the stack yet
- **KMP strategy docs** (`couple-tools/docs/strategy/kmp_*.md`) — couple-tools' migration path to Kotlin Multiplatform is an open direction for that project, not a commitment for Twikka. Evaluate separately if/when it becomes relevant.
- The four-flavor setup — we're going with two flavors as described above

---

## Open questions to resolve during scaffolding

These deliberately don't have answers yet; pin them here so they don't get lost:

1. **Clerk SDK shape** — does the Dart/Flutter SDK give us hosted UI (recommended) or do we need to build sign-in screens ourselves?
2. **Convex + Riverpod bridge** — what's the cleanest adapter? A generated provider per query, or a generic `convexQueryProvider(functionReference, args)` helper?
3. **Paywall presentation** — `purchases_ui_flutter` default, or custom UI?
4. **Font choice** — Nunito as a placeholder, or does Twikka brand call for something specific?
5. **Localization framework** — stock `intl` + ARB, or `slang`?
6. **Admin app shape** — same codebase with a flavor-gated feature set, or would the admin app eventually want to diverge into its own repo?

---

## Key reference files in couple-tools

When scaffolding, open these side-by-side:

| Concern | Couple-tools path |
|---|---|
| Root `main.dart` | `lib/main.dart:10-149` |
| Bootstrap phases | `lib/core/services/bootstrap_service.dart:32-183` |
| Router + redirect | `lib/routing/app_router.dart:60-337` |
| Provider registry | `lib/data/providers/repository_providers.dart:1-295` |
| Envied setup | `lib/core/config/env.dart:1-54` |
| RevenueCat service | `lib/core/services/revenuecat_service.dart:1-265` |
| OneSignal config | `lib/core/config/onesignal_config.dart:1-200` |
| Responsive utility | `lib/core/utils/responsive.dart:1-51` |
| Logger | `lib/core/utils/logger.dart:1-25` |
| Codemagic workflows | `codemagic.yaml` |
| Reference CLAUDE.md | `CLAUDE.md` |
