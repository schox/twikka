import 'package:flutter/material.dart';

// ─────────────────────────────────────────────────────────────────────
// Twikka design tokens — warm, patient, morning-light.
// Mirrors `tokens.css` from the design package.
// ─────────────────────────────────────────────────────────────────────

// Surfaces
const Color twBg = Color(0xFFFAF8F5);          // app background
const Color twPaper = Color(0xFFFFFDF9);       // raised surfaces (cards, headers)
const Color twPaperDeep = Color(0xFFF6F2EB);   // canvas behind device
const Color twCream = Color(0xFFF3EEE6);       // coach bubble / cream cards
const Color twCreamDeep = Color(0xFFECE5D8);   // card inner

// Ink + muted
const Color twInk = Color(0xFF1F2A2E);
const Color twInk2 = Color(0xFF3D4A4F);
const Color twMuted = Color(0xFF6B6560);
const Color twMuted2 = Color(0xFF938B84);

// Hairlines + borders
const Color twHairline = Color(0xFFE7E0D5);

// Accent — terracotta (default)
const Color twTerracotta = Color(0xFFC97B5E);
const Color twTerracottaSoft = Color(0xFFE9CDBE);
const Color twTerracottaTint = Color(0xFFF5E4D9);

// Sage (secondary warm) — used for trajectory dots, progress accents
const Color twSage = Color(0xFF8FA48C);
const Color twSageSoft = Color(0xFFD4DCCF);

// Clay (alt warm)
const Color twClay = Color(0xFFB89072);
const Color twClaySoft = Color(0xFFE6D3C0);

// Aliases — the "current accent". For now wired straight to terracotta.
const Color twAccent = twTerracotta;
const Color twAccentSoft = twTerracottaSoft;
const Color twAccentTint = twTerracottaTint;

// Errors (kept calm)
const Color twError = Color(0xFFB05A45);
const Color twErrorSoft = Color(0xFFEED4CB);

// Radii
const double radiusSm = 10;
const double radiusMd = 14;
const double radiusLg = 18;
const double radiusXl = 22;
const double radiusBubble = 18;
const double radiusBubbleTail = 6;
const double radiusCard = 22;
const double radiusCardTail = 8;
const double radiusPill = 999;

// Spacing baseline (matches --gap-1..6 from tokens.css)
const double gap1 = 6;
const double gap2 = 10;
const double gap3 = 14;
const double gap4 = 18;
const double gap5 = 24;
const double gap6 = 32;

// Page-level
const double pageHorizontalPadding = 16;
const double pageVerticalPadding = gap2;

// Component
const double iconSizeSmall = 16;
const double iconSizeMedium = 18;
const double iconSizeLarge = 22;

// Avatars
const double avatarChatTrail = 28;       // trailing avatar in chat bubble row
const double avatarHeader = 40;          // coach header
const double avatarRow = 48;             // inbox row
const double avatarPortrait = 56;        // selection card
const double avatarProfile = 100;        // full profile

// Progress indicators
const double progressIndicatorSmall = 18;
const double progressIndicatorMedium = 28;
const double progressIndicatorLarge = 44;

// Layout breakpoints (from couple-tools convention, kept the same)
const int mobileBreakpoint = 600;
const int tabletBreakpoint = 1024;
const int desktopBreakpoint = 1440;

// Stats
const double statsAreaChartHeight = 96;
