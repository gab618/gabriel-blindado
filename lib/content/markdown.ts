import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import type { Root as HastRoot } from 'hast';
import { VFile } from 'vfile';
import type { Locale } from '../i18n/config';
import type { TocItem } from '../types';
import { remarkAdmonitions } from './plugins/remark-admonitions';
import { remarkWikilinks } from './plugins/remark-wikilinks';
import { rehypeExtractToc } from './plugins/rehype-extract-toc';

export interface ProcessedMarkdown {
  hast: HastRoot;
  toc: TocItem[];
}

/**
 * Cria e configura o pipeline do Unified para processar Markdown
 */
function createProcessor(lang: Locale) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkAdmonitions)
    .use(remarkWikilinks, { lang })
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        className: ['anchor-link'],
        ariaHidden: 'true',
        tabIndex: -1,
      },
      content: {
        type: 'text',
        value: ' #',
      },
    })
    .use(rehypeShiki, {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    })
    .use(rehypeExtractToc);
}

// Cache de instâncias do processador por locale (singleton de módulo)
const processors = new Map<Locale, ReturnType<typeof createProcessor>>();

function getProcessor(lang: Locale) {
  let proc = processors.get(lang);
  if (!proc) {
    proc = createProcessor(lang);
    processors.set(lang, proc);
  }
  return proc;
}

/**
 * Compila uma string Markdown para HAST e extrai a tabela de conteúdos (TOC)
 */
export async function compileMarkdown(
  source: string,
  lang: Locale
): Promise<ProcessedMarkdown> {
  const processor = getProcessor(lang);
  const file = new VFile({ value: source });
  const mdast = processor.parse(file);
  const hast = (await processor.run(mdast, file)) as HastRoot;
  const toc = (file.data.toc as TocItem[]) || [];

  return {
    hast,
    toc,
  };
}
