import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/theme/twikka_icons.dart';
import '../../../core/widgets/centered.dart';
import '../../../core/widgets/theme_mode_toggle.dart';

class SettingsPreferencesScreen extends ConsumerWidget {
  const SettingsPreferencesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final themeState = ref.watch(themeControllerProvider);
    final controller = ref.read(themeControllerProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: const Text('Preferences')),
      body: Centered.content(
        child: ListView(
          padding: const EdgeInsets.symmetric(vertical: gap2),
          children: [
            const _SectionHeader('Appearance'),
            Padding(
              padding: const EdgeInsets.fromLTRB(gap4, gap1, gap4, gap2),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  ThemeModeToggle(
                    mode: themeState.mode,
                    onChanged: controller.setMode,
                  ),
                  const SizedBox(height: gap2),
                  Text(
                    switch (themeState.mode) {
                      AppThemeMode.light => 'Light mode',
                      AppThemeMode.dark => 'Dark mode',
                      AppThemeMode.system => 'Follow system settings',
                    },
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
            const Divider(),
            const _SectionHeader('Theme'),
            Padding(
              padding: const EdgeInsets.fromLTRB(gap4, gap1, gap4, gap2),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  for (final variant in twikkaThemeVariants)
                    Padding(
                      padding: const EdgeInsets.only(bottom: gap2),
                      child: _VariantCard(
                        variant: variant,
                        selected: themeState.variant.id == variant.id,
                        onTap: () => controller.setVariant(variant),
                      ),
                    ),
                ],
              ),
            ),
            const Divider(),
            const _SectionHeader('Notifications'),
            SwitchListTile(
              value: true,
              onChanged: (_) {},
              title: const Text('Daily reminder'),
              subtitle: const Text('A nudge each morning to check in'),
            ),
            SwitchListTile(
              value: false,
              onChanged: (_) {},
              title: const Text('Weekly summary'),
              subtitle: const Text('A recap of your week, every Monday'),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader(this.label);
  final String label;
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.fromLTRB(gap4, gap3, gap4, gap1),
      child: Text(
        label.toUpperCase(),
        style: theme.textTheme.labelSmall?.copyWith(
          color: theme.colorScheme.onSurfaceVariant,
        ),
      ),
    );
  }
}

class _VariantCard extends StatelessWidget {
  const _VariantCard({
    required this.variant,
    required this.selected,
    required this.onTap,
  });

  final ThemeVariant variant;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Material(
      color: selected
          ? context.tw.accentTint
          : scheme.surfaceContainerLowest,
      borderRadius: BorderRadius.circular(radiusMd),
      child: InkWell(
        borderRadius: BorderRadius.circular(radiusMd),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(gap3),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(radiusMd),
            border: Border.all(
              color: selected ? scheme.primary : scheme.outlineVariant,
              width: selected ? 1.5 : 1,
            ),
          ),
          child: Row(
            children: [
              _Swatch(variant: variant),
              const SizedBox(width: gap3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      variant.displayName,
                      style: theme.textTheme.titleMedium,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      variant.description,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: scheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
              if (selected)
                Icon(
                  TwikkaIcons.check,
                  size: iconSizeLarge,
                  color: scheme.primary,
                ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Three side-by-side dots showing primary / secondary / tertiary of
/// the variant's light scheme — a visual cue for the picker without
/// rendering the full theme.
class _Swatch extends StatelessWidget {
  const _Swatch({required this.variant});
  final ThemeVariant variant;

  @override
  Widget build(BuildContext context) {
    final scheme = variant.light.colorScheme;
    final ringColor = Theme.of(context).colorScheme.surface;
    return SizedBox(
      width: 56,
      height: 24,
      child: Stack(
        children: [
          _dot(0, scheme.primary, ringColor),
          _dot(16, scheme.secondary, ringColor),
          _dot(32, scheme.tertiary, ringColor),
        ],
      ),
    );
  }

  Widget _dot(double left, Color color, Color ring) {
    return Positioned(
      left: left,
      top: 0,
      child: Container(
        width: 24,
        height: 24,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
          border: Border.all(color: ring, width: 1.5),
        ),
      ),
    );
  }
}
