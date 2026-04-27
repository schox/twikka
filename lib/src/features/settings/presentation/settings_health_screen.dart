import 'dart:convert';
import 'dart:io';

import 'package:convex_flutter/convex_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/services/health_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/twikka_icons.dart';
import '../../../core/widgets/centered.dart';
import '../../../data/providers/current_user_provider.dart';

class SettingsHealthScreen extends ConsumerStatefulWidget {
  const SettingsHealthScreen({super.key});

  @override
  ConsumerState<SettingsHealthScreen> createState() =>
      _SettingsHealthScreenState();
}

class _SettingsHealthScreenState extends ConsumerState<SettingsHealthScreen> {
  bool _busy = false;
  String? _statusMessage;
  Map<String, dynamic>? _counts;

  @override
  void initState() {
    super.initState();
    _loadCounts();
  }

  Future<void> _loadCounts() async {
    try {
      final raw = await ConvexClient.instance.query(
        'activities:countsBySource',
        const {},
      );
      if (!mounted) return;
      setState(() => _counts = jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      // silent
    }
  }

  Future<void> _connect() async {
    setState(() {
      _busy = true;
      _statusMessage = 'Asking ${_providerLabel()} for permission…';
    });
    final granted = await HealthService.requestPermissions();
    if (!granted) {
      if (!mounted) return;
      setState(() {
        _busy = false;
        _statusMessage = 'Permission declined.';
      });
      return;
    }
    setState(() => _statusMessage = 'Pulling history…');
    final summary = await HealthService.backfill();
    await _loadCounts();
    if (!mounted) return;
    setState(() {
      _busy = false;
      _statusMessage =
          'Backfill done · ${summary.inserted} new · ${summary.updated} updated · ${summary.skipped} unchanged · ${summary.scanned} scanned.';
    });
  }

  Future<void> _syncNow() async {
    setState(() {
      _busy = true;
      _statusMessage = 'Syncing recent…';
    });
    final user = ref.read(currentUserProvider).asData?.value;
    final lastMs = user?.lastHealthSyncAt;
    final lastSync = lastMs == null
        ? null
        : DateTime.fromMillisecondsSinceEpoch(lastMs);
    final summary = await HealthService.syncSince(lastSync);
    await _loadCounts();
    if (!mounted) return;
    setState(() {
      _busy = false;
      _statusMessage =
          'Synced · ${summary.inserted} new · ${summary.updated} updated · ${summary.skipped} unchanged · ${summary.scanned} scanned.';
    });
  }

  Future<void> _disconnect({required bool deleteActivities}) async {
    setState(() {
      _busy = true;
      _statusMessage =
          deleteActivities ? 'Disconnecting and wiping…' : 'Disconnecting…';
    });
    await HealthService.disconnect(deleteActivities: deleteActivities);
    await _loadCounts();
    if (!mounted) return;
    setState(() {
      _busy = false;
      _statusMessage = 'Disconnected.';
    });
  }

  String _providerLabel() => Platform.isIOS ? 'Apple Health' : 'Health Connect';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final user = ref.watch(currentUserProvider).asData?.value;
    final connected = user?.healthSource != null;
    final lastSync = user?.lastHealthSyncAt;

    return Scaffold(
      appBar: AppBar(title: const Text('Health')),
      body: Centered.content(
        child: ListView(
        padding: const EdgeInsets.fromLTRB(gap4, gap2, gap4, gap5),
        children: [
          Container(
            padding: const EdgeInsets.all(gap4),
            decoration: BoxDecoration(
              color: context.tw.accentTint.withValues(alpha: 0.4),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surfaceContainerLowest,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    TwikkaIcons.timezone,
                    color: theme.colorScheme.primary,
                  ),
                ),
                const SizedBox(width: gap3),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(_providerLabel(),
                          style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 2),
                      Text(
                        connected
                            ? 'Connected · last sync ${_formatRelative(lastSync)}'
                            : 'Not connected',
                        style: Theme.of(context).textTheme.bodySmall
                            ?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: gap4),
          Text(
            'Twikka reads your workout history so your coach can see what you\u2019re actually doing. We don\u2019t read steps, heart rate, sleep, or anything else.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: context.tw.ink2),
          ),
          const SizedBox(height: gap4),
          if (!connected)
            FilledButton(
              onPressed: _busy ? null : _connect,
              child: _busy
                  ? const _Spin()
                  : Text('Connect ${_providerLabel()}'),
            )
          else ...[
            FilledButton.tonal(
              onPressed: _busy ? null : _syncNow,
              child: _busy
                  ? const _Spin()
                  : const Text('Sync now'),
            ),
            const SizedBox(height: gap2),
            OutlinedButton(
              onPressed: _busy
                  ? null
                  : () => _disconnect(deleteActivities: false),
              child: const Text('Disconnect (keep activities)'),
            ),
            const SizedBox(height: gap2),
            TextButton(
              onPressed: _busy
                  ? null
                  : () async {
                      final ok = await _confirmWipe();
                      if (ok) await _disconnect(deleteActivities: true);
                    },
              style: TextButton.styleFrom(foregroundColor: Theme.of(context).colorScheme.error),
              child:
                  const Text('Disconnect and delete activities from this source'),
            ),
          ],
          if (_statusMessage != null) ...[
            const SizedBox(height: gap3),
            Text(_statusMessage!,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
          ],
          const SizedBox(height: gap5),
          if (_counts != null) _CountsPanel(counts: _counts!),
        ],
        ),
      ),
    );
  }

  Future<bool> _confirmWipe() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete activities?'),
        content: Text(
          'This removes activities tagged from ${_providerLabel()} only. '
          'Manual entries and other sources stay.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: TextButton.styleFrom(foregroundColor: Theme.of(context).colorScheme.error),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    return ok ?? false;
  }

  String _formatRelative(int? ms) {
    if (ms == null) return 'never';
    final dt = DateTime.fromMillisecondsSinceEpoch(ms);
    final diff = DateTime.now().difference(dt);
    if (diff.inMinutes < 1) return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}

class _CountsPanel extends StatelessWidget {
  const _CountsPanel({required this.counts});
  final Map<String, dynamic> counts;

  @override
  Widget build(BuildContext context) {
    int n(String k) => (counts[k] as num?)?.toInt() ?? 0;
    return Container(
      padding: const EdgeInsets.all(gap3),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest
            .withValues(alpha: 0.4),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Activities by source', style: Theme.of(context).textTheme.labelLarge),
          const SizedBox(height: gap2),
          _row('Apple Health', n('apple_hk')),
          _row('Health Connect', n('health_connect')),
          _row('Manual', n('manual')),
        ],
      ),
    );
  }

  Widget _row(String label, int count) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 2),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [Text(label), Text('$count')],
        ),
      );
}

class _Spin extends StatelessWidget {
  const _Spin();
  @override
  Widget build(BuildContext context) => const SizedBox(
        width: 16,
        height: 16,
        child: CircularProgressIndicator(strokeWidth: 2),
      );
}
