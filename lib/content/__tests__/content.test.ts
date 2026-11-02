import { describe, it, expect } from 'vitest';
import { parseMarkdownString } from '../parse';
import { compileMarkdown } from '../markdown';
import { ContentError } from '../errors';
import type { DiscoveredFile } from '../fs';
import { getAllPosts, getPostBySlug, getAllTags } from '../index';

describe('Content Layer — Parser and Schema Validation', () => {
  const dummyFile: DiscoveredFile = {
    absolutePath: '/dummy/content/pt/wiki/linux/arch.md',
    sourcePath: 'content/pt/wiki/linux/arch.md',
    lang: 'pt',
    collection: 'wiki',
    slug: ['linux', 'arch'],
    defaultTranslationKey: 'wiki/linux/arch',
  };

  it('correctly parses and validates valid frontmatter', () => {
    const raw = `---
title: "Arch Linux Setup"
description: "Guia de instalação minimalista"
date: 2026-11-02
status: evergreen
tags:
  - linux
  - arch
---
# Conteúdo principal
Texto de exemplo com várias palavras para cálculo de leitura.`;

    const { meta, content } = parseMarkdownString(raw, dummyFile);

    expect(meta.title).toBe('Arch Linux Setup');
    expect(meta.description).toBe('Guia de instalação minimalista');
    expect(meta.tags).toEqual(['linux', 'arch']);
    expect(meta.status).toBe('evergreen');
    expect(meta.translationKey).toBe('wiki/linux/arch');
    expect(meta.href).toBe('/pt/wiki/linux/arch');
    expect(meta.readingMinutes).toBeGreaterThanOrEqual(1);
    expect(content.trim()).toBe('# Conteúdo principal\nTexto de exemplo com várias palavras para cálculo de leitura.');
  });

  it('rejects missing required title with ContentError', () => {
    const raw = `---
description: "Sem título"
date: 2026-11-02
---
Conteúdo`;

    expect(() => parseMarkdownString(raw, dummyFile)).toThrowError(ContentError);
    try {
      parseMarkdownString(raw, dummyFile);
    } catch (err) {
      const cErr = err as ContentError;
      expect(cErr.filePath).toBe('content/pt/wiki/linux/arch.md');
      expect(cErr.issues?.some((i) => i.path === 'title')).toBe(true);
    }
  });

  it('rejects invalid tag formatting (uppercase or spaces)', () => {
    const raw = `---
title: "Título"
date: 2026-11-02
tags:
  - Linux Invalido
---
Conteúdo`;

    expect(() => parseMarkdownString(raw, dummyFile)).toThrowError(ContentError);
  });

  it('uses custom translationKey if provided in frontmatter', () => {
    const raw = `---
title: "Título"
date: 2026-11-02
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
> Cuidado ao rodar comandos como root.
`;

    const { hast } = await compileMarkdown(source, 'pt');
    // Verifica se existe um elemento admonition no HAST
    const hasAdmonition = JSON.stringify(hast).includes('"tagName":"admonition"');
    expect(hasAdmonition).toBe(true);
  });

  it('transforms wikilinks into relative wiki links', async () => {
    const source = `
Consulte a documentação em [[linux/arch|Guia Arch]].
`;

    const { hast } = await compileMarkdown(source, 'pt');
    const hastJson = JSON.stringify(hast);
    expect(hastJson).toContain('href":"/pt/wiki/linux/arch');
    expect(hastJson).toContain('Guia Arch');
  });
});

describe('Content Layer — Real Content Discovery & Queries', () => {
  it('loads real posts from disk in content/pt/', async () => {
    const posts = await getAllPosts('pt');
    expect(posts.length).toBeGreaterThanOrEqual(2);

    const wikiPost = posts.find((p) => p.collection === 'wiki');
    const tilPost = posts.find((p) => p.collection === 'til');

    expect(wikiPost).toBeDefined();
    expect(tilPost).toBeDefined();
  });

  it('compiles full post via getPostBySlug', async () => {
    const post = await getPostBySlug('pt', 'wiki', []);
    expect(post).not.toBeNull();
    if (post) {
      expect(post.title).toContain('Wiki Técnica');
      expect(post.body).toBeDefined();
      expect(post.toc.length).toBeGreaterThan(0);
    }
  });

  it('aggregates tags correctly across posts', async () => {
    const tags = await getAllTags('pt');
    expect(tags.length).toBeGreaterThan(0);
    const tagNames = tags.map((t) => t.tag);
    expect(tagNames).toContain('meta');
    expect(tagNames).toContain('wiki');
  });
});
