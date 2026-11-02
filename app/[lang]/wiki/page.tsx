import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllPosts, getPostBySlug } from '@/lib/content';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatDate } from '@/lib/i18n/format';
import { TagList } from '@/components/content/TagList';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';
import type { PostMeta } from '@/lib/types';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: currentLang } = await props.params;
  const dictionary = await getDictionary();

  return {
    title: `${dictionary.wiki.title} — ${siteConfig.name}`,
    description: dictionary.wiki.description,
    alternates: {
      canonical: `/${currentLang}/wiki`,
    },
  };
}

export default async function WikiIndexPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();

  // Carrega todos os posts da Wiki
  const posts = await getAllPosts(locale, 'wiki');

  // Carrega o documento raiz da Wiki (index.md) se existir
  const rootWikiPost = await getPostBySlug(locale, 'wiki', []);

  // Agrupa posts por categoria (primeiro segmento de slug)
  const categorized = new Map<string, PostMeta[]>();

  for (const post of posts) {
    if (post.slug.length === 0) continue; // Raiz é tratada separadamente

    const category = post.slug.length > 1 ? post.slug[0] : 'geral';
    const list = categorized.get(category) || [];
    list.push(post);
    categorized.set(category, list);
  }

  const breadcrumbs = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.wiki },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
          {dictionary.wiki.title}
        </h1>
        <p className="text-muted text-sm mt-1 font-mono">
          {dictionary.wiki.description}
        </p>
      </header>

      {/* Introdução / Digital Garden Manifesto (se index.md existir) */}
      {rootWikiPost && (
        <section className="border border-border p-4 bg-code-bg/30">
          <div className="prose-wiki">
            {rootWikiPost.body}
          </div>
        </section>
      )}

      {/* Índice Categorizado (Estilo Arch Wiki / Debian) */}
      <section className="space-y-8">
        <div className="font-mono text-sm font-bold border-b border-border pb-1 text-fg uppercase tracking-wider">
          [{dictionary.wiki.categories}]
        </div>

        {categorized.size === 0 ? (
          <p className="text-muted text-sm font-mono">{dictionary.wiki.emptyCategory}</p>
        ) : (
          Array.from(categorized.entries()).map(([category, catPosts]) => (
            <div key={category} className="space-y-3">
              <h2 className="font-mono text-base font-bold text-fg uppercase flex items-center gap-2 border-b border-border/80 pb-1">
                <span className="text-muted">#</span> {category}
                <span className="text-xs font-normal text-muted">
                  ({catPosts.length})
                </span>
              </h2>

              <ul className="list-none p-0 m-0 space-y-2.5 font-mono text-sm">
                {catPosts.map((post) => {
                  const dateStr = formatDate(locale, post.date);
                  const statusIcon = dictionary.wiki.status[post.status] || post.status;

                  return (
                    <li
                      key={post.href}
                      className="border border-border/60 hover:border-border p-3 bg-bg transition-colors flex flex-col gap-1.5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <Link
                          href={post.href as Route}
                          className="font-bold text-link hover:underline text-sm"
                        >
                          {post.title}
                        </Link>
                        <span className="text-xs text-muted flex items-center gap-2">
                          <span>{statusIcon}</span>
                          <span className="text-border">•</span>
                          <time dateTime={post.date.toISOString()}>{dateStr}</time>
                        </span>
                      </div>

                      {post.description && (
                        <p className="text-xs text-muted line-clamp-2">
                          {post.description}
                        </p>
                      )}

                      {post.tags.length > 0 && (
                        <div className="pt-1">
                          <TagList tags={post.tags} lang={locale} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
