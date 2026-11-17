import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
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

export const instant = false;

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];

  for (const lang of ACTIVE_LOCALES) {
    const projects = await getAllPosts(lang, 'projetos');
    for (const project of projects) {
      if (project.slug.length === 1) {
        params.push({ lang, slug: project.slug[0] });
      }
    }
  }

  if (params.length === 0) {
    return [{ lang: 'pt', slug: 'gabrielblindado' }];
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
  const project = await getPostBySlug(locale, 'projetos', [slug]);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} — ${siteConfig.name}`,
    description: project.description || project.title,
    alternates: {
      canonical: `/${locale}/projetos/${slug}`,
    },
  };
}

function ProjetoSkeleton() {
  return (
    <div className="space-y-6 font-mono animate-pulse">
      <div className="h-4 w-40 bg-border/40 rounded" />
      <div className="aspect-video w-full bg-border/30" />
      <div className="space-y-2 border-b border-border pb-4">
        <div className="h-8 w-2/3 bg-border/50 rounded" />
        <div className="h-4 w-1/2 bg-border/30 rounded" />
      </div>
    </div>
  );
}

export default function ProjetoDetailPage(props: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  return (
    <Suspense fallback={<ProjetoSkeleton />}>
      <ProjetoDetailContent params={props.params} />
    </Suspense>
  );
}

async function ProjetoDetailContent(props: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: currentLang, slug } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  if (!slug) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const project = await getPostBySlug(locale, 'projetos', [slug]);

  if (!project) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.projetos, href: href(locale, '/projetos') },
    { label: project.title },
  ];

  const isSvg = project.cover?.endsWith('.svg') ?? false;
  const githubEditUrl = `${siteConfig.repo}/blob/main/${project.sourcePath}`;

  return (
    <article className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      {project.cover && (
        <div className="relative aspect-video w-full overflow-hidden border border-border bg-code-bg">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            unoptimized={isSvg}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-fg">
            {project.title}
          </h1>

          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-fg bg-fg px-3 py-1.5 font-mono text-xs font-bold text-bg transition-colors hover:bg-bg hover:text-fg"
            >
              {dictionary.projetos.visitProject} ↗
            </a>
          ) : (
            <span className="inline-block border border-border bg-code-bg px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-muted">
              [{dictionary.projetos.comingSoon}]
            </span>
          )}
        </div>

        {project.description && (
          <p className="font-mono text-sm leading-relaxed text-muted">
            {project.description}
          </p>
        )}

        <PostMetaLine meta={project} dictionary={dictionary} />
      </header>

      <div className="prose-wiki mt-6">
        {project.body}
      </div>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 font-mono text-xs text-muted">
        <div>
          <Link
            href={href(locale, '/projetos') as Route}
            className="inline-flex items-center gap-1 text-link hover:underline"
          >
            &larr; {dictionary.projetos.backToProjetos}
          </Link>
        </div>

        <div>
          <a
            href={githubEditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-link hover:underline"
          >
            {dictionary.posts.editOnGithub} ↗
          </a>
        </div>
      </footer>
    </article>
  );
}
