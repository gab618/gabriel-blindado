export const LOCALES = ['pt', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const ACTIVE_LOCALES: readonly Locale[] = ['pt'];
export const DEFAULT_LOCALE: Locale = 'pt';

export const LOCALE_META: Record<
  Locale,
  { bcp47: string; label: string; ogLocale: string }
> = {
  pt: { bcp47: 'pt-BR', label: 'Português', ogLocale: 'pt_BR' },
  en: { bcp47: 'en-US', label: 'English', ogLocale: 'en_US' },
};

export const isLocale = (v: string): v is Locale =>
  (LOCALES as readonly string[]).includes(v);

export type Localized<T = string> = { [K in Locale]?: T } & {
  [DEFAULT_LOCALE]: T;
};
