// Sealed message model for the Coach chat.
// Each variant corresponds to a widget in the design's `widgets.jsx`.

sealed class ChatMessage {
  const ChatMessage({required this.id});
  final String id;
}

class TimeStampMessage extends ChatMessage {
  const TimeStampMessage({required super.id, required this.label});
  final String label;
}

class SystemNoticeMessage extends ChatMessage {
  const SystemNoticeMessage({required super.id, required this.text});
  final String text;
}

class CoachTextMessage extends ChatMessage {
  const CoachTextMessage({required super.id, required this.text});
  final String text;
}

class UserTextMessage extends ChatMessage {
  const UserTextMessage({required super.id, required this.text});
  final String text;
}

class TypingMessage extends ChatMessage {
  const TypingMessage({required super.id});
}

class ActivityAckMessage extends ChatMessage {
  const ActivityAckMessage({
    required super.id,
    required this.activity,
    required this.duration,
    required this.when,
    this.source = 'Apple Health',
    this.note,
  });
  final String activity;
  final String duration;
  final String when;
  final String source;
  final String? note;
}

enum SuggestionResponse { pending, accepted, later, declined }

class SuggestionCardMessage extends ChatMessage {
  const SuggestionCardMessage({
    required super.id,
    required this.title,
    this.detail,
    this.status = SuggestionResponse.pending,
  });
  final String title;
  final String? detail;
  final SuggestionResponse status;

  SuggestionCardMessage copyWith({SuggestionResponse? status}) =>
      SuggestionCardMessage(
        id: id,
        title: title,
        detail: detail,
        status: status ?? this.status,
      );
}

enum CheckInMood { pending, flat, okay, good, great, writing }

class CheckInCardMessage extends ChatMessage {
  const CheckInCardMessage({
    required super.id,
    required this.question,
    this.status = CheckInMood.pending,
  });
  final String question;
  final CheckInMood status;

  CheckInCardMessage copyWith({CheckInMood? status}) => CheckInCardMessage(
        id: id,
        question: question,
        status: status ?? this.status,
      );
}

class MilestoneMessage extends ChatMessage {
  const MilestoneMessage({
    required super.id,
    required this.figure,
    required this.label,
  });
  final String figure;
  final String label;
}
