import type { Root, Element } from 'hast';
import type { VFile } from 'vfile';
import type { TocItem } from '../../types';

function extractText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const el = node as { type?: string; value?: string; children?: unknown[] };
  if (el.type === 'text' && typeof el.value === 'string') {
    return el.value;
  }
  if (Array.isArray(el.children)) {
    return el.children.map(extractText).join('');
  }
  return '';
}

/**
 * Plugin Rehype para extrair tabela de conteúdos (TOC) para file.data.toc
 */
export function rehypeExtractToc() {
  return (tree: Root, file: VFile) => {
    const toc: TocItem[] = [];

    function visit(node: unknown) {
      if (!node || typeof node !== 'object') return;
      const el = node as Element;

      if (el.type === 'element') {
        const tagName = el.tagName;
        if (tagName === 'h2' || tagName === 'h3' || tagName === 'h4') {
          const depth = (parseInt(tagName.substring(1), 10) || 2) as 2 | 3 | 4;
          const id = (el.properties?.id as string) || '';
          const text = extractText(el).trim();

          // Remove a âncora '#' anexada no final pelo autolink
          const cleanText = text.replace(/\s*#+\s*$/, '').trim();

          if (id && cleanText) {
            toc.push({
              depth,
              id,
              text: cleanText,
            });
          }
        }
      }

      if (Array.isArray((node as { children?: unknown[] }).children)) {
        for (const child of (node as { children: unknown[] }).children) {
          visit(child);
        }
      }
    }

    visit(tree);
    file.data.toc = toc;
  };
}
