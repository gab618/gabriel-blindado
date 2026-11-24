import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { GaleriaTema } from '@/lib/galeria';
import type { Dictionary } from '@/lib/i18n/dictionaries/pt';

export interface TemaCardProps {
  tema: GaleriaTema;
  labels: Dictionary['galeria'];
}

export function TemaCard({ tema, labels }: TemaCardProps) {
  const countText = labels.itemsCount.replace('{count}', String(tema.count));

  return (
    <article className="group relative flex flex-col border border-border bg-bg transition-all duration-200 hover:-translate-y-1 hover:border-fg hover:shadow-[4px_4px_0_0_var(--color-fg)]">
      <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-code-bg">
        {tema.coverItem ? (
          <Image
            src={tema.coverItem.url}
            alt={tema.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            placeholder={tema.coverItem.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={tema.coverItem.blurDataURL}
            className="object-cover saturate-50 brightness-95 transition-all duration-300 ease-out group-hover:saturate-100 group-hover:brightness-100 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 font-mono text-sm font-bold text-muted">
            [{tema.slug}]
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5 font-mono">
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <Link
              href={tema.href as Route}
              className="text-base font-bold text-fg after:absolute after:inset-0 group-hover:text-link group-hover:underline"
            >
              {tema.title}
            </Link>
            <span className="shrink-0 text-xs text-muted">{countText}</span>
          </div>

          {tema.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted">
              {tema.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
