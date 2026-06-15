'use client';
import { Monitor, Moon, Sun, Eye } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface ThemeSettingsProps {
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function ThemeSettings({ showLabels = true, orientation = 'vertical' }: ThemeSettingsProps) {
  const { theme, variant, setTheme, setVariant } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  const variantOptions = [
    { value: 'default', label: 'Default', icon: Eye },
    { value: 'high-contrast', label: 'High Contrast', icon: Eye },
  ] as const;

  const containerClass = orientation === 'horizontal' ? 'flex items-center gap-4' : 'space-y-4';

  return (
    <div className={containerClass}>
      {/* Theme Mode Selection */}
      <div className="space-y-2">
        {showLabels && (
          <label className="text-sm font-medium text-foreground block mb-2">Theme Mode</label>
        )}
        <div className="flex rounded-md border border-border p-1 gap-1">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              variant={theme === value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTheme(value)}
              className="flex items-center gap-2 flex-1"
            >
              <Icon className="h-4 w-4" />
              {showLabels && <span className="hidden sm:inline">{label}</span>}
            </Button>
          ))}
        </div>
      </div>

      {/* Theme Variant Selection */}
      <div className="space-y-2">
        {showLabels && (
          <label className="text-sm font-medium text-foreground block mb-2">Accessibility</label>
        )}
        <Select
          value={variant}
          onValueChange={(value: string) => setVariant(value as 'default' | 'high-contrast')}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {variantOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Compact version for headers/toolbars
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
      default:
        return Sun;
    }
  };

  const Icon = getIcon();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      aria-label="Toggle theme"
      className="h-8 w-8 p-0"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}