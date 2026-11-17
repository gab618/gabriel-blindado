import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from '../index';
import { parseMarkdownString } from '../parse';
import { ContentError } from '../errors';
import type { DiscoveredFile } from '../fs';

describe('Projetos Subsystem — Content Queries and Schema', () => {
  const dummyProjetoFile: DiscoveredFile = {
    absolutePath: '/dummy/content/pt/projetos/projeto-futuro.md',
    sourcePath: 'content/pt/projetos/projeto-futuro.md',
    lang: 'pt',
    collection: 'projetos',
    slug: ['projeto-futuro'],
    defaultTranslationKey: 'projetos/projeto-futuro',
  };

  it('loads all projects ordered by order ascending', async () => {
    const projects = await getAllPosts('pt', 'projetos');
    expect(projects.length).toBeGreaterThanOrEqual(3);

    const slugs = projects.map((p) => p.slug.join('/'));
    expect(slugs).toEqual(['gabrielblindado', 'cade-a-rosenda', 'tirarotarot']);

    expect(projects[0].url).toBe('https://gabrielblindado.com.br');
    expect(projects[1].url).toBe('https://cade-a-rosenda.vercel.app');
    expect(projects[2].url).toBe('https://tirarotarot.com.br');
    expect(projects[0].cover).toBe('/projetos/gabrielblindado.svg');
  });

  it('fetches a single project by slug with body and metadata', async () => {
    const project = await getPostBySlug('pt', 'projetos', ['cade-a-rosenda']);
    expect(project).not.toBeNull();
    if (project) {
      expect(project.title).toBe('Cadê a Rosenda');
      expect(project.url).toBe('https://cade-a-rosenda.vercel.app');
      expect(project.cover).toBe('/projetos/cade-a-rosenda.svg');
      expect(project.body).toBeDefined();
    }
  });

  it('accepts a project without url (coming soon state)', () => {
    const raw = `---
title: "Projeto Secreto"
description: "Ainda em construção"
date: 2026-11-17
cover: "/projetos/gabrielblindado.svg"
order: 4
---
Detalhes do projeto em andamento.`;

    const { meta } = parseMarkdownString(raw, dummyProjetoFile);
    expect(meta.title).toBe('Projeto Secreto');
    expect(meta.url).toBeUndefined();
    expect(meta.cover).toBe('/projetos/gabrielblindado.svg');
    expect(meta.order).toBe(4);
  });

  it('rejects a project with an invalid url format', () => {
    const raw = `---
title: "Projeto Inválido"
date: 2026-11-17
url: "nao-e-uma-url"
---
Corpo`;

    expect(() => parseMarkdownString(raw, dummyProjetoFile)).toThrowError(ContentError);
  });
});
