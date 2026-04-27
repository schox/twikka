import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/theme/twikka_icons.dart';
import '../data/chat_message.dart';
import '../data/coach.dart';
import 'coach_avatar.dart';

// ─────────────────────────────────────────────────────────────────────
// Primitives — Kicker, CardTitle, CardButton, Surfaces, helpers
// ─────────────────────────────────────────────────────────────────────

class Kicker extends StatelessWidget {
  const Kicker(this.text, {super.key});
  final String text;
  @override
  Widget build(BuildContext context) {
    return Text(
      text.toUpperCase(),
      style: Theme.of(context).textTheme.labelSmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
            letterSpacing: 1.2,
          ),
    );
  }
}

class CardTitle extends StatelessWidget {
  const CardTitle(this.text, {super.key, this.size = 22});
  final String text;
  final double size;
  @override
  Widget build(BuildContext context) {
    final base = Theme.of(context).textTheme.titleLarge;
    return Text(
      text,
      style: base?.copyWith(
        fontSize: size,
        fontWeight: FontWeight.w400,
        height: 1.2,
        letterSpacing: -0.01 * size,
      ),
    );
  }
}

enum CardButtonKind { primary, ghost, quiet }

class CardButton extends StatelessWidget {
  const CardButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.kind = CardButtonKind.ghost,
    this.full = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final CardButtonKind kind;
  final bool full;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final (bg, fg, side) = switch (kind) {
      CardButtonKind.primary => (scheme.primary, Theme.of(context).colorScheme.surfaceContainerLowest, BorderSide.none),
      CardButtonKind.ghost => (Theme.of(context).colorScheme.surfaceContainerLowest, Theme.of(context).colorScheme.onSurface, BorderSide(color: Theme.of(context).colorScheme.outline)),
      CardButtonKind.quiet => (Colors.transparent, Theme.of(context).colorScheme.onSurfaceVariant, BorderSide.none),
    };

    final btn = SizedBox(
      height: 44,
      child: TextButton(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          backgroundColor: bg,
          foregroundColor: fg,
          padding: const EdgeInsets.symmetric(horizontal: gap4),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusSm + 2),
            side: side,
          ),
          textStyle: Theme.of(context).textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w500),
        ),
        child: Text(label),
      ),
    );
    return full ? Expanded(child: btn) : btn;
  }
}

// ─────────────────────────────────────────────────────────────────────
// TimeStamp + SystemNotice + Typing
// ─────────────────────────────────────────────────────────────────────

class TimeStampWidget extends StatelessWidget {
  const TimeStampWidget(this.label, {super.key});
  final String label;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: gap2),
      child: Center(
        child: Text(
          label.toUpperCase(),
          style: Theme.of(context).textTheme.labelSmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant),
        ),
      ),
    );
  }
}

class SystemNoticeWidget extends StatelessWidget {
  const SystemNoticeWidget(this.text, {super.key});
  final String text;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: gap2, horizontal: gap5),
      child: Center(
        child: Text(
          text,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant, height: 1.5),
        ),
      ),
    );
  }
}

class TypingIndicatorWidget extends StatefulWidget {
  const TypingIndicatorWidget({super.key, required this.coach});
  final Coach coach;

  @override
  State<TypingIndicatorWidget> createState() => _TypingIndicatorWidgetState();
}

