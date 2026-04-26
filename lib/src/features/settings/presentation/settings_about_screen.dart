import 'package:flutter/material.dart';

import '../../../core/theme/twikka_icons.dart';

class SettingsAboutScreen extends StatelessWidget {
  const SettingsAboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('About')),
      body: ListView(
        children: const [
          ListTile(
            leading: Icon(TwikkaIcons.appVersion),
            title: Text('Version'),
            subtitle: Text('1.0.0 (1) — shell preview'),
          ),
          ListTile(
            leading: Icon(TwikkaIcons.docs),
            title: Text('Terms of service'),
          ),
          ListTile(
            leading: Icon(TwikkaIcons.privacy),
            title: Text('Privacy policy'),
          ),
          ListTile(
            leading: Icon(TwikkaIcons.support),
            title: Text('Support'),
            subtitle: Text('hello@twikka.com'),
          ),
        ],
      ),
    );
  }
}
