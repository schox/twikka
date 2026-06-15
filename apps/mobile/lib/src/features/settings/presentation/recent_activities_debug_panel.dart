import 'dart:convert';

import 'package:convex_flutter/convex_flutter.dart';
import 'package:flutter/material.dart';


/// Tester-only feed of the latest activities for the current user.
/// Reads `activities:listRecent` once on mount; pull-to-refresh
/// re-reads. Live subscription deferred until Phase C builds the real
/// Coach feed.
class RecentActivitiesDebugPanel extends StatefulWidget {
  const RecentActivitiesDebugPanel({super.key});

  @override
  State<RecentActivitiesDebugPanel> createState() =>
      _RecentActivitiesDebugPanelState();
}

class _RecentActivitiesDebugPanelState
    extends State<RecentActivitiesDebugPanel> {
  bool _loading = true;
  List<Map<String, dynamic>> _rows = const [];
  List<Map<String, dynamic>> _summaries = const [];

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  Future<void> _refresh() async {
    setState(() => _loading = true);
    try {
      final activitiesRaw = await ConvexClient.instance.query(
        'activities:listRecent',
        {'limit': 25},
      );
      final summariesRaw = await ConvexClient.instance.query(
        'dailySummaries:recent',
        {'days': 14},
      );
      if (!mounted) return;
      setState(() {
        _rows = (jsonDecode(activitiesRaw) as List<dynamic>)
            .cast<Map<String, dynamic>>();
        _summaries = (jsonDecode(summariesRaw) as List<dynamic>)
            .cast<Map<String, dynamic>>();
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _rows = const [];
        _summaries = const [];
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                _rows.isEmpty
                    ? 'No activities yet — connect a source from Settings → Health.'
                    : '${_rows.length} most recent',
                style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
              ),
              TextButton(
                onPressed: _loading ? null : _refresh,
                child: const Text('Refresh'),
              ),
            ],
          ),
          if (_loading)
            const Padding(
              padding: EdgeInsets.all(16),
              child: Center(child: CircularProgressIndicator()),
            )
          else ...[
            for (final row in _rows) _RowTile(row: row),
            if (_summaries.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text(
                'Daily steps (last 14 days)',
                style: theme.textTheme.labelLarge,
              ),
              const SizedBox(height: 6),
              for (final s in _summaries) _StepRow(row: s),
            ],
          ],
        ],
      ),
    );
  }
}

class _StepRow extends StatelessWidget {
  const _StepRow({required this.row});
  final Map<String, dynamic> row;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            '${row['date']}  ·  ${(row['source'] as String).replaceAll('_', ' ')}',
            style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
          ),
          Text(
            '${row['stepCount']} steps',
            style: theme.textTheme.bodySmall,
          ),
        ],
      ),
    );
  }
}

class _RowTile extends StatelessWidget {
  const _RowTile({required this.row});
  final Map<String, dynamic> row;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final source = row['source'] as String;
    final platform = row['platformType'] as String?;
    final kindName = row['activityKindName'] as String?;
    final heading = row['activityKindHeading'] as String?;
    final start = DateTime.fromMillisecondsSinceEpoch(
      (row['startTime'] as num).toInt(),
    );
    final duration = (row['durationMin'] as num).toDouble();
    final distance = (row['distanceMeters'] as num?)?.toDouble();
    final calories = (row['caloriesKcal'] as num?)?.toDouble();
    final needsReview = row['needsReview'] as bool;

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest
            .withValues(alpha: 0.4),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  kindName ?? '(unresolved)',
                  style: theme.textTheme.bodyMedium
                      ?.copyWith(fontWeight: FontWeight.w500),
                ),
              ),
              _badge(theme, source.replaceAll('_', ' ')),
              if (needsReview) ...[
                const SizedBox(width: 4),
                _badge(theme, 'needs review'),
              ],
            ],
          ),
          const SizedBox(height: 2),
          Text(
            [
              ?heading,
              ?platform,
              '${duration.toStringAsFixed(0)} min',
              if (distance != null) '${(distance / 1000).toStringAsFixed(1)} km',
              if (calories != null) '${calories.toStringAsFixed(0)} kcal',
              _formatDate(start),
            ].join(' \u00b7 '),
            style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
          ),
        ],
      ),
    );
  }

  Widget _badge(ThemeData theme, String label) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
        decoration: BoxDecoration(
          color: theme.colorScheme.primaryContainer.withValues(alpha: 0.4),
          borderRadius: BorderRadius.circular(999),
        ),
        child: Text(label, style: theme.textTheme.labelSmall),
      );

  String _formatDate(DateTime dt) {
    final diff = DateTime.now().difference(dt);
    if (diff.inDays < 1) return '${diff.inHours}h ago';
    if (diff.inDays < 30) return '${diff.inDays}d ago';
    return '${dt.year}-${dt.month.toString().padLeft(2, '0')}-${dt.day.toString().padLeft(2, '0')}';
  }
}
