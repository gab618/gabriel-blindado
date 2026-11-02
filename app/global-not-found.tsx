import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '404 — Não Encontrado / Not Found',
  description: 'Página não encontrada / Page not found',
};

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col items-center justify-center p-6 font-mono text-sm bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="max-w-md w-full border border-zinc-300 dark:border-zinc-800 p-6 space-y-4">
          <h1 className="font-bold text-base border-b border-zinc-200 dark:border-zinc-800 pb-2">
            404 — Página não encontrada / Page not found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            A URL acessada não corresponde a nenhuma rota válida.
            <br />
            The requested URL does not match any valid route.
          </p>
          <div className="pt-2">
            <Link
              href="/pt"
              className="inline-block text-blue-600 dark:text-blue-400 underline hover:no-underline"
            >
              &larr; Voltar ao início / Return to home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
