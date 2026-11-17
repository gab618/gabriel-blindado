import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { PostMeta } from '@/lib/types';
import type { Dictionary } from '@/lib/i18n/dictionaries/pt';

export interface ProjectCardProps {
  project: PostMeta;
  labels: Dictionary['projetos'];
}

export function ProjectCard({ project, labels }: ProjectCardProps) {
  const isSvg = project.cover?.endsWith('.svg') ?? false;
  const openLabel = labels.openInNewTab.replace('{title}', project.title);

  return (
    <article
      className="group relative flex flex-col border border-border bg-bg transition-all duration-200 hover:-translate-y-1 hover:border-fg hover:shadow-[4px_4px_0_0_var(--color-fg)]"
    >
      {/* Thumbnail 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-code-bg">
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.title}
            fill
            unoptimized={isSvg}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover saturate-50 brightness-95 transition-all duration-300 ease-out group-hover:saturate-100 group-hover:brightness-100 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 font-mono text-sm font-bold text-muted">
            [{project.title}]
          </div>
        )}
      </div>

      {/* Rodapé do card: Título + Ícone de acesso direto (ou selo "em breve") */}
      <div className="flex flex-1 flex-col justify-between p-3.5 font-mono">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={project.href as Route}
              className="text-base font-bold text-fg after:absolute after:inset-0 group-hover:text-link group-hover:underline"
            >
              {project.title}
            </Link>

            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={openLabel}
                title={openLabel}
                className="relative z-10 inline-flex h-6 w-6 shrink-0 items-center justify-center border border-border bg-bg text-xs text-muted transition-colors hover:border-fg hover:bg-fg hover:text-bg"
              >
                ↗
              </a>
            ) : (
              <span className="relative z-10 shrink-0 border border-border bg-code-bg px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                {labels.comingSoon}
              </span>
            )}
          </div>

          {project.description && (
            <p className="line-clamp-2 font-mono text-xs leading-relaxed text-muted">
              {project.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
