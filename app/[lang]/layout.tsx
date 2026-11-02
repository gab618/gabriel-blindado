import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, LOCALE_META, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import '../globals.css';

export const ensureStatic = 'navigation';

export async function generateStaticParams() {
  return ACTIVE_LOCALES.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: 'Gabriel Blindado',
  description: 'Portfólio técnico, wiki e ferramentas pessoais.',
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();

  return (
    <html lang={LOCALE_META[locale].bcp47} className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-bg text-fg">
        <SiteHeader lang={locale} dictionary={dictionary} />
        <main id="main-content" className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
          {props.children}
        </main>
        <SiteFooter dictionary={dictionary} />
      </body>
    </html>
  );
}
