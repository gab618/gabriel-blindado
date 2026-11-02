import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getAllPosts } from '@/lib/content';
import { TOOLS_REGISTRY } from '@/tools/registry';
import { href } from '@/lib/i18n/href';

export async function generateStaticParams() {
  return ACTIVE_LOCALES.map((lang) => ({ lang }));
}

export interface SearchIndexItem {
  title: string;
  href: string;
  collection: 'wiki' | 'til' | 'tool';
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

  // 1. Ferramentas
  for (const tool of TOOLS_REGISTRY) {
    items.push({
      title: tool.title[locale] || tool.title.pt,
      href: href(locale, `/tools/${tool.slug}`),
      collection: 'tool',
      tags: [...tool.keywords],
      description: tool.description[locale] || tool.description.pt,
    });
  }

  // 2. Wiki
  const wikiPosts = await getAllPosts(locale, 'wiki');
  for (const post of wikiPosts) {
    items.push({
      title: post.title,
      href: post.href,
      collection: 'wiki',
      tags: post.tags,
      description: post.description || '',
    });
  }

  // 3. TIL
  const tilPosts = await getAllPosts(locale, 'til');
  for (const post of tilPosts) {
    items.push({
      title: post.title,
      href: post.href,
      collection: 'til',
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
