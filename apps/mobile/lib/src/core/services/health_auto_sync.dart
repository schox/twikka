import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/providers/current_user_provider.dart';
import 'health_service.dart';

/// App-wide lifecycle hook. On resume, if the current user has a
/// connected health source and we haven't synced in the last few
/// minutes, pull anything new from HealthKit / Health Connect. The
/// sync is fire-and-forget — failures are logged, not surfaced
/// (Settings → Health is the explicit retry surface).
class HealthAutoSync extends ConsumerStatefulWidget {
  const HealthAutoSync({super.key, required this.child});
  final Widget child;

  @override
  ConsumerState<HealthAutoSync> createState() => _HealthAutoSyncState();
}

class _HealthAutoSyncState extends ConsumerState<HealthAutoSync>
    with WidgetsBindingObserver {
  static const _minSyncInterval = Duration(minutes: 1);
  DateTime? _lastSyncAttempt;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _maybeSync();
    }
  }

  void _maybeSync() {
    final user = ref.read(currentUserProvider).asData?.value;
    if (user == null) return;
    if (user.healthSource == null) return;
    final last = _lastSyncAttempt;
    if (last != null && DateTime.now().difference(last) < _minSyncInterval) {
      return;
    }
    _lastSyncAttempt = DateTime.now();

    final lastSync = user.lastHealthSyncAt == null
        ? null
        : DateTime.fromMillisecondsSinceEpoch(user.lastHealthSyncAt!);

    HealthService.syncSince(lastSync).catchError((Object err) {
      // ignore: avoid_print
      print('health auto-sync failed: $err');
      return const HealthSyncSummary(
          inserted: 0, updated: 0, skipped: 0, scanned: 0);
    });
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
