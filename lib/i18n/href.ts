import type { Route } from 'next';
import { Locale, DEFAULT_LOCALE } from './config';

/**
 * Cria URLs canônicas com prefixo de locale.
 * Exemplo: href('pt', '/wiki/linux') -> '/pt/wiki/linux'
 */
export function href(locale: Locale = DEFAULT_LOCALE, path: string = ''): Route {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/') {
    return `/${locale}` as Route;
  }
  return `/${locale}${cleanPath}` as Route;
}
