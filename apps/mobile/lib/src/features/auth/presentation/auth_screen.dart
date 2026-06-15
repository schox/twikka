import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/theme/twikka_icons.dart';
import '../data/auth_state.dart';
import '../data/clerk_auth_notifier.dart';

/// Single morphing auth screen — replaces the four-step welcome / login /
/// signup / verify flow with one stateful page that animates between
/// `email` → (probe) → `name` (only for new users) → `code` → in.
class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

enum _Step { email, name, code }

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _emailController = TextEditingController();
  final _nameController = TextEditingController();
  final _codeController = TextEditingController();

  late _Step _step;
  bool _busy = false;
  String? _emailError;
  String? _nameError;
  String? _codeError;

  @override
  void initState() {
    super.initState();
    final auth = ref.read(clerkAuthProvider);
    if (auth is AuthAwaitingCode) {
      _emailController.text = auth.email;
      _nameController.text = auth.pendingDisplayName ?? '';
      _step = _Step.code;
    } else {
      _step = _Step.email;
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _nameController.dispose();
    _codeController.dispose();
    super.dispose();
  }

  // ── Step transitions ───────────────────────────────────────────────

  Future<void> _submitEmail() async {
    final email = _emailController.text.trim();
    if (!_isValidEmail(email)) {
      setState(() => _emailError = 'Enter a valid email address');
      return;
    }
    setState(() {
      _emailError = null;
      _busy = true;
    });

    final notifier = ref.read(clerkAuthProvider.notifier);
    final probe = await notifier.probeEmail(email);
    if (!mounted) return;

    if (!probe.ok) {
      setState(() {
        _busy = false;
        _emailError = probe.errorMessage;
      });
      return;
    }

    if (probe.exists) {
      // Existing user: skip name, request code now.
      final result = await notifier.requestLoginCode(email);
      if (!mounted) return;
      setState(() {
        _busy = false;
        _emailError = result.ok ? null : result.errorMessage;
        if (result.ok) _step = _Step.code;
      });
    } else {
      setState(() {
        _busy = false;
        _step = _Step.name;
      });
    }
  }

  Future<void> _submitName() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      setState(() => _nameError = 'Your name helps your coach');
      return;
    }
    setState(() {
      _nameError = null;
      _busy = true;
    });

    final result = await ref.read(clerkAuthProvider.notifier).requestSignupCode(
          email: _emailController.text.trim(),
          displayName: name,
        );
    if (!mounted) return;
    setState(() {
      _busy = false;
      if (result.ok) {
        _step = _Step.code;
      } else {
        _nameError = result.errorMessage;
      }
    });
  }

  Future<void> _submitCode() async {
    if (_busy) return;
    final code = _codeController.text.trim();
    setState(() {
      _busy = true;
      _codeError = null;
    });

    final result = await ref.read(clerkAuthProvider.notifier).verifyCode(code);
    if (!mounted) return;
    setState(() {
      _busy = false;
      _codeError = result.ok ? null : result.errorMessage;
    });
  }

  Future<void> _resendCode() async {
    if (_busy) return;
    setState(() => _busy = true);
    final result = await ref.read(clerkAuthProvider.notifier).resendCode();
    if (!mounted) return;
    setState(() {
      _busy = false;
      _codeError = null;
    });
    final messenger = ScaffoldMessenger.of(context);
    messenger.showSnackBar(
      SnackBar(
        content: Text(result.ok
            ? 'Fresh code sent — check your email.'
            : (result.errorMessage ?? 'Could not resend.')),
      ),
    );
  }

  Future<void> _useDifferentEmail() async {
    await ref.read(clerkAuthProvider.notifier).cancelCodeEntry();
    if (!mounted) return;
    setState(() {
      _codeController.clear();
      _nameController.clear();
      _codeError = null;
      _nameError = null;
      _emailError = null;
      _step = _Step.email;
    });
  }

  // ── UI ─────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: kFormMaxWidth),
            child: Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: gap5, vertical: gap4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (_step == _Step.email)
                    const Spacer()
                  else
                    const SizedBox(height: gap4),
                  const Center(child: _BrandMark()),
                  const SizedBox(height: gap4),
                  Expanded(
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 220),
                      switchInCurve: Curves.easeOut,
                      switchOutCurve: Curves.easeIn,
                      child: KeyedSubtree(
                        key: ValueKey<_Step>(_step),
                        child: switch (_step) {
                          _Step.email => _buildEmail(theme),
                          _Step.name => _buildName(theme),
                          _Step.code => _buildCode(theme),
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: gap5),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEmail(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Twikka',
            textAlign: TextAlign.center,
            style: theme.textTheme.displayMedium?.copyWith(color: theme.colorScheme.onSurface)),
        const SizedBox(height: gap2),
        Text(
          'A coach in your corner. Quietly there. No streaks, no shouting.',
          textAlign: TextAlign.center,
          style: theme.textTheme.bodyLarge?.copyWith(color: context.tw.ink2, height: 1.5),
        ),
        const SizedBox(height: gap1),
        Text(
          'Coaches are AI personas trained by our expert team.',
          textAlign: TextAlign.center,
          style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
        ),
        const SizedBox(height: gap5),
        TextField(
          controller: _emailController,
          decoration: InputDecoration(
            labelText: 'Email address',
            errorText: _emailError,
          ),
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.done,
          autofocus: true,
          onSubmitted: (_) => _submitEmail(),
          enabled: !_busy,
        ),
        const SizedBox(height: gap4),
        FilledButton(
          onPressed: _busy ? null : _submitEmail,
          child: _busy
              ? const _ButtonSpinner()
              : const Text('Continue'),
        ),
      ],
    );
  }

  Widget _buildName(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Make yourself at home',
            style: theme.textTheme.headlineLarge),
        const SizedBox(height: gap1),
        Text(
          'We’ll email a 6-digit code to verify it’s you. No password needed.',
          style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
        ),
        const SizedBox(height: gap5),
        _LockedEmailRow(
          email: _emailController.text.trim(),
          onChange: _useDifferentEmail,
        ),
        const SizedBox(height: gap4),
        TextField(
          controller: _nameController,
          decoration: InputDecoration(
            labelText: 'Your name',
            errorText: _nameError,
          ),
          textInputAction: TextInputAction.done,
          autofocus: true,
          onSubmitted: (_) => _submitName(),
          enabled: !_busy,
        ),
        const SizedBox(height: gap4),
        FilledButton(
          onPressed: _busy ? null : _submitName,
          child: _busy ? const _ButtonSpinner() : const Text('Send code'),
        ),
      ],
    );
  }

  Widget _buildCode(ThemeData theme) {
    final email = _emailController.text.trim();
    // True if this is a sign-up flow (signed up via name step), false on
    // sign-in (probe found existing user). Read from the live AuthState so
    // we render correctly on cold-start when a SignUp/SignIn was persisted.
    final auth = ref.watch(clerkAuthProvider);
    final isSignup =
        auth is AuthAwaitingCode ? auth.isSignup : false;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(
              horizontal: gap2, vertical: gap1),
          decoration: BoxDecoration(
            color: context.tw.accentTint.withValues(alpha: 0.5),
            borderRadius: BorderRadius.circular(999),
          ),
          alignment: Alignment.center,
          child: Text(
            isSignup ? 'Creating your account' : 'Welcome back',
            textAlign: TextAlign.center,
            style: theme.textTheme.labelMedium?.copyWith(
              color: theme.colorScheme.primary,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.4,
            ),
          ),
        ),
        const SizedBox(height: gap3),
        Text(
          isSignup ? 'Almost there' : 'Just verifying it\u2019s you',
          style: theme.textTheme.headlineLarge,
        ),
        const SizedBox(height: gap1),
        Text.rich(
          TextSpan(
            style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
            children: [
              const TextSpan(text: 'We sent a 6-digit code to '),
              TextSpan(
                text: email,
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const TextSpan(text: '.'),
            ],
          ),
        ),
        const SizedBox(height: gap5),
        TextField(
          controller: _codeController,
          decoration: InputDecoration(
            labelText: '6-digit code',
            errorText: _codeError,
            counterText: '',
          ),
          keyboardType: TextInputType.number,
          maxLength: 6,
          textAlign: TextAlign.center,
          style: theme.textTheme.headlineSmall?.copyWith(letterSpacing: 8),
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          autofocus: true,
          onSubmitted: (_) => _submitCode(),
          enabled: !_busy,
        ),
        const SizedBox(height: gap4),
        FilledButton(
          onPressed: _busy ? null : _submitCode,
          child: _busy
              ? const _ButtonSpinner()
              : Text(isSignup ? 'Verify and continue' : 'Sign in'),
        ),
        const SizedBox(height: gap2),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            TextButton(
              onPressed: _busy ? null : _resendCode,
              child: const Text('Resend code'),
            ),
            TextButton(
              onPressed: _busy ? null : _useDifferentEmail,
              child: const Text('Use a different email'),
            ),
          ],
        ),
      ],
    );
  }

  static bool _isValidEmail(String value) {
    if (value.isEmpty) return false;
    final pattern = RegExp(r'^[\w.\-+]+@[\w\-]+\.[\w.\-]+$');
    return pattern.hasMatch(value);
  }
}

class _BrandMark extends StatelessWidget {
  const _BrandMark();

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'assets/icons/twikka_icon_nbg.png',
      width: 72,
      height: 72,
      semanticLabel: 'Twikka',
    );
  }
}

class _LockedEmailRow extends StatelessWidget {
  const _LockedEmailRow({required this.email, required this.onChange});

  final String email;
  final VoidCallback onChange;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: gap3, vertical: gap2),
      decoration: BoxDecoration(
        color: context.tw.accentTint.withValues(alpha: 0.4),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(
            TwikkaIcons.email,
            size: 18,
            color: theme.colorScheme.onSurfaceVariant,
          ),
          const SizedBox(width: gap2),
          Expanded(
            child: Text(
              email,
              style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurface),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          TextButton(
            onPressed: onChange,
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: gap2),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: const Text('Change'),
          ),
        ],
      ),
    );
  }
}

class _ButtonSpinner extends StatelessWidget {
  const _ButtonSpinner();

  @override
  Widget build(BuildContext context) {
    return const SizedBox(
      width: progressIndicatorSmall,
      height: progressIndicatorSmall,
      child: CircularProgressIndicator(strokeWidth: 2),
    );
  }
}
