import type { Dictionary } from './pt';

export const en = {
  meta: {
    title: 'Gabriel Blindado — Software Engineering & Digital Garden',
    description: 'Technical portfolio, notes, and interactive utilities.',
  },
  common: {
    hello: 'Hello, world! gabrielblindado.com.br',
  },
  nav: {
    home: 'Home',
    wiki: 'Wiki',
    til: 'TIL',
    tools: 'Tools',
    tags: 'Tags',
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
    returnHome: 'Back to Home',
  },
} as const satisfies Dictionary;
