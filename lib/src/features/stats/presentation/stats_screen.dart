import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../../core/theme/theme_constants.dart';
import '../../../core/widgets/notifications_bell.dart';

/// "Journal" — Twikka's progress view. Calm, never-rescinded framing:
/// no streaks, no goals to miss. Mirrors the `ProgressScreen` from the design.
class StatsScreen extends StatelessWidget {
  const StatsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        titleSpacing: gap4,
        title: Text('Progress', style: theme.textTheme.titleLarge),
        actions: const [NotificationsBell()],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(gap4, gap4, gap4, gap6),
        children: [
          // Hero "so far" line
          Text('SO FAR',
              style: theme.textTheme.labelSmall?.copyWith(color: twMuted)),
          const SizedBox(height: gap2),
          Text.rich(
            TextSpan(
              style: theme.textTheme.headlineLarge?.copyWith(height: 1.2),
              children: [
                const TextSpan(text: 'You’ve been active on '),
                TextSpan(text: '47 days', style: const TextStyle(color: twAccent)),
                const TextSpan(text: ' since you started with Twikka.'),
              ],
            ),
          ),
          const SizedBox(height: gap2),
          Text(
            'This number only goes up. Quiet days don’t take anything away.',
            style: theme.textTheme.bodyMedium?.copyWith(color: twMuted),
          ),
          const SizedBox(height: gap5),

          // Rolling-pace area chart
          _Card(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('LAST 90 DAYS — ROLLING PACE',
                    style: theme.textTheme.labelSmall?.copyWith(color: twMuted)),
                const SizedBox(height: gap3),
                SizedBox(
                  width: double.infinity,
                  height: statsAreaChartHeight,
                  child: CustomPaint(painter: _AreaChartPainter()),
                ),
                const SizedBox(height: 6),
                DefaultTextStyle(
                  style: theme.textTheme.bodySmall!.copyWith(color: twMuted),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [Text('Jan'), Text('Feb'), Text('Mar')],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: gap3),

          // Milestones
          const _Milestone(value: '47', label: 'Days you’ve been active'),
          const SizedBox(height: gap2),
          const _Milestone(value: '6', label: 'Different activities you’ve tried'),
          const SizedBox(height: gap2),
          const _Milestone(value: 'March', label: 'Most consistent month', valueFontSize: 26),

          const SizedBox(height: gap5),

          Text('WHAT YOU’VE TRIED',
              style: theme.textTheme.labelSmall?.copyWith(color: twMuted)),
          const SizedBox(height: gap2),
          _Card(
            padding: const EdgeInsets.symmetric(horizontal: gap4),
            child: const Column(
              children: [
                _ActivityRow(name: 'Morning walks', count: '28 times'),
                _Divider(),
                _ActivityRow(name: 'Stretching', count: '11 times'),
                _Divider(),
                _ActivityRow(name: 'Swimming', count: '4 times'),
                _Divider(),
                _ActivityRow(name: 'Gardening', count: '3 times'),
                _Divider(),
                _ActivityRow(name: 'Bike to the shops', count: '2 times'),
                _Divider(),
                _ActivityRow(name: 'Tai chi (tried once)', count: '1 time'),
              ],
            ),
          ),

          const SizedBox(height: gap5),

          // Reflective note
          Container(
            padding: const EdgeInsets.all(gap4),
            decoration: BoxDecoration(
              color: twCream,
              borderRadius: BorderRadius.circular(radiusLg),
              border: Border.all(color: twHairline),
            ),
            child: Text(
              '“Morning walks are clearly your thing. You don’t have to make it more complicated than that — Margaret.”',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: twInk2,
                fontStyle: FontStyle.italic,
                height: 1.5,
              ),
            ),
          ),

          const SizedBox(height: gap4),
          Center(
            child: Text(
              'No streaks. No goals to miss.',
              style: theme.textTheme.bodySmall?.copyWith(color: twMuted),
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────

class _Card extends StatelessWidget {
  const _Card({required this.child, this.padding});
  final Widget child;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding ?? const EdgeInsets.all(gap3),
      decoration: BoxDecoration(
        color: twPaper,
        border: Border.all(color: twHairline),
        borderRadius: BorderRadius.circular(radiusMd),
      ),
      child: child,
    );
  }
}

class _Milestone extends StatelessWidget {
  const _Milestone({required this.value, required this.label, this.valueFontSize = 32});
  final String value;
  final String label;
  final double valueFontSize;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return _Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: gap2, vertical: gap1),
        child: Row(
          children: [
            ConstrainedBox(
              constraints: const BoxConstraints(minWidth: 96, maxWidth: 130),
              child: Text(
                value,
                style: theme.textTheme.displaySmall?.copyWith(
                  color: twAccent,
                  fontSize: valueFontSize,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ),
            const SizedBox(width: gap3),
            Expanded(child: Text(label, style: theme.textTheme.bodyLarge?.copyWith(color: twInk2))),
          ],
        ),
      ),
    );
  }
}

