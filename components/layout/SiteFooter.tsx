import { siteConfig } from '@/lib/site';
import type { Dictionary } from '@/lib/i18n/dictionaries/pt';
import type { Locale } from '@/lib/i18n/config';

export interface SiteFooterProps {
  dictionary: Dictionary;
  lang?: Locale;
}

export function SiteFooter({ dictionary, lang = 'pt' }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-border bg-bg py-6 px-4 text-xs font-mono text-muted">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <p>
            © {siteConfig.copyrightYear} {siteConfig.author}. {dictionary.site.license}.
          </p>
          <p className="mt-0.5">{dictionary.site.builtWith}.</p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`/${lang}/feed.xml`}
            className="text-link hover:underline inline-flex items-center gap-1"
          >
            {dictionary.site.rss}
          </a>
          <a
            href={siteConfig.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link hover:underline inline-flex items-center gap-1"
          >
            {dictionary.site.sourceCode} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
