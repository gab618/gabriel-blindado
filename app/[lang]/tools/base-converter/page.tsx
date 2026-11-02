import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getToolBySlug } from '@/tools/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';
import { BaseConverterTool } from './tool';

export async function generateStaticParams() {
  return ACTIVE_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: currentLang } = await props.params;
  const dictionary = await getDictionary();
  const tool = getToolBySlug('base-converter');

  const title = tool
    ? `${tool.title[currentLang as Locale] || tool.title.pt} — ${siteConfig.name}`
    : `${dictionary.tools.baseConverter.title} — ${siteConfig.name}`;

  const description = tool
    ? tool.description[currentLang as Locale] || tool.description.pt
    : dictionary.tools.baseConverter.description;

  return {
    title,
    description,
    alternates: {
      canonical: `/${currentLang}/tools/base-converter`,
    },
  };
}

export default async function BaseConverterPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const tool = getToolBySlug('base-converter');

  if (!tool) {
    notFound();
  }

  const breadcrumbs = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.tools, href: href(locale, '/tools') },
    { label: tool.title[locale] || tool.title.pt },
  ];

  const labels = dictionary.tools.baseConverter;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={href(locale, '/tools') as Route}
            className="text-xs font-mono text-link hover:underline"
          >
            &larr; {dictionary.tools.backToTools}
          </Link>
        </div>

        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
          {tool.title[locale] || tool.title.pt}
        </h1>
        <p className="text-muted text-sm mt-1 font-mono">
          {tool.description[locale] || tool.description.pt}
        </p>
        <div className="mt-2 text-xs font-mono text-adm-tip-text">
          ✓ {dictionary.tools.clientOnlyNotice}
        </div>
      </header>

      <BaseConverterTool labels={labels} />
    </div>
  );
}
