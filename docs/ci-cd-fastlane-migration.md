# Mobile CI/CD (fastlane) — post-restructure fix-up

**Status: needs verification before the next mobile deploy.**

On 2026-06-15 Twikka was restructured to the standard Novansa layout: the Flutter
app **and** its `ci-cd/` fastlane setup moved as a unit from the repo root into
`apps/mobile/`. This note records what still works, what to check, and what to fix
before deploying to the App Store / Play Store.

## What moved

```
<root>/lib, ios, android, assets, fonts, pubspec.yaml, Gemfile, ci-cd/, ...
   →  apps/mobile/lib, ios, android, assets, fonts, pubspec.yaml, Gemfile, ci-cd/, ...
```

`convex/`, `scripts/` (Convex seed tooling), and `docs/` stayed at the repo root.

## What still works (relative paths preserved)

Because the Flutter app and `ci-cd/` moved **together**, all *internal* relative
paths are intact:

- `ci-cd/scripts/deploy-ios.sh` / `deploy-android.sh` compute
  `PROJECT_ROOT="$SCRIPT_DIR/../.."` → now resolves to `apps/mobile/` (where
  `pubspec.yaml` lives). Still correct.
- `ci-cd/scripts/update-version.sh` uses the same `../../` → `apps/mobile/pubspec.yaml`. Correct.
- `ci-cd/fastlane/` (Appfile, Fastfile, ExportOptions.plist) references the `ios/`
  project relative to the fastlane dir → still `apps/mobile/ios`. Correct.
- `Gemfile` / bundler / `.ruby-version` moved with the app. Correct.
- The flutter `.gitignore` moved to `apps/mobile/.gitignore`, so its `ci-cd/secrets/*`,
  `/build/`, `/android/app/release` patterns are correctly anchored under `apps/mobile`.

## What to fix / verify BEFORE deploying

1. **External invocation paths.** Anything that *calls* the deploy scripts now
   needs the new prefix: `apps/mobile/ci-cd/scripts/deploy-*.sh` (was
   `ci-cd/scripts/...`). Check: any CI runner config, shell aliases, and the
   references in `apps/mobile/ci-cd/README.md`.
2. **Verify a build from the new location** (Flutter isn't available in the
   migration environment, so this was NOT verified):
   ```bash
   cd apps/mobile
   flutter pub get
   flutter build ipa        # and: flutter build appbundle
   ```
3. **Fastlane dry-run:**
   ```bash
   cd apps/mobile/ci-cd/fastlane
   bundle install
   bundle exec fastlane ios build   # or the lane you use; confirm paths resolve
   ```
4. **Secrets present.** The real `ci-cd/secrets/*.env` files were copied to
   `apps/mobile/ci-cd/secrets/` (gitignored). Confirm they're there.
5. **Convex unaffected.** `convex/` stayed at root; `npm run convex:dev` /
   `convex:deploy` run from the repo root as before.

## Note for Couple Tools

Couple Tools has the same flutter-root + fastlane structure. Apply the identical
move (Flutter + `ci-cd/` as a unit → `apps/mobile/`) and the same fix-up checklist.
