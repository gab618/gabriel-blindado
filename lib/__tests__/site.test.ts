import { describe, it, expect } from 'vitest';
import { NAV_ROUTES, siteConfig } from '../site';
import { pt } from '../i18n/dictionaries/pt';
import { en } from '../i18n/dictionaries/en';

describe('site configuration and navigation routes', () => {
  it('siteConfig has valid URLs and author info', () => {
    expect(siteConfig.name).toBe('gabrielblindado.com.br');
    expect(siteConfig.author).toBe('Gabriel Blindado');
    expect(siteConfig.url).toContain('https://');
    expect(siteConfig.github).toContain('github.com');
  });

  it('NAV_ROUTES all correspond to valid nav dictionary keys', () => {
    expect(NAV_ROUTES.length).toBeGreaterThanOrEqual(2);

    for (const route of NAV_ROUTES) {
      expect(pt.nav[route.labelKey]).toBeDefined();
      expect(en.nav[route.labelKey]).toBeDefined();
      expect(route.path.startsWith('/')).toBe(true);
    }
  });

  it('dictionaries have matching new sections (site, breadcrumbs, admonition, styleguide)', () => {
    expect(Object.keys(pt.site)).toEqual(Object.keys(en.site));
    expect(Object.keys(pt.breadcrumbs)).toEqual(Object.keys(en.breadcrumbs));
    expect(Object.keys(pt.admonition)).toEqual(Object.keys(en.admonition));
    expect(Object.keys(pt.styleguide)).toEqual(Object.keys(en.styleguide));
  });
});
