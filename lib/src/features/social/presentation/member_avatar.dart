import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/branding/abstract_avatar.dart';
import '../data/social_models.dart';

class MemberAvatar extends StatelessWidget {
  const MemberAvatar({
    super.key,
    required this.member,
    this.size = 36,
    this.ring = false,
    this.coachBadge = false,
  });

  final Member member;
  final double size;
  final bool ring;
  final bool coachBadge;

  @override
  Widget build(BuildContext context) {
    return AbstractAvatar(
      palette: member.palette,
      monogram: member.monogram,
      size: size,
      ring: ring,
      coachBadge: coachBadge || member.isCoach,
    );
  }
}

class GroupAvatarWidget extends StatelessWidget {
  const GroupAvatarWidget({super.key, required this.group, this.size = 36});

  final SocialGroup group;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Theme.of(context).colorScheme.surfaceContainerLowest,
        border: Border.all(color: group.avatar.ring, width: 1.5),
      ),
      alignment: Alignment.center,
      child: Text(
        group.avatar.glyph,
        style: GoogleFonts.fraunces(
          fontSize: size * 0.44,
          fontWeight: FontWeight.w500,
          color: group.avatar.ink,
          letterSpacing: -0.02 * size * 0.44,
        ),
      ),
    );
  }
}
