import type { PostMeta } from '@/lib/types';
import type { Dictionary } from '@/lib/i18n/dictionaries/pt';
import { formatDate } from '@/lib/i18n/format';
import { TagList } from './TagList';

export interface PostMetaLineProps {
  meta: PostMeta;
  dictionary: Dictionary;
  className?: string;
}

export function PostMetaLine({ meta, dictionary, className = '' }: PostMetaLineProps) {
  const publishedDate = formatDate(meta.lang, meta.date);
  const updatedDate = meta.updated ? formatDate(meta.lang, meta.updated) : null;
  const readingTimeText = dictionary.posts.readingTime.replace(
    '{minutes}',
    String(meta.readingMinutes)
  );
  const statusLabel = dictionary.posts.status[meta.status] || meta.status;

  return (
    <div className={`border-y border-border py-2.5 my-3 font-mono text-xs text-muted space-y-1.5 ${className}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          <strong className="text-fg">{dictionary.posts.publishedAt}:</strong> {publishedDate}
        </span>

        {updatedDate && (
          <>
            <span className="text-border" aria-hidden="true">•</span>
            <span>
              <strong className="text-fg">{dictionary.posts.updatedAt}:</strong> {updatedDate}
            </span>
          </>
        )}

        <span className="text-border" aria-hidden="true">•</span>
        <span>
          <strong className="text-fg">{dictionary.posts.statusLabel}:</strong> {statusLabel}
        </span>

        <span className="text-border" aria-hidden="true">•</span>
        <span>{readingTimeText}</span>
      </div>

      {meta.tags && meta.tags.length > 0 && (
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-fg font-semibold">{dictionary.posts.tagsLabel}</span>
          <TagList tags={meta.tags} lang={meta.lang} />
        </div>
      )}
    </div>
  );
}
