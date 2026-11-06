import type React from 'react';
import type { Locale } from './i18n/config';
import type { PostFrontmatter } from './content/schema';

export type Collection = 'posts';

export interface PostMeta extends PostFrontmatter {
  lang: Locale;
  collection: Collection;
  slug: string[]; // ex: ['linux', 'systemd-units']
  href: string; // ex: '/pt/wiki/linux/systemd-units'
  translationKey: string; // chave canônica de tradução
  translations: Partial<Record<Locale, string>>; // locale -> href da versão traduzida
  sourcePath: string; // relativo à raiz (ex: content/pt/wiki/linux/systemd.md)
  readingMinutes: number;
}

export interface TocItem {
  depth: 2 | 3 | 4;
  id: string;
  text: string;
}

export interface Post extends PostMeta {
  toc: TocItem[];
  body: React.ReactNode;
}
