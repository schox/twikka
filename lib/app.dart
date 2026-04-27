import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'src/core/services/health_auto_sync.dart';
import 'src/core/theme/app_theme.dart';
import 'src/routing/app_router.dart';

class TwikkaApp extends ConsumerWidget {
  const TwikkaApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final themeState = ref.watch(themeControllerProvider);
    return HealthAutoSync(
      child: MaterialApp.router(
        title: 'Twikka',
        debugShowCheckedModeBanner: false,
        theme: buildTwikkaTheme(themeState.variant.light),
        darkTheme: buildTwikkaTheme(themeState.variant.dark),
        themeMode: themeState.mode.materialMode,
        routerConfig: router,
      ),
    );
  }
}