class _ActivityRow extends StatelessWidget {
  const _ActivityRow({required this.name, required this.count});
  final String name;
  final String count;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: gap2),
      child: Row(
        children: [
          Expanded(child: Text(name, style: theme.textTheme.bodyLarge?.copyWith(color: twInk))),
          Text(count, style: theme.textTheme.bodyMedium?.copyWith(color: twMuted)),
        ],
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  const _Divider();
  @override
  Widget build(BuildContext context) =>
      const Divider(height: 0.5, thickness: 0.5, color: twHairline);
}

// ─────────────────────────────────────────────────────────────────────
// Soft area chart — directional, no axis, deterministic
// ─────────────────────────────────────────────────────────────────────

class _AreaChartPainter extends CustomPainter {
  static final List<double> _values = _generateRollingPace();

  static List<double> _generateRollingPace() {
    final rand = math.Random(42); // deterministic
    final active = <bool>[];
    for (var i = 0; i < 90; i++) {
      final p = i < 20 ? 0.25 : i < 55 ? 0.55 : 0.65;
      active.add(rand.nextDouble() < p);
    }
    final out = <double>[];
    for (var i = 0; i < 90; i++) {
      var sum = 0;
      var c = 0;
      for (var j = math.max(0, i - 6); j <= i; j++) {
        if (active[j]) sum++;
        c++;
      }
      out.add(sum / c);
    }
    return out;
  }

  @override
  void paint(Canvas canvas, Size size) {
    if (size.width <= 0 || size.height <= 0) return;
    final w = size.width;
    final h = size.height;
    const pad = 4.0;
    final pts = <Offset>[];
    for (var i = 0; i < _values.length; i++) {
      final x = (i / (_values.length - 1)) * w;
      final clamped = _values[i].clamp(0.0, 1.0);
      final y = h - pad - (clamped * (h - pad * 2));
      pts.add(Offset(x, y));
    }

    Path buildSmoothed({required bool closed}) {
      final p = Path();
      if (closed) {
        p.moveTo(0, h);
        p.lineTo(pts.first.dx, pts.first.dy);
      } else {
        p.moveTo(pts.first.dx, pts.first.dy);
      }
      for (var i = 1; i < pts.length; i++) {
        final mid = Offset(
          (pts[i].dx + pts[i - 1].dx) / 2,
          (pts[i].dy + pts[i - 1].dy) / 2,
        );
        p.quadraticBezierTo(pts[i - 1].dx, pts[i - 1].dy, mid.dx, mid.dy);
      }
      p.lineTo(pts.last.dx, pts.last.dy);
      if (closed) {
        p.lineTo(w, h);
        p.close();
      }
      return p;
    }

    final fill = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          twAccent.withValues(alpha: 0.35),
          twAccent.withValues(alpha: 0.04),
        ],
      ).createShader(Offset.zero & size);
    canvas.drawPath(buildSmoothed(closed: true), fill);

    canvas.drawPath(
      buildSmoothed(closed: false),
      Paint()
        ..color = twAccent.withValues(alpha: 0.9)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.6
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round,
    );
  }

  @override
  bool shouldRepaint(covariant _AreaChartPainter old) => false;
}
