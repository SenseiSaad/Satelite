import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms',
  description: `Plain language terms for ${site.name} early access.`,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="panel mx-auto max-w-3xl p-6 sm:p-10 lg:p-14">
        <p className="eyebrow">Terms</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Early access terms in plain language.
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-2 sm:text-base">
          <div>
            <h2 className="font-display text-lg tracking-tight text-ink">What this is</h2>
            <p className="mt-2">
              {site.name} is an early access product. Submitting the form asks us to contact you;
              it does not commit you to buy anything and it does not commit us to a delivery
              schedule.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg tracking-tight text-ink">No performance promises</h2>
            <p className="mt-2">
              We have not published accuracy figures yet. Any satellite-based summary is decision
              support, not a replacement for field checks or a professional assessment. Pilot
              partners agree on evaluation scope before any comparison work starts.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg tracking-tight text-ink">Pricing</h2>
            <p className="mt-2">
              Pricing has not been decided. It will be decided with the pilot group, and we
              discuss scope directly before any paid work.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg tracking-tight text-ink">Contact</h2>
            <p className="mt-2">
              Questions? Write to{' '}
              {site.email ? (
                <a className="border-b border-line pb-0.5 text-ink" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              ) : (
                'the contact address on our footer'
              )}
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
