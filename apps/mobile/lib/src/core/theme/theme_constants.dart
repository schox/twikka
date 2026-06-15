// ─────────────────────────────────────────────────────────────────────
// Twikka design tokens — sizing, layout, motion, type scale.
//
// These tokens are *theme-agnostic*: they describe the size and
// rhythm of the UI, not its colour. Colours live in the variant
// palette files under `variants/`. Anything in this file is shared by
// every theme variant.
// ─────────────────────────────────────────────────────────────────────

// ── Type families ────────────────────────────────────────────────────
// Twikka uses two families:
//   • Fraunces — display serif (warm, soft optical settings)
//   • Plus Jakarta Sans — UI / body
const String kSerifFamily = 'Fraunces';
const String kSansFamily = 'Plus Jakarta Sans';

// ── Type scale ───────────────────────────────────────────────────────
// Single source of truth for font sizes. Display + headline + title
// lean on the serif family; body + label on the sans family.
const double kFontDisplayLarge = 44;
const double kFontDisplayMedium = 36;
const double kFontDisplaySmall = 30;
const double kFontHeadlineLarge = 28;
const double kFontHeadlineMedium = 24;
const double kFontHeadlineSmall = 20;
const double kFontTitleLarge = 22;
const double kFontTitleMedium = 18;
const double kFontTitleSmall = 13;
const double kFontBodyLarge = 17;
const double kFontBodyMedium = 15;
const double kFontBodySmall = 13;
const double kFontLabelLarge = 15;
const double kFontLabelMedium = 13;
const double kFontLabelSmall = 11;

// ── Hero / brand sizes (off the standard scale) ──────────────────────
// Used by the brand mark (auth screen), chat hero, and oversized
// numerals. Anything above the headline/display ladder lands here.
const double kFontBrandMark = 42;
const double kFontHeroMark = 44;

// ── Radii ────────────────────────────────────────────────────────────
const double radiusSm = 10;
const double radiusMd = 14;
const double radiusLg = 18;
const double radiusXl = 22;
const double radiusBubble = 18;
const double radiusBubbleTail = 6;
const double radiusCard = 22;
const double radiusCardTail = 8;
const double radiusPill = 999;

// ── Spacing baseline (matches --gap-1..6 from tokens.css) ────────────
const double gap1 = 6;
const double gap2 = 10;
const double gap3 = 14;
const double gap4 = 18;
const double gap5 = 24;
const double gap6 = 32;

// Sub-gap values for tight intra-component spacing. Use sparingly —
// most layouts should sit on the gap1..6 scale.
const double gapHair = 2;
const double gapTight = 4;

// ── Page-level ───────────────────────────────────────────────────────
const double pageHorizontalPadding = 16;
const double pageVerticalPadding = gap2;

// ── Responsive content caps ──────────────────────────────────────────
// Forms (auth, profile edit) read best when the line length stays
// close to a single column on tablet. Lists and cards can breathe a
// little wider.
const double kFormMaxWidth = 520;
const double kContentMaxWidth = 720;

// ── Component sizing ─────────────────────────────────────────────────
const double iconSizeSmall = 16;
const double iconSizeMedium = 18;
const double iconSizeLarge = 22;

// Avatars
const double avatarChatTrail = 28; // trailing avatar in chat bubble row
const double avatarHeader = 40; // coach header
const double avatarRow = 48; // inbox row
const double avatarPortrait = 56; // selection card
const double avatarProfile = 100; // full profile

// Progress indicators
const double progressIndicatorSmall = 18;
const double progressIndicatorMedium = 28;
const double progressIndicatorLarge = 44;

// Layout breakpoints
const int mobileBreakpoint = 600;
const int tabletBreakpoint = 1024;
const int desktopBreakpoint = 1440;

// Stats
const double statsAreaChartHeight = 96;

// ── Motion ───────────────────────────────────────────────────────────
const Duration kMotionFast = Duration(milliseconds: 120);
const Duration kMotionMedium = Duration(milliseconds: 220);
const Duration kMotionSlow = Duration(milliseconds: 320);

// ── App bar / navigation sizing ──────────────────────────────────────
const double kNavigationBarHeight = 72;
const double kNavigationIconSize = 26;
const double kRailIconSize = 36;

// ── Button sizing ────────────────────────────────────────────────────
const double kButtonMinHeight = 48;
