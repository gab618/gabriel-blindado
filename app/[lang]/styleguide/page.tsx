import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { lang } from 'next/root-params';
import { href } from '@/lib/i18n/href';
import type { Locale } from '@/lib/i18n/config';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Admonition } from '@/components/ui/Admonition';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Kbd } from '@/components/ui/Kbd';
import { Field } from '@/components/ui/Field';

export const metadata: Metadata = {
  title: 'Styleguide — Visual Tokens & Brutalist UI',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function StyleguidePage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const dictionary = await getDictionary();
  const currentLang = (await lang()) as Locale;

  const breadcrumbs = [
    { label: dictionary.nav.home, href: href(currentLang, '/') },
    { label: 'Styleguide' },
  ];

  return (
    <div className="space-y-8 font-sans">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold text-fg">
          {dictionary.styleguide.title}
        </h1>
        <p className="text-muted text-sm mt-1">
          {dictionary.styleguide.description}
        </p>
      </header>

      {/* 1. Tipografia e Prose Wiki */}
      <section className="space-y-4">
        <h2 className="font-mono text-lg font-bold border-b border-border pb-1">
          1. {dictionary.styleguide.typographySection}
        </h2>
        <div className="prose-wiki border border-border p-4 bg-bg">
          <h1>Título H1 (1.5rem / 700)</h1>
          <p>{dictionary.styleguide.proseSample}</p>
          <h2>Título H2 (1.25rem / 700)</h2>
          <p>
            Parágrafo com texto em <strong>negrito</strong>, <em>itálico</em>, e um link interno de teste:{' '}
            <a href="#test-link">link interno não visitado</a>.
          </p>
          <h3>Título H3 (1.05rem / 600)</h3>
          <ul>
            <li>Item de lista não ordenada 1</li>
            <li>Item de lista não ordenada 2 com <code>código inline</code></li>
            <li>Item de lista não ordenada 3</li>
          </ul>
          <h4>Título H4 (0.95rem / 600)</h4>
          <blockquote>
            Citação em bloco (blockquote) com recuo sutil e borda de destaque à esquerda.
          </blockquote>
        </div>
      </section>

      {/* 2. Admonitions */}
      <section className="space-y-4">
        <h2 className="font-mono text-lg font-bold border-b border-border pb-1">
          2. {dictionary.styleguide.admonitionsSection}
        </h2>
        <Admonition type="note" title={`[${dictionary.admonition.note}]`}>
          Informação de contexto, nota arquitetural ou documentação de apoio.
        </Admonition>
        <Admonition type="tip" title={`[${dictionary.admonition.tip}]`}>
          Sugestão de otimização de performance, boas práticas ou atalho prático.
        </Admonition>
        <Admonition type="important" title={`[${dictionary.admonition.important}]`}>
          Requisito fundamental ou detalhe obrigatório que não deve ser ignorado.
        </Admonition>
        <Admonition type="warning" title={`[${dictionary.admonition.warning}]`}>
          Aviso sobre comportamentos depreciados ou potenciais incompatibilidades.
        </Admonition>
        <Admonition type="caution" title={`[${dictionary.admonition.caution}]`}>
          Ação crítica de alto risco que pode causar perda de dados ou quebra de build.
        </Admonition>
      </section>

      {/* 3. Tabelas Limpas */}
      <section className="space-y-4">
        <h2 className="font-mono text-lg font-bold border-b border-border pb-1">
          3. {dictionary.styleguide.tablesSection}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comando / Pacote</TableHead>
              <TableHead>Versão Alvo</TableHead>
              <TableHead>Papel Arquitetural</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono font-semibold">next</TableCell>
              <TableCell className="font-mono">16.4.3</TableCell>
              <TableCell>App Router + Cache Components</TableCell>
              <TableCell className="font-mono text-adm-tip-text">Ativo</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono font-semibold">tailwindcss</TableCell>
              <TableCell className="font-mono">4.0</TableCell>
              <TableCell>Tokens semânticos e utilitários básicos</TableCell>
              <TableCell className="font-mono text-adm-tip-text">Ativo</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono font-semibold">vitest</TableCell>
              <TableCell className="font-mono">5.0.5</TableCell>
              <TableCell>Testes unitários atômicos</TableCell>
              <TableCell className="font-mono text-adm-tip-text">Ativo</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* 4. Controles de Formulário e Campos */}
      <section className="space-y-4">
        <h2 className="font-mono text-lg font-bold border-b border-border pb-1">
          4. {dictionary.styleguide.fieldsSection}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border p-4 bg-bg">
          <Field
            id="sample-input"
            label="Entrada de Dados (Input Texto)"
            hint="Dica de formatação em texto mono"
          >
            <input
              id="sample-input"
              type="text"
              placeholder="Digite um valor..."
              className="w-full border border-border bg-code-bg px-2.5 py-1.5 font-mono text-xs text-fg focus:outline-none focus:ring-1 focus:ring-link"
              defaultValue="0xDEADBEEF"
            />
          </Field>

          <Field
            id="sample-select"
            label="Seleção de Base / Opção"
            hint="Selecione o formato desejado"
          >
            <select
              id="sample-select"
              className="w-full border border-border bg-code-bg px-2.5 py-1.5 font-mono text-xs text-fg focus:outline-none focus:ring-1 focus:ring-link"
              defaultValue="hex"
            >
              <option value="hex">Hexadecimal (Base 16)</option>
              <option value="dec">Decimal (Base 10)</option>
              <option value="bin">Binário (Base 2)</option>
            </select>
          </Field>
        </div>
      </section>

      {/* 5. Atalhos de Teclado */}
      <section className="space-y-4">
        <h2 className="font-mono text-lg font-bold border-b border-border pb-1">
          5. {dictionary.styleguide.kbdSection}
        </h2>
        <div className="border border-border p-4 bg-bg space-y-2 text-sm">
          <p>
            Pressione <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> para abrir a busca no futuro.
          </p>
          <p>
            Pressione <Kbd>Esc</Kbd> para fechar qualquer janela modal.
          </p>
          <p>
            Pressione <Kbd>Alt</Kbd> + <Kbd>Shift</Kbd> + <Kbd>F</Kbd> para formatar.
          </p>
        </div>
      </section>

      {/* 6. Código Inline e Blocos */}
      <section className="space-y-4">
        <h2 className="font-mono text-lg font-bold border-b border-border pb-1">
          6. {dictionary.styleguide.codeSection}
        </h2>
        <div className="prose-wiki">
          <pre>
            <code>
{`// Exemplo de código demonstrativo de alta densidade
export async function getPost(slug: string[]) {
  'use cache';
  return fetchPostFromDisk(slug);
}`}
            </code>
          </pre>
        </div>
      </section>
    </div>
  );
}
