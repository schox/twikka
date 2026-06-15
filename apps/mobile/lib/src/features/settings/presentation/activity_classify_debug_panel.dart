import 'dart:convert';

import 'package:convex_flutter/convex_flutter.dart';
import 'package:flutter/material.dart';

import '../../../core/theme/twikka_icons.dart';

/// Tester-only panel for sending a phrase through the 5-step activity
/// classifier. Surfaces every branch of the resolver — user_alias /
/// global_alias / embedding / llm_match / llm_create / ambiguous —
/// so we can sanity-check the assumptions live.
class ActivityClassifyDebugPanel extends StatefulWidget {
  const ActivityClassifyDebugPanel({super.key});

  @override
  State<ActivityClassifyDebugPanel> createState() =>
      _ActivityClassifyDebugPanelState();
}

class _ActivityClassifyDebugPanelState
    extends State<ActivityClassifyDebugPanel> {
  final _controller = TextEditingController();
  bool _busy = false;
  Map<String, dynamic>? _result;
  String? _error;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _classify() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final raw = await ConvexClient.instance.action(
        name: 'activityClassifier:classify',
        args: {'phrase': text},
      );
      if (!mounted) return;
      setState(() {
        _result = jsonDecode(raw) as Map<String, dynamic>;
        _busy = false;
      });
    } catch (err) {
      if (!mounted) return;
      setState(() {
        _error = err.toString();
        _result = null;
        _busy = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Type something a user might say (e.g. "did the lawn", "morning loop", "spin class").',
            style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _controller,
                  decoration: const InputDecoration(
                    hintText: 'Phrase',
                    prefixIcon: Icon(TwikkaIcons.search),
                    isDense: true,
                  ),
                  textInputAction: TextInputAction.go,
                  onSubmitted: (_) => _classify(),
                  enabled: !_busy,
                ),
              ),
              const SizedBox(width: 8),
              FilledButton(
                onPressed: _busy ? null : _classify,
                child: _busy
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Classify'),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (_error != null)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Text(
                _error!,
                style: theme.textTheme.bodySmall
                    ?.copyWith(color: theme.colorScheme.error),
              ),
            ),
          if (_result != null) _ResultView(result: _result!),
        ],
      ),
    );
  }
}

class _ResultView extends StatelessWidget {
  const _ResultView({required this.result});
  final Map<String, dynamic> result;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final kind = result['kind'] as String;

    Widget badge(String label, Color bg) => Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(999),
          ),
          child: Text(label,
              style: theme.textTheme.labelSmall
                  ?.copyWith(fontWeight: FontWeight.w600)),
        );

    final origin = result['origin'] as String?;
    final color = switch (kind) {
      'resolved' => Colors.green.withValues(alpha: 0.15),
      'ambiguous' => Colors.orange.withValues(alpha: 0.18),
      'new' => Colors.blue.withValues(alpha: 0.18),
      _ => theme.colorScheme.errorContainer,
    };

    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest
            .withValues(alpha: 0.4),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              badge(kind.toUpperCase(), color),
              if (origin != null) ...[
                const SizedBox(width: 6),
                badge(origin, theme.colorScheme.surfaceContainerHigh),
              ],
            ],
          ),
          const SizedBox(height: 8),
          if (kind == 'resolved' || kind == 'new') _resolvedBody(theme),
          if (kind == 'ambiguous') _ambiguousBody(theme),
          if (kind == 'error')
            Text(
              result['error'] as String? ?? 'unknown error',
              style: theme.textTheme.bodyMedium
                  ?.copyWith(color: theme.colorScheme.error),
            ),
        ],
      ),
    );
  }

  Widget _resolvedBody(ThemeData theme) {
    final name = result['name'] as String? ?? '?';
    final mets = result['mets'];
    final heading = result['headingName'] as String? ?? '';
    final score = result['score'];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(name,
            style: theme.textTheme.bodyLarge
                ?.copyWith(fontWeight: FontWeight.w600)),
        const SizedBox(height: 2),
        Text(
          [
            if (mets != null) '$mets METs',
            heading,
            if (score != null) 'score ${(score as num).toStringAsFixed(3)}',
          ].join(' · '),
          style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
        ),
      ],
    );
  }

  Widget _ambiguousBody(ThemeData theme) {
    final candidates =
        (result['candidates'] as List<dynamic>).cast<Map<String, dynamic>>();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Top candidates:', style: theme.textTheme.bodyMedium),
        const SizedBox(height: 4),
        for (final c in candidates)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: Text(
              '${c['name']}  ·  score ${(c['score'] as num).toStringAsFixed(3)}',
              style: theme.textTheme.bodySmall,
            ),
          ),
      ],
    );
  }
}
