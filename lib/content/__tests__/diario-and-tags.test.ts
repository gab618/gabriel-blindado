import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug, getAllTags, getPostsByTag } from '../index';

describe('Diário & Tags Subsystem — Integration', () => {
  it('loads all Diário entries in descending chronological order', async () => {
    const diarioPosts = await getAllPosts('pt', 'diario');
    expect(diarioPosts.length).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < diarioPosts.length - 1; i++) {
      expect(diarioPosts[i].date.getTime()).toBeGreaterThanOrEqual(diarioPosts[i + 1].date.getTime());
    }

    const first = diarioPosts[0];
    expect(first.collection).toBe('diario');
    expect(first.href.startsWith('/pt/diario/')).toBe(true);
  });

  it('fetches a single Diário note by slug', async () => {
    const post = await getPostBySlug('pt', 'diario', ['2026-11-04-o-silencio-da-manha']);
    expect(post).not.toBeNull();
    if (post) {
      expect(post.title).toContain('ritual do café');
      expect(post.body).toBeDefined();
      expect(post.collection).toBe('diario');
    }
  });

  it('aggregates tags and filters posts across collections', async () => {
    const tags = await getAllTags('pt');
    expect(tags.length).toBeGreaterThan(0);

    const reflexoesTag = tags.find((t) => t.tag === 'reflexoes');
    expect(reflexoesTag).toBeDefined();
    expect(reflexoesTag?.count).toBeGreaterThanOrEqual(2);

    // Deve retornar posts tanto de escritos quanto de diario
    const reflexoesPosts = await getPostsByTag('pt', 'reflexoes');
    const collections = reflexoesPosts.map((p) => p.collection);
    expect(collections).toContain('escritos');
    expect(collections).toContain('diario');
  });
});