class _TypingIndicatorWidgetState extends State<TypingIndicatorWidget>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))
      ..repeat();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        CoachAvatar(coach: widget.coach, size: avatarChatTrail),
        const SizedBox(width: gap2),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: gap3, vertical: gap2),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surfaceContainer,
            borderRadius: BorderRadius.circular(radiusBubble).copyWith(
              bottomLeft: const Radius.circular(radiusBubbleTail),
            ),
          ),
          child: AnimatedBuilder(
            animation: _ctrl,
            builder: (_, _) => Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _dot(0),
                const SizedBox(width: 4),
                _dot(0.15),
                const SizedBox(width: 4),
                _dot(0.3),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _dot(double phase) {
    final t = ((_ctrl.value - phase) % 1.0 + 1.0) % 1.0;
    final opacity = 0.35 + 0.65 * (1 - (t - 0.5).abs() * 2).clamp(0.0, 1.0);
    return Container(
      width: 6,
      height: 6,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.onSurfaceVariant.withValues(alpha: opacity),
        shape: BoxShape.circle,
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────
// Bubbles — coach (cream, left tail) and user (terracotta tint, right tail)
// ─────────────────────────────────────────────────────────────────────

class CoachBubbleRow extends StatelessWidget {
  const CoachBubbleRow({super.key, required this.coach, required this.text, this.showAvatar = true});
  final Coach coach;
  final String text;
  final bool showAvatar;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        SizedBox(
          width: avatarChatTrail,
          child: showAvatar ? CoachAvatar(coach: coach, size: avatarChatTrail) : null,
        ),
        const SizedBox(width: gap2),
        Flexible(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.78),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: gap4, vertical: gap3),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceContainer,
                borderRadius: BorderRadius.circular(radiusBubble).copyWith(
                  bottomLeft: const Radius.circular(radiusBubbleTail),
                ),
              ),
              child: Text(
                text,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Theme.of(context).colorScheme.onSurface),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class UserBubble extends StatelessWidget {
  const UserBubble({super.key, required this.text});
  final String text;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerRight,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.78),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: gap4, vertical: gap3),
          decoration: BoxDecoration(
            color: context.tw.accentTint,
            borderRadius: BorderRadius.circular(radiusBubble).copyWith(
              bottomRight: const Radius.circular(radiusBubbleTail),
            ),
          ),
          child: Text(
            text,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Theme.of(context).colorScheme.onSurface),
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────
// CoachCard — shared wrapper for all offer-style cards
// ─────────────────────────────────────────────────────────────────────

class CoachCard extends StatelessWidget {
  const CoachCard({
    super.key,
    required this.coach,
    required this.child,
    this.tone = CoachCardTone.paper,
  });

  final Coach coach;
  final Widget child;
  final CoachCardTone tone;

  @override
  Widget build(BuildContext context) {
    final bg = tone == CoachCardTone.cream ? Theme.of(context).colorScheme.surfaceContainer : Theme.of(context).colorScheme.surfaceContainerLowest;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        CoachAvatar(coach: coach, size: avatarChatTrail),
        const SizedBox(width: gap2),
        Flexible(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.86),
            child: Container(
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(radiusCard).copyWith(
                  bottomLeft: const Radius.circular(radiusCardTail),
                ),
                border: Border.all(color: Theme.of(context).colorScheme.outline),
              ),
              padding: const EdgeInsets.fromLTRB(gap4, gap4, gap4, gap3),
              child: child,
            ),
          ),
        ),
      ],
    );
  }
}

enum CoachCardTone { paper, cream }

