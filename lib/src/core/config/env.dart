import 'package:envied/envied.dart';

part 'env.g.dart';

/// Compile-time environment configuration.
///
/// Values are read from `.env.local` at codegen time and baked into
/// `env.g.dart` as `static const` fields — no runtime file IO. Missing
/// required keys fail the build instead of crashing on launch.
///
/// Only client-publishable values go through here. Server secrets
/// (CLERK_SECRET_KEY, OPENROUTER_API_KEY, webhook signing secrets)
/// must never be referenced from Flutter code — they live on the Convex
/// deployment exclusively.
@Envied(path: '.env.local')
abstract class AppEnv {
  @EnviedField(varName: 'CONVEX_URL')
  static const String convexUrl = _AppEnv.convexUrl;

  @EnviedField(varName: 'CLERK_PUBLISHABLE_KEY')
  static const String clerkPublishableKey = _AppEnv.clerkPublishableKey;

  /// Identifier the Convex client sends in its connection metadata.
  /// Not sensitive; defaulted to `twikka-flutter` so the build still
  /// succeeds when .env.local doesn't override it.
  @EnviedField(varName: 'CONVEX_CLIENT_ID', defaultValue: 'twikka-flutter-dev')
  static const String clientId = _AppEnv.clientId;
}
