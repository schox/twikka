import 'package:flutter/painting.dart';

/// Three-tone warm palette used by an abstract Twikka avatar.
///
/// Mirrors the JS prototype: `a` is the head-ish circle, `b` is the
/// shoulder/back layer, `c` is the cream background tile, and `ink` tints
/// the monogram glyph.
class AvatarPalette {
  const AvatarPalette({
    required this.a,
    required this.b,
    required this.c,
    required this.ink,
  });

  final Color a;
  final Color b;
  final Color c;
  final Color ink;
}
