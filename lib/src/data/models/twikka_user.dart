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
      );
}
