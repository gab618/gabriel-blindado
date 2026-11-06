import { describe, it, expect } from 'vitest';
import { getBacklinks } from '../index';

describe('Backlinks Subsystem', () => {
  it('correctly resolves backlinks pointing to a post', async () => {
    const backlinks = await getBacklinks('pt', ['bolo-de-cenoura']);

    expect(backlinks.length).toBeGreaterThan(0);
    const slugs = backlinks.map((b) => b.slug.join('/'));
    expect(slugs).toContain('sobre-desacelerar-e-escrever');
  });
});
