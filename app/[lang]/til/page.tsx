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
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: currentLang } = await props.params;
  const dictionary = await getDictionary();

  return {
    title: `${dictionary.til.title} — ${siteConfig.name}`,
    description: dictionary.til.description,
    alternates: {
      canonical: `/${currentLang}/til`,
    },
  };
}

export default async function TilIndexPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();

  // Carrega todos os registros do TIL ordenados cronologicamente
  const posts = await getAllPosts(locale, 'til');

  const breadcrumbs = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.til },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
          {dictionary.til.title}
        </h1>
        <p className="text-muted text-sm mt-1 font-mono">
          {dictionary.til.description}
        </p>
      </header>

      {/* Tabela Cronológica Densa */}
      <section className="space-y-3">
        <div className="font-mono text-xs font-bold text-muted uppercase tracking-wider">
          [{dictionary.til.allEntries} — {posts.length}]
        </div>

        {posts.length === 0 ? (
          <p className="text-muted text-sm font-mono">{dictionary.til.empty}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">{dictionary.til.tableHeaderDate}</TableHead>
                <TableHead>{dictionary.til.tableHeaderTitle}</TableHead>
                <TableHead className="w-48 hidden sm:table-cell">{dictionary.til.tableHeaderTags}</TableHead>
                <TableHead className="w-36 hidden md:table-cell">{dictionary.til.tableHeaderStatus}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => {
                const dateStr = formatDate(locale, post.date);
                const statusLabel = dictionary.wiki.status[post.status] || post.status;

                return (
                  <TableRow key={post.href}>
                    <TableCell className="font-mono text-xs text-muted whitespace-nowrap">
                      <time dateTime={post.date.toISOString()}>{dateStr}</time>
                    </TableCell>

                    <TableCell>
                      <Link
                        href={post.href as Route}
                        className="font-bold text-link hover:underline block"
                      >
                        {post.title}
                      </Link>
                      {post.description && (
                        <p className="text-xs text-muted mt-0.5 line-clamp-1 sm:hidden">
                          {post.description}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      <TagList tags={post.tags} lang={locale} />
                    </TableCell>

                    <TableCell className="hidden md:table-cell font-mono text-xs text-muted whitespace-nowrap">
                      {statusLabel}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
