# CI/CD for Twikka

Mirrors the pattern from `couple-tools/ci-cd`: fastlane lanes for iOS
TestFlight + Android Google Play, driven by shell scripts that source
per-platform credentials from `secrets/`. pubspec.yaml is the single
source of truth for `version` and `+buildNumber`.

## Quick start

```sh
# iOS → TestFlight
./ci-cd/scripts/deploy-ios.sh

# Android → Google Play (default track: internal)
./ci-cd/scripts/deploy-android.sh

# Both platforms (one shared build number)
./ci-cd/scripts/deploy-all.sh

# Bump the marketing version (preserves +buildNumber)
./ci-cd/scripts/update-version.sh 1.1.0

# Show current version info
./ci-cd/scripts/update-version.sh --check
```

## Layout

```
ci-cd/
├── build_number.txt            # Mirror of +N from pubspec.yaml (gitignored)
├── fastlane/
│   ├── Appfile                 # Bundle ID + team ID
│   ├── Fastfile                # iOS + Android beta + build lanes
│   └── ExportOptions.plist     # Reference; Fastfile generates a dynamic copy with API key
├── scripts/
│   ├── deploy-all.sh           # Deploy iOS + Android
│   ├── deploy-ios.sh           # Deploy iOS to TestFlight
│   ├── deploy-android.sh       # Deploy Android to Play Console
│   ├── update-version.sh       # Edit marketing version (X.Y.Z)
│   └── helpers/
│       ├── version-bump.sh         # Increment +buildNumber in pubspec
│       └── update-pubspec-build.sh # Stamp pubspec.yaml after a successful deploy
├── secrets/                    # GITIGNORED
│   ├── ios-credentials.env.example           # APPLE_ID, TEAM_ID, ASC API key
│   ├── android-credentials.env.example       # SUPPLY_JSON_KEY, package, track
│   ├── certificates/                         # iOS distribution .p12
│   ├── profiles/                             # iOS provisioning profiles
│   ├── AuthKey_XXXXX.p8                      # ASC API key
│   └── google-play-service.json              # GP service account
├── logs/                       # GITIGNORED — per-deploy timestamped logs
└── docs/
    └── twikka-setup.md         # First-time setup walkthrough (Apple + Google)
```

## How it works

1. `version-bump.sh` reads `version: X.Y.Z+N` from `pubspec.yaml`,
   increments `N`, and writes `VERSION_NAME` + `BUILD_NUMBER` to
   `/tmp/twikka_build.env`.
2. `deploy-{ios,android}.sh` sources that env, calls `bundle exec
   fastlane <platform> beta`, and on success calls
   `update-pubspec-build.sh` to stamp the final number into pubspec.
3. `deploy-all.sh` bumps once, then runs both deploy scripts with
   `SKIP_VERSION_BUMP=true` so they share the same `+N`.

Env vars are injected via [`envied`](https://pub.dev/packages/envied):
`@Envied(path: '.env.local')` reads `.env.local` at codegen time and
bakes the values into `lib/src/core/config/env.g.dart` as `static
const` fields. The Fastfile runs `dart run build_runner build` before
each `flutter build` so the committed `env.g.dart` is in sync. After
editing `.env.local` locally, run `dart run build_runner build
--delete-conflicting-outputs` and commit the regenerated file.

## First-time setup

See [`docs/twikka-setup.md`](docs/twikka-setup.md) for the
Apple Developer + Google Play onboarding checklist (App ID
registration, App Store Connect API key, signing certificate,
provisioning profiles, Play Console service account, and the Android
release keystore).

```sh
# Once Ruby (>= 3.2 via rbenv recommended) is set up:
bundle install
```

## Security

The following are gitignored — never commit them:

- `ci-cd/secrets/*.env` (except `*.env.example`)
- `ci-cd/secrets/*.p8`, `*.p12`, `*.json`, `*.jks`, `*.mobileprovision`
- `ci-cd/secrets/certificates/`, `ci-cd/secrets/profiles/`
- `ci-cd/build_number.txt`, `ci-cd/logs/`
