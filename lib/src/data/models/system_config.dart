class SystemConfig {
  const SystemConfig({
    required this.available,
    required this.minAppVersion,
    required this.updateLinks,
    required this.models,
    required this.flags,
    required this.updatedBy,
    required this.updatedAt,
    this.unavailableReason,
    this.estimatedBackOnline,
    this.costBudgets,
    this.notes,
  });

  final bool available;
  final String? unavailableReason;
  final int? estimatedBackOnline;
  final String minAppVersion;
  final UpdateLinks updateLinks;
  final ModelPreferences models;
  final SystemFlags flags;
  final CostBudgets? costBudgets;
  final String updatedBy;
  final int updatedAt;
  final String? notes;

  factory SystemConfig.fromJson(Map<String, dynamic> json) {
    return SystemConfig(
      available: json['available'] as bool,
      unavailableReason: json['unavailableReason'] as String?,
      estimatedBackOnline: (json['estimatedBackOnline'] as num?)?.toInt(),
      minAppVersion: json['minAppVersion'] as String,
      updateLinks: UpdateLinks.fromJson(
        json['updateLinks'] as Map<String, dynamic>,
      ),
      models: ModelPreferences.fromJson(
        json['models'] as Map<String, dynamic>,
      ),
      flags: SystemFlags.fromJson(json['flags'] as Map<String, dynamic>),
      costBudgets: json['costBudgets'] == null
          ? null
          : CostBudgets.fromJson(json['costBudgets'] as Map<String, dynamic>),
      updatedBy: json['updatedBy'] as String,
      updatedAt: (json['updatedAt'] as num).toInt(),
      notes: json['notes'] as String?,
    );
  }
}

class UpdateLinks {
  const UpdateLinks({required this.ios, required this.android});

  final String ios;
  final String android;

  factory UpdateLinks.fromJson(Map<String, dynamic> json) => UpdateLinks(
        ios: json['ios'] as String,
        android: json['android'] as String,
      );
}

class ModelPreferences {
  const ModelPreferences({
    required this.classifier,
    required this.general,
    required this.deep,
    required this.extractor,
    required this.embedding,
  });

  final String classifier;
  final String general;
  final String deep;
  final String extractor;
  final String embedding;

  factory ModelPreferences.fromJson(Map<String, dynamic> json) =>
      ModelPreferences(
        classifier: json['classifier'] as String,
        general: json['general'] as String,
        deep: json['deep'] as String,
        extractor: json['extractor'] as String,
        embedding: json['embedding'] as String,
      );
}

class SystemFlags {
  const SystemFlags({
    required this.enableProactiveCoachMessages,
    required this.enableBackgroundFactExtraction,
    required this.enablePushNotifications,
    required this.pauseGoHighLevelSync,
  });

  final bool enableProactiveCoachMessages;
  final bool enableBackgroundFactExtraction;
  final bool enablePushNotifications;
  final bool pauseGoHighLevelSync;

  factory SystemFlags.fromJson(Map<String, dynamic> json) => SystemFlags(
        enableProactiveCoachMessages:
            json['enableProactiveCoachMessages'] as bool,
        enableBackgroundFactExtraction:
            json['enableBackgroundFactExtraction'] as bool,
        enablePushNotifications: json['enablePushNotifications'] as bool,
        pauseGoHighLevelSync: json['pauseGoHighLevelSync'] as bool,
      );
}

class CostBudgets {
  const CostBudgets({
    required this.perUserDailyUsdSoft,
    required this.perOrgDailyUsdSoft,
    required this.platformDailyUsdSoft,
  });

  final double perUserDailyUsdSoft;
  final double perOrgDailyUsdSoft;
  final double platformDailyUsdSoft;

  factory CostBudgets.fromJson(Map<String, dynamic> json) => CostBudgets(
        perUserDailyUsdSoft: (json['perUserDailyUsdSoft'] as num).toDouble(),
        perOrgDailyUsdSoft: (json['perOrgDailyUsdSoft'] as num).toDouble(),
        platformDailyUsdSoft: (json['platformDailyUsdSoft'] as num).toDouble(),
      );
}
