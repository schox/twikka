import 'package:convex_flutter/convex_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/branding/abstract_avatar.dart';
import '../../../core/branding/coach_palette.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/twikka_icons.dart';
import '../../../core/widgets/centered.dart';
import '../../../data/models/coach_persona.dart';
import '../../../data/providers/coach_personas_provider.dart';
import '../../../data/providers/current_coach_provider.dart' as convex_coach;

/// Coach picker. Used both as the post-OTP onboarding step and as
/// Settings → Coach for repeat use. Renders the six active personas with
/// AbstractAvatar fallbacks (per-coach palette + monogram) until Phase D
/// fills `coach_personas.avatarRefs` with real HeyGen photos.
class CoachPickerScreen extends ConsumerStatefulWidget {
  const CoachPickerScreen({super.key, this.onPicked});

  /// Called with the selected coach after the assignCoach mutation succeeds.
  /// If null the screen pops itself (for the Settings → Coach reuse case).
  final void Function(CoachPersona)? onPicked;

  @override
  ConsumerState<CoachPickerScreen> createState() => _CoachPickerScreenState();
}

class _CoachPickerScreenState extends ConsumerState<CoachPickerScreen> {
  String? _selectedId;
  bool _submitting = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    // Pre-select the user's current coach for the re-pick case.
    final current =
        ref.read(convex_coach.currentCoachPersonaProvider).asData?.value;
    _selectedId = current?.id;
  }

  Future<void> _submit(List<CoachPersona> personas) async {
    final id = _selectedId;
    if (id == null) return;
    final picked = personas.firstWhere((p) => p.id == id);

    setState(() {
      _submitting = true;
      _error = null;
    });

    try {
      await ConvexClient.instance.mutation(
        name: 'coachPersonas:assignCoach',
        args: {'coachPersonaId': id},
      );
    } catch (err) {
      if (!mounted) return;
      setState(() {
        _submitting = false;
        _error = 'Could not save your pick. Try again.';
      });
      return;
    }

    if (!mounted) return;
    setState(() => _submitting = false);

    final cb = widget.onPicked;
    if (cb != null) {
      cb(picked);
    } else if (Navigator.of(context).canPop()) {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final personasAsync = ref.watch(coachPersonasProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Choose your coach'),
        automaticallyImplyLeading: widget.onPicked == null,
      ),
      body: Centered.content(child: personasAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Couldn\u2019t load coaches: $err')),
        data: (personas) {
          if (personas.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(gap5),
                child: Text(
                  'No coaches available right now. Try again in a moment.',
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(gap5, gap2, gap5, gap3),
                child: Text(
                  'Each coach is an AI personality. We\u2019ve spent time training their voice, manner, and what they know.',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                ),
              ),
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.fromLTRB(gap4, 0, gap4, gap5),
                  itemCount: personas.length,
                  separatorBuilder: (_, _) => const SizedBox(height: gap3),
                  itemBuilder: (context, i) {
                    final p = personas[i];
                    final selected = p.id == _selectedId;
                    return _CoachCard(
                      persona: p,
                      selected: selected,
                      onTap: _submitting
                          ? null
                          : () => setState(() => _selectedId = p.id),
                    );
                  },
                ),
              ),
              if (_error != null)
                Padding(
                  padding: const EdgeInsets.fromLTRB(gap5, 0, gap5, gap2),
                  child: Text(
                    _error!,
                    style: theme.textTheme.bodyMedium
                        ?.copyWith(color: theme.colorScheme.error),
                    textAlign: TextAlign.center,
                  ),
                ),
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(gap5, 0, gap5, gap4),
                  child: SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _selectedId == null || _submitting
                          ? null
                          : () => _submit(personas),
                      child: _submitting
                          ? const SizedBox(
                              width: progressIndicatorSmall,
                              height: progressIndicatorSmall,
                              child:
                                  CircularProgressIndicator(strokeWidth: 2),
                            )
                          : Text(
                              _selectedId == null
                                  ? 'Choose a coach'
                                  : 'Continue with ${personas.firstWhere((p) => p.id == _selectedId).name}',
                            ),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      )),
    );
  }
}

class _CoachCard extends StatelessWidget {
  const _CoachCard({
    required this.persona,
    required this.selected,
    required this.onTap,
  });

  final CoachPersona persona;
  final bool selected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final palette = paletteForCoachSlug(persona.slug);
    return Material(
      color: selected ? context.tw.accentTint.withValues(alpha: 0.45) : theme.colorScheme.surface,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(gap3),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: selected
                  ? theme.colorScheme.primary
                  : theme.colorScheme.outlineVariant.withValues(alpha: 0.5),
              width: selected ? 1.5 : 1,
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              AbstractAvatar(
                palette: palette,
                monogram: coachInitial(persona.name),
                size: 64,
                ring: selected,
              ),
              const SizedBox(width: gap3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          persona.name,
                          style: theme.textTheme.titleMedium,
                        ),
                        const SizedBox(width: gap1),
                        Text(
                          _ageBandLabel(persona.ageBand),
                          style: theme.textTheme.labelMedium
                              ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      persona.shortDescriptor,
                      style: theme.textTheme.bodyMedium
                          ?.copyWith(color: context.tw.ink2),
                    ),
                    const SizedBox(height: gap1),
                    Text(
                      '\u201c${persona.introSample}\u201d',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ],
                ),
              ),
              if (selected)
                Padding(
                  padding: const EdgeInsets.only(left: gap2),
                  child: Icon(TwikkaIcons.checkCircle, color: theme.colorScheme.primary, size: 22),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

String _ageBandLabel(CoachAgeBand band) => switch (band) {
      CoachAgeBand.thirties => '· 30s',
      CoachAgeBand.fortyFives => '· 40s',
      CoachAgeBand.sixties => '· 60s',
      CoachAgeBand.seventies => '· 70s',
    };
