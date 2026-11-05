import Link from 'next/link';
import type { Route } from 'next';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { lang } from 'next/root-params';
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { href } from '@/lib/i18n/href';

export default async function PostsNotFound() {
  const currentLang = await lang();
  const locale: Locale = isLocale(currentLang) ? currentLang : DEFAULT_LOCALE;
  const dictionary = await getDictionary();

  return (
    <div className="border border-border p-6 font-mono space-y-4">
      <h1 className="text-xl font-bold text-fg">
        404 — {dictionary.notFound.title}
      </h1>
      <p className="text-sm text-muted">
        O post que você procurou não existe ou foi movido.
      </p>
      <div>
        <Link
          href={href(locale, '/posts') as Route}
          className="text-link hover:underline text-xs"
        >
          &larr; {dictionary.posts.backToPosts}
        </Link>
      </div>
    </div>
  );
}
