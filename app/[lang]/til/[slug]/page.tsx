import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllPosts, getPostBySlug } from '@/lib/content';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs';
import { PostMetaLine } from '@/components/content/PostMetaLine';
import { Toc } from '@/components/content/Toc';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

interface TilPostPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

/**
 * Pré-renderiza todos os registros do TIL no build (SSG)
 */
export async function generateStaticParams() {
  const posts = await getAllPosts('pt', 'til');

  return posts.map((post) => ({
    slug: post.slug.join('/'),
  }));
}

export async function generateMetadata(props: TilPostPageProps): Promise<Metadata> {
  const { lang: currentLang, slug } = await props.params;

  if (!isLocale(currentLang)) {
    return { title: 'Not Found' };
  }

  const post = await getPostBySlug(currentLang as Locale, 'til', [slug]);
  if (!post) {
    return { title: 'Not Found' };
  }

  return {
    title: `${post.title} — TIL | ${siteConfig.name}`,
    description: post.description || post.title,
    alternates: {
      canonical: post.href,
      languages: post.translations,
    },
  };
}

export default async function TilPostPage(props: TilPostPageProps) {
  const { lang: currentLang, slug } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const post = await getPostBySlug(locale, 'til', [slug]);

  if (!post) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.til, href: href(locale, '/til') },
    { label: post.title },
  ];

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

      {/* Sumário de seções se houver */}
      {post.toc.length > 0 && (
        <Toc items={post.toc} title={dictionary.wiki.tableOfContents} />
      )}

      {/* Conteúdo compilado via RSC */}
      <div className="prose-wiki mt-6">
        {post.body}
      </div>

      {/* Rodapé da entrada TIL */}
      <footer className="border-t border-border pt-4 mt-8 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted">
        <div>
          <Link
            href={href(locale, '/til') as Route}
            className="text-link hover:underline inline-flex items-center gap-1"
          >
            &larr; {dictionary.til.backToTil}
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
