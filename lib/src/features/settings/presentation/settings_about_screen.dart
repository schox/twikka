import 'package:flutter/material.dart';

class SettingsAboutScreen extends StatelessWidget {
  const SettingsAboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('About')),
      body: ListView(
        children: const [
          ListTile(
            leading: Icon(Icons.tag),
            title: Text('Version'),
            subtitle: Text('1.0.0 (1) — shell preview'),
          ),
          ListTile(
            leading: Icon(Icons.description_outlined),
            title: Text('Terms of service'),
          ),
          ListTile(
            leading: Icon(Icons.privacy_tip_outlined),
            title: Text('Privacy policy'),
          ),
          ListTile(
            leading: Icon(Icons.support_outlined),
            title: Text('Support'),
            subtitle: Text('hello@twikka.com'),
          ),
        ],
      ),
    );
  }
}
