import 'package:flutter/material.dart';

import '../../../core/theme/theme_constants.dart';
import '../../../core/widgets/notifications_bell.dart';
import '../data/social_models.dart';
import 'member_avatar.dart';

class SocialScreen extends StatefulWidget {
  const SocialScreen({super.key});

  @override
  State<SocialScreen> createState() => _SocialScreenState();
}

class _SocialScreenState extends State<SocialScreen> {
  final _searchController = TextEditingController();
  String _query = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = kInboxThreads.where(_matchesQuery).toList();
    final invites = filtered.where((t) => t.kind == ThreadKind.invite).toList();
    final rest = filtered.where((t) => t.kind != ThreadKind.invite).toList();

    return Scaffold(
      backgroundColor: twPaper,
      appBar: AppBar(
        titleSpacing: gap4,
        title: Text('Social', style: Theme.of(context).textTheme.titleLarge),
        actions: [
          IconButton(
            tooltip: 'New message',
            onPressed: _showStub,
            icon: const Icon(Icons.edit_outlined),
          ),
          const NotificationsBell(),
        ],
      ),
      body: SafeArea(
        top: false,
        bottom: false,
        child: CustomScrollView(
          slivers: [
            const SliverToBoxAdapter(child: _SocialIntro()),
            SliverToBoxAdapter(
              child: _Search(
                controller: _searchController,
                onChanged: (v) => setState(() => _query = v),
              ),
            ),
            if (invites.isNotEmpty) ...[
              const SliverToBoxAdapter(child: _SectionLabel('Invites')),
              SliverList.builder(
                itemCount: invites.length,
                itemBuilder: (context, i) => _InviteRow(thread: invites[i], onOpen: _showStub),
              ),
            ],
            SliverList.separated(
              itemCount: rest.length,
              itemBuilder: (context, i) => _ThreadRow(thread: rest[i], onOpen: _showStub),
              separatorBuilder: (_, _) => const Divider(indent: gap5 + avatarRow, height: 0.5),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: gap5)),
          ],
        ),
      ),
    );
  }

  bool _matchesQuery(InboxThread t) {
    if (_query.isEmpty) return true;
    final q = _query.toLowerCase();
    final hay = StringBuffer()..write(t.preview.toLowerCase());
    if (t.peerId != null) hay.write(' ${findMember(t.peerId!)?.name.toLowerCase() ?? ''}');
    if (t.groupId != null) hay.write(' ${findGroup(t.groupId!)?.name.toLowerCase() ?? ''}');
    return hay.toString().contains(q);
  }

  void _showStub() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Threads come next — this is the inbox shell.'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────

class _SocialIntro extends StatelessWidget {
  const _SocialIntro();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(gap4, gap2, gap4, gap2),
      child: Text(
        'Your coach, plus people you’ve connected with.',
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: twMuted),
      ),
    );
  }
}

class _Search extends StatelessWidget {
  const _Search({required this.controller, required this.onChanged});
  final TextEditingController controller;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(gap4, 0, gap4, gap3),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: gap3),
        decoration: BoxDecoration(
          color: twCream,
          borderRadius: BorderRadius.circular(radiusPill),
        ),
        child: Row(
          children: [
            Icon(Icons.search, size: 16, color: twMuted2),
            const SizedBox(width: gap1),
            Expanded(
              child: TextField(
                controller: controller,
                onChanged: onChanged,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: twInk),
                decoration: InputDecoration(
                  isCollapsed: true,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(vertical: gap2),
                  hintText: 'Search people, groups, messages',
                  hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(color: twMuted),
                  filled: false,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.text);
  final String text;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(gap4, gap3, gap4, gap1),
      child: Text(
        text.toUpperCase(),
        style: Theme.of(context).textTheme.labelSmall?.copyWith(color: twMuted),
      ),
    );
  }
}

