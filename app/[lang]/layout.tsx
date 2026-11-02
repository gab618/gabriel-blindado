import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, LOCALE_META, type Locale } from '@/lib/i18n/config';
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

  return (
    <html lang={LOCALE_META[locale].bcp47} className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {props.children}
      </body>
    </html>
  );
}
