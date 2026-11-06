'use client';

import { useState } from 'react';
import { useForm, type DefaultValues, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from './ui/Button';
import { FieldError, FieldLabel, Input, Select, Textarea } from './ui/Field';
import { EASE } from './Reveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import {
  cropOptions,
  earlyAccessSchema,
  hectareLabels,
  hectareRanges,
  organizationTypeLabels,
  organizationTypes,
  type EarlyAccessInput,
} from '@/lib/schemas';

type Status = 'idle' | 'submitting' | 'saving' | 'success' | 'error';

interface ServerFields {
  fields?: Record<string, string>;
  error?: string;
}

/**
 * Fresh form values. Called once on mount and again after a reset, so the
 * timing field always reflects the moment the form became interactive.
 */
function freshValues(): DefaultValues<EarlyAccessInput> {
  return {
    fullName: '',
    email: '',
    organization: '',
    regionOfInterest: '',
    cropsOfInterest: [],
    useCase: '',
    consent: false,
    honeypot: '',
    formStartedAt: Date.now(),
  };
}

const cropLabels: Record<string, string> = {
  cotton: 'Cotton',
  wheat: 'Wheat',
  rice: 'Rice',
  maize: 'Maize',
  sugarcane: 'Sugarcane',
  soybean: 'Soybean',
  other: 'Other',
};

