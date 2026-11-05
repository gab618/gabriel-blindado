import type { MetadataRoute } from 'next';
import { ACTIVE_LOCALES, type Locale } from '@/lib/i18n/config';
import { getAllPosts, getAllTags } from '@/lib/content';
import { siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const entries: MetadataRoute.Sitemap = [];
  const defaultDate = new Date('2026-11-04T00:00:00Z');

  for (const lang of ACTIVE_LOCALES) {
    const locale = lang as Locale;

    // 1. Rotas estáticas principais
    const coreRoutes = [
      { path: `/${locale}`, priority: 1.0, freq: 'daily' as const },
      { path: `/${locale}/posts`, priority: 0.9, freq: 'daily' as const },
      { path: `/${locale}/notas`, priority: 0.8, freq: 'daily' as const },
      { path: `/${locale}/projetos`, priority: 0.8, freq: 'weekly' as const },
      { path: `/${locale}/tags`, priority: 0.7, freq: 'weekly' as const },
    ];

    for (const r of coreRoutes) {
      entries.push({
        url: `${baseUrl}${r.path}`,
        lastModified: defaultDate,
        changeFrequency: r.freq,
        priority: r.priority,
      });
    }

    // 2. Todos os posts (Posts, Notas e Projetos)
    const allPosts = await getAllPosts(locale);
    for (const post of allPosts) {
      const languages: Record<string, string> = {};
      for (const [tLang, tHref] of Object.entries(post.translations)) {
        languages[tLang] = `${baseUrl}${tHref}`;
      }

      entries.push({
        url: `${baseUrl}${post.href}`,
        lastModified: post.updated || post.date,
        changeFrequency: post.collection === 'notas' ? 'monthly' : 'weekly',
        priority: post.collection === 'posts' ? 0.8 : 0.7,
        alternates: Object.keys(languages).length > 0 ? { languages } : undefined,
      });
    }

    // 3. Páginas de Tags
    const tags = await getAllTags(locale);
    for (const tag of tags) {
      entries.push({
        url: `${baseUrl}/${locale}/tags/${tag}`,
        lastModified: defaultDate,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
