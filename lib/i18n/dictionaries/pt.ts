type DeepString<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends object
      ? DeepString<T[K]>
      : T[K];
};

export const pt = {
  meta: {
    title: 'Gabriel Blindado — coisas aleatórias de Gabriel Blindado',
    description: 'coisas aleatórias de Gabriel Blindado',
  },
  site: {
    title: 'gabrielblindado.com.br',
    subtitle: 'coisas aleatórias de Gabriel Blindado',
    sourceCode: 'Código-fonte',
    rss: 'Feed RSS',
    license: 'Licença CC BY-SA 4.0',
    builtWith: 'Gerado estaticamente, rápido e sem algoritmos',
  },
  common: {
    hello: 'Olá! Bem-vindo a gabrielblindado.com.br',
    skipToContent: 'Pular para o conteúdo principal',
    language: 'Idioma',
    collection: 'Coleção',
  },
  nav: {
    home: 'Início',
    posts: 'Posts',
  },
  breadcrumbs: {
    prefix: 'Localização:',
  },
  theme: {
    auto: 'auto',
    light: 'claro',
    dark: 'escuro',
    toggleTheme: 'Alternar tema (auto/escuro/claro)',
  },
  search: {
    placeholder: 'Buscar posts (Ctrl+K)...',
    openSearch: 'Busca',
    noResults: 'Nenhum resultado encontrado.',
    close: 'Fechar [Esc]',
    resultsFound: 'resultado(s)',
  },
  home: {
    heroGreeting: 'Olá, sou o Gabriel.',
    heroBio: 'Bem-vindo ao meu cantinho na web. Eu sou o pai da Violeta, escrevo códigos e gosto do sonic. Fique a vontade :)',
    recentUpdates: 'Posts Recentes',
    viewAllNotes: 'Ver todos os posts',
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
  posts: {
    title: 'Posts',
    description: 'coisas que escrevi e publiquei.',
    tableOfContents: 'Neste texto',
    readingTime: '{minutes} min de leitura',
    publishedAt: 'Publicado em',
    updatedAt: 'Última edição em',
    statusLabel: 'Status',
    status: {
      seedling: '🌱 Rascunho',
      budding: '🌿 Em revisão',
      evergreen: '🌲 Concluído',
    },
    editOnGithub: 'Ver histórico no GitHub',
    backToPosts: 'Voltar aos Posts',
    emptyCategory: 'Nenhum post publicado ainda.',
    allDocuments: 'Todos os Posts',
    tagsLabel: 'Tags:',
    backlinks: 'Posts que mencionam este',
  },
  styleguide: {
    title: 'Guia de Estilo & Tokens Visuais (Apenas Dev)',
    description: 'Catálogo de componentes brutais com tipografia limpa.',
    typographySection: 'Tipografia & Títulos',
    proseSample: 'Este é um parágrafo demonstrativo da classe .prose-wiki. Ele possui densidade de informação agradável, entrelinha compacta e tipografia sólida.',
    admonitionsSection: 'Admonitions / Avisos Técnicos',
    tablesSection: 'Tabelas Limpas',
    fieldsSection: 'Controles de Formulário & Campos',
    kbdSection: 'Atalhos de Teclado & Teclas',
    codeSection: 'Código Inline & Blocos',
  },
  pagination: {
    previous: 'Anterior',
    next: 'Próxima',
    pageOf: 'Página {current} de {total}',
  },
} as const;

export type Dictionary = DeepString<typeof pt>;
