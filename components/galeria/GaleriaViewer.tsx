import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { GaleriaItem, GaleriaTema } from '@/lib/galeria';
import type { Dictionary } from '@/lib/i18n/dictionaries/pt';
import type { Locale } from '@/lib/i18n/config';

export interface GaleriaViewerProps {
  item: GaleriaItem;
  tema: GaleriaTema;
  prev: GaleriaItem | null;
  next: GaleriaItem | null;
  locale: Locale;
  labels: Dictionary['galeria'];
}

export function GaleriaViewer({
  item,
  tema,
  prev,
  next,
  locale,
  labels,
}: GaleriaViewerProps) {
  const formattedDate = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'pt-BR', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(item.date);

  const backToTemaLabel = labels.backToTema.replace('{tema}', tema.title);

  return (
    <article className="space-y-6">
      <div className="border border-border bg-code-bg p-2 sm:p-4">
        <Image
          src={item.url}
          alt={item.title}
          width={item.width}
          height={item.height}
          preload
          quality={85}
          sizes="100vw"
          placeholder={item.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={item.blurDataURL}
          className="mx-auto max-h-[80vh] w-auto object-contain"
        />
      </div>

      <header className="space-y-2 border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg sm:text-3xl">
          {item.title}
        </h1>

        {item.description && (
          <p className="font-mono text-sm leading-relaxed text-muted">
            {item.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-mono text-xs text-muted">
          <span>
            {labels.dateLabel} <time dateTime={item.date.toISOString()}>{formattedDate}</time>
          </span>
          {item.medium && (
            <span>
              {labels.mediumLabel} {item.medium}
            </span>
          )}
          {item.tags.length > 0 && (
            <span className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span key={tag} className="border border-border bg-code-bg px-1.5 py-0.5">
                  #{tag}
                </span>
              ))}
            </span>
          )}
        </div>
      </header>

      <nav
        aria-label="Navegação da galeria"
        className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs"
      >
        <div className="flex items-center gap-4">
          {prev ? (
            <Link
              href={prev.href as Route}
              className="inline-flex items-center gap-1 border border-border px-2.5 py-1.5 text-link hover:border-fg hover:underline"
            >
              &larr; {labels.previous}: {prev.title}
            </Link>
          ) : (
            <span className="inline-flex items-center border border-border/50 px-2.5 py-1.5 text-muted/50">
              &larr; {labels.previous}
            </span>
          )}

          {next ? (
            <Link
              href={next.href as Route}
              className="inline-flex items-center gap-1 border border-border px-2.5 py-1.5 text-link hover:border-fg hover:underline"
            >
              {labels.next}: {next.title} &rarr;
            </Link>
          ) : (
            <span className="inline-flex items-center border border-border/50 px-2.5 py-1.5 text-muted/50">
              {labels.next} &rarr;
            </span>
          )}
        </div>

        <Link
          href={tema.href as Route}
          className="inline-flex items-center gap-1 text-link hover:underline"
        >
          &larr; {backToTemaLabel}
        </Link>
      </nav>
    </article>
  );
}
