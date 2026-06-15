// Social fixtures for the inbox shell while real threads/groups land
// in Phase D. Avatars are derived from `id` + `name` by PersonAvatar
// / GroupAvatar, so palette data lives no more.

class Member {
  const Member({
    required this.id,
    required this.name,
    required this.handle,
    required this.context,
    required this.location,
    this.bio = '',
    this.isCoach = false,
    this.photoUrl,
  });

  final String id;
  final String name;
  final String handle;
  final String context; // "Met through Fullarton parkrun"
  final String location;
  final String bio;
  final bool isCoach;
  final String? photoUrl;
}

class SocialGroup {
  const SocialGroup({
    required this.id,
    required this.name,
    required this.topic,
    required this.memberCount,
    this.photoUrl,
  });
  final String id;
  final String name;
  final String topic;
  final int memberCount;
  final String? photoUrl;
}

enum ThreadKind { coach, dm, group, invite }

class InboxThread {
  const InboxThread({
    required this.id,
    required this.kind,
    required this.preview,
    required this.timeLabel,
    this.unread = 0,
    this.pinned = false,
    this.peerId,
    this.groupId,
    this.inviteNote,
  });

  final String id;
  final ThreadKind kind;
  final String preview;
  final String timeLabel;
  final int unread;
  final bool pinned;
  final String? peerId;
  final String? groupId;
  final String? inviteNote;
}

// ─────────────────────────────────────────────────────────────────────
// Fixtures (mirror social-data.jsx, lightly trimmed)
// ─────────────────────────────────────────────────────────────────────

const Member coachMember = Member(
  id: 'margaret',
  name: 'Margaret',
  handle: 'margaret',
  context: 'Your coach',
  location: '',
  isCoach: true,
);

const List<Member> kMembers = [
  Member(
    id: 'alex',
    name: 'Alex Moreton',
    handle: 'alex_m',
    context: 'Met through Fullarton parkrun',
    location: 'Glasgow · Southside',
    bio: 'Parkrun regular. Mostly tail-walker these days, which suits me.',
  ),
  Member(
    id: 'priya',
    name: 'Priya Shah',
    handle: 'priya_s',
    context: 'Introduced by Margaret',
    location: 'Glasgow · West End',
    bio: 'Walking my way back after a rough year. Good company welcome.',
  ),
  Member(
    id: 'ken',
    name: 'Ken Brown',
    handle: 'kenny_b',
    context: 'Met through Fullarton parkrun',
    location: 'Paisley',
    bio: 'Retired, 71. Started the Couch to 5k last year. Still on couch-week-3.',
  ),
  Member(
    id: 'maya',
    name: 'Maya Okafor',
    handle: 'maya_o',
    context: 'Met in Couch to 5k',
    location: 'Glasgow · East End',
    bio: 'Running a first half marathon in April. Accepting all the nerves.',
  ),
  Member(
    id: 'jamie',
    name: 'Jamie Tait',
    handle: 'jamie_t',
    context: 'Sent you an invite',
    location: 'Edinburgh',
    bio: 'Dog-walking counts, right? (It counts.)',
  ),
];

const List<SocialGroup> kGroups = [
  SocialGroup(
    id: 'fullarton',
    name: 'Fullarton parkrun crew',
    topic: 'Saturday 9:30 · Fullarton Park',
    memberCount: 11,
  ),
  SocialGroup(
    id: 'couch5k',
    name: 'Couch-to-5k — March cohort',
    topic: 'Coached by Margaret',
    memberCount: 8,
  ),
  SocialGroup(
    id: 'restdays',
    name: 'Rest-day appreciators',
    topic: 'Anyone can join',
    memberCount: 214,
  ),
];

const List<InboxThread> kInboxThreads = [
  InboxThread(
    id: 'coach',
    kind: ThreadKind.coach,
    peerId: 'margaret',
    preview: 'Alright is plenty. That’s three mornings this week…',
    timeLabel: '7:14 am',
    pinned: true,
  ),
  InboxThread(
    id: 'jamie-invite',
    kind: ThreadKind.invite,
    peerId: 'jamie',
    preview: 'Jamie wants to connect',
    inviteNote:
        'Hi — we’ve not met, but I saw your post in Rest-day appreciators and it really landed. Would love to have a walking buddy in Edinburgh when we visit Glasgow.',
    timeLabel: '2 days ago',
    unread: 1,
  ),
  InboxThread(
    id: 'alex',
    kind: ThreadKind.dm,
    peerId: 'alex',
    preview:
        'Saw you at Fullarton on Saturday — small world. Fancy a coffee after next week?',
    timeLabel: '9:02 am',
    unread: 2,
  ),
  InboxThread(
    id: 'priya',
    kind: ThreadKind.dm,
    peerId: 'priya',
    preview: 'Okay so that check-in from Margaret — do yours ever catch you off guard?',
    timeLabel: 'Yesterday',
    unread: 1,
  ),
  InboxThread(
    id: 'fullarton',
    kind: ThreadKind.group,
    groupId: 'fullarton',
    preview: 'Ken: I’ll be there. Tail-walking or shuffling, one of those.',
    timeLabel: 'Yesterday',
  ),
  InboxThread(
    id: 'couch5k',
    kind: ThreadKind.group,
    groupId: 'couch5k',
    preview: 'Margaret: Week three proper today. No times, just minutes.',
    timeLabel: 'Mon',
  ),
  InboxThread(
    id: 'ken',
    kind: ThreadKind.dm,
    peerId: 'ken',
    preview: 'You: Cheers for the route tip — much nicer than the main road.',
    timeLabel: 'Mon',
  ),
  InboxThread(
    id: 'restdays',
    kind: ThreadKind.group,
    groupId: 'restdays',
    preview: 'Claire: today is a rest day by decree. the decree is mine.',
    timeLabel: '3 days ago',
  ),
];

Member? findMember(String id) {
  if (id == coachMember.id) return coachMember;
  for (final m in kMembers) {
    if (m.id == id) return m;
  }
  return null;
}

SocialGroup? findGroup(String id) {
  for (final g in kGroups) {
    if (g.id == id) return g;
  }
  return null;
}
