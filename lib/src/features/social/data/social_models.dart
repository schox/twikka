import 'package:flutter/painting.dart';

import '../../../core/branding/avatar_palette.dart';

class Member {
  const Member({
    required this.id,
    required this.name,
    required this.handle,
    required this.palette,
    required this.monogram,
    required this.context,
    required this.location,
    this.bio = '',
    this.isCoach = false,
  });

  final String id;
  final String name;
  final String handle;
  final AvatarPalette palette;
  final String monogram;
  final String context; // "Met through Fullarton parkrun"
  final String location;
  final String bio;
  final bool isCoach;
}

class GroupAvatarStyle {
  const GroupAvatarStyle({required this.ring, required this.ink, required this.glyph});
  final Color ring;
  final Color ink;
  final String glyph;
}

class SocialGroup {
  const SocialGroup({
    required this.id,
    required this.name,
    required this.topic,
    required this.memberCount,
    required this.avatar,
  });
  final String id;
  final String name;
  final String topic;
  final int memberCount;
  final GroupAvatarStyle avatar;
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
  monogram: 'M',
  context: 'Your coach',
  location: '',
  isCoach: true,
  palette: AvatarPalette(
    a: Color(0xFFD89C80),
    b: Color(0xFF8FA48C),
    c: Color(0xFFE9CDBE),
    ink: Color(0xFF5B3B2E),
  ),
);

const List<Member> kMembers = [
  Member(
    id: 'alex',
    name: 'Alex Moreton',
    handle: 'alex_m',
    monogram: 'A',
    context: 'Met through Fullarton parkrun',
    location: 'Glasgow · Southside',
    bio: 'Parkrun regular. Mostly tail-walker these days, which suits me.',
    palette: AvatarPalette(
      a: Color(0xFFB89072),
      b: Color(0xFF6B8E8E),
      c: Color(0xFFE6D3C0),
      ink: Color(0xFF4A3826),
    ),
  ),
  Member(
    id: 'priya',
    name: 'Priya Shah',
    handle: 'priya_s',
    monogram: 'P',
    context: 'Introduced by Margaret',
    location: 'Glasgow · West End',
    bio: 'Walking my way back after a rough year. Good company welcome.',
    palette: AvatarPalette(
      a: Color(0xFFC88A8A),
      b: Color(0xFF9E8DB3),
      c: Color(0xFFEED3D3),
      ink: Color(0xFF5A3838),
    ),
  ),
  Member(
    id: 'ken',
    name: 'Ken Brown',
    handle: 'kenny_b',
    monogram: 'K',
    context: 'Met through Fullarton parkrun',
    location: 'Paisley',
    bio: 'Retired, 71. Started the Couch to 5k last year. Still on couch-week-3.',
    palette: AvatarPalette(
      a: Color(0xFFA6A78F),
      b: Color(0xFFC7B78F),
      c: Color(0xFFDDDCC3),
      ink: Color(0xFF46452E),
    ),
  ),
  Member(
    id: 'maya',
    name: 'Maya Okafor',
    handle: 'maya_o',
    monogram: 'M',
    context: 'Met in Couch to 5k',
    location: 'Glasgow · East End',
    bio: 'Running a first half marathon in April. Accepting all the nerves.',
    palette: AvatarPalette(
      a: Color(0xFF8FA9B5),
      b: Color(0xFFC9B18A),
      c: Color(0xFFD6E1E5),
      ink: Color(0xFF2F4A55),
    ),
  ),
  Member(
    id: 'jamie',
    name: 'Jamie Tait',
    handle: 'jamie_t',
    monogram: 'J',
    context: 'Sent you an invite',
    location: 'Edinburgh',
    bio: 'Dog-walking counts, right? (It counts.)',
    palette: AvatarPalette(
      a: Color(0xFFD89C80),
      b: Color(0xFF8FA48C),
      c: Color(0xFFE9CDBE),
      ink: Color(0xFF5B3B2E),
    ),
  ),
];

const List<SocialGroup> kGroups = [
  SocialGroup(
    id: 'fullarton',
    name: 'Fullarton parkrun crew',
    topic: 'Saturday 9:30 · Fullarton Park',
    memberCount: 11,
    avatar: GroupAvatarStyle(
      ring: Color(0xFFC97B5E),
      ink: Color(0xFF5B3B2E),
      glyph: 'F',
    ),
  ),
  SocialGroup(
    id: 'couch5k',
    name: 'Couch-to-5k — March cohort',
    topic: 'Coached by Margaret',
    memberCount: 8,
    avatar: GroupAvatarStyle(
      ring: Color(0xFFB89072),
      ink: Color(0xFF4A3826),
      glyph: 'C',
    ),
  ),
  SocialGroup(
    id: 'restdays',
    name: 'Rest-day appreciators',
    topic: 'Anyone can join',
    memberCount: 214,
    avatar: GroupAvatarStyle(
      ring: Color(0xFF6F8E8E),
      ink: Color(0xFF2F4A55),
      glyph: '~',
    ),
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
