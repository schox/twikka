import 'theme_variant.dart';
import 'variants/classic.dart';
import 'variants/warm_coach.dart';

/// Single registry of every Twikka theme variant.
///
/// To add a variant: drop a new file under `variants/`, export a
/// `const ThemeVariant`, and add it to [twikkaThemeVariants]. Order
/// here is the order the picker shows in Settings → Preferences.
///
/// [defaultThemeVariant] is the variant a fresh user lands on. The
/// theme controller falls back to this when SharedPreferences is
/// empty or holds an unknown id.
const List<ThemeVariant> twikkaThemeVariants = [
  classicVariant,
  warmCoachVariant,
];

const ThemeVariant defaultThemeVariant = classicVariant;

ThemeVariant themeVariantById(String? id) {
  if (id == null) return defaultThemeVariant;
  return twikkaThemeVariants.firstWhere(
    (v) => v.id == id,
    orElse: () => defaultThemeVariant,
  );
}
