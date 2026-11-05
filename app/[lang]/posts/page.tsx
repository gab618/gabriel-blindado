import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllPosts } from '@/lib/content';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatDate } from '@/lib/i18n/format';
import { TagList } from '@/components/content/TagList';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: currentLang } = await props.params;
  const dictionary = await getDictionary();

  return {
    title: `${dictionary.posts.title} — ${siteConfig.name}`,
    description: dictionary.posts.description,
    alternates: {
      canonical: `/${currentLang}/posts`,
    },
  };
}

export default async function PostsIndexPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const posts = await getAllPosts(locale, 'posts');

  const breadcrumbs = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.posts },
  ];

  // Agrupa os posts por categoria (primeiro segmento do slug)
  const groupedByCategory = new Map<string, typeof posts>();
  for (const post of posts) {
    const category = post.slug.length > 1 ? post.slug[0] : 'geral';
    const list = groupedByCategory.get(category) || [];
    list.push(post);
    groupedByCategory.set(category, list);
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
          {dictionary.posts.title}
        </h1>
        <p className="text-muted text-sm mt-1 font-mono">
          {dictionary.posts.description}
        </p>
      </header>

      {/* Listagem categorizada */}
      <section className="space-y-8">
        {Array.from(groupedByCategory.entries()).map(([category, catPosts]) => (
          <div key={category} className="space-y-3">
            <h2 className="font-mono text-base font-bold text-fg uppercase flex items-center gap-2 border-b border-border/80 pb-1">
              <span className="text-muted">#</span> {category}
              <span className="text-xs font-normal text-muted">
                ({catPosts.length})
              </span>
            </h2>

            <div className="divide-y divide-border border border-border bg-bg">
              {catPosts.map((post) => (
                <div key={post.href} className="p-3.5 space-y-1.5 hover:bg-code-bg/30 transition-colors">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link
                      href={post.href as Route}
                      className="font-mono text-base font-bold text-link hover:underline"
                    >
                      {post.title}
                    </Link>
                    <time dateTime={post.date.toISOString()} className="font-mono text-xs text-muted">
                      {formatDate(locale, post.date)}
                    </time>
                  </div>

                  {post.description && (
                    <p className="text-sm text-muted font-mono leading-relaxed">
                      {post.description}
                    </p>
                  )}

                  <div className="pt-1">
                    <TagList tags={post.tags} lang={locale} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <p className="font-mono text-sm text-muted">{dictionary.posts.emptyCategory}</p>
        )}
      </section>
    </div>
  );
}
