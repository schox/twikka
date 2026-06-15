/// Local fixture for chat plumbing while Phase C wires up the real
/// per-user persona pipeline. Avatars are now derived from
/// `id` + `name` by `CoachAvatar`, so palette data lives no more.
class Coach {
  const Coach({
    required this.id,
    required this.name,
    required this.descriptor,
    required this.sample,
    this.photoUrl,
    this.cacheKey,
  });

  final String id;
  final String name;
  final String descriptor;
  final String sample;
  final String? photoUrl;
  // R2 object key — passed through to CachedNetworkImage so cache hits
  // survive signed-URL rotations.
  final String? cacheKey;
}

const List<Coach> kCoaches = [
  Coach(
    id: 'margaret',
    name: 'Margaret',
    descriptor: 'Patient and reflective. Retired GP, mid-50s.',
    sample:
        'Hey. How’ve you been? No need to catch me up — whatever’s on your mind is fine.',
  ),
  Coach(
    id: 'dave',
    name: 'Dave',
    descriptor: 'Dry-humoured and steady. Late 60s.',
    sample: 'Right. Shall we not overthink today? A short wander counts plenty.',
  ),
  Coach(
    id: 'priya',
    name: 'Priya',
    descriptor: 'Gentle and curious. Early 40s.',
    sample: 'What felt alright this week? Even the small stuff — I’m interested.',
  ),
  Coach(
    id: 'tom',
    name: 'Tom',
    descriptor: 'Quiet and unhurried. Retired, 70s.',
    sample:
        'No rush. When the weather’s right, you’ll know. We can start from there.',
  ),
  Coach(
    id: 'ren',
    name: 'Ren',
    descriptor: 'Calm and practical. Physio, late 40s.',
    sample:
        'Whatever your body’s up for today, that’s the right amount. We’ll work with it.',
  ),
];

const Coach defaultCoach = Coach(
  id: 'margaret',
  name: 'Margaret',
  descriptor: 'Patient and reflective. Retired GP, mid-50s.',
  sample:
      'Hey. How’ve you been? No need to catch me up — whatever’s on your mind is fine.',
);
