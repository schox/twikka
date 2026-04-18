import 'package:flutter/painting.dart';

import '../../../core/branding/avatar_palette.dart';

class Coach {
  const Coach({
    required this.id,
    required this.name,
    required this.monogram,
    required this.descriptor,
    required this.sample,
    required this.palette,
  });

  final String id;
  final String name;
  final String monogram;
  final String descriptor;
  final String sample;
  final AvatarPalette palette;
}

const List<Coach> kCoaches = [
  Coach(
    id: 'margaret',
    name: 'Margaret',
    monogram: 'M',
    descriptor: 'Patient and reflective. Retired GP, mid-50s.',
    sample:
        'Hey. How’ve you been? No need to catch me up — whatever’s on your mind is fine.',
    palette: AvatarPalette(
      a: Color(0xFFD89C80),
      b: Color(0xFF8FA48C),
      c: Color(0xFFE9CDBE),
      ink: Color(0xFF5B3B2E),
    ),
  ),
  Coach(
    id: 'dave',
    name: 'Dave',
    monogram: 'D',
    descriptor: 'Dry-humoured and steady. Late 60s.',
    sample: 'Right. Shall we not overthink today? A short wander counts plenty.',
    palette: AvatarPalette(
      a: Color(0xFFB89072),
      b: Color(0xFF6B8E8E),
      c: Color(0xFFE6D3C0),
      ink: Color(0xFF4A3826),
    ),
  ),
  Coach(
    id: 'priya',
    name: 'Priya',
    monogram: 'P',
    descriptor: 'Gentle and curious. Early 40s.',
    sample: 'What felt alright this week? Even the small stuff — I’m interested.',
    palette: AvatarPalette(
      a: Color(0xFFC88A8A),
      b: Color(0xFF9E8DB3),
      c: Color(0xFFEED3D3),
      ink: Color(0xFF5A3838),
    ),
  ),
  Coach(
    id: 'tom',
    name: 'Tom',
    monogram: 'T',
    descriptor: 'Quiet and unhurried. Retired, 70s.',
    sample:
        'No rush. When the weather’s right, you’ll know. We can start from there.',
    palette: AvatarPalette(
      a: Color(0xFFA6A78F),
      b: Color(0xFFC7B78F),
      c: Color(0xFFDDDCC3),
      ink: Color(0xFF46452E),
    ),
  ),
  Coach(
    id: 'ren',
    name: 'Ren',
    monogram: 'R',
    descriptor: 'Calm and practical. Physio, late 40s.',
    sample:
        'Whatever your body’s up for today, that’s the right amount. We’ll work with it.',
    palette: AvatarPalette(
      a: Color(0xFF8FA9B5),
      b: Color(0xFFC9B18A),
      c: Color(0xFFD6E1E5),
      ink: Color(0xFF2F4A55),
    ),
  ),
];

const Coach defaultCoach = Coach(
  id: 'margaret',
  name: 'Margaret',
  monogram: 'M',
  descriptor: 'Patient and reflective. Retired GP, mid-50s.',
  sample:
      'Hey. How’ve you been? No need to catch me up — whatever’s on your mind is fine.',
  palette: AvatarPalette(
    a: Color(0xFFD89C80),
    b: Color(0xFF8FA48C),
    c: Color(0xFFE9CDBE),
    ink: Color(0xFF5B3B2E),
  ),
);
