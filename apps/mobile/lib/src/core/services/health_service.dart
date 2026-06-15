import 'dart:convert';
import 'dart:io';

import 'package:convex_flutter/convex_flutter.dart';
import 'package:health/health.dart';

/// Wrapper around the `health` package that handles permission flow,
/// historical backfill on first connect, and foreground "since-last-sync"
/// pulls. Every captured workout is forwarded to Convex's
/// `activities:upsertBatch` mutation, which dedupes on
/// `(userId, source, externalId)`.
class HealthService {
  HealthService._();

  static final _health = Health();
  static const _types = [HealthDataType.WORKOUT, HealthDataType.STEPS];
  static const _access = [HealthDataAccess.READ, HealthDataAccess.READ];
  // First-connect window. 365 days is plenty for "what have I been
  // doing this past year"; recent activity matters most for the coach.
  static const _backfillDays = 365;
  // Cap step backfill at 90 days — 365 calls (one per day) over a slow
  // HealthKit aggregator would block UI for too long. Steps before
  // that don't earn their keep for the coach.
  static const _stepBackfillDays = 90;

  static bool _configured = false;

  static Future<void> _ensureConfigured() async {
    if (_configured) return;
    await _health.configure();
    _configured = true;
  }

  /// Which platform-native source we're on. Manual entries don't pass
  /// through here.
  static String currentSource() =>
      Platform.isIOS ? 'apple_hk' : 'health_connect';

  static Future<bool> hasPermissions() async {
    await _ensureConfigured();
    final granted = await _health.hasPermissions(_types, permissions: _access);
    return granted ?? false;
  }

  /// Request workout-read permission. iOS shows a sheet; Health Connect
  /// on Android may bounce the user to the system permission screen.
  static Future<bool> requestPermissions() async {
    await _ensureConfigured();
    return await _health.requestAuthorization(_types, permissions: _access);
  }

  /// Backfill the last 365 days of workouts + last 90 days of step
  /// totals. Idempotent server-side.
  static Future<HealthSyncSummary> backfill() async {
    final now = DateTime.now();
    final workoutStart = now.subtract(const Duration(days: _backfillDays));
    final summary = await _syncRange(workoutStart, now);
    final stepsStart = now.subtract(const Duration(days: _stepBackfillDays));
    final stepSummary = await _syncDailySteps(stepsStart, now);
    return summary.merged(stepSummary);
  }

  /// Pull anything since `lastSync` (exclusive) up to now. If lastSync
  /// is null we fall back to the standard backfill window.
  static Future<HealthSyncSummary> syncSince(DateTime? lastSync) async {
    final now = DateTime.now();
    if (lastSync == null) return backfill();
    // Epsilon avoids re-fetching the boundary record.
    final start = lastSync.add(const Duration(milliseconds: 1));
    if (!start.isBefore(now)) {
      return const HealthSyncSummary(
          inserted: 0, updated: 0, skipped: 0, scanned: 0);
    }
    final summary = await _syncRange(start, now);
    // Re-aggregate the days touched since lastSync — daily totals can
    // shift if the user's device wrote more samples for those days.
    final stepStart = DateTime(start.year, start.month, start.day);
    final stepSummary = await _syncDailySteps(stepStart, now);
    return summary.merged(stepSummary);
  }

  static Future<HealthSyncSummary> _syncRange(
    DateTime start,
    DateTime end,
  ) async {
    await _ensureConfigured();
    final points = await _health.getHealthDataFromTypes(
      types: _types,
      startTime: start,
      endTime: end,
    );

    final source = currentSource();
    final activities = <Map<String, dynamic>>[];
    int latestEndMs = 0;
    for (final p in points) {
      final value = p.value;
      if (value is! WorkoutHealthValue) continue;
      final endMs = p.dateTo.millisecondsSinceEpoch;
      if (endMs > latestEndMs) latestEndMs = endMs;
      final durationMin =
          (endMs - p.dateFrom.millisecondsSinceEpoch) / (1000 * 60);
      activities.add({
        'source': source,
        'externalId': p.uuid,
        'platformType': value.workoutActivityType.name,
        'startTime': p.dateFrom.millisecondsSinceEpoch,
        'endTime': endMs,
        'durationMin': durationMin,
        if (value.totalDistance != null)
          'distanceMeters': value.totalDistance!.toDouble(),
        if (value.totalEnergyBurned != null)
          'caloriesKcal': value.totalEnergyBurned!.toDouble(),
      });
    }

    if (activities.isEmpty) {
      return HealthSyncSummary(
        inserted: 0,
        updated: 0,
        skipped: 0,
        scanned: points.length,
      );
    }

    // Send in batches so a single mutation doesn't get too large. The
    // server walks each batch sequentially.
    const batchSize = 50;
    int inserted = 0;
    int updated = 0;
    int skipped = 0;
    for (var i = 0; i < activities.length; i += batchSize) {
      final batch = activities.sublist(
        i,
        i + batchSize > activities.length ? activities.length : i + batchSize,
      );
      final args = <String, dynamic>{'activities': batch};
      // Last batch advances the watermark + sets source.
      if (i + batchSize >= activities.length) {
        args['advanceLastSyncTo'] = latestEndMs;
        args['setSource'] = source;
      }
      final raw = await ConvexClient.instance.mutation(
        name: 'activities:upsertBatch',
        args: args,
      );
      final result = raw.isEmpty
          ? const <String, dynamic>{}
          : (jsonDecode(raw) as Map<String, dynamic>);
      inserted += (result['inserted'] as num?)?.toInt() ?? 0;
      updated += (result['updated'] as num?)?.toInt() ?? 0;
      skipped += (result['skipped'] as num?)?.toInt() ?? 0;
    }

    return HealthSyncSummary(
      inserted: inserted,
      updated: updated,
      skipped: skipped,
      scanned: points.length,
    );
  }

