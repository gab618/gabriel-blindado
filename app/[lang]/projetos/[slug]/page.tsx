import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllPosts, getPostBySlug } from '@/lib/content';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs';
import { PostMetaLine } from '@/components/content/PostMetaLine';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];

  for (const lang of ACTIVE_LOCALES) {
    const posts = await getAllPosts(lang, 'projetos');
    for (const post of posts) {
      if (post.slug.length === 1) {
        params.push({ lang, slug: post.slug[0] });
      }
    }
  }

  if (params.length === 0) {
    return [{ lang: 'pt', slug: 'meu-canto-na-web' }];
  }

  return params;
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: currentLang, slug } = await props.params;

  if (!isLocale(currentLang) || !slug) {
    return {};
  }

  const locale = currentLang as Locale;
  const post = await getPostBySlug(locale, 'projetos', [slug]);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} — ${siteConfig.name}`,
    description: post.description || post.title,
    alternates: {
      canonical: `/${locale}/projetos/${slug}`,
    },
  };
}

export default async function ProjetoDetailPage(props: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: currentLang, slug } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const post = await getPostBySlug(locale, 'projetos', [slug]);

  if (!post) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.projetos, href: href(locale, '/projetos') },
    { label: post.title },
  ];

  const githubEditUrl = `${siteConfig.repo}/blob/main/${post.sourcePath}`;

  return (
    <article className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="space-y-2">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
          {post.title}
        </h1>
        <PostMetaLine meta={post} dictionary={dictionary} />
      </header>

      <div className="prose-wiki mt-6">
        {post.body}
      </div>

      <footer className="border-t border-border pt-4 mt-8 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted">
        <div>
          <Link
            href={href(locale, '/projetos') as Route}
            className="text-link hover:underline inline-flex items-center gap-1"
          >
            &larr; {dictionary.projetos.backToProjetos}
          </Link>
        </div>

        <div>
          <a
            href={githubEditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link hover:underline inline-flex items-center gap-1"
          >
            {dictionary.posts.editOnGithub} ↗
          </a>
        </div>
      </footer>
    </article>
  );
}
