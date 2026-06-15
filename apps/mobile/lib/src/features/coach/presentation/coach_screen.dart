import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/avatar_preview.dart';
import '../../../core/widgets/notifications_bell.dart';
import '../data/chat_message.dart';
import '../data/chat_notifier.dart';
import '../data/coach.dart';
import 'chat_widgets.dart';
import '../../../core/branding/twikka_avatars.dart';

class CoachScreen extends ConsumerStatefulWidget {
  const CoachScreen({super.key});

  @override
  ConsumerState<CoachScreen> createState() => _CoachScreenState();
}

class _CoachScreenState extends ConsumerState<CoachScreen> {
  final _composerController = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void dispose() {
    _composerController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _send() {
    final text = _composerController.text;
    if (text.trim().isEmpty) return;
    ref.read(chatProvider.notifier).send(text);
    _composerController.clear();
    _scrollToBottomSoon();
  }

  void _scrollToBottomSoon() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scrollController.hasClients) return;
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 280),
        curve: Curves.easeOut,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<List<ChatMessage>>(chatProvider, (_, _) => _scrollToBottomSoon());

    final coach = ref.watch(currentCoachProvider);
    final messages = ref.watch(chatProvider);

    return Scaffold(
      appBar: _CoachHeader(coach: coach),
      body: Column(
        children: [
          Expanded(
            child: ListView.separated(
              controller: _scrollController,
              padding: const EdgeInsets.fromLTRB(gap3, gap3, gap3, gap4),
              itemCount: messages.length,
              separatorBuilder: (_, _) => const SizedBox(height: gap3),
              itemBuilder: (context, i) {
                final m = messages[i];
                return switch (m) {
                  TimeStampMessage() => TimeStampWidget(m.label),
                  SystemNoticeMessage() => SystemNoticeWidget(m.text),
                  CoachTextMessage() => CoachBubbleRow(coach: coach, text: m.text),
                  UserTextMessage() => UserBubble(text: m.text),
                  TypingMessage() => TypingIndicatorWidget(coach: coach),
                  ActivityAckMessage() => ActivityAckCardWidget(coach: coach, message: m),
                  SuggestionCardMessage() => SuggestionCardWidget(
                      coach: coach,
                      message: m,
                      onRespond: (r) => ref
                          .read(chatProvider.notifier)
                          .respondToSuggestion(m.id, r),
                    ),
                  CheckInCardMessage() => CheckInCardWidget(
                      coach: coach,
                      message: m,
                      onRespond: (r) =>
                          ref.read(chatProvider.notifier).respondToCheckIn(m.id, r),
                    ),
                  MilestoneMessage() => MilestoneCardWidget(coach: coach, message: m),
                };
              },
            ),
          ),
          ChatComposer(controller: _composerController, onSend: _send),
        ],
      ),
    );
  }
}

class _CoachHeader extends StatelessWidget implements PreferredSizeWidget {
  const _CoachHeader({required this.coach});
  final Coach coach;

  @override
  Size get preferredSize => const Size.fromHeight(72);

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return SafeArea(
      bottom: false,
      child: Container(
        padding: const EdgeInsets.fromLTRB(gap3, gap2, gap3, gap2),
        decoration: BoxDecoration(
          color: scheme.surface,
          border: Border(
            bottom: BorderSide(
              color: Theme.of(context).colorScheme.outline,
              width: 0.5,
            ),
          ),
        ),
        child: Row(
          children: [
            _AvatarTapTarget(
              size: avatarHeader,
              photoUrl: coach.photoUrl,
              cacheKey: coach.cacheKey,
              name: coach.name,
              child: CoachAvatar(
                name: coach.name,
                photoUrl: coach.photoUrl,
                cacheKey: coach.cacheKey,
                size: avatarHeader,
              ),
            ),
            const SizedBox(width: gap3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(coach.name, style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 2),
                  // AI disclosure surface (one of three). Matches welcome
                  // subtitle + coach-selection line. Per
                  // docs/memory/reference_coach_character_system.md.
                  Text(
                    'AI coach \u00b7 usually replies in the morning',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant),
                  ),
                ],
              ),
            ),
            const NotificationsBell(),
          ],
        ),
      ),
    );
  }
}

/// Wraps a circular avatar in a circular ink-well that opens the
/// preview overlay when tapped. No-op if there's no image to preview,
/// so the monogram fallback stays a static badge.
class _AvatarTapTarget extends StatelessWidget {
  const _AvatarTapTarget({
    required this.size,
    required this.photoUrl,
    required this.cacheKey,
    required this.name,
    required this.child,
  });

  final double size;
  final String? photoUrl;
  final String? cacheKey;
  final String name;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final url = photoUrl;
    if (url == null) return child;
    return SizedBox.square(
      dimension: size,
      child: Material(
        type: MaterialType.transparency,
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: () => showAvatarPreview(
            context,
            imageUrl: url,
            cacheKey: cacheKey,
            name: name,
          ),
          child: child,
        ),
      ),
    );
  }
}
