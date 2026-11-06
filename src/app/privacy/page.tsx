import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy',
  description: `What ${site.name} collects through the early-access form and how it is used.`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="panel mx-auto max-w-3xl p-6 sm:p-10 lg:p-14">
        <p className="eyebrow">Privacy</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Plain language, no surprises.
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-2 sm:text-base">
          <div>
            <h2 className="font-display text-lg tracking-tight text-ink">What we collect</h2>
            <p className="mt-2">
              We only receive what you type into the early-access form: your name, work email,
              organization, region, crops, approximate area and use case. Nothing else, and we
              do not use tracking cookies.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg tracking-tight text-ink">Why we collect it</h2>
            <p className="mt-2">
              To contact you about early access and the pilot group. We reply from{' '}
              {site.email ? site.email : 'the contact address on our footer'}.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg tracking-tight text-ink">How your request is saved</h2>
            <p className="mt-2">
              When you submit the form it is saved for us to read and reply to. Field observations
              or field data are only shared in a pilot after we agree the scope in writing with
              you.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg tracking-tight text-ink">How to ask for removal</h2>
            <p className="mt-2">
              Write to{' '}
              {site.email ? (
                <a className="border-b border-line pb-0.5 text-ink" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              ) : (
                'the contact address on our footer'
              )}{' '}
              and ask us to remove your details. We remove them, confirm the removal, and do not
              contact you again afterwards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
