import { lang } from 'next/root-params';
import { notFound } from 'next/navigation';
import { isLocale, Locale } from './config';
import { pt, type Dictionary } from './dictionaries/pt';
import { en } from './dictionaries/en';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pt: () => Promise.resolve(pt),
  en: () => Promise.resolve(en),
};

export async function getDictionary(): Promise<Dictionary> {
  const currentLang = await lang();
  if (!isLocale(currentLang)) {
    notFound();
  }
  return dictionaries[currentLang]();
}