class _InviteRow extends StatelessWidget {
  const _InviteRow({required this.thread, required this.onOpen});
  final InboxThread thread;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final m = findMember(thread.peerId!);
    if (m == null) return const SizedBox.shrink();
    final theme = Theme.of(context);
    return InkWell(
      onTap: onOpen,
      child: Container(
        margin: const EdgeInsets.fromLTRB(gap4, 0, gap4, gap2),
        padding: const EdgeInsets.fromLTRB(gap3, gap3, gap3, gap3),
        decoration: BoxDecoration(
          color: twAccentTint,
          borderRadius: BorderRadius.circular(radiusMd),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            MemberAvatar(member: m, size: avatarRow),
            const SizedBox(width: gap3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(m.name, style: theme.textTheme.titleMedium),
                      const SizedBox(width: gap2),
                      Text('INVITE', style: theme.textTheme.labelSmall?.copyWith(color: twAccent)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  if (thread.inviteNote != null)
                    Text(
                      thread.inviteNote!,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodySmall?.copyWith(color: twInk2, height: 1.45),
                    ),
                  const SizedBox(height: gap2),
                  Row(
                    children: [
                      _InviteAction(label: 'Accept', primary: true, onPressed: onOpen),
                      const SizedBox(width: gap1),
                      _InviteAction(label: 'Decline', onPressed: onOpen),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InviteAction extends StatelessWidget {
  const _InviteAction({required this.label, required this.onPressed, this.primary = false});
  final String label;
  final VoidCallback onPressed;
  final bool primary;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        backgroundColor: primary ? twAccent : twPaper,
        foregroundColor: primary ? twPaper : twInk,
        side: BorderSide(color: primary ? Colors.transparent : twHairline),
        padding: const EdgeInsets.symmetric(horizontal: gap3, vertical: gap1),
        minimumSize: const Size(0, 32),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(radiusSm)),
        textStyle: Theme.of(context).textTheme.labelMedium?.copyWith(fontWeight: FontWeight.w600),
      ),
      child: Text(label),
    );
  }
}

class _ThreadRow extends StatelessWidget {
  const _ThreadRow({required this.thread, required this.onOpen});
  final InboxThread thread;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final (leading, title, subtitle) = _resolveLeading(thread);
    if (leading == null || title == null) return const SizedBox.shrink();
    return InkWell(
      onTap: onOpen,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(gap4, gap3, gap4, gap3),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                leading,
                if (thread.pinned)
                  Positioned(
                    left: -2,
                    top: -2,
                    child: Container(
                      width: 16,
                      height: 16,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: twPaper,
                        border: Border.all(color: twHairline),
                      ),
                      alignment: Alignment.center,
                      child: const Text('◆', style: TextStyle(fontSize: 9, color: twAccent)),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: gap3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: theme.textTheme.titleMedium?.copyWith(fontSize: 17),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: gap2),
                      Text(thread.timeLabel, style: theme.textTheme.bodySmall?.copyWith(color: twMuted)),
                    ],
                  ),
                  if (subtitle != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        subtitle,
                        style: theme.textTheme.bodySmall?.copyWith(color: twMuted),
                      ),
                    ),
                  const SizedBox(height: 4),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          thread.preview,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: thread.unread > 0 ? twInk : twInk2,
                            height: 1.4,
                            fontWeight: thread.unread > 0 ? FontWeight.w500 : FontWeight.w400,
                          ),
                        ),
                      ),
                      if (thread.unread > 0) ...[
                        const SizedBox(width: gap2),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                          decoration: BoxDecoration(
                            color: twAccent,
                            borderRadius: BorderRadius.circular(radiusPill),
                          ),
                          child: Text(
                            '${thread.unread}',
                            style: theme.textTheme.labelSmall?.copyWith(
                              color: twPaper,
                              letterSpacing: 0,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  (Widget?, String?, String?) _resolveLeading(InboxThread t) {
    switch (t.kind) {
      case ThreadKind.coach:
        final m = findMember(t.peerId!);
        if (m == null) return (null, null, null);
        return (MemberAvatar(member: m, size: avatarRow, coachBadge: true), m.name, 'Your coach');
      case ThreadKind.dm:
        final m = findMember(t.peerId!);
        if (m == null) return (null, null, null);
        return (MemberAvatar(member: m, size: avatarRow), m.name, null);
      case ThreadKind.group:
        final g = findGroup(t.groupId!);
        if (g == null) return (null, null, null);
        return (GroupAvatarWidget(group: g, size: avatarRow), g.name, g.topic);
      case ThreadKind.invite:
        return (null, null, null); // invites rendered separately
    }
  }
}
