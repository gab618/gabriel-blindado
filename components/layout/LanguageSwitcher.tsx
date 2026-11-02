import { ACTIVE_LOCALES, Locale, LOCALE_META } from '@/lib/i18n/config';

export interface LanguageSwitcherProps {
  currentLang: Locale;
  translations?: Partial<Record<Locale, string>>;
}

export function LanguageSwitcher({
  currentLang,
  translations,
}: LanguageSwitcherProps) {
  if (ACTIVE_LOCALES.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Language selection" className="flex items-center gap-2 text-xs font-mono">
      {ACTIVE_LOCALES.map((locale, idx) => {
        const isActive = locale === currentLang;
        const targetHref = translations?.[locale] || `/${locale}`;

        return (
          <span key={locale} className="inline-flex items-center gap-2">
            {idx > 0 && <span className="text-border">|</span>}
            {isActive ? (
              <span className="font-bold underline" aria-current="true">
                {LOCALE_META[locale].label}
              </span>
            ) : (
              <a
                href={targetHref}
                className="text-muted hover:text-fg underline"
                hrefLang={LOCALE_META[locale].bcp47}
              >
                {LOCALE_META[locale].label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
