import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_theme.dart';
import 'avatar_palette.dart';

/// Soft abstract portrait — overlapping circles, shoulder line, faint serif
/// monogram. Same vocabulary as the design's `CoachAvatar` / `MemberAvatar`.
class AbstractAvatar extends StatelessWidget {
  const AbstractAvatar({
    super.key,
    required this.palette,
    this.monogram,
    this.size = 48,
    this.ring = false,
    this.coachBadge = false,
  });

  final AvatarPalette palette;
  final String? monogram;
  final double size;
  final bool ring;
  final bool coachBadge;

  @override
  Widget build(BuildContext context) {
    final showMonogram = monogram != null && size >= 28;
    final scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          DecoratedBox(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              boxShadow: ring
                  ? [
                      BoxShadow(color: scheme.surface, blurRadius: 0, spreadRadius: 3),
                      BoxShadow(color: scheme.shadow, blurRadius: 0, spreadRadius: 4),
                    ]
                  : null,
            ),
            child: ClipOval(
              child: SizedBox(
                width: size,
                height: size,
                child: CustomPaint(
                  painter: _AbstractAvatarPainter(palette, scheme.shadow),
                ),
              ),
            ),
          ),
          if (showMonogram)
            Positioned.fill(
              child: Center(
                child: Text(
                  monogram!,
                  style: GoogleFonts.fraunces(
                    fontSize: size * 0.42,
                    fontWeight: FontWeight.w500,
                    letterSpacing: -0.02 * size * 0.42,
                    color: palette.ink.withValues(alpha: 0.55),
                  ),
                ),
              ),
            ),
          if (coachBadge)
            Positioned(
              right: -1,
              bottom: -1,
              child: Container(
                width: size * 0.42,
                height: size * 0.42,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: context.tw.accentTint,
                  border: Border.all(color: scheme.surface, width: 1.5),
                ),
                alignment: Alignment.center,
                child: Text(
                  'c',
                  style: GoogleFonts.fraunces(
                    fontSize: size * 0.24,
                    fontWeight: FontWeight.w500,
                    color: scheme.primary,
                    height: 1,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _AbstractAvatarPainter extends CustomPainter {
  _AbstractAvatarPainter(this.p, this.hairlineColor);

  final AvatarPalette p;
  final Color hairlineColor;

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final r = w / 2;
    final paint = Paint()..isAntiAlias = true;

    // Cream background tile
    paint.color = p.c;
    canvas.drawRect(Offset.zero & size, paint);

    // Soft back shape (shoulder/back)
    paint.color = p.b.withValues(alpha: 0.55);
    canvas.drawCircle(Offset(r * 0.65, r * 1.25), r * 0.85, paint);

    // Head-ish shape
    paint.color = p.a;
    canvas.drawCircle(Offset(r * 1.05, r * 0.9), r * 0.72, paint);

    // Highlight
    paint.color = const Color(0x59FFFFFF);
    canvas.drawCircle(Offset(r * 1.3, r * 0.7), r * 0.18, paint);

    // Shoulder line (curve at the bottom)
    final path = Path()
      ..moveTo(0, h * 0.95)
      ..quadraticBezierTo(r, h * 0.75, w, h * 0.95)
      ..lineTo(w, h)
      ..lineTo(0, h)
      ..close();
    paint.color = p.b.withValues(alpha: 0.75);
    canvas.drawPath(path, paint);

    // Hairline ring
    paint
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1
      ..color = hairlineColor;
    canvas.drawCircle(Offset(r, r), r - 0.5, paint);
  }

  @override
  bool shouldRepaint(covariant _AbstractAvatarPainter old) =>
      old.p.a != p.a ||
      old.p.b != p.b ||
      old.p.c != p.c ||
      old.p.ink != p.ink ||
      old.hairlineColor != hairlineColor;
}
