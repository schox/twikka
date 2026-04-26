import 'package:flutter/painting.dart';

import 'avatar_palette.dart';

/// Per-coach AvatarPalette, keyed by `coach_personas.slug`. Lives in code
/// rather than the Convex doc because it's pure visual presentation —
/// changing it doesn't require a backend migration. Phase D will fold these
/// hues into the warm corners of the real HeyGen photos so the picker
/// transition is seamless.
const Map<String, AvatarPalette> _coachPalettes = {
  // Priya — peach / apricot warmth
  'priya': AvatarPalette(
    a: Color(0xFFE3A887),
    b: Color(0xFFC97E5C),
    c: Color(0xFFF7E5D6),
    ink: Color(0xFF7A3F25),
  ),
  // Fiona — terracotta + clay
  'fiona': AvatarPalette(
    a: Color(0xFFCF8367),
    b: Color(0xFFA85839),
    c: Color(0xFFF1DDCB),
    ink: Color(0xFF6F3520),
  ),
  // Margaret — cocoa cream (Twikka default)
  'margaret': AvatarPalette(
    a: Color(0xFFD7AC8C),
    b: Color(0xFFA77452),
    c: Color(0xFFF6E6D4),
    ink: Color(0xFF5C3920),
  ),
  // Ben — sage
  'ben': AvatarPalette(
    a: Color(0xFFA8B89B),
    b: Color(0xFF6F8267),
    c: Color(0xFFE5EAD8),
    ink: Color(0xFF3D4D38),
  ),
  // Rob — oat + charcoal
  'rob': AvatarPalette(
    a: Color(0xFFBDA988),
    b: Color(0xFF85745A),
    c: Color(0xFFEFE4D2),
    ink: Color(0xFF3F362A),
  ),
  // Tom — pale slate
  'tom': AvatarPalette(
    a: Color(0xFFB6B6AC),
    b: Color(0xFF7F7F75),
    c: Color(0xFFE6E6DD),
    ink: Color(0xFF383832),
  ),
};

/// Default palette used when a slug isn't in the table — should never
/// happen in normal flow but keeps rendering safe if a new coach lands
/// before the client is updated.
const AvatarPalette _defaultPalette = AvatarPalette(
  a: Color(0xFFD8C8B6),
  b: Color(0xFF937A5E),
  c: Color(0xFFF1E5D6),
  ink: Color(0xFF4D3A28),
);

AvatarPalette paletteForCoachSlug(String? slug) =>
    _coachPalettes[slug] ?? _defaultPalette;

String coachInitial(String name) =>
    name.trim().isEmpty ? '?' : name.trim().substring(0, 1).toUpperCase();
