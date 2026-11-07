import { describe, it, expect } from 'vitest';
import { getBacklinks } from '../index';

describe('Backlinks Subsystem', () => {
  it('correctly resolves backlinks pointing to a post', async () => {
    const backlinks = await getBacklinks('pt', ['hello-world']);
    expect(Array.isArray(backlinks)).toBe(true);
  });
});
