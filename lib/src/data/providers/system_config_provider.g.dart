// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'system_config_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(systemConfig)
final systemConfigProvider = SystemConfigProvider._();

final class SystemConfigProvider
    extends
        $FunctionalProvider<
          AsyncValue<SystemConfig?>,
          SystemConfig?,
          Stream<SystemConfig?>
        >
    with $FutureModifier<SystemConfig?>, $StreamProvider<SystemConfig?> {
  SystemConfigProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'systemConfigProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$systemConfigHash();

  @$internal
  @override
  $StreamProviderElement<SystemConfig?> $createElement(
    $ProviderPointer pointer,
  ) => $StreamProviderElement(pointer);

  @override
  Stream<SystemConfig?> create(Ref ref) {
    return systemConfig(ref);
  }
}

String _$systemConfigHash() => r'fc2f77470db9f42ff07c6b1d44bb7cdcf8d72e06';
