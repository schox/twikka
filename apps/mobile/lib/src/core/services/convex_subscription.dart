import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;

import 'package:convex_flutter/convex_flutter.dart';

/// Wraps `ConvexClient.subscribe`'s callback-shaped API as a typed [Stream].
///
/// The stream cancels the underlying subscription when its last listener
/// is removed, so Riverpod's auto-dispose works end-to-end.
///
/// Reconnects on error with exponential backoff (500 ms → 30 s, doubling)
/// so a transient Convex/auth fault doesn't leave the stream permanently
/// dead. Errors are still forwarded to listeners on every failure — the
/// retry runs in the background and a successful reconnect simply
/// resumes [onUpdate]. The attempt counter resets on each successful
/// update.
Stream<T> convexSubscribe<T>({
  required String name,
  Map<String, dynamic> args = const {},
  required T Function(dynamic json) decode,
}) {
  final controller = StreamController<T>();
  SubscriptionHandle? handle;
  Timer? retryTimer;
  var attempt = 0;
  var disposed = false;

  Duration nextDelay() {
    // 500 ms, 1 s, 2 s, 4 s, ... capped at 30 s.
    final ms = math.min(30000, 500 * (1 << math.min(attempt, 10)));
    return Duration(milliseconds: ms);
  }

  Future<void> connect() async {
    if (disposed || controller.isClosed) return;
    try {
      handle = await ConvexClient.instance.subscribe(
        name: name,
        args: args,
        onUpdate: (String rawJson) {
          if (controller.isClosed) return;
          attempt = 0;
          try {
            controller.add(decode(jsonDecode(rawJson)));
          } catch (err, st) {
            controller.addError(err, st);
          }
        },
        onError: (String message, String? _) {
          if (controller.isClosed) return;
          controller.addError(Exception('convex subscribe $name: $message'));
          // Tear down the failed handle and schedule a reconnect. Convex's
          // Rust client doesn't auto-restart errored subscriptions, so
          // without this the stream stays dead until the provider is
          // disposed (which doesn't happen with keepAlive: true).
          handle?.cancel();
          handle = null;
          final delay = nextDelay();
          attempt++;
          retryTimer?.cancel();
          retryTimer = Timer(delay, connect);
        },
      );
    } catch (err, st) {
      // The subscribe call itself failed (rare — usually a transport
      // error before the subscription is even registered). Treat the
      // same as an onError tick.
      if (controller.isClosed) return;
      controller.addError(err, st);
      final delay = nextDelay();
      attempt++;
      retryTimer?.cancel();
      retryTimer = Timer(delay, connect);
    }
  }

  controller.onListen = () {
    connect();
  };

  controller.onCancel = () async {
    disposed = true;
    retryTimer?.cancel();
    retryTimer = null;
    handle?.cancel();
    handle = null;
    await controller.close();
  };

  return controller.stream;
}
