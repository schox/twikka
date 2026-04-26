// Twikka uses Phosphor icons exclusively. Material's `Icons.*` set is
// banned everywhere in `lib/` — it doesn't pair with the warm palette
// or the calm voice (Material's icons are louder than we want).
//
// This file is the single import any UI code needs for icons. Use the
// semantic names defined here (`TwikkaIcons.profile`) rather than
// reaching into `phosphor_flutter` directly. That way an icon swap
// (e.g. swapping Regular for Light on a specific surface) is a
// one-file change.

import 'package:flutter/widgets.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

class TwikkaIcons {
  TwikkaIcons._();

  // ── Navigation / shell ────────────────────────────────────────────
  // Selected nav uses Bold (heavier line) rather than Fill (solid) —
  // pairs better with the warm light surface and avoids reading as a
  // chip / shape.
  static const IconData chatOutline = PhosphorIconsRegular.chatCircle;
  static const IconData chatSelected = PhosphorIconsBold.chatCircle;
  static const IconData chartOutline = PhosphorIconsRegular.chartLineUp;
  static const IconData chartSelected = PhosphorIconsBold.chartLineUp;
  static const IconData peopleOutline = PhosphorIconsRegular.usersThree;
  static const IconData peopleSelected = PhosphorIconsBold.usersThree;
  static const IconData settingsOutline = PhosphorIconsRegular.gear;
  static const IconData settingsSelected = PhosphorIconsBold.gear;

  // ── Settings tree ─────────────────────────────────────────────────
  static const IconData profile = PhosphorIconsRegular.user;
  static const IconData coach = PhosphorIconsRegular.heart;
  static const IconData preferences = PhosphorIconsRegular.slidersHorizontal;
  static const IconData subscription = PhosphorIconsRegular.crown;
  static const IconData about = PhosphorIconsRegular.info;
  static const IconData debug = PhosphorIconsRegular.bug;
  static const IconData appVersion = PhosphorIconsRegular.tag;
  static const IconData docs = PhosphorIconsRegular.fileText;
  static const IconData privacy = PhosphorIconsRegular.shield;
  static const IconData support = PhosphorIconsRegular.lifebuoy;
  static const IconData signOut = PhosphorIconsRegular.signOut;

  // ── Profile ───────────────────────────────────────────────────────
  static const IconData displayName = PhosphorIconsRegular.identificationCard;
  static const IconData email = PhosphorIconsRegular.envelopeSimple;
  static const IconData city = PhosphorIconsRegular.mapPin;
  static const IconData timezone = PhosphorIconsRegular.clock;

  // ── Status / inline ───────────────────────────────────────────────
  static const IconData check = PhosphorIconsBold.check;
  static const IconData checkCircle = PhosphorIconsFill.checkCircle;
  static const IconData circleOutline = PhosphorIconsRegular.circle;
  static const IconData chevronRight = PhosphorIconsRegular.caretRight;
  static const IconData errorCircle = PhosphorIconsRegular.warningCircle;
  static const IconData flag = PhosphorIconsRegular.flag;
  static const IconData notifications = PhosphorIconsRegular.bell;
  static const IconData refresh = PhosphorIconsRegular.arrowsClockwise;
  static const IconData search = PhosphorIconsRegular.magnifyingGlass;
  static const IconData edit = PhosphorIconsRegular.pencilSimple;
  static const IconData send = PhosphorIconsBold.arrowUp;
}
