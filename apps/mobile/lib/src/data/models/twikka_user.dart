class TwikkaUser {
  const TwikkaUser({
    required this.id,
    required this.clerkId,
    required this.organisationId,
    required this.email,
    required this.lifecycleStage,
    required this.suspended,
    required this.createdAt,
    required this.updatedAt,
    this.displayName,
    this.deletionRequestedAt,
    this.cityId,
    this.timezone,
    this.city,
    this.tester = false,
    this.healthSource,
    this.lastHealthSyncAt,
    this.photoMediaId,
    this.photoUrl,
    this.photoCacheKey,
  });

  final String id;
  final String clerkId;
  final String organisationId;
  final String email;
  final String? displayName;
  final String lifecycleStage;
  final bool suspended;
  final int? deletionRequestedAt;
  final int createdAt;
  final int updatedAt;
  final String? cityId;
  final String? timezone;
  final TwikkaUserCity? city;
  final bool tester;
  final String? healthSource;
  final int? lastHealthSyncAt;
  final String? photoMediaId;

  /// Signed R2 URL resolved server-side at query time. ~24h TTL.
  /// The signature changes on every refresh, but [photoCacheKey] is
  /// stable per image — pass that to CachedNetworkImage so cache hits
  /// survive URL rotations.
  final String? photoUrl;

  /// Stable identifier for the underlying R2 object (its key). Use as
  /// `CachedNetworkImage.cacheKey` so the local cache stays warm even
  /// when [photoUrl] rotates. Null when [photoUrl] is null.
  final String? photoCacheKey;

  factory TwikkaUser.fromJson(Map<String, dynamic> json) => TwikkaUser(
        id: json['_id'] as String,
        clerkId: json['clerkId'] as String,
        organisationId: json['organisationId'] as String,
        email: json['email'] as String,
        displayName: json['displayName'] as String?,
        lifecycleStage: json['lifecycleStage'] as String,
        suspended: json['suspended'] as bool,
        deletionRequestedAt: (json['deletionRequestedAt'] as num?)?.toInt(),
        createdAt: (json['createdAt'] as num).toInt(),
        updatedAt: (json['updatedAt'] as num).toInt(),
        cityId: json['cityId'] as String?,
        timezone: json['timezone'] as String?,
        city: json['city'] == null
            ? null
            : TwikkaUserCity.fromJson(json['city'] as Map<String, dynamic>),
        tester: (json['tester'] as bool?) ?? false,
        healthSource: json['healthSource'] as String?,
        lastHealthSyncAt: (json['lastHealthSyncAt'] as num?)?.toInt(),
        photoMediaId: json['photoMediaId'] as String?,
        photoUrl: json['photoUrl'] as String?,
        photoCacheKey: json['photoCacheKey'] as String?,
      );
}

class TwikkaUserCity {
  const TwikkaUserCity({
    required this.id,
    required this.name,
    required this.countryCode,
    required this.timezone,
  });
  final String id;
  final String name;
  final String countryCode;
  final String timezone;

  factory TwikkaUserCity.fromJson(Map<String, dynamic> json) => TwikkaUserCity(
        id: json['_id'] as String,
        name: json['name'] as String,
        countryCode: json['countryCode'] as String,
        timezone: json['timezone'] as String,
      );
}
