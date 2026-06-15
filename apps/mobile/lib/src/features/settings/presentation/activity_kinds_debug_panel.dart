import 'dart:async';
import 'dart:convert';

import 'package:convex_flutter/convex_flutter.dart';
import 'package:flutter/material.dart';

import '../../../core/theme/twikka_icons.dart';

/// Tester-only browser over the activity_kinds table. Surfaces enough
/// information to redline the CoPA seed + platform mapping live.
class ActivityKindsDebugPanel extends StatefulWidget {
  const ActivityKindsDebugPanel({super.key});

  @override
  State<ActivityKindsDebugPanel> createState() =>
      _ActivityKindsDebugPanelState();
}

enum _ActivityFilter { all, synthetic, withPlatform, needsReview }

class _ActivityKindsDebugPanelState extends State<ActivityKindsDebugPanel> {
  final _controller = TextEditingController();
  Timer? _debounce;
  _ActivityFilter _filter = _ActivityFilter.all;
  String _query = '';
  List<Map<String, dynamic>> _rows = const [];
  Map<String, dynamic>? _stats;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _refresh();
    _refreshStats();
  }

  @override
  void dispose() {
    _controller.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  Future<void> _refreshStats() async {
    try {
      final raw = await ConvexClient.instance.action(
        name: 'activityKinds:debugStats',
        args: const {},
      );
      if (!mounted) return;
      setState(() => _stats = jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      // best-effort
    }
  }

  Future<void> _refresh() async {
    setState(() => _loading = true);
    try {
      final raw = await ConvexClient.instance.query(
        'activityKinds:debugList',
        {
          'q': _query,
          'filter': _filter.name,
          'limit': 60,
        },
      );
      if (!mounted) return;
      final list = (jsonDecode(raw) as List<dynamic>)
          .cast<Map<String, dynamic>>();
      setState(() {
        _rows = list;
        _loading = false;
      });
    } catch (err) {
      if (!mounted) return;
      setState(() {
        _rows = const [];
        _loading = false;
      });
    }
  }

  void _onQueryChanged(String s) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 240), () {
      _query = s.trim();
      _refresh();
    });
  }

  void _setFilter(_ActivityFilter f) {
    setState(() => _filter = f);
    _refresh();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (_stats != null)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Wrap(
              spacing: 8,
              runSpacing: 4,
              children: [
                _StatChip('total: ${_stats!['total']}'),
                _StatChip('CoPA: ${_stats!['copa']}'),
                _StatChip('synthetic: ${_stats!['synthetic']}'),
                _StatChip('with platform: ${_stats!['withPlatform']}'),
                _StatChip('needs review: ${_stats!['needsReview']}'),
              ],
            ),
          ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
          child: TextField(
            controller: _controller,
            decoration: const InputDecoration(
              hintText: 'Search activity name…',
              prefixIcon: Icon(TwikkaIcons.search),
              isDense: true,
            ),
            onChanged: _onQueryChanged,
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                for (final f in _ActivityFilter.values)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: ChoiceChip(
                      label: Text(_filterLabel(f)),
                      selected: _filter == f,
                      onSelected: (_) => _setFilter(f),
                    ),
                  ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 4),
        if (_loading)
          const Padding(
            padding: EdgeInsets.all(16),
            child: Center(child: CircularProgressIndicator()),
          )
        else if (_rows.isEmpty)
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              'No matching activity_kinds rows.',
              style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
            ),
          )
        else
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _rows.length,
            separatorBuilder: (_, _) => const Divider(height: 1),
            itemBuilder: (ctx, i) => _ActivityKindTile(row: _rows[i]),
          ),
      ],
    );
  }

  static String _filterLabel(_ActivityFilter f) => switch (f) {
        _ActivityFilter.all => 'All',
        _ActivityFilter.synthetic => 'Synthetic',
        _ActivityFilter.withPlatform => 'Has platform',
        _ActivityFilter.needsReview => 'Needs review',
      };
}

class _StatChip extends StatelessWidget {
  const _StatChip(this.text);
  final String text;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(text, style: theme.textTheme.labelSmall),
    );
  }
}

class _ActivityKindTile extends StatelessWidget {
  const _ActivityKindTile({required this.row});
  final Map<String, dynamic> row;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final name = row['name'] as String;
    final mets = (row['mets'] as num?)?.toDouble();
    final copaCode = row['copaCode'] as num?;
    final headingName = row['headingName'] as String;
    final source = row['source'] as String;
    final needsReview = row['needsReview'] as bool;
    final platformTypes = (row['platformTypes'] as List<dynamic>).cast<String>();
    final flags = <String>[
      if (row['isCardio'] as bool) 'cardio',
      if (row['isStrength'] as bool) 'strength',
      if (row['isMobility'] as bool) 'mobility',
      if (row['isBalance'] as bool) 'balance',
      if (row['isMental'] as bool) 'mental',
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  name,
                  style: theme.textTheme.bodyMedium
                      ?.copyWith(fontWeight: FontWeight.w500),
                ),
              ),
              if (needsReview)
                Padding(
                  padding: const EdgeInsets.only(left: 6),
                  child: Icon(
                    TwikkaIcons.flag,
                    size: 14,
                    color: theme.colorScheme.error,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            [
              if (copaCode != null) 'CoPA $copaCode',
              if (mets != null) '${mets.toStringAsFixed(mets == mets.toInt() ? 0 : 1)} METs',
              headingName,
              source,
            ].join(' \u00b7 '),
            style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
          ),
          if (flags.isNotEmpty || platformTypes.isNotEmpty) ...[
            const SizedBox(height: 4),
            Wrap(
              spacing: 4,
              runSpacing: 2,
              children: [
                for (final f in flags)
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 6, vertical: 1),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primaryContainer
                          .withValues(alpha: 0.4),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      f,
                      style: theme.textTheme.labelSmall,
                    ),
                  ),
                for (final p in platformTypes)
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 6, vertical: 1),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.tertiaryContainer
                          .withValues(alpha: 0.45),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      p,
                      style: theme.textTheme.labelSmall,
                    ),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
