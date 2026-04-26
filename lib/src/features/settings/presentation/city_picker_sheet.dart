import 'dart:async';
import 'dart:convert';

import 'package:convex_flutter/convex_flutter.dart';
import 'package:flutter/material.dart';

import '../../../core/theme/theme_constants.dart';
import '../../../core/theme/twikka_icons.dart';

/// Result row from `cities:search` — kept lean (we don't need lat/long
/// in the picker).
class _CitySearchResult {
  const _CitySearchResult({
    required this.id,
    required this.name,
    required this.countryCode,
    required this.timezone,
  });
  final String id;
  final String name;
  final String countryCode;
  final String timezone;

  factory _CitySearchResult.fromJson(Map<String, dynamic> j) =>
      _CitySearchResult(
        id: j['_id'] as String,
        name: j['name'] as String,
        countryCode: j['countryCode'] as String,
        timezone: j['timezone'] as String,
      );
}

/// Modal bottom sheet that searches the cities table as the user types
/// and returns the selected city's id when one is tapped. Caller is
/// responsible for firing the setForCurrentUser mutation.
Future<String?> showCityPickerSheet(BuildContext context) {
  return showModalBottomSheet<String>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (ctx) => const _CityPickerSheet(),
  );
}

class _CityPickerSheet extends StatefulWidget {
  const _CityPickerSheet();

  @override
  State<_CityPickerSheet> createState() => _CityPickerSheetState();
}

class _CityPickerSheetState extends State<_CityPickerSheet> {
  final _controller = TextEditingController();
  Timer? _debounce;
  List<_CitySearchResult> _results = const [];
  bool _loading = false;
  String? _lastQuery;

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  void _onChanged(String q) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 220), () => _search(q));
  }

  Future<void> _search(String q) async {
    final trimmed = q.trim();
    _lastQuery = trimmed;
    if (trimmed.isEmpty) {
      setState(() {
        _results = const [];
        _loading = false;
      });
      return;
    }
    setState(() => _loading = true);
    try {
      final raw = await ConvexClient.instance.query(
        'cities:search',
        {'q': trimmed, 'limit': 20},
      );
      // Drop late results: if the user kept typing, ignore stale answers.
      if (!mounted || _lastQuery != trimmed) return;
      final list = (jsonDecode(raw) as List<dynamic>)
          .map((e) => _CitySearchResult.fromJson(e as Map<String, dynamic>))
          .toList();
      setState(() {
        _results = list;
        _loading = false;
      });
    } catch (_) {
      if (!mounted || _lastQuery != trimmed) return;
      setState(() {
        _results = const [];
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final padding = MediaQuery.viewInsetsOf(context).bottom;
    return Padding(
      padding: EdgeInsets.only(bottom: padding),
      child: SizedBox(
        height: MediaQuery.sizeOf(context).height * 0.7,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(gap4, gap2, gap4, gap2),
              child: Text(
                'Where are you based?',
                style: theme.textTheme.titleLarge,
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(gap4, 0, gap4, gap3),
              child: TextField(
                controller: _controller,
                autofocus: true,
                textInputAction: TextInputAction.search,
                onChanged: _onChanged,
                decoration: const InputDecoration(
                  hintText: 'City, town, country code…',
                  prefixIcon: Icon(TwikkaIcons.search),
                ),
              ),
            ),
            Expanded(child: _buildBody(theme)),
          ],
        ),
      ),
    );
  }

  Widget _buildBody(ThemeData theme) {
    if (_loading && _results.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_controller.text.trim().isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(gap4),
          child: Text(
            'Start typing to find your city.',
            style: theme.textTheme.bodyMedium?.copyWith(color: twMuted),
          ),
        ),
      );
    }
    if (_results.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(gap4),
          child: Text(
            'No matches. Try a different spelling.',
            style: theme.textTheme.bodyMedium?.copyWith(color: twMuted),
          ),
        ),
      );
    }
    return ListView.separated(
      itemCount: _results.length,
      separatorBuilder: (_, _) => const Divider(height: 1),
      itemBuilder: (ctx, i) {
        final r = _results[i];
        return ListTile(
          dense: true,
          title: Text(r.name),
          subtitle: Text('${r.countryCode} \u00b7 ${r.timezone}'),
          onTap: () => Navigator.of(ctx).pop(r.id),
        );
      },
    );
  }
}
