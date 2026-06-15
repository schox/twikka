import { cn } from '../utils';
import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn('text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight', className)}>
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn('text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight', className)}>
      {children}
    </h2>
  );
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn('text-lg md:text-xl lg:text-2xl font-semibold', className)}>{children}</h3>
  );
}

export function H4({ children, className }: TypographyProps) {
  return <h4 className={cn('text-base md:text-lg font-semibold', className)}>{children}</h4>;
}

export function P({ children, className }: TypographyProps) {
  return <p className={cn('text-sm md:text-base leading-relaxed', className)}>{children}</p>;
}

export function Small({ children, className }: TypographyProps) {
  return (
    <small className={cn('text-xs md:text-sm text-muted-foreground', className)}>{children}</small>
  );
}

export function Lead({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-base md:text-lg lg:text-xl text-muted-foreground', className)}>
      {children}
    </p>
  );
}
