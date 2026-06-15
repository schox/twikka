import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');
  });

  it('applies size classes correctly', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button', { name: /large button/i });
    expect(button).toHaveClass('h-10', 'px-6');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toHaveClass('custom-class');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Clickable</Button>);
    const button = screen.getByRole('button', { name: /clickable/i });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/link">Link Button</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/link');
    expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });

  it('supports all button variants', () => {
    const variants = ['default', 'destructive', 'secondary', 'outline', 'ghost', 'link'] as const;

    variants.forEach(variant => {
      render(
        <Button variant={variant} data-testid={variant}>
          {variant}
        </Button>,
      );
      const button = screen.getByTestId(variant);
      expect(button).toBeInTheDocument();
    });
  });

  it('supports all button sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    sizes.forEach(size => {
      render(
        <Button size={size} data-testid={size}>
          {size}
        </Button>,
      );
      const button = screen.getByTestId(size);
      expect(button).toBeInTheDocument();
    });
  });

  it('maintains proper focus styles', () => {
    render(<Button>Focus Me</Button>);
    const button = screen.getByRole('button', { name: /focus me/i });
    expect(button).toHaveClass('focus-visible:ring-ring/50');
  });

  it('includes data-slot attribute', () => {
    render(<Button>Slotted</Button>);
    const button = screen.getByRole('button', { name: /slotted/i });
    expect(button).toHaveAttribute('data-slot', 'button');
  });
});
