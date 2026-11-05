import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllTags, getPostsByTag } from '@/lib/content';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs';
import { formatDate } from '@/lib/i18n/format';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

interface TagDetailsPageProps {
  params: Promise<{
    lang: string;
    tag: string;
  }>;
}

/**
 * Pré-renderiza todas as tags cadastradas no build (SSG)
 */
export async function generateStaticParams() {
  const tags = await getAllTags('pt');

  return tags.map(({ tag }) => ({
    tag,
  }));
}

export async function generateMetadata(props: TagDetailsPageProps): Promise<Metadata> {
  const { lang: currentLang, tag } = await props.params;

  return {
    title: `#${tag} — ${siteConfig.name}`,
    description: `Anotações e registros técnicos categorizados sob a tag #${tag}.`,
    alternates: {
      canonical: `/${currentLang}/tags/${tag}`,
    },
  };
}

export default async function TagDetailsPage(props: TagDetailsPageProps) {
  const { lang: currentLang, tag } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const posts = await getPostsByTag(locale, tag);

  if (!posts || posts.length === 0) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.tags, href: href(locale, '/tags') },
    { label: `#${tag}` },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg flex items-baseline gap-2">
          <span>#{tag}</span>
          <span className="text-sm font-normal text-muted">
            ({posts.length} {posts.length === 1 ? 'documento' : 'documentos'})
          </span>
        </h1>
        <p className="text-muted text-sm mt-1 font-mono">
          {dictionary.tags.taggedWith} <code className="bg-code-bg px-1 py-0.5 border border-border">#{tag}</code>:
        </p>
      </header>

      {/* Tabela de Documentos Filtrados */}
      <section className="space-y-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">{dictionary.tags.tableHeaderCollection}</TableHead>
              <TableHead>{dictionary.tags.tableHeaderTitle}</TableHead>
              <TableHead className="w-32 hidden sm:table-cell">{dictionary.tags.tableHeaderDate}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => {
              const dateStr = formatDate(locale, post.date);
              const collectionLabel =
                post.collection === 'escritos'
                  ? 'Escritos'
                  : post.collection === 'diario'
                    ? 'Diário'
                    : 'Projetos';

              return (
                <TableRow key={post.href}>
                  <TableCell className="font-mono text-xs font-semibold text-muted">
                    [{collectionLabel}]
                  </TableCell>

                  <TableCell>
                    <Link
                      href={post.href as Route}
                      className="font-bold text-link hover:underline block"
                    >
                      {post.title}
                    </Link>
                    {post.description && (
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">
                        {post.description}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="hidden sm:table-cell font-mono text-xs text-muted whitespace-nowrap">
                    <time dateTime={post.date.toISOString()}>{dateStr}</time>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="pt-2">
          <Link
            href={href(locale, '/tags') as Route}
            className="font-mono text-xs text-link hover:underline inline-flex items-center gap-1"
          >
            &larr; {dictionary.tags.backToTags}
          </Link>
        </div>
      </section>
    </div>
  );
}
