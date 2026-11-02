import Link from 'next/link';
import type { Route } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { href } from '@/lib/i18n/href';

export interface TagListProps {
  tags: string[];
  lang: Locale;
  className?: string;
}

export function TagList({ tags, lang, className = '' }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <ul className={`inline-flex flex-wrap items-center gap-1.5 list-none p-0 m-0 ${className}`}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={href(lang, `/tags/${tag}`) as Route}
            className="inline-block px-1.5 py-0.5 font-mono text-xs border border-border bg-code-bg text-fg hover:border-link hover:text-link transition-colors"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
