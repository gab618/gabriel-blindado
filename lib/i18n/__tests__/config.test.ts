import { describe, it, expect } from 'vitest';
import { LOCALES, ACTIVE_LOCALES, DEFAULT_LOCALE, isLocale, LOCALE_META } from '../config';
import { href } from '../href';
import { pt } from '../dictionaries/pt';
import { en } from '../dictionaries/en';

describe('i18n configuration and helpers', () => {
  it('should have valid locale constants', () => {
    expect(LOCALES).toContain('pt');
    expect(LOCALES).toContain('en');
    expect(ACTIVE_LOCALES).toEqual(['pt']);
    expect(DEFAULT_LOCALE).toBe('pt');
  });

  it('isLocale identifies valid and invalid locales', () => {
    expect(isLocale('pt')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('es')).toBe(false);
    expect(isLocale('')).toBe(false);
  });

  it('href formats canonical paths with locale', () => {
    expect(href('pt', '/')).toBe('/pt');
    expect(href('pt', '')).toBe('/pt');
    expect(href('pt', '/wiki/linux')).toBe('/pt/wiki/linux');
    expect(href('pt', 'wiki/linux')).toBe('/pt/wiki/linux');
    expect(href('en', '/tools')).toBe('/en/tools');
  });

  it('dictionaries have matching structure', () => {
    expect(Object.keys(pt)).toEqual(Object.keys(en));
    expect(Object.keys(pt.nav)).toEqual(Object.keys(en.nav));
    expect(Object.keys(pt.notFound)).toEqual(Object.keys(en.notFound));
  });

  it('LOCALE_META contains BCP47 codes for all locales', () => {
    for (const loc of LOCALES) {
      expect(LOCALE_META[loc]).toBeDefined();
      expect(LOCALE_META[loc].bcp47).toBeTruthy();
    }
  });
});
