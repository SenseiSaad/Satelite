'use client';

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

export const fieldClass =
  'w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink ' +
  'placeholder:text-ink-2/70 transition-colors duration-200 ' +
  'focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand';

export const invalidClass =
  'border-severe focus-visible:border-severe focus-visible:outline-severe';

export function FieldLabel({
  htmlFor,
  children,
  required,
  hint,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {children}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-severe">
            *
          </span>
        ) : null}
      </label>
      {hint ? <span className="font-mono text-[11px] text-ink-2">{hint}</span> : null}
    </div>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-xs font-medium text-severe">
      <span aria-hidden="true" className="mt-px">
        !
      </span>
      <span>{children}</span>
    </p>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  describedBy?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, describedBy, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(fieldClass, invalid && invalidClass, className)}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      {...rest}
    />
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  describedBy?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, describedBy, children, ...rest },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(fieldClass, 'appearance-none pr-10', invalid && invalidClass, className)}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        {...rest}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-ink-2"
      >
        <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  describedBy?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, describedBy, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(fieldClass, 'min-h-32 resize-y', invalid && invalidClass, className)}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      {...rest}
    />
  );
});
