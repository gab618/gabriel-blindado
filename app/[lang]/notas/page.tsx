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
    title: `${dictionary.notas.title} — ${siteConfig.name}`,
    description: dictionary.notas.description,
    alternates: {
      canonical: `/${currentLang}/notas`,
    },
  };
}

export default async function NotasIndexPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const posts = await getAllPosts(locale, 'notas');

  const breadcrumbs = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.notas },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
          {dictionary.notas.title}
        </h1>
        <p className="text-muted text-sm mt-1 font-mono">
          {dictionary.notas.description}
        </p>
      </header>

      {/* Tabela de registros */}
      <section className="space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-muted border-b border-border pb-1">
          <span>{dictionary.notas.allEntries}</span>
          <span>{posts.length} notas</span>
        </div>

        {posts.length === 0 ? (
          <p className="font-mono text-sm text-muted">{dictionary.notas.empty}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">{dictionary.notas.tableHeaderDate}</TableHead>
                <TableHead>{dictionary.notas.tableHeaderTitle}</TableHead>
                <TableHead className="hidden sm:table-cell">{dictionary.notas.tableHeaderTags}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => {
                const dateStr = formatDate(locale, post.date);
                const postUrl = post.href as Route;

                return (
                  <TableRow key={post.href}>
                    <TableCell className="text-muted whitespace-nowrap text-xs font-mono">
                      {dateStr}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={postUrl}
                        className="font-mono text-sm font-semibold text-link hover:underline block"
                      >
                        {post.title}
                      </Link>
                      {post.description && (
                        <span className="text-xs text-muted font-mono block mt-0.5 sm:hidden">
                          {post.description}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <TagList tags={post.tags} lang={locale} />
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
