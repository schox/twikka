import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'src/core/theme/app_theme.dart';
import 'src/core/theme/theme_notifier.dart';
import 'src/routing/app_router.dart';

class TwikkaApp extends ConsumerWidget {
  const TwikkaApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final appearance = ref.watch(themeProvider);
    return MaterialApp.router(
      title: 'Twikka',
      debugShowCheckedModeBanner: false,
      theme: lightTheme(),
      darkTheme: darkTheme(),
      themeMode: appearance.themeMode,
      routerConfig: router,
    );
  }
}
