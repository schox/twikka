import 'package:flutter/material.dart';

import '../../../core/branding/abstract_avatar.dart';
import '../data/coach.dart';

/// Coach avatar = [AbstractAvatar] keyed off a [Coach].
class CoachAvatar extends StatelessWidget {
  const CoachAvatar({
    super.key,
    required this.coach,
    this.size = 48,
    this.showMonogram = false,
    this.ring = false,
  });

  final Coach coach;
  final double size;
  final bool showMonogram;
  final bool ring;

  @override
  Widget build(BuildContext context) {
    return AbstractAvatar(
      palette: coach.palette,
      monogram: showMonogram ? coach.monogram : null,
      size: size,
      ring: ring,
    );
  }
}
