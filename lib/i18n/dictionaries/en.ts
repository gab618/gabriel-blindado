import type { Dictionary } from './pt';

export const en = {
  meta: {
    title: 'Gabriel Blindado — Software Engineering & Digital Garden',
    description: 'Technical portfolio, notes, and interactive utilities.',
  },
  site: {
    title: 'gabrielblindado.com.br',
    subtitle: 'Software Engineering, Systems & Technical Wiki',
    sourceCode: 'Source Code',
    license: 'License CC BY-SA 4.0 / MIT',
    builtWith: 'Statically generated with Next.js & zero bloat',
  },
  common: {
    hello: 'Hello, world! gabrielblindado.com.br',
    skipToContent: 'Skip to main content',
    language: 'Language',
  },
  nav: {
    home: 'Home',
    wiki: 'Wiki',
    til: 'TIL',
    tools: 'Tools',
    tags: 'Tags',
  },
  breadcrumbs: {
    prefix: 'Location:',
  },
  admonition: {
    note: 'NOTE',
    tip: 'TIP',
    important: 'IMPORTANT',
    warning: 'WARNING',
    caution: 'CAUTION',
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
    returnHome: 'Back to Home',
  },
  styleguide: {
    title: 'Styleguide & Visual Tokens (Dev Only)',
    description: 'Brutalist component catalog inspired by Debian and Arch Wiki.',
    typographySection: 'Typography & Headings',
    proseSample: 'This is a sample paragraph of the .prose-wiki class. It features high information density, compact line-height, and solid typography. Internal and external links are underlined with distinct visited styling.',
    admonitionsSection: 'Admonitions / Technical Callouts',
    tablesSection: 'Clean High-Density Tables',
    fieldsSection: 'Form Controls & Inputs',
    kbdSection: 'Keyboard Shortcuts & Keys',
    codeSection: 'Inline Code & Blocks',
  },
} as const satisfies Dictionary;
