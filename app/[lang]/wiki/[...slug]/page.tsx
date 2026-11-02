import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllPosts, getPostBySlug, getBacklinks } from '@/lib/content';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs';
import { PostMetaLine } from '@/components/content/PostMetaLine';
import { Toc } from '@/components/content/Toc';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

interface WikiNotePageProps {
  params: Promise<{
    lang: string;
    slug: string[];
  }>;
}

/**
 * Pré-renderiza todas as notas da Wiki durante o build (SSG)
 */
export async function generateStaticParams() {
  const posts = await getAllPosts('pt', 'wiki');
  const subPosts = posts.filter((p) => p.slug.length > 0);

  return subPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: WikiNotePageProps): Promise<Metadata> {
  const { lang: currentLang, slug } = await props.params;

  if (!isLocale(currentLang)) {
    return { title: 'Not Found' };
  }

  const post = await getPostBySlug(currentLang as Locale, 'wiki', slug);
  if (!post) {
    return { title: 'Not Found' };
  }

  return {
    title: `${post.title} — ${siteConfig.name}`,
    description: post.description || post.title,
    alternates: {
      canonical: post.href,
      languages: post.translations,
    },
  };
}

export default async function WikiNotePage(props: WikiNotePageProps) {
  const { lang: currentLang, slug } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const post = await getPostBySlug(locale, 'wiki', slug);

  if (!post) {
    notFound();
  }

  const backlinks = await getBacklinks(locale, slug);

  // Constrói migalhas de pão dinâmicas a partir da hierarquia do slug
  const breadcrumbs: BreadcrumbItem[] = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.wiki, href: href(locale, '/wiki') },
  ];

  if (slug.length > 1) {
    // Adiciona categorias intermediárias
    for (let i = 0; i < slug.length - 1; i++) {
      const catSlug = slug.slice(0, i + 1);
      breadcrumbs.push({
        label: slug[i],
        href: href(locale, `/wiki/${catSlug.join('/')}`),
      });
    }
  }

  breadcrumbs.push({ label: post.title });

  const githubEditUrl = `${siteConfig.repo}/blob/main/${post.sourcePath}`;

  return (
    <article className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="space-y-3">
        <h1 className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-fg">
          {post.title}
        </h1>

        {post.description && (
          <p className="text-muted text-sm font-mono leading-relaxed">
            {post.description}
          </p>
        )}

        <PostMetaLine meta={post} dictionary={dictionary} />
      </header>

      {/* Índice de seções (TOC) */}
      {post.toc.length > 0 && (
        <Toc items={post.toc} title={dictionary.wiki.tableOfContents} />
      )}

      {/* Corpo principal do documento renderizado via RSC */}
      <div className="prose-wiki mt-6">
        {post.body}
      </div>

      {/* Backlinks */}
      {backlinks.length > 0 && (
        <section className="border border-border p-4 bg-code-bg/30 space-y-2 mt-8">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-fg">
            # {dictionary.wiki.backlinks} ({backlinks.length})
          </h2>
          <ul className="space-y-1 font-mono text-xs">
            {backlinks.map((bl) => (
              <li key={bl.href} className="flex items-center gap-2">
                <span className="text-muted">&rarr;</span>
                <Link href={bl.href as Route} className="text-link hover:underline">
                  {bl.title}
                </Link>
                <span className="text-[10px] text-muted">[{bl.collection}]</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Rodapé da nota com links úteis */}
      <footer className="border-t border-border pt-4 mt-8 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted">
        <div>
          <Link
            href={href(locale, '/wiki') as Route}
            className="text-link hover:underline inline-flex items-center gap-1"
          >
            {dictionary.wiki.backToWiki}
          </Link>
        </div>

        <div>
          <a
            href={githubEditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link hover:underline inline-flex items-center gap-1"
          >
            {dictionary.wiki.editOnGithub} ↗
          </a>
        </div>
      </footer>
    </article>
  );
}
