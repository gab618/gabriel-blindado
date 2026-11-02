import Link from 'next/link';
import type { Route } from 'next';

export interface BreadcrumbItem {
  label: string;
  href?: Route | string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  prefixLabel?: string;
  className?: string;
}

export function Breadcrumbs({
  items,
  prefixLabel = 'Localização:',
  className = '',
}: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-2 px-3 my-3 border border-border bg-code-bg font-mono text-xs ${className}`}
    >
      <span className="text-muted mr-2">{prefixLabel}</span>
      <ol className="inline-flex flex-wrap items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {index > 0 && <span className="text-border" aria-hidden="true">&gt;</span>}
              {isLast || !item.href ? (
                <span className="text-fg font-semibold" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href as Route}
                  className="text-link hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
