import 'package:flutter/material.dart';

/// Twikka-specific colour tokens that don't have a clean home in the
/// Material 3 [ColorScheme]. Each variant supplies its own values; the
/// builder bakes them in as a [ThemeExtension] so feature code reads
/// them via `Theme.of(context).extension<TwikkaPalette>()` (or the
/// shorter `context.tw` accessor below).
///
/// Stick to ColorScheme tokens when one fits — `colorScheme.primary`
/// for accent, `colorScheme.onSurfaceVariant` for muted text,
/// `colorScheme.outline` for hairlines. Reach for TwikkaPalette when
/// the colour is genuinely Twikka-specific (cream chat bubbles, the
/// soft accent tint behind chips, the success/warning/info semantics
/// Material 3 doesn't ship).
@immutable
class TwikkaPalette extends ThemeExtension<TwikkaPalette> {
  const TwikkaPalette({
    required this.paperDeep,
    required this.cream,
    required this.creamDeep,
    required this.ink2,
    required this.muted2,
    required this.accentSoft,
    required this.accentTint,
    required this.success,
    required this.onSuccess,
    required this.successContainer,
    required this.onSuccessContainer,
    required this.warning,
    required this.onWarning,
    required this.warningContainer,
    required this.onWarningContainer,
    required this.info,
    required this.onInfo,
    required this.infoContainer,
    required this.onInfoContainer,
  });

  /// Canvas colour behind the device frame in marketing/illustrative
  /// surfaces. One step deeper than [ColorScheme.surface].
  final Color paperDeep;

  /// Coach chat bubble background. Slightly creamier than
  /// surfaceContainer.
  final Color cream;

  /// Card inner colour, one shade deeper than [cream].
  final Color creamDeep;

  /// Softer ink — for second-line text where onSurface is too strong
  /// and onSurfaceVariant is too muted. Sits between the two.
  final Color ink2;

  /// Even quieter than onSurfaceVariant — used for trailing icons,
  /// time stamps, "ago" markers.
  final Color muted2;

  /// Lower-saturation accent — chip backgrounds, soft highlight rings.
  /// One step richer than primaryContainer.
  final Color accentSoft;

  /// Tinted wash of the accent — backgrounds for callout cards,
  /// subtle "free plan" surfaces, etc.
  final Color accentTint;

  /// Semantic success (resolved states, positive trends).
  final Color success;
  final Color onSuccess;
  final Color successContainer;
  final Color onSuccessContainer;

  /// Semantic warning (ambiguous states, low-severity flags).
  final Color warning;
  final Color onWarning;
  final Color warningContainer;
  final Color onWarningContainer;

  /// Semantic info (new states, neutral alerts).
  final Color info;
  final Color onInfo;
  final Color infoContainer;
  final Color onInfoContainer;

  @override
  TwikkaPalette copyWith({
    Color? paperDeep,
    Color? cream,
    Color? creamDeep,
    Color? ink2,
    Color? muted2,
    Color? accentSoft,
    Color? accentTint,
    Color? success,
    Color? onSuccess,
    Color? successContainer,
    Color? onSuccessContainer,
    Color? warning,
    Color? onWarning,
    Color? warningContainer,
    Color? onWarningContainer,
    Color? info,
    Color? onInfo,
    Color? infoContainer,
    Color? onInfoContainer,
  }) {
    return TwikkaPalette(
      paperDeep: paperDeep ?? this.paperDeep,
      cream: cream ?? this.cream,
      creamDeep: creamDeep ?? this.creamDeep,
      ink2: ink2 ?? this.ink2,
      muted2: muted2 ?? this.muted2,
      accentSoft: accentSoft ?? this.accentSoft,
      accentTint: accentTint ?? this.accentTint,
      success: success ?? this.success,
      onSuccess: onSuccess ?? this.onSuccess,
      successContainer: successContainer ?? this.successContainer,
      onSuccessContainer: onSuccessContainer ?? this.onSuccessContainer,
      warning: warning ?? this.warning,
      onWarning: onWarning ?? this.onWarning,
      warningContainer: warningContainer ?? this.warningContainer,
      onWarningContainer: onWarningContainer ?? this.onWarningContainer,
      info: info ?? this.info,
      onInfo: onInfo ?? this.onInfo,
      infoContainer: infoContainer ?? this.infoContainer,
      onInfoContainer: onInfoContainer ?? this.onInfoContainer,
    );
  }

  @override
  TwikkaPalette lerp(ThemeExtension<TwikkaPalette>? other, double t) {
    if (other is! TwikkaPalette) return this;
    return TwikkaPalette(
      paperDeep: Color.lerp(paperDeep, other.paperDeep, t)!,
      cream: Color.lerp(cream, other.cream, t)!,
      creamDeep: Color.lerp(creamDeep, other.creamDeep, t)!,
      ink2: Color.lerp(ink2, other.ink2, t)!,
      muted2: Color.lerp(muted2, other.muted2, t)!,
      accentSoft: Color.lerp(accentSoft, other.accentSoft, t)!,
      accentTint: Color.lerp(accentTint, other.accentTint, t)!,
      success: Color.lerp(success, other.success, t)!,
      onSuccess: Color.lerp(onSuccess, other.onSuccess, t)!,
      successContainer: Color.lerp(successContainer, other.successContainer, t)!,
      onSuccessContainer: Color.lerp(onSuccessContainer, other.onSuccessContainer, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      onWarning: Color.lerp(onWarning, other.onWarning, t)!,
      warningContainer: Color.lerp(warningContainer, other.warningContainer, t)!,
      onWarningContainer: Color.lerp(onWarningContainer, other.onWarningContainer, t)!,
      info: Color.lerp(info, other.info, t)!,
      onInfo: Color.lerp(onInfo, other.onInfo, t)!,
      infoContainer: Color.lerp(infoContainer, other.infoContainer, t)!,
      onInfoContainer: Color.lerp(onInfoContainer, other.onInfoContainer, t)!,
    );
  }
}

/// Sugar for `Theme.of(context).extension<TwikkaPalette>()!`.
///
/// Crashes loudly if the active theme doesn't carry a TwikkaPalette —
/// which would mean the theme builder forgot to register it. We want
/// that crash early.
extension TwikkaPaletteContext on BuildContext {
  TwikkaPalette get tw => Theme.of(this).extension<TwikkaPalette>()!;
}
