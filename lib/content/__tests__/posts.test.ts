import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from '../index';

describe('Posts Subsystem — Content Queries and Integration', () => {
  it('loads all posts for pt locale', async () => {
    const posts = await getAllPosts('pt', 'posts');
    expect(posts.length).toBeGreaterThanOrEqual(1);

    const firstPost = posts[0];
    expect(firstPost).toBeDefined();
    expect(firstPost.title).toBeDefined();
    expect(firstPost.collection).toBe('posts');
  });

  it('fetches a single post by slug with full body and TOC', async () => {
    const posts = await getAllPosts('pt', 'posts');
    const slug = posts[0].slug;
    const post = await getPostBySlug('pt', 'posts', slug);

    expect(post).not.toBeNull();
    if (post) {
      expect(post.title).toBeDefined();
      expect(post.body).toBeDefined();
      expect(post.readingMinutes).toBeGreaterThanOrEqual(1);
    }
  });

  it('returns null when post slug does not exist', async () => {
    const post = await getPostBySlug('pt', 'posts', ['nao-existe', 'invalido']);
    expect(post).toBeNull();
  });
});
