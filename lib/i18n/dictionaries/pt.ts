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
    notas: 'Notas',
    projetos: 'Projetos',
    tags: 'Tags',
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
    placeholder: 'Buscar posts, notas e projetos (Ctrl+K)...',
    openSearch: 'Busca',
    noResults: 'Nenhum resultado encontrado.',
    close: 'Fechar [Esc]',
    resultsFound: 'resultado(s)',
  },
  home: {
    heroGreeting: 'Olá, sou o Gabriel.',
    heroBio: 'Bem-vindo ao meu cantinho na web. Eu sou o pai da Violeta, escrevo códigos e gosto do sonic. Fique a vontade :)',
    recentUpdates: 'Últimas Publicações & Notas',
    viewAllNotes: 'Ver todos os posts',
    featuredSections: 'Seções',
    postsDesc: 'Textos, pensamentos e receitas.',
    notasDesc: 'Notas rápidas e ideias do dia a dia.',
    projetosDesc: 'Iniciativas, criações pessoais e projetos que tirei do papel.',
    tagsDesc: 'Navegação por temas e tópicos.',
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
    description: 'Textos, pensamentos e receitas.',
    categories: 'Categorias',
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
    emptyCategory: 'Nenhum post nesta categoria ainda.',
    allDocuments: 'Todos os Posts',
    tagsLabel: 'Tags:',
    backlinks: 'Notas que mencionam este post',
  },
  notas: {
    title: 'Notas',
    description: 'Notas breves, fragmentos de ideias e observações do dia a dia.',
    backToNotas: 'Voltar às Notas',
    tableHeaderDate: 'Data',
    tableHeaderTitle: 'Nota',
    tableHeaderTags: 'Tags',
    tableHeaderStatus: 'Status',
    empty: 'Nenhuma nota registrada ainda.',
    allEntries: 'Todas as Notas',
  },
  projetos: {
    title: 'Projetos Pessoais',
    description: 'Coisas que construí, iniciativas tiradas do papel e criações pessoais.',
    backToProjetos: 'Voltar aos Projetos',
    tableHeaderDate: 'Ano',
    tableHeaderTitle: 'Projeto',
    tableHeaderTags: 'Tags',
    tableHeaderStatus: 'Status',
    empty: 'Nenhum projeto cadastrado ainda.',
    allEntries: 'Todos os Projetos',
  },
  tags: {
    title: 'Navegação por Tags',
    description: 'Índice temático de todos os posts, receitas e notas.',
    taggedWith: 'Publicações com a tag',
    backToTags: 'Voltar ao índice de Tags',
    notesCount: '{count} notas',
    empty: 'Nenhuma tag cadastrada.',
    tableHeaderCollection: 'Coleção',
    tableHeaderTitle: 'Título',
    tableHeaderDate: 'Data',
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
