# Locale roadmap and layout elasticity

**Status:** Foundational reference. v1 ships en-AU only, but layout discipline is enforced from day one.
**Purpose:** Capture (a) the priority order for adding locales after v1, and (b) the layout rules that make adding them later cheap.

---

## v1 commitment

en-AU only. All copy in warm, plain Australian English. Locale strings externalised from day one (ARB files, `intl` package, `flutter gen-l10n`) but `localizationsDelegates` and `supportedLocales` are not yet wired into `MaterialApp` — no runtime cost until we flip this on.

See `docs/01-architecture-patterns.md` § "i18n — deferred, but scaffold for it" for the scaffolding details.

---

## Locale roadmap (post-v1, prioritised by demand)

This list is the working priority order. Real demand will reshape it.

1. **English variants — en-GB, en-US, en-NZ.** Same ARB tree with per-region overrides for spelling and idiom. Coach voice mostly works as-is; idiom calibration needed (American positivity patterns are out across the board).
2. **English (simplified)** — lighter reading level for accessibility. Same coach personas, simpler vocabulary and sentence structure.
3. **Spanish (neutral)** — drives a per-language pass on coach personas (the coach voice does not translate cleanly via MT).
4. **Portuguese (Brazilian)** — similar pass.
5. **French.**
6. **German.**
7. **Italian.**
8. **Japanese.**
9. **Korean.**
10. **Simplified Chinese.**

Each non-English locale requires a per-language pass on coach-persona prompts. PRD §20.4 is canon on this point — the coach voice is character work, not translation work.

---

## Locale-elastic layout rules

Every UI control with text — button, chip, list tile, header, tab label, snackbar — must tolerate string-length variance from day one. Even though we ship en-AU only in v1, every UI decision should be reviewable later under a German + Japanese smoke test.

### Hard rules

- **No fixed-width buttons** that fit only the English label. Use intrinsic sizing or a min-width with overflow handling.
- **Headers and titles must wrap or auto-shrink rather than truncate** unless truncation is genuinely the intended behaviour (e.g. message preview snippets in the inbox).
- **Bottom-nav labels need room for ≈1.5× the English length** (German, French run long) and conversely cope with very short ideographic labels (Japanese, Chinese).
- **Form-field labels never sit *inside* the field if they could overflow** — float labels above instead.
- **No string concatenation across locales.** "You have " + count + " messages" breaks the moment you localise. Use ICU MessageFormat or `intl` plurals from day one even in en-AU.
- **No baking dates, numbers, or currency into ARB strings.** Use `DateFormat`, `NumberFormat`.
- **Right-to-left readiness** — use `Directionality` and `EdgeInsetsDirectional` rather than `EdgeInsets.only(left: ...)`. Even though no v1 RTL locale ships, this is cheap to do correctly from the start.

### Things to test against

When evaluating any new screen, mentally apply:

- **German smoke test** — does the layout still work if every string is 50% longer?
- **Japanese smoke test** — does the layout still work if every string is 70% shorter and uses ideographic characters?
- **Plural smoke test** — does the count copy work for 0, 1, 2, many?

If yes to all three, the screen is locale-elastic. If no to any, fix the layout, not the strings.

### Coach character per locale

The coach personas doc (`docs/twikka_coach_personas.md`) is en-AU canon. When a non-English locale is added, the persona needs:

- A re-imagined backstory anchored in the locale's culture (Margaret in en-AU is a different person to Margarita in es)
- Re-written would/wouldn't say lists in the target language's idiom
- Re-recorded sample lines in voice (especially important for v2 voice coaching)
- A native-speaker pass on the AI disclosure response

Do not auto-translate persona content. The character is the value; a machine-translated persona feels uncanny in a way that breaks trust.

---

## Implementation status across phases

| Phase | What lands |
|---|---|
| A | `intl` + `flutter_localizations` deps, `lib/l10n/app_en_AU.arb` with one placeholder, `l10n.yaml` config |
| B–E | All visible strings are constants in a `strings.dart` per feature initially. Easy to find-and-replace into ARB keys later. |
| F | Full ARB extraction, accessibility audit at 100% / 130% / 150% type, layout review at multiple string lengths |
| post-v1 | Activate `localizationsDelegates` + `supportedLocales`. Add second locale (en-GB likely first). Per-locale persona pass. |

---

## Related docs

- `docs/01-architecture-patterns.md` — i18n scaffolding details
- `docs/04-build-plan.md` Phase F — locale-elastic layouts as cross-cutting principle
- `docs/twikka_coach_personas.md` — en-AU persona canon
- `docs/twikka_v1_prd.md` §20.4 — internationalisation principles
