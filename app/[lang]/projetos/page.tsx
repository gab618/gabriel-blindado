import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllPosts } from '@/lib/content';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TagList } from '@/components/content/TagList';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: currentLang } = await props.params;
  const dictionary = await getDictionary();

  return {
    title: `${dictionary.projetos.title} — ${siteConfig.name}`,
    description: dictionary.projetos.description,
    alternates: {
      canonical: `/${currentLang}/projetos`,
    },
  };
}

export default async function ProjetosIndexPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const posts = await getAllPosts(locale, 'projetos');

  const breadcrumbs = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.projetos },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
          {dictionary.projetos.title}
        </h1>
        <p className="text-muted text-sm mt-1 font-mono">
          {dictionary.projetos.description}
        </p>
      </header>

      <section className="space-y-4">
        {posts.length === 0 ? (
          <p className="font-mono text-sm text-muted">{dictionary.projetos.empty}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <div
                key={post.href}
                className="border border-border p-4 bg-bg hover:border-link transition-colors space-y-2 flex flex-col justify-between"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={post.href as Route}
                    className="font-mono text-base font-bold text-link hover:underline"
                  >
                    {post.title}
                  </Link>
                  <span className="font-mono text-xs px-1.5 py-0.5 border border-border bg-code-bg text-muted">
                    {post.date.getFullYear()}
                  </span>
                </div>

                {post.description && (
                  <p className="text-sm text-muted font-mono leading-relaxed">
                    {post.description}
                  </p>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <TagList tags={post.tags} lang={locale} />
                  <Link
                    href={post.href as Route}
                    className="text-link hover:underline font-semibold"
                  >
                    Ver projeto &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
