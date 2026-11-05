type DeepString<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends object
      ? DeepString<T[K]>
      : T[K];
};

export const pt = {
  meta: {
    title: 'Gabriel Blindado — Caderno, Receitas & Projetos',
    description: 'Espaço pessoal para registrar pensamentos, receitas, reflexões e projetos.',
  },
  site: {
    title: 'gabrielblindado.com.br',
    subtitle: 'Caderno pessoal, receitas, diário e projetos',
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
    escritos: 'Escritos',
    diario: 'Diário',
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
    placeholder: 'Buscar textos, receitas e projetos (Ctrl+K)...',
    openSearch: 'Busca',
    noResults: 'Nenhum resultado encontrado.',
    close: 'Fechar [Esc]',
    resultsFound: 'resultado(s)',
  },
  home: {
    heroGreeting: 'Olá, sou o Gabriel.',
    heroBio: 'Bem-vindo ao meu canto calmo na web. Este site é um caderno pessoal aberto onde registro pensamentos, receitas que gosto de fazer, reflexões sobre o ano e projetos que coloco no mundo.',
    recentUpdates: 'Últimas Publicações & Notas',
    viewAllNotes: 'Ver todo o arquivo',
    featuredSections: 'Seções',
    escritosDesc: 'Ensaios, reflexões sobre a vida e receitas culinárias afetivas.',
    diarioDesc: 'Fragmentos de pensamentos, observações da rotina e notas curtas.',
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
  escritos: {
    title: 'Escritos & Receitas',
    description: 'Caderno de reflexões sobre a vida, ensaios e receitas culinárias.',
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
    backToEscritos: 'Voltar aos Escritos',
    emptyCategory: 'Nenhum texto nesta categoria ainda.',
    allDocuments: 'Todos os Escritos',
    tagsLabel: 'Tags:',
    backlinks: 'Notas que mencionam esta',
  },
  diario: {
    title: 'Diário de Bordo',
    description: 'Notas breves, fragmentos de ideias e observações do cotidiano.',
    backToDiario: 'Voltar ao Diário',
    tableHeaderDate: 'Data',
    tableHeaderTitle: 'Nota / Registro',
    tableHeaderTags: 'Tags',
    tableHeaderStatus: 'Status',
    empty: 'Nenhuma nota registrada ainda.',
    allEntries: 'Todas as Notas do Diário',
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
    description: 'Índice temático de todos os textos, receitas e notas.',
    taggedWith: 'Publicações com a tag',
    backToTags: 'Voltar ao índice de Tags',
    notesCount: '{count} notas',
    empty: 'Nenhuma tag cadastrada.',
    tableHeaderCollection: 'Coleção',
    tableHeaderTitle: 'Documento',
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
} as const;

export type Dictionary = DeepString<typeof pt>;
