import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllTags } from '@/lib/content';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: currentLang } = await props.params;
  const dictionary = await getDictionary();

  return {
    title: `${dictionary.tags.title} — ${siteConfig.name}`,
    description: dictionary.tags.description,
    alternates: {
      canonical: `/${currentLang}/tags`,
    },
  };
}

export default async function TagsIndexPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const tags = await getAllTags(locale);

  const breadcrumbs = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.tags },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
          {dictionary.tags.title}
        </h1>
        <p className="text-muted text-sm mt-1 font-mono">
          {dictionary.tags.description}
        </p>
      </header>

      {/* Grid de Tags com Contagem */}
      <section className="space-y-4">
        {tags.length === 0 ? (
          <p className="text-muted text-sm font-mono">{dictionary.tags.empty}</p>
        ) : (
          <div className="flex flex-wrap gap-2.5 pt-2">
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={href(locale, `/tags/${tag}`) as Route}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-border bg-code-bg/50 hover:bg-code-bg hover:border-link font-mono text-xs text-fg transition-colors"
              >
                <span className="font-semibold text-link">#{tag}</span>
                <span className="text-muted border-l border-border pl-1.5 text-[11px]">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
