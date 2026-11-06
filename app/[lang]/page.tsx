import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllPosts } from '@/lib/content';
import { formatDate } from '@/lib/i18n/format';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
  };
}

export default async function HomePage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();

  const allPosts = await getAllPosts(locale, 'posts');
  const recentPosts = allPosts.slice(0, 10);

  return (
    <div className="space-y-10">
      {/* Apresentação Pessoal / Bio */}
      <section className="border border-border p-5 bg-code-bg/30 space-y-3 font-mono">
        <h1 className="text-xl sm:text-2xl font-bold text-fg tracking-tight">
          {dictionary.home.heroGreeting}
        </h1>
        <p className="text-sm text-muted leading-relaxed font-sans">
          {dictionary.home.heroBio}
        </p>
        <div className="pt-1 text-xs text-muted flex flex-wrap gap-4">
          <span>
            <strong className="text-fg">Autor:</strong> {siteConfig.author}
          </span>
          <span className="text-border">•</span>
          <span>
            <strong className="text-fg">GitHub:</strong>{' '}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:underline"
            >
              @gab618 ↗
            </a>
          </span>
        </div>
      </section>

      {/* Posts Recentes */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-border pb-1 font-mono text-xs">
          <span className="font-bold text-muted uppercase tracking-wider">
            [{dictionary.home.recentUpdates}]
          </span>
          <Link
            href={href(locale, '/posts') as Route}
            className="text-link hover:underline"
          >
            {dictionary.home.viewAllNotes} &rarr;
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <p className="text-muted text-sm font-mono">{dictionary.posts.emptyCategory}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28 sm:w-32">{dictionary.posts.publishedAt}</TableHead>
                <TableHead>{dictionary.posts.title}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPosts.map((post) => {
                const dateStr = formatDate(locale, post.date);

                return (
                  <TableRow key={post.href}>
                    <TableCell className="font-mono text-xs text-muted whitespace-nowrap align-top pt-3">
                      <time dateTime={post.date.toISOString()}>{dateStr}</time>
                    </TableCell>

                    <TableCell className="pt-3">
                      <Link
                        href={post.href as Route}
                        className="font-bold text-link hover:underline block font-mono text-sm"
                      >
                        {post.title}
                      </Link>
                      {post.description && (
                        <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                      )}
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
