import type { TocItem } from '@/lib/types';

export interface TocProps {
  items: TocItem[];
  title?: string;
  className?: string;
}

export function Toc({ items, title = 'Índice de Seções', className = '' }: TocProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label={title}
      className={`my-4 p-3 border border-border bg-code-bg/40 max-w-sm ${className}`}
    >
      <div className="font-mono text-xs font-bold text-fg border-b border-border pb-1 mb-2 tracking-wide uppercase">
        [{title}]
      </div>
      <ol className="list-none p-0 m-0 space-y-1 font-mono text-xs">
        {items.map((item) => {
          const indent =
            item.depth === 3
              ? 'pl-3 border-l border-border ml-1'
              : item.depth === 4
                ? 'pl-6 border-l border-border ml-1'
                : '';

          return (
            <li key={item.id} className={indent}>
              <a
                href={`#${item.id}`}
                className="text-link hover:underline block truncate"
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
