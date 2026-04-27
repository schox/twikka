# Twikka — App Store + Play Store setup

First-time onboarding checklist for getting Twikka onto TestFlight and
Google Play Internal Testing. Mirrors the pattern proven on couple-tools.

---

## Apple Developer

### Account
- **Entity**: Novansa Pty Ltd
- **Team ID**: `4R5HLHSR7V`
- **Apple ID**: stored in `ci-cd/secrets/ios-credentials.env`

### App ID
Register `com.novansa.twka` in
Apple Developer → Certificates, Identifiers & Profiles → Identifiers → +.

Capabilities Twikka needs (v1):
- **HealthKit** — required for the workout/steps integration shipped in B4
- **Sign in with Apple** — only enable if/when we add it
- (No App Groups, Push Notifications, or In-App Purchase yet — leave off
  until the product needs them)

> The bundle ID is `com.novansa.twka` (not `twikka`) because the previous
> Google account holds the older identifier hostage. Same ID on both
> stores so search/install flows are consistent.

### Distribution certificate
Same Novansa Pty Ltd distribution cert used by couple-tools (valid until
Oct 2026) can sign Twikka — distribution certs are per team, not per
app. Export as `.p12` and place at:

```
ci-cd/secrets/certificates/distribution.p12
```

### Provisioning profile
Generate one App Store profile for `com.novansa.twka`:
- Apple Developer → Profiles → + → App Store
- Tied to `com.novansa.twka` and the distribution cert
- Download as `.mobileprovision` and place at:

```
ci-cd/secrets/profiles/Twikka_Distribution.mobileprovision
```

### App Store Connect API key
For automated TestFlight uploads:
1. App Store Connect → Users and Access → Keys (Integrations)
2. Create key with **App Manager** role (the existing couple-tools key
   may already cover this if it was scoped to the team rather than
   per-app — check first; if so, reuse).
3. Download the `.p8` (only available once!).
4. Note the **Key ID** and **Issuer ID**.
5. Place the file at `ci-cd/secrets/AuthKey_XXXXXXXXXX.p8` and update
   `ios-credentials.env`.

### App Store Connect record
Create the app record in App Store Connect:
- App Store Connect → Apps → + → New App
- Platform: iOS
- Name: **Twikka**
- Primary language: English (Australia)
- Bundle ID: `com.novansa.twka`
- SKU: `twikka-ios` (any unique string)

After this, TestFlight is reachable for the first build.

---

## Google Play Console

### App
Create app in Google Play Console:
- App name: **Twikka**
- Default language: English (Australia)
- Application: App
- Free / paid: Free (subscription tier comes later via Play Billing)

Application ID: `com.novansa.twka` — must match
`android/app/build.gradle.kts` `applicationId`.

### Service account
For automated uploads:
1. Google Play Console → Setup → API access
2. Create or reuse a service account.
3. Grant **Release to testing tracks** (and optionally production).
4. Download the JSON key.
5. Place at `ci-cd/secrets/google-play-service.json` and reference it
   from `android-credentials.env` via `SUPPLY_JSON_KEY`.

### Release keystore
Generate a Twikka-specific keystore (couple-tools has its own — they
must not be shared):

```sh
keytool -genkey -v \
  -keystore ci-cd/secrets/twikka-release-key.jks \
  -alias twikka \
  -keyalg RSA -keysize 2048 -validity 10000
```

Then point `android/key.properties` at it. Keep the password somewhere
safe — losing it means losing the ability to update the app on Play.

---

## Credential files

Once all the secrets above are in place:

```sh
cp ci-cd/secrets/ios-credentials.env.example ci-cd/secrets/ios-credentials.env
cp ci-cd/secrets/android-credentials.env.example ci-cd/secrets/android-credentials.env
```

Edit each with your real values (Apple ID, key IDs, paths). Both files
are gitignored.

---

## File checklist before first deploy

iOS:
- [ ] `ci-cd/secrets/certificates/distribution.p12`
- [ ] `ci-cd/secrets/profiles/Twikka_Distribution.mobileprovision`
- [ ] `ci-cd/secrets/AuthKey_XXXXXXXXXX.p8`
- [ ] `ci-cd/secrets/ios-credentials.env`

Android:
- [ ] `ci-cd/secrets/twikka-release-key.jks`
- [ ] `ci-cd/secrets/google-play-service.json`
- [ ] `ci-cd/secrets/android-credentials.env`
- [ ] `android/key.properties` configured

Repo:
- [ ] `bundle install` (rbenv Ruby >= 3.2 recommended)

---

## First deploy

```sh
# Confirm the version is what you want.
./ci-cd/scripts/update-version.sh --check

# Try iOS only first; the cocoapods + signing path is the most error-prone.
./ci-cd/scripts/deploy-ios.sh

# Then Android.
./ci-cd/scripts/deploy-android.sh

# Once both are clean:
./ci-cd/scripts/deploy-all.sh
```

Logs land in `ci-cd/logs/<platform>_<timestamp>.log`.

---

## Links
- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Portal](https://developer.apple.com/account)
- [Google Play Console](https://play.google.com/console)
