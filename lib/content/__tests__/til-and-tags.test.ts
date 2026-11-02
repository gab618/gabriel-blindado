import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug, getAllTags, getPostsByTag } from '../index';

describe('TIL & Tags Subsystem — Integration', () => {
  it('loads all TIL entries in descending chronological order', async () => {
    const tilPosts = await getAllPosts('pt', 'til');
    expect(tilPosts.length).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < tilPosts.length - 1; i++) {
      expect(tilPosts[i].date.getTime()).toBeGreaterThanOrEqual(tilPosts[i + 1].date.getTime());
    }

    const first = tilPosts[0];
    expect(first.collection).toBe('til');
    expect(first.href.startsWith('/pt/til/')).toBe(true);
  });

  it('fetches a single TIL note by slug', async () => {
    const post = await getPostBySlug('pt', 'til', ['2026-11-02-primeiras-impressoes']);
    expect(post).not.toBeNull();
    if (post) {
      expect(post.title).toContain('Cache Components');
      expect(post.body).toBeDefined();
      expect(post.collection).toBe('til');
    }
  });

  it('aggregates tags and filters posts across collections', async () => {
    const tags = await getAllTags('pt');
    expect(tags.length).toBeGreaterThan(0);

    const devopsTag = tags.find((t) => t.tag === 'devops');
    expect(devopsTag).toBeDefined();
    expect(devopsTag?.count).toBeGreaterThanOrEqual(2);

    // Deve retornar posts tanto da wiki quanto do til
    const devopsPosts = await getPostsByTag('pt', 'devops');
    const collections = devopsPosts.map((p) => p.collection);
    expect(collections).toContain('wiki');
    expect(collections).toContain('til');
  });
});
