import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { TOOLS_REGISTRY, type ToolCategory, type ToolConfig } from '@/tools/registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: currentLang } = await props.params;
  const dictionary = await getDictionary();

  return {
    title: `${dictionary.tools.title} — ${siteConfig.name}`,
    description: dictionary.tools.description,
    alternates: {
      canonical: `/${currentLang}/tools`,
    },
  };
}

export default async function ToolsIndexPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();

  const breadcrumbs = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.tools },
  ];

  // Agrupa as ferramentas cadastradas por categoria
  const grouped = new Map<ToolCategory, ToolConfig[]>();
  for (const tool of TOOLS_REGISTRY) {
    const list = grouped.get(tool.category) || [];
    list.push(tool);
    grouped.set(tool.category, list);
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
          {dictionary.tools.title}
        </h1>
        <p className="text-muted text-sm mt-1 font-mono">
          {dictionary.tools.description}
        </p>
        <div className="mt-2 text-xs font-mono text-adm-tip-text">
          ✓ {dictionary.tools.clientOnlyNotice}
        </div>
      </header>

      {/* Lista por Categorias */}
      <section className="space-y-8">
        {Array.from(grouped.entries()).map(([category, tools]) => {
          const catTitle = dictionary.tools.categories[category] || category;

          return (
            <div key={category} className="space-y-3">
              <h2 className="font-mono text-base font-bold text-fg uppercase flex items-center gap-2 border-b border-border/80 pb-1">
                <span className="text-muted">#</span> {catTitle}
                <span className="text-xs font-normal text-muted">
                  ({tools.length})
                </span>
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {tools.map((tool) => {
                  const title = tool.title[locale] || tool.title.pt;
                  const description = tool.description[locale] || tool.description.pt;
                  const statusLabel = dictionary.tools.status[tool.status] || tool.status;

                  return (
                    <div
                      key={tool.slug}
                      className="border border-border p-4 bg-bg hover:border-link transition-colors space-y-2 flex flex-col justify-between"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <Link
                          href={href(locale, `/tools/${tool.slug}`) as Route}
                          className="font-mono text-base font-bold text-link hover:underline"
                        >
                          {title}
                        </Link>
                        <span className="font-mono text-xs px-1.5 py-0.5 border border-border bg-code-bg text-muted">
                          [{statusLabel}]
                        </span>
                      </div>

                      <p className="text-sm text-muted font-mono leading-relaxed">
                        {description}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex flex-wrap gap-1 text-muted">
                          {tool.keywords.map((kw) => (
                            <span key={kw} className="bg-code-bg px-1 border border-border/60">
                              {kw}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={href(locale, `/tools/${tool.slug}`) as Route}
                          className="text-link hover:underline font-semibold"
                        >
                          {dictionary.tools.openTool} &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
