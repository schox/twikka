import 'dart:async';
import 'dart:convert';

import 'package:convex_flutter/convex_flutter.dart';

/// Wraps `ConvexClient.subscribe`'s callback-shaped API as a typed [Stream].
///
/// The stream cancels the underlying subscription when its last listener
/// is removed, so Riverpod's auto-dispose works end-to-end.
Stream<T> convexSubscribe<T>({
  required String name,
  Map<String, dynamic> args = const {},
  required T Function(dynamic json) decode,
}) {
  final controller = StreamController<T>();
  SubscriptionHandle? handle;

  Future<void> start() async {
    handle = await ConvexClient.instance.subscribe(
      name: name,
      args: args,
      onUpdate: (String rawJson) {
        if (controller.isClosed) return;
        try {
          controller.add(decode(jsonDecode(rawJson)));
        } catch (err, st) {
          controller.addError(err, st);
        }
      },
      onError: (String message, String? _) {
        if (controller.isClosed) return;
        controller.addError(Exception('convex subscribe $name: $message'));
      },
    );
  }

  controller.onListen = () {
    start();
  };

  controller.onCancel = () async {
    handle?.cancel();
    await controller.close();
  };

  return controller.stream;
}
