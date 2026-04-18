import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/theme_constants.dart';
import '../../../routing/app_routes.dart';
import '../data/auth_state.dart';
import '../data/fake_auth_notifier.dart';

class VerifyCodeScreen extends ConsumerStatefulWidget {
  const VerifyCodeScreen({super.key});

  @override
  ConsumerState<VerifyCodeScreen> createState() => _VerifyCodeScreenState();
}

class _VerifyCodeScreenState extends ConsumerState<VerifyCodeScreen> {
  final _codeController = TextEditingController();
  bool _submitting = false;
  String? _errorText;

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _submitting = true;
      _errorText = null;
    });
    final ok = await ref.read(fakeAuthProvider.notifier).verifyCode(_codeController.text);
    if (!mounted) return;
    setState(() => _submitting = false);
    if (!ok) {
      setState(() => _errorText = 'Enter the 6-digit code from your email.');
    }
  }

  void _resend() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('A new code is on the way (pretend).')),
    );
  }

  Future<void> _changeEmail() async {
    await ref.read(fakeAuthProvider.notifier).cancelCodeEntry();
    if (!mounted) return;
    context.goNamed(AppRoute.welcome.name);
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(fakeAuthProvider);
    final email = state is AuthAwaitingCode ? state.email : '';
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: gap5, vertical: gap4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Check your email', style: theme.textTheme.headlineLarge),
              const SizedBox(height: gap1),
              Text.rich(
                TextSpan(
                  style: theme.textTheme.bodyMedium?.copyWith(color: twMuted),
                  children: [
                    const TextSpan(text: 'We sent a 6-digit code to '),
                    TextSpan(
                      text: email,
                      style: const TextStyle(fontWeight: FontWeight.w600, color: twInk),
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
                  errorText: _errorText,
                  counterText: '',
                ),
                keyboardType: TextInputType.number,
                maxLength: 6,
                textAlign: TextAlign.center,
                style: theme.textTheme.headlineSmall?.copyWith(letterSpacing: 8),
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                autofocus: true,
                onSubmitted: (_) => _submit(),
              ),
              const SizedBox(height: gap5),
              FilledButton(
                onPressed: _submitting ? null : _submit,
                child: _submitting
                    ? const SizedBox(
                        width: progressIndicatorSmall,
                        height: progressIndicatorSmall,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Verify'),
              ),
              const SizedBox(height: gap3),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(onPressed: _resend, child: const Text('Resend code')),
                  TextButton(onPressed: _changeEmail, child: const Text('Use a different email')),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
