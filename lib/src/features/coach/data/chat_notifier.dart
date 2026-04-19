import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../auth/data/auth_state.dart';
import '../../auth/data/clerk_auth_notifier.dart';
import 'chat_message.dart';
import 'coach.dart';

part 'chat_notifier.g.dart';

/// The currently-selected coach. For now: always Margaret. Changing coaches
/// is a future settings flow.
@Riverpod(keepAlive: true)
Coach currentCoach(Ref ref) => defaultCoach;

/// Fake chat state for the Coach screen. Mirrors the sample mid-conversation
/// from the design's `buildInitialMessages()`.
@Riverpod(keepAlive: true)
class Chat extends _$Chat {
  int _seq = 0;
  String _nextId() => 'm${_seq++}';

  @override
  List<ChatMessage> build() {
    final auth = ref.watch(clerkAuthProvider);
    final isFirstRun = auth is AuthLoggedIn && !auth.onboardingComplete;
    _seq = 0;
    return isFirstRun ? _onboardingSeed() : _midConversationSeed();
  }

  List<ChatMessage> _onboardingSeed() => [
        CoachTextMessage(
          id: _nextId(),
          text:
              'Hey. Good to see you. How have you been? — properly, not fitness-wise. Just in general.',
        ),
      ];

  List<ChatMessage> _midConversationSeed() => [
        TimeStampMessage(id: _nextId(), label: 'Yesterday'),
        CoachTextMessage(
          id: _nextId(),
          text:
              'Hey. How’d Sunday end up — restful, or one of those ones that gets away from you?',
        ),
        UserTextMessage(
          id: _nextId(),
          text: 'Bit of both. Took the dog out after lunch though, which was nice.',
        ),
        CoachTextMessage(
          id: _nextId(),
          text: 'Oh that’s lovely. The weather was doing its thing yesterday, wasn’t it.',
        ),
        TimeStampMessage(id: _nextId(), label: 'Today — 7:12 am'),
        ActivityAckMessage(
          id: _nextId(),
          activity: 'Walk',
          duration: '18 min',
          when: 'this morning',
          note: 'Nice one.',
        ),
        UserTextMessage(
          id: _nextId(),
          text: 'Just a loop around the block. Felt alright.',
        ),
        CoachTextMessage(
          id: _nextId(),
          text:
              'Alright is plenty. That’s three mornings this week you’ve gotten out the door — I noticed.',
        ),
        CheckInCardMessage(
          id: _nextId(),
          question: 'How are you feeling this morning?',
        ),
        MilestoneMessage(
          id: _nextId(),
          figure: '30',
          label: 'different days active since you started.',
        ),
        SuggestionCardMessage(
          id: _nextId(),
          title: 'A short stretch after dinner?',
          detail:
              'Five or ten minutes, nothing clever. I’ll show you a couple that aren’t fussy. We can move it to tomorrow if tonight’s busy.',
        ),
      ];

  // ── Mutations ───────────────────────────────────────────────────────

  void send(String text) {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return;
    state = [...state, UserTextMessage(id: _nextId(), text: trimmed)];
    _queueCoachReply(trimmed);
  }

  void _queueCoachReply(String userText) {
    final typingId = _nextId();
    state = [...state, TypingMessage(id: typingId)];
    Future.delayed(const Duration(milliseconds: 900), () {
      final reply = _canned(userText);
      state = [
        for (final m in state)
          if (m.id != typingId) m,
        CoachTextMessage(id: _nextId(), text: reply),
      ];
    });
  }

  void respondToSuggestion(String messageId, SuggestionResponse response) {
    state = [
      for (final m in state)
        if (m.id == messageId && m is SuggestionCardMessage)
          m.copyWith(status: response)
        else
          m,
    ];
  }

  void respondToCheckIn(String messageId, CheckInMood mood) {
    state = [
      for (final m in state)
        if (m.id == messageId && m is CheckInCardMessage)
          m.copyWith(status: mood)
        else
          m,
    ];
  }

  void reset() => ref.invalidateSelf();
}

String _canned(String userText) {
  final t = userText.toLowerCase();
  if (t.contains('walk') || t.contains('run')) {
    return 'Nice. Counts. How did it feel at the end — worse, same, or better than the start?';
  }
  if (t.contains('tired') || t.contains('sore')) {
    return 'Listen to that. A rest day is a proper day. We’ll pick up when you’re up for it.';
  }
  if (t.contains('busy') || t.contains('skip')) {
    return 'Today gets a pass. Nothing to make up. We’ll carry on tomorrow.';
  }
  if (t.contains('yes') || t.contains('sure') || t.contains('ok')) {
    return 'Good. I’ll be here.';
  }
  if (t.contains('no')) {
    return 'No worries — noted, and nothing lost.';
  }
  return 'Thanks for saying so. I’ll hold onto that.';
}
