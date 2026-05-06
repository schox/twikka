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
    this.avatarUrl,
    this.avatarCacheKey,
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
  // Resolved by `coachPersonas:listActive` / `currentForUser` server-side.
  // Null until the operator runs `coachPersonas:registerAvatarMedia`.
  final String? avatarUrl;
  // Stable across signed-URL rotations (the underlying R2 object key).
  // Used as `CachedNetworkImage.cacheKey` so local cache hits survive
  // URL refresh; null when avatarUrl is null.
  final String? avatarCacheKey;
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
        avatarUrl: json['avatarUrl'] as String?,
        avatarCacheKey: json['avatarCacheKey'] as String?,
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
