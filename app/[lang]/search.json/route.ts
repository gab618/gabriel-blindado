import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getAllPosts } from '@/lib/content';
import type { Collection } from '@/lib/types';

export async function generateStaticParams() {
  return ACTIVE_LOCALES.map((lang) => ({ lang }));
}

export interface SearchIndexItem {
  title: string;
  href: string;
  collection: Collection;
  tags: string[];
  description: string;
}

export async function GET(
  _request: Request,
  props: { params: Promise<{ lang: string }> }
) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    return new Response('Not Found', { status: 404 });
  }

  const locale = currentLang as Locale;
  const items: SearchIndexItem[] = [];

  const allPosts = await getAllPosts(locale);
  for (const post of allPosts) {
    items.push({
      title: post.title,
      href: post.href,
      collection: post.collection,
      tags: post.tags,
      description: post.description || '',
    });
  }

  return Response.json(items, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate',
    },
  });
}
