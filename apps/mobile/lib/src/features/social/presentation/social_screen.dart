import 'package:flutter/material.dart';

import '../../../core/branding/twikka_avatars.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/twikka_icons.dart';
import '../../../core/widgets/notifications_bell.dart';
import '../data/social_models.dart';

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
      backgroundColor: Theme.of(context).colorScheme.surfaceContainerLowest,
      appBar: AppBar(
        title: const Text('Social'),
        actions: [
          IconButton(
            tooltip: 'New message',
            onPressed: _showStub,
            icon: const Icon(TwikkaIcons.edit),
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
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant),
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
          color: Theme.of(context).colorScheme.surfaceContainer,
          borderRadius: BorderRadius.circular(radiusPill),
        ),
        child: Row(
          children: [
            Icon(TwikkaIcons.search, size: 16, color: context.tw.muted2),
            const SizedBox(width: gap1),
            Expanded(
              child: TextField(
                controller: controller,
                onChanged: onChanged,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Theme.of(context).colorScheme.onSurface),
                decoration: InputDecoration(
                  isCollapsed: true,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(vertical: gap2),
                  hintText: 'Search people, groups, messages',
                  hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant),
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
        style: Theme.of(context).textTheme.labelSmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant),
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
    return InkWell(
      onTap: onOpen,
      child: Container(
        margin: const EdgeInsets.fromLTRB(gap4, 0, gap4, gap2),
        padding: const EdgeInsets.fromLTRB(gap3, gap3, gap3, gap3),
        decoration: BoxDecoration(
          color: context.tw.accentTint,
          borderRadius: BorderRadius.circular(radiusMd),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            PersonAvatar(id: m.id, name: m.name, size: avatarRow),
            const SizedBox(width: gap3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(m.name, style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(width: gap2),
                      Text('INVITE', style: Theme.of(context).textTheme.labelSmall?.copyWith(color: Theme.of(context).colorScheme.primary)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  if (thread.inviteNote != null)
                    Text(
                      thread.inviteNote!,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(color: context.tw.ink2, height: 1.45),
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
        backgroundColor: primary ? Theme.of(context).colorScheme.primary : Theme.of(context).colorScheme.surfaceContainerLowest,
        foregroundColor: primary ? Theme.of(context).colorScheme.surfaceContainerLowest : Theme.of(context).colorScheme.onSurface,
        side: BorderSide(color: primary ? Colors.transparent : Theme.of(context).colorScheme.outline),
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
                    right: -2,
                    top: -2,
                    child: Container(
                      width: 16,
                      height: 16,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Theme.of(context).colorScheme.surfaceContainerLowest,
                        border: Border.all(color: Theme.of(context).colorScheme.outline),
                      ),
                      alignment: Alignment.center,
                      child: Icon(
                        TwikkaIcons.pinFilled,
                        size: 9,
                        color: Theme.of(context).colorScheme.primary,
                      ),
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
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 17),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: gap2),
                      Text(thread.timeLabel, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
                    ],
                  ),
                  if (subtitle != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        subtitle,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant),
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
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: thread.unread > 0 ? Theme.of(context).colorScheme.onSurface : context.tw.ink2,
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
                            color: Theme.of(context).colorScheme.primary,
                            borderRadius: BorderRadius.circular(radiusPill),
                          ),
                          child: Text(
                            '${thread.unread}',
                            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                              color: Theme.of(context).colorScheme.surfaceContainerLowest,
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
        return (
          CoachAvatar(name: m.name, photoUrl: m.photoUrl, size: avatarRow),
          m.name,
          'Your coach',
        );
      case ThreadKind.dm:
        final m = findMember(t.peerId!);
        if (m == null) return (null, null, null);
        if (m.isCoach) {
          return (
            CoachAvatar(name: m.name, photoUrl: m.photoUrl, size: avatarRow),
            m.name,
            null,
          );
        }
        return (
          PersonAvatar(id: m.id, name: m.name, photoUrl: m.photoUrl, size: avatarRow),
          m.name,
          null,
        );
      case ThreadKind.group:
        final g = findGroup(t.groupId!);
        if (g == null) return (null, null, null);
        return (
          GroupAvatar(id: g.id, photoUrl: g.photoUrl, size: avatarRow),
          g.name,
          g.topic,
        );
      case ThreadKind.invite:
        return (null, null, null); // invites rendered separately
    }
  }
}
