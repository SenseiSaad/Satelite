import { site } from '@/lib/site';
import { Wordmark } from './Wordmark';

const year = new Date().getFullYear();

const navLinks = [
  { href: '#product', label: 'Product' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#roadmap', label: 'What comes next' },
  { href: '#faq', label: 'FAQ' },
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
            Fieldline is set up and running. We are just iterating on the final changes,
            so product capabilities and pilot scope may be refined as partners come on board.
          </p>
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
        </nav>

        <div>
          <h2 className="mono-label text-page/60">Get in touch</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-page/75">
            Interested in an evaluation? Share your organization, region and use case in the
            early-access form.
          </p>
          <a
            href="#early-access"
            className="mt-4 inline-block border-b border-page/40 pb-1 text-sm text-page hover:border-page"
          >
            Discuss a pilot
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-page/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono">
            Coverage: {site.coverage.scope} · {site.coverage.crops}
          </p>
        </div>
      </div>
    </footer>
  );
}
