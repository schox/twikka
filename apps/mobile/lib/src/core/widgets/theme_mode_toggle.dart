import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Animated 3-position toggle for the active [AppThemeMode]
/// (light / dark / system). Tapping anywhere cycles forward; tapping
/// directly on a specific glyph jumps to that mode.
class ThemeModeToggle extends StatefulWidget {
  const ThemeModeToggle({
    super.key,
    required this.mode,
    required this.onChanged,
  });

  final AppThemeMode mode;
  final ValueChanged<AppThemeMode> onChanged;

  @override
  State<ThemeModeToggle> createState() => _ThemeModeToggleState();
}

class _ThemeModeToggleState extends State<ThemeModeToggle>
    with SingleTickerProviderStateMixin {
  static const double _trackWidth = 156;
  static const double _trackHeight = 48;
  static const double _knobSize = 40;
  static const double _knobInset = (_trackHeight - _knobSize) / 2;

  late final AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: kMotionMedium,
      value: _positionFor(widget.mode),
    );
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
  }

  @override
  void didUpdateWidget(covariant ThemeModeToggle oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.mode != widget.mode) {
      _controller.animateTo(_positionFor(widget.mode));
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  double _positionFor(AppThemeMode mode) => switch (mode) {
        AppThemeMode.light => 0,
        AppThemeMode.dark => 0.5,
        AppThemeMode.system => 1,
      };

  void _cycle() {
    const order = AppThemeMode.values;
    final next = order[(widget.mode.index + 1) % order.length];
    widget.onChanged(next);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return GestureDetector(
      onTap: _cycle,
      child: SizedBox(
        width: _trackWidth,
        height: _trackHeight,
        child: Stack(
          children: [
            // Track
            DecoratedBox(
              decoration: BoxDecoration(
                color: scheme.surfaceContainer,
                borderRadius: BorderRadius.circular(_trackHeight / 2),
                border: Border.all(color: scheme.outline),
              ),
            ),
            // Static glyphs (light / dark / system)
            for (final mode in AppThemeMode.values)
              Positioned.fill(
                child: Align(
                  alignment: _alignmentFor(mode),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: _knobInset),
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: () => widget.onChanged(mode),
                      child: SizedBox(
                        width: _knobSize,
                        height: _knobSize,
                        child: Icon(
                          mode.icon,
                          size: 20,
                          color: widget.mode == mode
                              ? Colors.transparent
                              : scheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            // Sliding knob
            AnimatedBuilder(
              animation: _animation,
              builder: (context, _) {
                final t = _animation.value;
                final dx = _knobInset +
                    (_trackWidth - _knobSize - 2 * _knobInset) * t;
                return Positioned(
                  left: dx,
                  top: _knobInset,
                  child: Container(
                    width: _knobSize,
                    height: _knobSize,
                    decoration: BoxDecoration(
                      color: scheme.primary,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: scheme.shadow,
                          blurRadius: 4,
                          offset: const Offset(0, 1),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: Icon(
                      widget.mode.icon,
                      size: 20,
                      color: scheme.onPrimary,
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Alignment _alignmentFor(AppThemeMode mode) => switch (mode) {
        AppThemeMode.light => Alignment.centerLeft,
        AppThemeMode.dark => Alignment.center,
        AppThemeMode.system => Alignment.centerRight,
      };
}
