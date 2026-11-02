import { type Locale, LOCALE_META } from './config';

export function formatDate(
  lang: Locale,
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(LOCALE_META[lang].bcp47, {
    ...options,
    timeZone: 'America/Sao_Paulo',
  }).format(d);
}
