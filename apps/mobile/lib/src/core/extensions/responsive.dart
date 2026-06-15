import 'package:flutter/widgets.dart';

import '../theme/app_theme.dart';

extension ResponsiveContextX on BuildContext {
  double get screenWidth => MediaQuery.sizeOf(this).width;
  double get screenHeight => MediaQuery.sizeOf(this).height;

  bool get isMobile => screenWidth < mobileBreakpoint;
  bool get isTablet => screenWidth >= mobileBreakpoint && screenWidth < tabletBreakpoint;
  bool get isDesktop => screenWidth >= tabletBreakpoint;
  bool get isCompact => isMobile;
  bool get isExpanded => !isMobile;
}
