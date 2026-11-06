import { describe, it, expect } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { GET as getFeed } from '@/app/[lang]/feed.xml/route';
import { siteConfig } from '@/lib/site';

describe('SEO, Sitemap, Robots & RSS Feed', () => {
  it('generates valid robots.txt configuration', () => {
    const robotsData = robots();

    expect(robotsData.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
    expect(robotsData.rules).toBeDefined();

    const rules = Array.isArray(robotsData.rules) ? robotsData.rules : [robotsData.rules];
    expect(rules.length).toBeGreaterThan(0);
    expect(rules[0].userAgent).toBe('*');
  });

  it('generates a complete, localized sitemap including core pages and posts', async () => {
    const sitemapEntries = await sitemap();

    expect(sitemapEntries.length).toBeGreaterThan(0);

    const urls = sitemapEntries.map((e) => e.url);

    // Core static routes
    expect(urls).toContain(`${siteConfig.url}/pt`);
    expect(urls).toContain(`${siteConfig.url}/pt/posts`);

    // Posts
    expect(urls).toContain(`${siteConfig.url}/pt/posts/bolo-de-cenoura`);
    expect(urls).toContain(`${siteConfig.url}/pt/posts/sobre-desacelerar-e-escrever`);

    // Every entry must have a valid lastModified date
    for (const entry of sitemapEntries) {
      expect(entry.lastModified).toBeDefined();
    }
  });

  it('generates a valid RSS 2.0 XML feed for active locale', async () => {
    const req = new Request('http://localhost:3000/pt/feed.xml');
    const res = await getFeed(req, {
      params: Promise.resolve({ lang: 'pt' }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/xml');

    const xml = await res.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
    expect(xml).toContain('<channel>');
    expect(xml).toContain('<title>');
    expect(xml).toContain('<item>');
    expect(xml).toContain('<guid isPermaLink="true">');
  });

  it('returns 404 for non-existent or inactive locale feed', async () => {
    const req = new Request('http://localhost:3000/xx/feed.xml');
    const res = await getFeed(req, {
      params: Promise.resolve({ lang: 'xx' }),
    });

    expect(res.status).toBe(404);
  });
});
