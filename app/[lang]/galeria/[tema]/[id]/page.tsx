import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getItem, getItens, getTema, getTemas } from '@/lib/galeria';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs';
import { GaleriaViewer } from '@/components/galeria/GaleriaViewer';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

export const instant = false;

export async function generateStaticParams() {
  const params: { lang: string; tema: string; id: string }[] = [];
  const temas = await getTemas();

  for (const lang of ACTIVE_LOCALES) {
    for (const tema of temas) {
      const itens = await getItens(tema.slug);
      for (const item of itens) {
        params.push({ lang, tema: tema.slug, id: item.id });
      }
    }
  }

  if (params.length === 0) {
    return [{ lang: 'pt', tema: 'desenhos', id: '_empty' }];
  }

  return params;
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; tema: string; id: string }>;
}): Promise<Metadata> {
  const { lang: currentLang, tema: temaSlug, id } = await props.params;

  if (!isLocale(currentLang) || !temaSlug || !id) {
    return {};
  }

  const result = await getItem(temaSlug, id);
  if (!result) {
    return {};
  }

  const { item } = result;
  return {
    title: `${item.title} — ${siteConfig.name}`,
    description: item.description || item.title,
    alternates: {
      canonical: `/${currentLang}/galeria/${temaSlug}/${item.id}`,
    },
    openGraph: {
      title: item.title,
      description: item.description || item.title,
      images: [
        {
          url: item.url,
          width: item.width,
          height: item.height,
          alt: item.title,
        },
      ],
    },
  };
}

function ItemSkeleton() {
  return (
    <div className="space-y-6 font-mono animate-pulse">
      <div className="h-4 w-56 rounded bg-border/40" />
      <div className="aspect-video w-full bg-border/30" />
      <div className="space-y-2 border-b border-border pb-4">
        <div className="h-8 w-1/2 rounded bg-border/50" />
        <div className="h-4 w-2/3 rounded bg-border/30" />
      </div>
    </div>
  );
}

export default function GaleriaItemPage(props: {
  params: Promise<{ lang: string; tema: string; id: string }>;
}) {
  return (
    <Suspense fallback={<ItemSkeleton />}>
      <GaleriaItemContent params={props.params} />
    </Suspense>
  );
}

async function GaleriaItemContent(props: {
  params: Promise<{ lang: string; tema: string; id: string }>;
}) {
  const { lang: currentLang, tema: temaSlug, id } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  if (!temaSlug || !id) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const tema = await getTema(temaSlug);

  if (!tema) {
    notFound();
  }

  const result = await getItem(tema.slug, id);
  if (!result) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.galeria, href: href(locale, '/galeria') },
    { label: tema.title, href: href(locale, `/galeria/${tema.slug}`) },
    { label: result.item.title },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <GaleriaViewer
        item={result.item}
        tema={tema}
        prev={result.prev}
        next={result.next}
        locale={locale}
        labels={dictionary.galeria}
      />
    </div>
  );
}
