type DeepString<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends object
      ? DeepString<T[K]>
      : T[K];
};

export const pt = {
  meta: {
    title: 'Gabriel Blindado — Engenharia de Software & Digital Garden',
    description: 'Portfólio técnico, anotações e utilitários interativos.',
  },
  site: {
    title: 'gabrielblindado.com.br',
    subtitle: 'Engenharia de Software, Sistemas & Wiki Técnica',
    sourceCode: 'Código-fonte',
    license: 'Licença CC BY-SA 4.0 / MIT',
    builtWith: 'Gerado estaticamente com Next.js & zero bloat',
  },
  common: {
    hello: 'Olá, mundo! gabrielblindado.com.br',
    skipToContent: 'Pular para o conteúdo principal',
    language: 'Idioma',
  },
  nav: {
    home: 'Início',
    wiki: 'Wiki',
    til: 'TIL',
    tools: 'Ferramentas',
    tags: 'Tags',
  },
  breadcrumbs: {
    prefix: 'Localização:',
  },
  admonition: {
    note: 'NOTA',
    tip: 'DICA',
    important: 'IMPORTANTE',
    warning: 'ATENÇÃO',
    caution: 'CUIDADO',
  },
  notFound: {
    title: 'Página não encontrada',
    description: 'A página solicitada não foi encontrada.',
    returnHome: 'Voltar ao início',
  },
  styleguide: {
    title: 'Guia de Estilo & Tokens Visuais (Apenas Dev)',
    description: 'Catálogo de componentes brutais inspirados no Debian e Arch Wiki.',
    typographySection: 'Tipografia & Títulos',
    proseSample: 'Este é um parágrafo demonstrativo da classe .prose-wiki. Ele possui densidade de informação alta, entrelinha compacta e tipografia sólida. Links internos e externos são sublinhados com diferenciação clara para links já visitados.',
    admonitionsSection: 'Admonitions / Avisos Técnicos',
    tablesSection: 'Tabelas Limpas de Alta Densidade',
    fieldsSection: 'Controles de Formulário & Campos',
    kbdSection: 'Atalhos de Teclado & Teclas',
    codeSection: 'Código Inline & Blocos',
  },
} as const;

export type Dictionary = DeepString<typeof pt>;
