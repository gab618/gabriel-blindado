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
  common: {
    hello: 'Olá, mundo! gabrielblindado.com.br',
  },
  nav: {
    home: 'Início',
    wiki: 'Wiki',
    til: 'TIL',
    tools: 'Ferramentas',
    tags: 'Tags',
  },
  notFound: {
    title: 'Página não encontrada',
    description: 'A página solicitada não foi encontrada.',
    returnHome: 'Voltar ao início',
  },
} as const;

export type Dictionary = DeepString<typeof pt>;
