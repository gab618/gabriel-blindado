import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from '../index';

describe('Posts Subsystem — Content Queries and Integration', () => {
  it('loads all posts for pt locale', async () => {
    const posts = await getAllPosts('pt', 'posts');
    expect(posts.length).toBeGreaterThanOrEqual(2);

    const receitaPost = posts.find((p) => p.slug.join('/') === 'receitas/bolo-de-cenoura');
    const reflexaoPost = posts.find((p) => p.slug.join('/') === 'reflexoes/sobre-desacelerar-e-escrever');

    expect(receitaPost).toBeDefined();
    expect(receitaPost?.title).toContain('Bolo de Cenoura');
    expect(receitaPost?.tags).toContain('receitas');

    expect(reflexaoPost).toBeDefined();
    expect(reflexaoPost?.title).toContain('Desacelerar');
  });

  it('fetches a single post by nested slug with full body and TOC', async () => {
    const post = await getPostBySlug('pt', 'posts', ['receitas', 'bolo-de-cenoura']);

    expect(post).not.toBeNull();
    if (post) {
      expect(post.title).toBe('Bolo de Cenoura com Calda Crocante de Chocolate');
      expect(post.toc.length).toBeGreaterThan(0);
      expect(post.toc.some((t) => t.id === 'modo-de-preparo')).toBe(true);
      expect(post.body).toBeDefined();
      expect(post.readingMinutes).toBeGreaterThanOrEqual(1);
    }
  });

  it('returns null when post slug does not exist', async () => {
    const post = await getPostBySlug('pt', 'posts', ['nao-existe', 'invalido']);
    expect(post).toBeNull();
  });
});
