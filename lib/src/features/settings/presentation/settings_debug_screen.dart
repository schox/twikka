import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/coach_persona.dart';
import '../../../data/models/system_config.dart';
import '../../../data/models/twikka_user.dart';
import '../../../data/providers/coach_personas_provider.dart';
import '../../../data/providers/current_user_provider.dart';
import '../../../data/providers/system_config_provider.dart';
import '../../auth/data/auth_state.dart';
import '../../auth/data/clerk_auth_notifier.dart';
import '../../coach/data/chat_notifier.dart';
import 'activity_kinds_debug_panel.dart';

class SettingsDebugScreen extends ConsumerWidget {
  const SettingsDebugScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(clerkAuthProvider);
    final onboardingComplete = auth is AuthLoggedIn ? auth.onboardingComplete : false;
    final systemConfig = ref.watch(systemConfigProvider);
    final personas = ref.watch(coachPersonasProvider);
    final currentUser = ref.watch(currentUserProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Debug')),
      body: ListView(
        children: [
          SwitchListTile(
            value: onboardingComplete,
            onChanged: (v) async {
              final notifier = ref.read(clerkAuthProvider.notifier);
              if (v) {
                await notifier.completeOnboarding();
              } else {
                await notifier.resetOnboarding();
              }
              ref.read(chatProvider.notifier).reset();
            },
            title: const Text('Onboarding complete'),
            subtitle: const Text(
              'Toggle to switch the coach greeting between onboarding and the daily check-in conversation.',
            ),
          ),
          ListTile(
            leading: const Icon(Icons.refresh),
            title: const Text('Reset chat'),
            onTap: () => ref.read(chatProvider.notifier).reset(),
          ),
          const Divider(height: 32),
          _sectionHeader(context, 'Current user (live)'),
          currentUser.when(
            data: (user) => _CurrentUserPanel(user: user),
            loading: () => const Padding(
              padding: EdgeInsets.all(16),
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (err, _) => _errorTile('Current user error: $err'),
          ),
          const Divider(height: 32),
          _sectionHeader(context, 'System config (live)'),
          systemConfig.when(
            data: (cfg) => _SystemConfigPanel(config: cfg),
            loading: () => const Padding(
              padding: EdgeInsets.all(16),
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (err, _) => _errorTile('System config error: $err'),
          ),
          const Divider(height: 32),
          _sectionHeader(context, 'Coach personas (live)'),
          personas.when(
            data: (list) => _PersonasPanel(personas: list),
            loading: () => const Padding(
              padding: EdgeInsets.all(16),
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (err, _) => _errorTile('Personas error: $err'),
          ),
          const Divider(height: 32),
          _sectionHeader(context, 'Activity kinds (live)'),
          const ActivityKindsDebugPanel(),
        ],
      ),
    );
  }

  Widget _sectionHeader(BuildContext context, String label) => Padding(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
        child: Text(
          label,
          style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: Theme.of(context).colorScheme.primary,
              ),
        ),
      );

  Widget _errorTile(String text) => ListTile(
        leading: const Icon(Icons.error_outline),
        title: Text(text),
      );
}

class _CurrentUserPanel extends StatelessWidget {
  const _CurrentUserPanel({required this.user});
  final TwikkaUser? user;

  @override
  Widget build(BuildContext context) {
    final u = user;
    if (u == null) {
      return const ListTile(title: Text('No users row (unauthenticated or pending)'));
    }
    return Column(
      children: [
        _kv(context, '_id', u.id),
        _kv(context, 'clerkId', u.clerkId),
        _kv(context, 'organisationId', u.organisationId),
        _kv(context, 'email', u.email),
        if (u.displayName != null) _kv(context, 'displayName', u.displayName!),
        _kv(context, 'lifecycleStage', u.lifecycleStage),
        _kv(context, 'suspended', u.suspended.toString()),
        if (u.deletionRequestedAt != null)
          _kv(
            context,
            'deletionRequestedAt',
            DateTime.fromMillisecondsSinceEpoch(u.deletionRequestedAt!)
                .toLocal()
                .toIso8601String(),
          ),
        _kv(
          context,
          'createdAt',
          DateTime.fromMillisecondsSinceEpoch(u.createdAt)
              .toLocal()
              .toIso8601String(),
        ),
        _kv(
          context,
          'updatedAt',
          DateTime.fromMillisecondsSinceEpoch(u.updatedAt)
              .toLocal()
              .toIso8601String(),
        ),
      ],
    );
  }
}

class _SystemConfigPanel extends StatelessWidget {
  const _SystemConfigPanel({required this.config});
  final SystemConfig? config;

  @override
  Widget build(BuildContext context) {
    final c = config;
    if (c == null) {
      return const ListTile(title: Text('No system_config row yet'));
    }
    return Column(
      children: [
        _kv(context, 'available', c.available.toString()),
        if (c.unavailableReason != null)
          _kv(context, 'unavailableReason', c.unavailableReason!),
        if (c.estimatedBackOnline != null)
          _kv(context, 'estimatedBackOnline',
              DateTime.fromMillisecondsSinceEpoch(c.estimatedBackOnline!)
                  .toLocal()
                  .toIso8601String()),
        _kv(context, 'minAppVersion', c.minAppVersion),
        _kv(context, 'models.general', c.models.general),
        _kv(context, 'models.classifier', c.models.classifier),
        _kv(context, 'models.deep', c.models.deep),
        _kv(context, 'flags.pauseGoHighLevelSync',
            c.flags.pauseGoHighLevelSync.toString()),
        _kv(
          context,
          'updatedAt',
          DateTime.fromMillisecondsSinceEpoch(c.updatedAt)
              .toLocal()
              .toIso8601String(),
        ),
        _kv(context, 'updatedBy', c.updatedBy),
      ],
    );
  }
}

class _PersonasPanel extends StatelessWidget {
  const _PersonasPanel({required this.personas});
  final List<CoachPersona> personas;

  @override
  Widget build(BuildContext context) {
    if (personas.isEmpty) {
      return const ListTile(title: Text('No active personas'));
    }
    return Column(
      children: [
        for (final p in personas)
          ListTile(
            dense: true,
            title: Text('${p.name} · ${p.slug}'),
            subtitle: Text(p.shortDescriptor),
          ),
      ],
    );
  }
}

Widget _kv(BuildContext context, String k, String v) {
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 180,
          child: Text(
            k,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
          ),
        ),
        Expanded(
          child: Text(
            v,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ),
      ],
    ),
  );
}
