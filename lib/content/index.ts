import 'server-only';
import { cacheLife } from 'next/cache';
import { ACTIVE_LOCALES, type Locale } from '../i18n/config';
import type { Collection, Post, PostMeta } from '../types';
import { discoverFiles } from './fs';
import { parseMarkdownFile } from './parse';
import { compileMarkdown } from './markdown';
import { renderHastToJsx } from './render';
import { ContentError } from './errors';

const COLLECTIONS: Collection[] = ['escritos', 'diario', 'projetos'];

/**
 * Lê e indexa todos os metadados brutos de todas as coleções de um idioma
 */
async function loadRawPosts(lang: Locale): Promise<PostMeta[]> {
  const isProd = process.env.NODE_ENV === 'production';
  const allDiscovered = (
    await Promise.all(COLLECTIONS.map((col) => discoverFiles(lang, col)))
  ).flat();

  const parsed = await Promise.all(
    allDiscovered.map(async (file) => {
      const { meta } = await parseMarkdownFile(file);
      return meta;
    })
  );

  // Filtra rascunhos em produção
  return parsed.filter((p) => !isProd || !p.draft);
}

/**
 * Valida a integridade dos posts de um locale (detecta colisões e duplicatas)
 */
function validateIntegrity(posts: PostMeta[], lang: Locale) {
  const slugSet = new Set<string>();
  const translationKeySet = new Set<string>();

  for (const post of posts) {
    const slugKey = `${post.collection}:${post.slug.join('/')}`;
    if (slugSet.has(slugKey)) {
      throw new ContentError(
        post.sourcePath,
        `Slug duplicado detectado para a coleção "${post.collection}": [${post.slug.join(', ')}]`
      );
    }
    slugSet.add(slugKey);

    if (translationKeySet.has(post.translationKey)) {
      throw new ContentError(
        post.sourcePath,
        `translationKey duplicada detectada no locale "${lang}": "${post.translationKey}"`
      );
    }
    translationKeySet.add(post.translationKey);
  }
}

/**
 * Retorna todos os posts indexados para um idioma, com traduções resolvidas
 */
export async function getAllPosts(
  lang: Locale,
  collection?: Collection
): Promise<PostMeta[]> {
  'use cache';
  cacheLife('max');

  // Carrega posts do locale solicitado
  const posts = await loadRawPosts(lang);
  validateIntegrity(posts, lang);

  // Se houver mais de um locale ativo, resolve as traduções cruzadas
  if (ACTIVE_LOCALES.length > 1) {
    const otherLocales = ACTIVE_LOCALES.filter((l) => l !== lang);
    const otherPostsByLocale = await Promise.all(
      otherLocales.map(async (otherLang) => {
        const list = await loadRawPosts(otherLang);
        return { otherLang, map: new Map(list.map((p) => [p.translationKey, p.href])) };
      })
    );

    for (const post of posts) {
      for (const { otherLang, map } of otherPostsByLocale) {
        const translatedHref = map.get(post.translationKey);
        if (translatedHref) {
          post.translations[otherLang] = translatedHref;
        }
      }
    }
  }

  // Ordena por data decrescente (mais recentes primeiro)
  posts.sort((a, b) => b.date.getTime() - a.date.getTime());

  if (collection) {
    return posts.filter((p) => p.collection === collection);
  }

  return posts;
}

/**
 * Carrega e compila o post completo (com HAST, TOC e JSX) por slug
 */
export async function getPostBySlug(
  lang: Locale,
  collection: Collection,
  slug: string[]
): Promise<Post | null> {
  'use cache';
  cacheLife('max');

  const files = await discoverFiles(lang, collection);
  const targetSlugStr = slug.join('/');

  const matchedFile = files.find((f) => f.slug.join('/') === targetSlugStr);
  if (!matchedFile) {
    return null;
  }

  const { meta, content } = await parseMarkdownFile(matchedFile);

  // Se for rascunho em produção, oculta
  if (process.env.NODE_ENV === 'production' && meta.draft) {
    return null;
  }

  // Resolve traduções para o post individual
  if (ACTIVE_LOCALES.length > 1) {
    const otherLocales = ACTIVE_LOCALES.filter((l) => l !== lang);
    await Promise.all(
      otherLocales.map(async (otherLang) => {
        const otherFiles = await discoverFiles(otherLang, collection);
        for (const ofile of otherFiles) {
          const oParsed = await parseMarkdownFile(ofile);
          if (oParsed.meta.translationKey === meta.translationKey) {
            meta.translations[otherLang] = oParsed.meta.href;
          }
        }
      })
    );
  }

  // Compila o markdown para HAST + TOC
  const { hast, toc } = await compileMarkdown(content, lang);
  const body = renderHastToJsx(hast, { lang });

  return {
    ...meta,
    toc,
    body,
  };
}

/**
 * Retorna todas as tags com suas respectivas contagens
 */
export async function getAllTags(
  lang: Locale
): Promise<{ tag: string; count: number }[]> {
  'use cache';
  cacheLife('max');

  const posts = await getAllPosts(lang);
  const countMap = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      countMap.set(tag, (countMap.get(tag) || 0) + 1);
    }
  }

  return Array.from(countMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Retorna posts filtrados por tag
 */
export async function getPostsByTag(
  lang: Locale,
  tag: string
): Promise<PostMeta[]> {
  'use cache';
  cacheLife('max');

  const posts = await getAllPosts(lang);
  return posts.filter((p) => p.tags.includes(tag));
}

/**
 * Retorna notas que apontam para o slug atual (Backlinks)
 */
export async function getBacklinks(
  lang: Locale,
  targetSlug: string[]
): Promise<PostMeta[]> {
  'use cache';
  cacheLife('max');

  const targetPath = targetSlug.join('/');
  const lastSegment = targetSlug[targetSlug.length - 1];
  const allFiles = (
    await Promise.all(COLLECTIONS.map((col) => discoverFiles(lang, col)))
  ).flat();

  const backlinks: PostMeta[] = [];

  for (const file of allFiles) {
    if (file.slug.join('/') === targetPath) continue;

    const { meta, content } = await parseMarkdownFile(file);
    if (process.env.NODE_ENV === 'production' && meta.draft) continue;

    // Procura wikilinks [[targetPath]] ou [[lastSegment]] ou links markdown para o target
    const mentionsTarget =
      content.includes(`[[${targetPath}`) ||
      content.includes(`[[${lastSegment}`) ||
      content.includes(`/wiki/${targetPath}`);

    if (mentionsTarget) {
      backlinks.push(meta);
    }
  }

  return backlinks;
}
