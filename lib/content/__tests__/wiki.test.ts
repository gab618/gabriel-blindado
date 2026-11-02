import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from '../index';

describe('Wiki Subsystem — Content Queries and Integration', () => {
  it('loads all wiki notes for pt locale', async () => {
    const wikiPosts = await getAllPosts('pt', 'wiki');
    expect(wikiPosts.length).toBeGreaterThanOrEqual(3);

    const systemdPost = wikiPosts.find((p) => p.slug.join('/') === 'linux/systemd');
    const cachePost = wikiPosts.find((p) => p.slug.join('/') === 'web/cache-components');

    expect(systemdPost).toBeDefined();
    expect(systemdPost?.title).toContain('Systemd');
    expect(systemdPost?.tags).toContain('linux');

    expect(cachePost).toBeDefined();
    expect(cachePost?.title).toContain('Cache Components');
  });

  it('fetches a single wiki note by nested slug with full body and TOC', async () => {
    const post = await getPostBySlug('pt', 'wiki', ['linux', 'systemd']);

    expect(post).not.toBeNull();
    if (post) {
      expect(post.title).toBe('Systemd: Gestão de Serviços e Timers');
      expect(post.toc.length).toBeGreaterThan(0);
      expect(post.toc.some((t) => t.id === 'comandos-fundamentais-de-controle')).toBe(true);
      expect(post.body).toBeDefined();
      expect(post.readingMinutes).toBeGreaterThanOrEqual(1);
    }
  });

  it('returns null when wiki note slug does not exist', async () => {
    const post = await getPostBySlug('pt', 'wiki', ['nao-existe', 'invalido']);
    expect(post).toBeNull();
  });
});
