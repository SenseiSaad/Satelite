import { site } from '@/lib/site';
import { Wordmark } from './Wordmark';

const navLinks = [
  { href: '#product', label: 'Product' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#roadmap', label: 'What comes next' },
  { href: '#faq', label: 'FAQ' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

const builderLinks = [
  { href: 'https://github.com/SenseiSaad', label: 'GitHub' },
  { href: 'https://linkedin.com/in/saadwaseemcloud', label: 'LinkedIn' },
];

export function SiteFooter() {
  return (
    <footer className="on-ink bg-ink text-page">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-10">
        <div>
          <a href="#top" aria-label={`${site.name} home`} className="inline-block text-page">
            <Wordmark />
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-page/75">{site.tagline}</p>
          <p className="mt-6 max-w-sm text-xs leading-relaxed text-page/60">
            Northgate Labs is in early access. Product capabilities and pilot scope may be refined as
            partners come on board.
          </p>
          <div className="mt-6">
            <h2 className="mono-label text-page/60">Built by</h2>
            <p className="mt-2 text-sm leading-relaxed text-page/85">
              Saad Waseem, Cloud and Web Developer, Lahore, Pakistan
            </p>
            <p className="mt-2 flex gap-3">
              {builderLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="border-b border-page/40 pb-0.5 text-sm text-page transition-colors duration-200 hover:border-page"
                >
                  {link.label}
                </a>
              ))}
            </p>
          </div>
        </div>

        <nav aria-label="Footer">
          <h2 className="mono-label text-page/60">Sections</h2>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-page/85 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <h2 className="mono-label mt-6 text-page/60">Legal</h2>
          <ul className="mt-4 space-y-2.5">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-page/85 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mono-label text-page/60">Get in touch</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-page/75">
            Interested in an evaluation? Share your organization, region and use case in the
            early-access form.
          </p>
          {site.email ? (
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-block border-b border-page/40 pb-1 text-sm text-page hover:border-page"
            >
              {site.email}
            </a>
          ) : null}
          <a
            href="#early-access"
            className="mt-4 block w-fit border-b border-page/40 pb-1 text-sm text-page hover:border-page"
          >
            Discuss a pilot
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-page/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {site.name}</p>
          <p className="font-mono">
            {site.coverage.scope}: {site.coverage.crops}; {site.coverage.regions}
          </p>
        </div>
      </div>
    </footer>
  );
}