class ResponseFooter extends StatelessWidget {
  const ResponseFooter(this.label, {super.key});
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: gap1),
      padding: const EdgeInsets.only(top: gap2),
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(color: Theme.of(context).colorScheme.outline),
        ),
      ),
      child: Row(
        children: [
          Icon(TwikkaIcons.check, size: 14, color: Theme.of(context).colorScheme.onSurfaceVariant),
          const SizedBox(width: gap1),
          Expanded(
            child: Text(label, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────
// Activity acknowledgement — short cream bubble with "From Apple Health"
// ─────────────────────────────────────────────────────────────────────

class ActivityAckCardWidget extends StatelessWidget {
  const ActivityAckCardWidget({super.key, required this.coach, required this.message});
  final Coach coach;
  final ActivityAckMessage message;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        CoachAvatar(coach: coach, size: avatarChatTrail),
        const SizedBox(width: gap2),
        Flexible(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.82),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: gap3, vertical: gap3),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceContainer,
                borderRadius: BorderRadius.circular(radiusBubble).copyWith(
                  bottomLeft: const Radius.circular(radiusBubbleTail),
                ),
                border: Border.all(color: Theme.of(context).colorScheme.outline),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(TwikkaIcons.circleOutline, size: 12, color: Theme.of(context).colorScheme.onSurfaceVariant),
                      const SizedBox(width: 6),
                      Text('FROM ${message.source.toUpperCase()}',
                          style: Theme.of(context).textTheme.labelSmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text.rich(
                    TextSpan(
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Theme.of(context).colorScheme.onSurface),
                      children: [
                        const TextSpan(text: 'Saw you got out for a '),
                        TextSpan(
                          text: message.activity.toLowerCase(),
                          style: const TextStyle(fontWeight: FontWeight.w500),
                        ),
                        TextSpan(text: ' ${message.when}, '),
                        TextSpan(
                          text: message.duration,
                          style: const TextStyle(fontWeight: FontWeight.w500),
                        ),
                        TextSpan(text: '. ${message.note ?? 'Nice.'}'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────
// SuggestionCard — three actions, switches to ResponseFooter on respond
// ─────────────────────────────────────────────────────────────────────

class SuggestionCardWidget extends StatelessWidget {
  const SuggestionCardWidget({
    super.key,
    required this.coach,
    required this.message,
    required this.onRespond,
  });

  final Coach coach;
  final SuggestionCardMessage message;
  final ValueChanged<SuggestionResponse> onRespond;

  @override
  Widget build(BuildContext context) {
    final pending = message.status == SuggestionResponse.pending;
    return CoachCard(
      coach: coach,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Kicker('A gentle suggestion'),
          const SizedBox(height: gap1),
          CardTitle(message.title),
          if (message.detail != null) ...[
            const SizedBox(height: gap1),
            Text(
              message.detail!,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: context.tw.ink2, height: 1.5),
            ),
          ],
          const SizedBox(height: gap3),
          if (pending)
            Row(
              children: [
                CardButton(
                  full: true,
                  kind: CardButtonKind.primary,
                  label: 'Sounds good',
                  onPressed: () => onRespond(SuggestionResponse.accepted),
                ),
                const SizedBox(width: gap1),
                CardButton(
                  full: true,
                  label: 'Maybe later',
                  onPressed: () => onRespond(SuggestionResponse.later),
                ),
                const SizedBox(width: gap1),
                CardButton(
                  full: true,
                  label: 'Not today',
                  onPressed: () => onRespond(SuggestionResponse.declined),
                ),
              ],
            )
          else
            ResponseFooter(switch (message.status) {
              SuggestionResponse.accepted => 'You said: sounds good',
              SuggestionResponse.later => 'You said: maybe later',
              SuggestionResponse.declined => 'You said: not today',
              SuggestionResponse.pending => '',
            }),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────
// CheckInCard — mood pills + "write something" escape hatch
// ─────────────────────────────────────────────────────────────────────

class CheckInCardWidget extends StatelessWidget {
  const CheckInCardWidget({
    super.key,
    required this.coach,
    required this.message,
    required this.onRespond,
  });

  final Coach coach;
  final CheckInCardMessage message;
  final ValueChanged<CheckInMood> onRespond;

  static const _moods = [
    (CheckInMood.flat, 'Flat'),
    (CheckInMood.okay, 'Okay'),
    (CheckInMood.good, 'Good'),
    (CheckInMood.great, 'Great'),
  ];

  @override
  Widget build(BuildContext context) {
    final pending = message.status == CheckInMood.pending;
    return CoachCard(
      coach: coach,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Kicker('Quick check-in'),
          const SizedBox(height: gap1),
          CardTitle(message.question),
          const SizedBox(height: gap1),
          Text(
            'Or tell me in your own words — whichever’s easier.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant),
          ),
          const SizedBox(height: gap3),
          if (pending)
            Wrap(
              spacing: gap1,
              runSpacing: gap1,
              children: [
                for (final (mood, label) in _moods)
                  _MoodPill(label: label, onTap: () => onRespond(mood)),
                _MoodPill(
                  label: 'Write something…',
                  dashed: true,
                  onTap: () => onRespond(CheckInMood.writing),
                ),
              ],
            )
          else
            ResponseFooter(switch (message.status) {
              CheckInMood.flat => 'You said: flat',
              CheckInMood.okay => 'You said: okay',
              CheckInMood.good => 'You said: good',
              CheckInMood.great => 'You said: great',
              CheckInMood.writing => 'You’re writing a reply',
              CheckInMood.pending => '',
            }),
        ],
      ),
    );
  }
}

class _MoodPill extends StatelessWidget {
  const _MoodPill({required this.label, required this.onTap, this.dashed = false});
  final String label;
  final VoidCallback onTap;
  final bool dashed;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(radiusPill),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: gap3, vertical: gap1 + 3),
        decoration: BoxDecoration(
          color: dashed ? Colors.transparent : Theme.of(context).colorScheme.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(radiusPill),
          border: Border.all(
            color: Theme.of(context).colorScheme.outline,
            // Dashed border isn't supported natively; close enough with hairline + opacity.
          ),
        ),
        child: Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontWeight: dashed ? FontWeight.w400 : FontWeight.w500,
                color: dashed ? Theme.of(context).colorScheme.onSurfaceVariant : Theme.of(context).colorScheme.onSurface,
              ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────
// MilestoneCard — quiet number, watermark circle
// ─────────────────────────────────────────────────────────────────────

class MilestoneCardWidget extends StatelessWidget {
  const MilestoneCardWidget({super.key, required this.coach, required this.message});
  final Coach coach;
  final MilestoneMessage message;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        CoachAvatar(coach: coach, size: avatarChatTrail),
        const SizedBox(width: gap2),
        Flexible(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.86),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(radiusCard).copyWith(
                bottomLeft: const Radius.circular(radiusCardTail),
              ),
              child: Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surfaceContainerLowest,
                  border: Border.all(color: Theme.of(context).colorScheme.outline),
                  borderRadius: BorderRadius.circular(radiusCard).copyWith(
                    bottomLeft: const Radius.circular(radiusCardTail),
                  ),
                ),
                padding: const EdgeInsets.all(gap4),
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Positioned(
                      right: -30,
                      top: -30,
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: context.tw.accentTint.withValues(alpha: 0.6),
                        ),
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Kicker('A small thing worth noticing'),
                        const SizedBox(height: gap2),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              message.figure,
                              style: Theme.of(context).textTheme.displayMedium?.copyWith(
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.w400,
                                height: 1,
                                fontSize: 44,
                              ),
                            ),
                            const SizedBox(width: gap2),
                            Expanded(
                              child: Padding(
                                padding: const EdgeInsets.only(top: 8),
                                child: Text(
                                  message.label,
                                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Theme.of(context).colorScheme.onSurface),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: gap2),
                        Text(
                          'Not a trophy, just a figure. Thought you’d want to know.',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────
// Composer — cream pill with terracotta send button
// ─────────────────────────────────────────────────────────────────────

class ChatComposer extends StatelessWidget {
  const ChatComposer({
    super.key,
    required this.controller,
    required this.onSend,
    this.placeholder = 'Write to your coach…',
  });

  final TextEditingController controller;
  final VoidCallback onSend;
  final String placeholder;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      decoration: BoxDecoration(
        color: scheme.surface,
        border: Border(top: BorderSide(color: Theme.of(context).colorScheme.outline)),
      ),
      padding: const EdgeInsets.fromLTRB(gap3, gap2, gap3, gap2),
      child: SafeArea(
        top: false,
        child: ValueListenableBuilder<TextEditingValue>(
          valueListenable: controller,
          builder: (context, value, _) {
            final hasText = value.text.trim().isNotEmpty;
            return Container(
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceContainerLowest,
                border: Border.all(color: Theme.of(context).colorScheme.outline),
                borderRadius: BorderRadius.circular(radiusXl),
              ),
              padding: const EdgeInsets.fromLTRB(gap4, 6, 6, 6),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: TextField(
                      controller: controller,
                      minLines: 1,
                      maxLines: 5,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Theme.of(context).colorScheme.onSurface),
                      decoration: InputDecoration.collapsed(
                        hintText: placeholder,
                        hintStyle: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant),
                      ),
                    ),
                  ),
                  const SizedBox(width: gap1),
                  GestureDetector(
                    onTap: hasText ? onSend : null,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: hasText ? Theme.of(context).colorScheme.primary : Theme.of(context).colorScheme.outline,
                      ),
                      child: Icon(
                        TwikkaIcons.send,
                        size: 18,
                        color: hasText ? Theme.of(context).colorScheme.surfaceContainerLowest : Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
