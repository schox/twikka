'use client';

import * as React from 'react';
import { cn } from '../utils';

export interface OtpInputProps {
  /** Number of digits (default: 6) */
  length?: number;
  /** Callback when all digits are entered */
  onComplete?: (code: string) => void;
  /** Callback when value changes */
  onChange?: (code: string) => void;
  /** Disable the input */
  disabled?: boolean;
  /** Show error state */
  error?: boolean;
  /** Auto focus first input on mount */
  autoFocus?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * OTP Input component with auto-advance between digits.
 * Supports paste, keyboard navigation, and OS autofill.
 */
export function OtpInput({
  length = 6,
  onComplete,
  onChange,
  disabled = false,
  error = false,
  autoFocus = true,
  className,
}: OtpInputProps) {
  const [values, setValues] = React.useState<string[]>(Array(length).fill(''));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  React.useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Handle value change
  const handleChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);

    const newValues = [...values];
    newValues[index] = digit;
    setValues(newValues);

    const code = newValues.join('');
    onChange?.(code);

    // Auto-advance to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete (all digits filled)
    if (newValues.every(v => v !== '')) {
      onComplete?.(newValues.join(''));
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

    if (pastedData.length > 0) {
      const newValues = [...values];
      for (let i = 0; i < pastedData.length; i++) {
        newValues[i] = pastedData[i];
      }
      setValues(newValues);

      const code = newValues.join('');
      onChange?.(code);

      // Focus last filled input or last input
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();

      // Check if complete (all digits filled)
      if (newValues.every(v => v !== '')) {
        onComplete?.(newValues.join(''));
      }
    }
  };

  // Handle keydown
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Backspace':
        if (!values[index] && index > 0) {
          // Move to previous input if current is empty
          inputRefs.current[index - 1]?.focus();
        } else {
          // Clear current input
          const newValues = [...values];
          newValues[index] = '';
          setValues(newValues);
          onChange?.(newValues.join(''));
        }
        break;

      case 'ArrowLeft':
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;

      case 'ArrowRight':
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        break;

      default:
        break;
    }
  };

  // Handle focus - select input content
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          className={cn(
            'w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold',
            'border rounded-lg bg-background',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-destructive ring-destructive/20 focus:ring-destructive focus:border-destructive'
              : 'border-input hover:border-primary/50',
          )}
        />
      ))}
    </div>
  );
}
