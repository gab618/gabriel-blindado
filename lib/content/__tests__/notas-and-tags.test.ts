import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug, getAllTags, getPostsByTag } from '../index';

describe('Notas & Tags Subsystem — Integration', () => {
  it('loads all Notas entries in descending chronological order', async () => {
    const notasPosts = await getAllPosts('pt', 'notas');
    expect(notasPosts.length).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < notasPosts.length - 1; i++) {
      expect(notasPosts[i].date.getTime()).toBeGreaterThanOrEqual(notasPosts[i + 1].date.getTime());
    }

    const first = notasPosts[0];
    expect(first.collection).toBe('notas');
    expect(first.href.startsWith('/pt/notas/')).toBe(true);
  });

  it('fetches a single Nota by slug', async () => {
    const post = await getPostBySlug('pt', 'notas', ['2026-11-04-o-silencio-da-manha']);
    expect(post).not.toBeNull();
    if (post) {
      expect(post.title).toContain('ritual do café');
      expect(post.body).toBeDefined();
      expect(post.collection).toBe('notas');
    }
  });

  it('aggregates tags and filters posts across collections', async () => {
    const tags = await getAllTags('pt');
    expect(tags.length).toBeGreaterThan(0);

    const reflexoesTag = tags.find((t) => t.tag === 'reflexoes');
    expect(reflexoesTag).toBeDefined();
    expect(reflexoesTag?.count).toBeGreaterThanOrEqual(2);

    // Deve retornar posts tanto de posts quanto de notas
    const reflexoesPosts = await getPostsByTag('pt', 'reflexoes');
    const collections = reflexoesPosts.map((p) => p.collection);
    expect(collections).toContain('posts');
    expect(collections).toContain('notas');
  });
});
