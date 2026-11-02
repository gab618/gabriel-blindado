import { describe, it, expect } from 'vitest';
import { getBacklinks } from '../index';

describe('Wiki Backlinks Subsystem', () => {
  it('correctly resolves backlinks pointing to a wiki note', async () => {
    const backlinks = await getBacklinks('pt', ['linux', 'systemd']);

    expect(backlinks.length).toBeGreaterThan(0);
    const slugs = backlinks.map((b) => b.slug.join('/'));
    expect(slugs).toContain('web/cache-components');
  });
});
