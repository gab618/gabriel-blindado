import { describe, it, expect } from 'vitest';
import { parseMarkdownString } from '../parse';
import { compileMarkdown } from '../markdown';
import { ContentError } from '../errors';
import type { DiscoveredFile } from '../fs';
import { getAllPosts, getPostBySlug, getAllTags } from '../index';

describe('Content Layer — Parser and Schema Validation', () => {
  const dummyFile: DiscoveredFile = {
    absolutePath: '/dummy/content/pt/posts/reflexoes/sobre-desacelerar.md',
    sourcePath: 'content/pt/posts/reflexoes/sobre-desacelerar.md',
    lang: 'pt',
    collection: 'posts',
    slug: ['reflexoes', 'sobre-desacelerar'],
    defaultTranslationKey: 'posts/reflexoes/sobre-desacelerar',
  };

  it('correctly parses and validates valid frontmatter', () => {
    const raw = `---
title: "Sobre Desacelerar"
description: "Reflexão pessoal"
date: 2026-11-04
status: evergreen
tags:
  - reflexoes
  - vida
---
# Conteúdo principal
Texto de exemplo com várias palavras para cálculo de leitura.`;

    const { meta, content } = parseMarkdownString(raw, dummyFile);

    expect(meta.title).toBe('Sobre Desacelerar');
    expect(meta.description).toBe('Reflexão pessoal');
    expect(meta.tags).toEqual(['reflexoes', 'vida']);
    expect(meta.status).toBe('evergreen');
    expect(meta.translationKey).toBe('posts/reflexoes/sobre-desacelerar');
    expect(meta.href).toBe('/pt/posts/reflexoes/sobre-desacelerar');
    expect(meta.readingMinutes).toBeGreaterThanOrEqual(1);
    expect(content.trim()).toBe('# Conteúdo principal\nTexto de exemplo com várias palavras para cálculo de leitura.');
  });

  it('rejects missing required title with ContentError', () => {
    const raw = `---
description: "Sem título"
date: 2026-11-04
---
Conteúdo`;

    expect(() => parseMarkdownString(raw, dummyFile)).toThrowError(ContentError);
    try {
      parseMarkdownString(raw, dummyFile);
    } catch (err) {
      const cErr = err as ContentError;
      expect(cErr.filePath).toBe('content/pt/posts/reflexoes/sobre-desacelerar.md');
      expect(cErr.issues?.some((i) => i.path === 'title')).toBe(true);
    }
  });

  it('rejects invalid tag formatting (uppercase or spaces)', () => {
    const raw = `---
title: "Título"
date: 2026-11-04
tags:
  - Tag Invalida
---
Conteúdo`;

    expect(() => parseMarkdownString(raw, dummyFile)).toThrowError(ContentError);
  });

  it('uses custom translationKey if provided in frontmatter', () => {
    const raw = `---
title: "Título"
date: 2026-11-04
translationKey: "custom-key-123"
---
Conteúdo`;

    const { meta } = parseMarkdownString(raw, dummyFile);
    expect(meta.translationKey).toBe('custom-key-123');
  });
});

describe('Content Layer — Markdown Compilation and Plugins', () => {
  it('compiles markdown and extracts TOC from headings', async () => {
    const source = `
# Título H1 (ignorado do TOC)
Intro.

## Primeira Seção
Texto 1.

### Subseção A
Texto 2.

## Segunda Seção
Texto 3.
`;

    const { hast, toc } = await compileMarkdown(source, 'pt');

    expect(hast.type).toBe('root');
    expect(toc).toHaveLength(3);
    expect(toc[0]).toEqual({
      depth: 2,
      id: 'primeira-seção',
      text: 'Primeira Seção',
    });
    expect(toc[1]).toEqual({
      depth: 3,
      id: 'subseção-a',
      text: 'Subseção A',
    });
    expect(toc[2]).toEqual({
      depth: 2,
      id: 'segunda-seção',
      text: 'Segunda Seção',
    });
  });

  it('transforms admonitions (> [!WARNING]) in AST', async () => {
    const source = `
> [!WARNING]
> Cuidado ao cozinhar com fogo alto.
`;

    const { hast } = await compileMarkdown(source, 'pt');
    const hasAdmonition = JSON.stringify(hast).includes('"tagName":"admonition"');
    expect(hasAdmonition).toBe(true);
  });

  it('transforms wikilinks into relative links', async () => {
    const source = `
Consulte a receita em [[bolo-de-cenoura|Bolo de Cenoura]].
`;

    const { hast } = await compileMarkdown(source, 'pt');
    const hastJson = JSON.stringify(hast);
    expect(hastJson).toContain('href":"/pt/posts/bolo-de-cenoura');
    expect(hastJson).toContain('Bolo de Cenoura');
  });
});

describe('Content Layer — Real Content Discovery & Queries', () => {
  it('loads real posts from disk in content/pt/', async () => {
    const posts = await getAllPosts('pt');
    expect(posts.length).toBeGreaterThanOrEqual(1);

    const postItem = posts.find((p) => p.collection === 'posts');
    expect(postItem).toBeDefined();
  });

  it('compiles full post via getPostBySlug', async () => {
    const posts = await getAllPosts('pt', 'posts');
    const post = await getPostBySlug('pt', 'posts', posts[0].slug);
    expect(post).not.toBeNull();
    if (post) {
      expect(post.title).toBeDefined();
      expect(post.body).toBeDefined();
    }
  });

  it('aggregates tags correctly across posts', async () => {
    const tags = await getAllTags('pt');
    expect(tags.length).toBeGreaterThan(0);
    const tagNames = tags.map((t) => t.tag);
    expect(tagNames.length).toBeGreaterThan(0);
  });
});
