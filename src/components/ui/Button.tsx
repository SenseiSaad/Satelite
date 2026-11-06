import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'onInk';

const styles: Record<Variant, string> = {
  primary:
    'bg-brand text-brand-contrast hover:bg-brand-strong border border-brand hover:border-brand-strong',
  secondary: 'bg-surface text-ink border border-ink/15 hover:border-ink/35 hover:bg-surface-2',
  onInk: 'bg-page text-ink border border-page hover:bg-surface',
};

/** Shared button styling, also used on anchor elements. */
export function buttonClass(variant: Variant = 'primary', className?: string): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3',
    'font-sans text-sm font-medium leading-none tracking-tight',
    'transition-colors duration-200 ease-entrance',
    'disabled:cursor-not-allowed disabled:opacity-60',
    styles[variant],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />;
}
