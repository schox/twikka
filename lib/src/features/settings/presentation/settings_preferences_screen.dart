import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/theme_constants.dart';
import '../../../core/theme/theme_notifier.dart';
import '../../../core/widgets/centered.dart';

class SettingsPreferencesScreen extends ConsumerWidget {
  const SettingsPreferencesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appearance = ref.watch(themeProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Preferences')),
      body: Centered.content(
        child: ListView(
        padding: const EdgeInsets.symmetric(vertical: gap2),
        children: [
          const _Section('Appearance'),
          RadioGroup<Appearance>(
            groupValue: appearance,
            onChanged: (v) {
              if (v != null) ref.read(themeProvider.notifier).set(v);
            },
            child: Column(
              children: [
                for (final option in Appearance.values)
                  RadioListTile<Appearance>(
                    value: option,
                    title: Text(option.label),
                  ),
              ],
            ),
          ),
          const Divider(),
          const _Section('Notifications'),
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

class _Section extends StatelessWidget {
  const _Section(this.label);
  final String label;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(gap4, gap3, gap4, gap1),
      child: Text(
        label.toUpperCase(),
        style: Theme.of(context).textTheme.labelSmall?.copyWith(color: twMuted),
      ),
    );
  }
}
