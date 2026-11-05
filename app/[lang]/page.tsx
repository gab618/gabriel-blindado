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

  // Carrega todos os posts combinados (Escritos + Diário + Projetos)
  const allPosts = await getAllPosts(locale);
  const recentPosts = allPosts.slice(0, 5);

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

      {/* Seções Principais do Site */}
      <section className="space-y-4">
        <div className="font-mono text-xs font-bold text-muted uppercase tracking-wider border-b border-border pb-1">
          [{dictionary.home.featuredSections}]
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <Link
            href={href(locale, '/escritos') as Route}
            className="border border-border p-3.5 bg-bg hover:border-link transition-colors flex flex-col justify-between group"
          >
            <div>
              <div className="font-bold text-sm text-link group-hover:underline">
                [Escritos & Receitas]
              </div>
              <p className="text-muted mt-1 font-sans text-xs">
                {dictionary.home.escritosDesc}
              </p>
            </div>
            <span className="text-muted text-[11px] mt-2 block">&rarr; Abrir caderno</span>
          </Link>

          <Link
            href={href(locale, '/diario') as Route}
            className="border border-border p-3.5 bg-bg hover:border-link transition-colors flex flex-col justify-between group"
          >
            <div>
              <div className="font-bold text-sm text-link group-hover:underline">
                [Diário de Bordo]
              </div>
              <p className="text-muted mt-1 font-sans text-xs">
                {dictionary.home.diarioDesc}
              </p>
            </div>
            <span className="text-muted text-[11px] mt-2 block">&rarr; Ver notas diárias</span>
          </Link>

          <Link
            href={href(locale, '/projetos') as Route}
            className="border border-border p-3.5 bg-bg hover:border-link transition-colors flex flex-col justify-between group"
          >
            <div>
              <div className="font-bold text-sm text-link group-hover:underline">
                [Projetos Pessoais]
              </div>
              <p className="text-muted mt-1 font-sans text-xs">
                {dictionary.home.projetosDesc}
              </p>
            </div>
            <span className="text-muted text-[11px] mt-2 block">&rarr; Ver iniciativas</span>
          </Link>

          <Link
            href={href(locale, '/tags') as Route}
            className="border border-border p-3.5 bg-bg hover:border-link transition-colors flex flex-col justify-between group"
          >
            <div>
              <div className="font-bold text-sm text-link group-hover:underline">
                [Índice de Tags]
              </div>
              <p className="text-muted mt-1 font-sans text-xs">
                {dictionary.home.tagsDesc}
              </p>
            </div>
            <span className="text-muted text-[11px] mt-2 block">&rarr; Explorar tópicos</span>
          </Link>
        </div>
      </section>

      {/* Últimas Publicações */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-border pb-1 font-mono text-xs">
          <span className="font-bold text-muted uppercase tracking-wider">
            [{dictionary.home.recentUpdates}]
          </span>
          <Link
            href={href(locale, '/escritos') as Route}
            className="text-link hover:underline"
          >
            {dictionary.home.viewAllNotes} &rarr;
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <p className="text-muted text-sm font-mono">{dictionary.diario.empty}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">{dictionary.common.collection}</TableHead>
                <TableHead>{dictionary.tags.tableHeaderTitle}</TableHead>
                <TableHead className="w-32 hidden sm:table-cell">{dictionary.tags.tableHeaderDate}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPosts.map((post) => {
                const dateStr = formatDate(locale, post.date);
                const collectionBadge =
                  post.collection === 'escritos'
                    ? 'Escritos'
                    : post.collection === 'diario'
                      ? 'Diário'
                      : 'Projetos';

                return (
                  <TableRow key={post.href}>
                    <TableCell className="font-mono text-xs font-semibold text-muted">
                      [{collectionBadge}]
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
        )}
      </section>
    </div>
  );
}