export function EarlyAccessForm() {
  const reduce = useReducedMotionSafe();
  const [status, setStatus] = useState<Status>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [duplicate, setDuplicate] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EarlyAccessInput>({
    resolver: zodResolver(earlyAccessSchema),
    mode: 'onTouched',
    defaultValues: freshValues(),
  });

  const onSubmit = async (values: EarlyAccessInput): Promise<void> => {
    setStatus('submitting');
    setServerMessage('');

    // formStartedAt was stamped by freshValues() when the form was created.
    const payload: EarlyAccessInput = values;

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ServerFields & {
        ok?: boolean;
        duplicate?: boolean;
      };

      if (response.ok && data.ok) {
        setDuplicate(Boolean(data.duplicate));
        // Keep a short "saving" beat so the handoff to the confirmation panel
        // feels deliberate rather than instant.
        setStatus('saving');
        window.setTimeout(() => setStatus('success'), reduce ? 600 : 2500);
        return;
      }

      if (response.status === 400 && data.fields) {
        for (const [key, message] of Object.entries(data.fields)) {
          setError(key as FieldPath<EarlyAccessInput>, { type: 'server', message });
        }
        setServerMessage('Some fields need another look.');
        setStatus('error');
        return;
      }

      if (response.status === 429) {
        setServerMessage('Too many attempts from this network. Wait a minute and try again.');
        setStatus('error');
        return;
      }

      setServerMessage('Something went wrong on our side. Please try again later.');
      setStatus('error');
    } catch {
      setServerMessage('The request did not reach us. Check your connection and try again.');
      setStatus('error');
    }
  };

  const onReset = (): void => {
    reset(freshValues());
    setStatus('idle');
    setServerMessage('');
    setDuplicate(false);
  };

  const fieldError = (name: FieldPath<EarlyAccessInput>): string | undefined => {
    const bag = errors as unknown as Record<
      string,
      { message?: string } | Array<{ message?: string }> | undefined
    >;
    const entry = bag[name];
    if (Array.isArray(entry)) return entry[0]?.message;
    return entry?.message;
  };

  const successPanel = (
    <motion.div
      key="success"
      role="status"
      aria-live="polite"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="rounded-[1.25rem] border border-line bg-surface-2 p-6 sm:p-8"
    >
      <span className="mono-label text-brand">
        {duplicate ? 'Request already received' : 'Request confirmed'}
      </span>
      <h3 className="mt-3 font-display text-2xl tracking-tight text-ink">
        {duplicate
          ? 'This email has already been submitted.'
          : 'Your form has been saved.'}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-2 sm:text-base">
        {duplicate
          ? 'You are on our list. We will contact you at this address when it is your turn.'
          : 'You will be contacted shortly at the email address you provided. Everything is set up on our side; we are just iterating on the final changes.'}
      </p>

      <div className="mt-6 border-t border-line pt-5">
        <span className="mono-label text-ink-2">If we explore a pilot</span>
        <ul className="mt-3 space-y-2.5">
          {[
            'We discuss your use case, region and crops.',
            'We agree on an evaluation scope before any field data is shared.',
          ].map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-2">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink transition-colors duration-200 hover:border-ink/30"
      >
        Submit another response
      </button>
    </motion.div>
  );

  const formPanel = (
    <motion.form
      key="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      initial={false}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-[1.25rem] border border-line bg-surface p-5 sm:p-7"
      aria-label="Early access request"
    >
      {/* Spam trap, hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('honeypot')}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <FieldLabel htmlFor="fullName" required>
            Full name
          </FieldLabel>
          <Input
            id="fullName"
            autoComplete="name"
            invalid={Boolean(errors.fullName)}
            describedBy={errors.fullName ? 'fullName-error' : undefined}
            {...register('fullName')}
          />
          <FieldError id="fullName-error">{fieldError('fullName')}</FieldError>
        </div>

        <div className="sm:col-span-1">
          <FieldLabel htmlFor="email" required hint="work address">
            Work email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            describedBy={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          <FieldError id="email-error">{fieldError('email')}</FieldError>
        </div>

        <div className="sm:col-span-1">
          <FieldLabel htmlFor="organization" required>
            Company or organization
          </FieldLabel>
          <Input
            id="organization"
            autoComplete="organization"
            invalid={Boolean(errors.organization)}
            describedBy={errors.organization ? 'organization-error' : undefined}
            {...register('organization')}
          />
          <FieldError id="organization-error">{fieldError('organization')}</FieldError>
        </div>

        <div className="sm:col-span-1">
          <FieldLabel htmlFor="organizationType" required>
            Organization type
          </FieldLabel>
          <Select
            id="organizationType"
            invalid={Boolean(errors.organizationType)}
            describedBy={errors.organizationType ? 'organizationType-error' : undefined}
            {...register('organizationType')}
          >
            <option value="">Select one</option>
            {organizationTypes.map((type) => (
              <option key={type} value={type}>
                {organizationTypeLabels[type]}
              </option>
            ))}
          </Select>
          <FieldError id="organizationType-error">{fieldError('organizationType')}</FieldError>
        </div>

        <div className="sm:col-span-1">
          <FieldLabel htmlFor="regionOfInterest" required>
            Region of interest
          </FieldLabel>
          <Input
            id="regionOfInterest"
            placeholder="District, province or country"
            invalid={Boolean(errors.regionOfInterest)}
            describedBy={errors.regionOfInterest ? 'regionOfInterest-error' : undefined}
            {...register('regionOfInterest')}
          />
          <FieldError id="regionOfInterest-error">{fieldError('regionOfInterest')}</FieldError>
        </div>

        <div className="sm:col-span-1">
          <FieldLabel htmlFor="hectares" required hint="approximate">
            Approximate land area
          </FieldLabel>
          <Select
            id="hectares"
            invalid={Boolean(errors.hectares)}
            describedBy={errors.hectares ? 'hectares-error' : undefined}
            {...register('hectares')}
          >
            <option value="">Select a range</option>
            {hectareRanges.map((range) => (
              <option key={range} value={range}>
                {hectareLabels[range]}
              </option>
            ))}
          </Select>
          <FieldError id="hectares-error">{fieldError('hectares')}</FieldError>
        </div>

        <fieldset
          className="sm:col-span-2"
          aria-describedby={errors.cropsOfInterest ? 'cropsOfInterest-error' : undefined}
        >
          <legend className="mb-2 text-sm font-medium text-ink">
            Crops of interest
            <span aria-hidden="true" className="ml-1 text-severe">
              *
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {cropOptions.map((crop) => (
              <label key={crop} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  value={crop}
                  {...register('cropsOfInterest')}
                />
                <span className="inline-flex rounded-full border border-line bg-white px-3.5 py-2 text-sm text-ink transition-colors duration-200 peer-checked:border-brand peer-checked:bg-brand peer-checked:text-brand-contrast peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
                  {cropLabels[crop] ?? crop}
                </span>
              </label>
            ))}
          </div>
          <FieldError id="cropsOfInterest-error">{fieldError('cropsOfInterest')}</FieldError>
        </fieldset>

        <div className="sm:col-span-2">
          <FieldLabel htmlFor="useCase" required hint="a couple of sentences">
            What would you use it for?
          </FieldLabel>
          <Textarea
            id="useCase"
            rows={4}
            placeholder="Claims verification, loan monitoring, flood assessment..."
            invalid={Boolean(errors.useCase)}
            describedBy={errors.useCase ? 'useCase-error' : undefined}
            {...register('useCase')}
          />
          <FieldError id="useCase-error">{fieldError('useCase')}</FieldError>
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
              aria-describedby={errors.consent ? 'consent-error' : undefined}
              {...register('consent')}
            />
            <span className="text-sm leading-relaxed text-ink-2">
              You may contact me about early access by email. I can ask to be removed at any time.
              <span aria-hidden="true" className="ml-1 text-severe">
                *
              </span>
            </span>
          </label>
          <FieldError id="consent-error">{fieldError('consent')}</FieldError>
        </div>
      </div>

      <div
        role="status"
        aria-live="polite"
        className="mt-5 min-h-[1.25rem] text-sm text-severe"
      >
        {status === 'saving' ? 'Saving your request, do not close this page...' : serverMessage}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={isSubmitting || status === 'saving'}>
          {isSubmitting || status === 'saving'
            ? 'Saving your details...'
            : 'Request early access'}
        </Button>
        <span className="font-mono text-[11px] text-ink-2">
          One reply from a person, no mailing list.
        </span>
      </div>
    </motion.form>
  );

  return (
    <div className={cn('relative')}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? successPanel : formPanel}
      </AnimatePresence>
    </div>
  );
}
