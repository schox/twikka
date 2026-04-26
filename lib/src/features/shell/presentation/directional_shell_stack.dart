import 'package:flutter/material.dart';

/// Container for go_router's `StatefulShellRoute.navigatorContainerBuilder`.
/// Renders all branches in a Stack so each preserves its own Navigator
/// state across tab switches; the inactive ones are kept offstage.
/// On a branch change, the outgoing branch slides off in the direction
/// opposite to the tap and the incoming branch slides in from the side
/// matching the tap.
class DirectionalShellStack extends StatefulWidget {
  const DirectionalShellStack({
    super.key,
    required this.currentIndex,
    required this.children,
  });

  final int currentIndex;
  final List<Widget> children;

  @override
  State<DirectionalShellStack> createState() => _DirectionalShellStackState();
}

class _DirectionalShellStackState extends State<DirectionalShellStack>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late int _previousIndex;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 240),
      value: 1,
    );
    _previousIndex = widget.currentIndex;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(DirectionalShellStack old) {
    super.didUpdateWidget(old);
    if (widget.currentIndex != old.currentIndex) {
      _previousIndex = old.currentIndex;
      _controller.forward(from: 0);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isAnimating = _controller.value < 1;
    final goingRight = widget.currentIndex > _previousIndex;
    final dx = goingRight ? 1.0 : -1.0;

    return ClipRect(
      child: AnimatedBuilder(
        animation: _controller,
        builder: (ctx, _) {
          final t = Curves.easeOut.transform(_controller.value);
          final width = MediaQuery.sizeOf(ctx).width;

          return Stack(
            fit: StackFit.expand,
            children: [
              for (var i = 0; i < widget.children.length; i++)
                _branch(i, t, width, dx, isAnimating),
            ],
          );
        },
      ),
    );
  }

  Widget _branch(int i, double t, double width, double dx, bool isAnimating) {
    final isCurrent = i == widget.currentIndex;
    final isPrevious = isAnimating && i == _previousIndex && !isCurrent;
    final isVisible = isCurrent || isPrevious;

    if (!isVisible) {
      // Keep mounted (preserves Navigator state) but skip painting / hit
      // testing.
      return Offstage(child: TickerMode(enabled: false, child: widget.children[i]));
    }

    final offset = isPrevious
        ? -dx * t * width // outgoing slides off in the opposite direction
        : dx * (1 - t) * width; // incoming slides in from the new direction

    return Transform.translate(
      offset: Offset(offset, 0),
      // Outgoing branch should not steal taps mid-slide.
      child: IgnorePointer(
        ignoring: isPrevious,
        child: widget.children[i],
      ),
    );
  }
}
