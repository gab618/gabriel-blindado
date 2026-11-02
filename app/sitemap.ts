import type { MetadataRoute } from 'next';
import { ACTIVE_LOCALES, type Locale } from '@/lib/i18n/config';
import { getAllPosts, getAllTags } from '@/lib/content';
import { TOOLS_REGISTRY } from '@/tools/registry';
import { siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const entries: MetadataRoute.Sitemap = [];
  const defaultDate = new Date('2026-11-02T00:00:00Z');

  for (const lang of ACTIVE_LOCALES) {
    const locale = lang as Locale;

    // 1. Rotas estáticas principais
    const coreRoutes = [
      { path: `/${locale}`, priority: 1.0, freq: 'daily' as const },
      { path: `/${locale}/wiki`, priority: 0.9, freq: 'daily' as const },
      { path: `/${locale}/til`, priority: 0.9, freq: 'daily' as const },
      { path: `/${locale}/tools`, priority: 0.8, freq: 'weekly' as const },
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

    // 2. Ferramentas do Registry
    for (const tool of TOOLS_REGISTRY) {
      entries.push({
        url: `${baseUrl}/${locale}/tools/${tool.slug}`,
        lastModified: new Date(tool.addedAt),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    // 3. Notas da Wiki
    const wikiPosts = await getAllPosts(locale, 'wiki');
    for (const post of wikiPosts) {
      const languages: Record<string, string> = {};
      for (const [tLang, tHref] of Object.entries(post.translations)) {
        languages[tLang] = `${baseUrl}${tHref}`;
      }

      entries.push({
        url: `${baseUrl}${post.href}`,
        lastModified: post.updated || post.date,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: Object.keys(languages).length > 0 ? { languages } : undefined,
      });
    }

    // 4. Registros do TIL
    const tilPosts = await getAllPosts(locale, 'til');
    for (const post of tilPosts) {
      const languages: Record<string, string> = {};
      for (const [tLang, tHref] of Object.entries(post.translations)) {
        languages[tLang] = `${baseUrl}${tHref}`;
      }

      entries.push({
        url: `${baseUrl}${post.href}`,
        lastModified: post.date,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: Object.keys(languages).length > 0 ? { languages } : undefined,
      });
    }

    // 5. Páginas de Tags
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
