import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getTemas } from '@/lib/galeria';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TemaCard } from '@/components/galeria/TemaCard';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: currentLang } = await props.params;
  const dictionary = await getDictionary();

  return {
    title: `${dictionary.galeria.title} — ${siteConfig.name}`,
    description: dictionary.galeria.description,
    alternates: {
      canonical: `/${currentLang}/galeria`,
    },
  };
}

export default async function GaleriaIndexPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const temas = await getTemas();

  const breadcrumbs = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.galeria },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
          {dictionary.galeria.title}
        </h1>
        <p className="mt-1 font-mono text-sm text-muted">
          {dictionary.galeria.description}
        </p>
      </header>

      <section>
        {temas.length === 0 ? (
          <p className="font-mono text-sm text-muted">{dictionary.galeria.emptyTemas}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {temas.map((tema) => (
              <TemaCard key={tema.slug} tema={tema} labels={dictionary.galeria} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
