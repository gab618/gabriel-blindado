import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.meta.title,
    description: t.meta.description,
  };
}

export default async function Page() {
  const t = await getDictionary();

  return (
    <main className="max-w-3xl mx-auto w-full py-12 px-4 font-mono">
      <div className="border border-zinc-300 dark:border-zinc-800 p-6 space-y-2">
        <h1 className="text-xl font-bold">gabrielblindado.com.br</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t.common.hello}</p>
      </div>
    </main>
  );
}
