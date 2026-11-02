import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { lang } from 'next/root-params';
import { href } from '@/lib/i18n/href';
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';

export default async function NotFound() {
  const t = await getDictionary();
  const currentLang = await lang();
  const locale: Locale = isLocale(currentLang) ? currentLang : DEFAULT_LOCALE;

  return (
    <main className="max-w-3xl mx-auto w-full py-16 px-4 font-mono">
      <div className="border border-zinc-300 dark:border-zinc-800 p-6 space-y-4">
        <h1 className="text-xl font-bold">{t.notFound.title}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t.notFound.description}</p>
        <div>
          <Link
            href={href(locale, '/')}
            className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
          >
            &larr; {t.notFound.returnHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
