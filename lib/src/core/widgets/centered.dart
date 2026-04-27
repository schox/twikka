import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Centers and width-caps its child. On phones the child fills the
/// available width (the cap never engages); on tablets and desktop the
/// content stays within a comfortable reading column instead of
/// stretching across the whole pane.
///
/// Use [Centered.form] for input-heavy screens (auth, profile edit) and
/// [Centered.content] for list/card-heavy screens (settings hub, sub-
/// screens). Pass a custom [maxWidth] when neither token fits.
class Centered extends StatelessWidget {
  const Centered({
    super.key,
    required this.maxWidth,
    required this.child,
  });

  const Centered.form({super.key, required this.child}) : maxWidth = kFormMaxWidth;
  const Centered.content({super.key, required this.child}) : maxWidth = kContentMaxWidth;

  final double maxWidth;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.topCenter,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: child,
      ),
    );
  }
}
