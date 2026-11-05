import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { href } from '@/lib/i18n/href';
import { NAV_ROUTES, siteConfig } from '@/lib/site';
import type { Dictionary } from '@/lib/i18n/dictionaries/pt';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from '@/components/islands/ThemeToggle';
import { QuickSearch } from '@/components/islands/QuickSearch';
import { SonicLogo } from '@/components/ui/SonicLogo';

export interface SiteHeaderProps {
  lang: Locale;
  dictionary: Dictionary;
}

export function SiteHeader({ lang, dictionary }: SiteHeaderProps) {
  return (
    <header className="border-b border-border bg-bg py-3 px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        {/* Skip to content accessibility link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:inline-block focus:p-2 focus:bg-code-bg focus:border focus:border-border font-mono text-xs"
        >
          {dictionary.common.skipToContent}
        </a>

        {/* Site branding */}
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <Link
              href={href(lang, '/')}
              className="inline-flex items-center gap-2 group hover:no-underline"
            >
              <SonicLogo className="w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-500 ease-out" />
              <span className="font-mono font-bold text-base text-fg group-hover:underline tracking-tight">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-xs text-muted font-mono">{dictionary.site.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <QuickSearch lang={lang} labels={dictionary.search} />
            <ThemeToggle labels={dictionary.theme} />
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>

        {/* Primary navigation */}
        <nav
          aria-label="Navegação principal"
          className="border-t border-border pt-2 flex flex-wrap items-center gap-x-2 text-xs font-mono"
        >
          {NAV_ROUTES.map((route, idx) => {
            const label = dictionary.nav[route.labelKey];
            const targetHref = href(lang, route.path);

            return (
              <span key={route.path} className="inline-flex items-center gap-x-2">
                {idx > 0 && <span className="text-border" aria-hidden="true">|</span>}
                <Link
                  href={targetHref}
                  className="text-fg hover:underline"
                >
                  [{label}]
                </Link>
              </span>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
