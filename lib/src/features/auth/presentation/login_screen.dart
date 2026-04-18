import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/theme_constants.dart';
import '../../../routing/app_routes.dart';
import '../data/fake_auth_notifier.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _submitting = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);
    await ref.read(fakeAuthProvider.notifier).requestLoginCode(_emailController.text);
    if (!mounted) return;
    setState(() => _submitting = false);
    context.goNamed(AppRoute.verifyCode.name);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: gap5, vertical: gap4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Welcome back', style: theme.textTheme.headlineLarge),
                const SizedBox(height: gap1),
                Text(
                  'Enter your email and we’ll send you a verification code.',
                  style: theme.textTheme.bodyMedium?.copyWith(color: twMuted),
                ),
                const SizedBox(height: gap5),
                TextFormField(
                  controller: _emailController,
                  decoration: const InputDecoration(labelText: 'Email address'),
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.done,
                  autofocus: true,
                  onFieldSubmitted: (_) => _submit(),
                  validator: _validateEmail,
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
                      : const Text('Send code'),
                ),
                const SizedBox(height: gap3),
                TextButton(
                  onPressed: () => context.goNamed(AppRoute.signup.name),
                  child: const Text('Need an account? Sign up'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

String? _validateEmail(String? value) {
  if (value == null || value.trim().isEmpty) return 'Email is required';
  final pattern = RegExp(r'^[\w.\-+]+@[\w\-]+\.[\w.\-]+$');
  if (!pattern.hasMatch(value.trim())) return 'Enter a valid email address';
  return null;
}
