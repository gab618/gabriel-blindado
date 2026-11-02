import Link from 'next/link';
import type { Route } from 'next';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { lang } from 'next/root-params';
import { href } from '@/lib/i18n/href';
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';

export default async function WikiNotFound() {
  const dictionary = await getDictionary();
  const currentLang = await lang();
  const locale: Locale = isLocale(currentLang) ? currentLang : DEFAULT_LOCALE;

  return (
    <div className="border border-border p-6 space-y-4 font-mono my-8 bg-code-bg/30">
      <h1 className="text-xl font-bold text-fg">
        404 — {dictionary.notFound.title}
      </h1>
      <p className="text-muted text-sm">
        {dictionary.notFound.description}
      </p>
      <div className="pt-2">
        <Link
          href={href(locale, '/wiki') as Route}
          className="text-link hover:underline text-sm inline-flex items-center gap-1"
        >
          &larr; {dictionary.wiki.backToWiki}
        </Link>
      </div>
    </div>
  );
}
