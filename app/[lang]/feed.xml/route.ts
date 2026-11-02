import { ACTIVE_LOCALES, isLocale, LOCALE_META, type Locale } from '@/lib/i18n/config';
import { getAllPosts } from '@/lib/content';
import { siteConfig } from '@/lib/site';

export async function generateStaticParams() {
  return ACTIVE_LOCALES.map((lang) => ({ lang }));
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
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
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const feedUrl = `${baseUrl}/${locale}/feed.xml`;
  const siteUrl = `${baseUrl}/${locale}`;

  // Busca todos os posts da wiki e til ordenados por data
  const wikiPosts = await getAllPosts(locale, 'wiki');
  const tilPosts = await getAllPosts(locale, 'til');
  const allPosts = [...wikiPosts, ...tilPosts].sort(
    (a, b) => (b.updated || b.date).getTime() - (a.updated || a.date).getTime()
  );

  const channelTitle = `${siteConfig.author} — Wiki & TIL (${LOCALE_META[locale].label})`;
  const channelDescription =
    locale === 'pt'
      ? 'Notas técnicas, TILs e documentação de engenharia de software.'
      : 'Technical notes, TILs, and software engineering documentation.';

  const latestPostDate = allPosts[0]?.updated || allPosts[0]?.date || new Date('2026-11-02T00:00:00Z');

  const itemsXml = allPosts
    .map((post) => {
      const itemUrl = `${baseUrl}${post.href}`;
      const pubDate = (post.updated || post.date).toUTCString();
      const title = escapeXml(post.title);
      const description = escapeXml(post.description || post.title);

      return `    <item>
      <title>${title}</title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>${LOCALE_META[locale].bcp47}</language>
    <lastBuildDate>${latestPostDate.toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate',
    },
  });
}
