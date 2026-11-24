import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getItens, getTema, getTemas } from '@/lib/galeria';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs';
import { GaleriaGrid } from '@/components/galeria/GaleriaGrid';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

export const instant = false;

export async function generateStaticParams() {
  const params: { lang: string; tema: string }[] = [];
  const temas = await getTemas();

  for (const lang of ACTIVE_LOCALES) {
    for (const tema of temas) {
      params.push({ lang, tema: tema.slug });
    }
  }

  if (params.length === 0) {
    return [{ lang: 'pt', tema: 'desenhos' }];
  }

  return params;
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; tema: string }>;
}): Promise<Metadata> {
  const { lang: currentLang, tema: temaSlug } = await props.params;

  if (!isLocale(currentLang) || !temaSlug) {
    return {};
  }

  const tema = await getTema(temaSlug);
  if (!tema) {
    return {};
  }

  return {
    title: `${tema.title} — ${siteConfig.name}`,
    description: tema.description || tema.title,
    alternates: {
      canonical: `/${currentLang}/galeria/${tema.slug}`,
    },
  };
}

function TemaSkeleton() {
  return (
    <div className="space-y-6 font-mono animate-pulse">
      <div className="h-4 w-48 rounded bg-border/40" />
      <div className="space-y-2 border-b border-border pb-4">
        <div className="h-8 w-1/3 rounded bg-border/50" />
        <div className="h-4 w-1/2 rounded bg-border/30" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <div className="aspect-square bg-border/30" />
        <div className="aspect-square bg-border/30" />
        <div className="aspect-square bg-border/30" />
        <div className="aspect-square bg-border/30" />
      </div>
    </div>
  );
}

export default function GaleriaTemaPage(props: {
  params: Promise<{ lang: string; tema: string }>;
}) {
  return (
    <Suspense fallback={<TemaSkeleton />}>
      <GaleriaTemaContent params={props.params} />
    </Suspense>
  );
}

async function GaleriaTemaContent(props: {
  params: Promise<{ lang: string; tema: string }>;
}) {
  const { lang: currentLang, tema: temaSlug } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  if (!temaSlug) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const tema = await getTema(temaSlug);

  if (!tema) {
    notFound();
  }

  const itens = await getItens(tema.slug);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.galeria, href: href(locale, '/galeria') },
    { label: tema.title },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
            {tema.title}
          </h1>
          <span className="font-mono text-xs text-muted">
            {dictionary.galeria.itemsCount.replace('{count}', String(itens.length))}
          </span>
        </div>
        {tema.description && (
          <p className="mt-1 font-mono text-sm text-muted">{tema.description}</p>
        )}
      </header>

      <section>
        <GaleriaGrid itens={itens} emptyMessage={dictionary.galeria.empty} />
      </section>

      <footer className="border-t border-border pt-4 font-mono text-xs">
        <Link
          href={href(locale, '/galeria') as Route}
          className="inline-flex items-center gap-1 text-link hover:underline"
        >
          &larr; {dictionary.galeria.backToGaleria}
        </Link>
      </footer>
    </div>
  );
}