  /// Walk one day at a time, ask HealthKit / Health Connect for that
  /// day's total step count, batch into Convex. Days with 0 steps are
  /// skipped to avoid noise rows. Day boundaries follow the device's
  /// local timezone.
  static Future<HealthSyncSummary> _syncDailySteps(
    DateTime start,
    DateTime end,
  ) async {
    await _ensureConfigured();
    final source = currentSource();
    final entries = <Map<String, dynamic>>[];

    var cursor = DateTime(start.year, start.month, start.day);
    final endDay = DateTime(end.year, end.month, end.day, 23, 59, 59, 999);
    int scanned = 0;
    while (!cursor.isAfter(endDay)) {
      final dayStart = cursor;
      final dayEnd = cursor.add(const Duration(days: 1));
      scanned += 1;
      final steps = await _health.getTotalStepsInInterval(dayStart, dayEnd);
      if (steps != null && steps > 0) {
        entries.add({
          'date':
              '${cursor.year}-${cursor.month.toString().padLeft(2, "0")}-${cursor.day.toString().padLeft(2, "0")}',
          'stepCount': steps,
        });
      }
      cursor = dayEnd;
    }

    if (entries.isEmpty) {
      return HealthSyncSummary(
        inserted: 0,
        updated: 0,
        skipped: 0,
        scanned: scanned,
      );
    }

    int inserted = 0;
    int updated = 0;
    int skipped = 0;
    const batchSize = 60;
    for (var i = 0; i < entries.length; i += batchSize) {
      final batch = entries.sublist(
        i,
        i + batchSize > entries.length ? entries.length : i + batchSize,
      );
      final raw = await ConvexClient.instance.mutation(
        name: 'dailySummaries:upsertBatch',
        args: {'source': source, 'entries': batch},
      );
      final result = raw.isEmpty
          ? const <String, dynamic>{}
          : (jsonDecode(raw) as Map<String, dynamic>);
      inserted += (result['inserted'] as num?)?.toInt() ?? 0;
      updated += (result['updated'] as num?)?.toInt() ?? 0;
      skipped += (result['skipped'] as num?)?.toInt() ?? 0;
    }
    return HealthSyncSummary(
      inserted: inserted,
      updated: updated,
      skipped: skipped,
      scanned: scanned,
    );
  }

  /// Disconnect: optionally wipe Convex-side activities tagged with
  /// the current source. Doesn't revoke iOS / Health Connect
  /// permissions — the user does that in OS Settings.
  static Future<void> disconnect({required bool deleteActivities}) async {
    await ConvexClient.instance.mutation(
      name: 'activities:disconnectSource',
      args: {
        'source': currentSource(),
        'deleteActivities': deleteActivities,
      },
    );
  }
}

class HealthSyncSummary {
  const HealthSyncSummary({
    required this.inserted,
    required this.updated,
    required this.skipped,
    required this.scanned,
  });

  final int inserted;
  final int updated;
  final int skipped;
  final int scanned;

  HealthSyncSummary merged(HealthSyncSummary other) => HealthSyncSummary(
        inserted: inserted + other.inserted,
        updated: updated + other.updated,
        skipped: skipped + other.skipped,
        scanned: scanned + other.scanned,
      );

  @override
  String toString() =>
      'inserted=$inserted updated=$updated skipped=$skipped scanned=$scanned';
}
