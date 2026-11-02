import { describe, it, expect } from 'vitest';
import { GET as getSearchIndex, type SearchIndexItem } from '@/app/[lang]/search.json/route';

describe('Search Index JSON Endpoint', () => {
  it('generates a complete JSON search index for active locale', async () => {
    const req = new Request('http://localhost:3000/pt/search.json');
    const res = await getSearchIndex(req, {
      params: Promise.resolve({ lang: 'pt' }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/json');

    const data = (await res.json()) as SearchIndexItem[];
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    const collections = new Set(data.map((item) => item.collection));
    expect(collections.has('tool')).toBe(true);
    expect(collections.has('wiki')).toBe(true);
    expect(collections.has('til')).toBe(true);

    // Verify properties on items
    for (const item of data) {
      expect(item.title).toBeDefined();
      expect(item.href).toBeDefined();
      expect(item.collection).toBeDefined();
      expect(Array.isArray(item.tags)).toBe(true);
    }
  });

  it('returns 404 when requesting search.json for unknown locale', async () => {
    const req = new Request('http://localhost:3000/xx/search.json');
    const res = await getSearchIndex(req, {
      params: Promise.resolve({ lang: 'xx' }),
    });

    expect(res.status).toBe(404);
  });
});
