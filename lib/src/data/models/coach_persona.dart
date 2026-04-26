enum CoachAgeBand { thirties, fortyFives, sixties, seventies }

enum CoachGender { female, male }

CoachAgeBand _ageBandFromString(String s) {
  switch (s) {
    case '30s':
      return CoachAgeBand.thirties;
    case '45s':
      return CoachAgeBand.fortyFives;
    case '60s':
      return CoachAgeBand.sixties;
    case '70s':
      return CoachAgeBand.seventies;
  }
  throw ArgumentError('Unknown coach ageBand: $s');
}

CoachGender _genderFromString(String s) {
  switch (s) {
    case 'female':
      return CoachGender.female;
    case 'male':
      return CoachGender.male;
  }
  throw ArgumentError('Unknown coach genderPresentation: $s');
}

class CoachPersona {
  const CoachPersona({
    required this.id,
    required this.slug,
    required this.name,
    required this.ageBand,
    required this.genderPresentation,
    required this.shortDescriptor,
    required this.introSample,
    this.avatarRefs,
    required this.styleDescriptors,
    required this.sampleLines,
    required this.wouldSayExamples,
    required this.wouldntSayExamples,
    required this.aiDisclosureLine,
    required this.affiliateSuggestionLine,
    required this.active,
    required this.promptVersion,
    this.heyGenAvatarId,
    this.voiceId,
    this.disclosureLine,
    this.modelOverride,
  });

  final String id;
  final String slug;
  final String name;
  final CoachAgeBand ageBand;
  final CoachGender genderPresentation;
  final String shortDescriptor;
  final String introSample;
  final CoachAvatarRefs? avatarRefs;
  final String? heyGenAvatarId;
  final String? voiceId;
  final List<String> styleDescriptors;
  final List<String> sampleLines;
  final List<String> wouldSayExamples;
  final List<String> wouldntSayExamples;
  final String aiDisclosureLine;
  final String affiliateSuggestionLine;
  final String? disclosureLine;
  final String? modelOverride;
  final bool active;
  final int promptVersion;

  factory CoachPersona.fromJson(Map<String, dynamic> json) => CoachPersona(
        id: json['_id'] as String,
        slug: json['slug'] as String,
        name: json['name'] as String,
        ageBand: _ageBandFromString(json['ageBand'] as String),
        genderPresentation:
            _genderFromString(json['genderPresentation'] as String),
        shortDescriptor: json['shortDescriptor'] as String,
        introSample: json['introSample'] as String,
        avatarRefs: json['avatarRefs'] == null
            ? null
            : CoachAvatarRefs.fromJson(
                json['avatarRefs'] as Map<String, dynamic>,
              ),
        heyGenAvatarId: json['heyGenAvatarId'] as String?,
        voiceId: json['voiceId'] as String?,
        styleDescriptors:
            (json['styleDescriptors'] as List<dynamic>).cast<String>(),
        sampleLines: (json['sampleLines'] as List<dynamic>).cast<String>(),
        wouldSayExamples:
            (json['wouldSayExamples'] as List<dynamic>).cast<String>(),
        wouldntSayExamples:
            (json['wouldntSayExamples'] as List<dynamic>).cast<String>(),
        aiDisclosureLine: json['aiDisclosureLine'] as String,
        affiliateSuggestionLine: json['affiliateSuggestionLine'] as String,
        disclosureLine: json['disclosureLine'] as String?,
        modelOverride: json['modelOverride'] as String?,
        active: json['active'] as bool,
        promptVersion: (json['promptVersion'] as num).toInt(),
      );
}

class CoachAvatarRefs {
  const CoachAvatarRefs({
    required this.hero,
    required this.profile,
    required this.chat,
    required this.message,
    required this.tiny,
  });

  final String hero;
  final String profile;
  final String chat;
  final String message;
  final String tiny;

  factory CoachAvatarRefs.fromJson(Map<String, dynamic> json) =>
      CoachAvatarRefs(
        hero: json['hero'] as String,
        profile: json['profile'] as String,
        chat: json['chat'] as String,
        message: json['message'] as String,
        tiny: json['tiny'] as String,
      );
}
