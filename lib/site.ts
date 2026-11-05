import type { Dictionary } from './i18n/dictionaries/pt';

export interface NavRoute {
  labelKey: keyof Dictionary['nav'];
  path: '/' | '/posts' | '/notas' | '/projetos' | '/tags';
  match?: 'exact' | 'prefix';
}

export const siteConfig = {
  name: 'gabrielblindado.com.br',
  author: 'Gabriel Blindado',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gabrielblindado.com.br',
  github: 'https://github.com/gab618',
  repo: 'https://github.com/gab618/gabriel-blindado',
  license: 'CC BY-SA 4.0',
  copyrightYear: '2026',
} as const;

export const NAV_ROUTES: readonly NavRoute[] = [
  { labelKey: 'home', path: '/', match: 'exact' },
  { labelKey: 'posts', path: '/posts', match: 'prefix' },
  { labelKey: 'notas', path: '/notas', match: 'prefix' },
  { labelKey: 'projetos', path: '/projetos', match: 'prefix' },
  { labelKey: 'tags', path: '/tags', match: 'prefix' },
] as const;
