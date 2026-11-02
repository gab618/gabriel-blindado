import type { Root } from 'mdast';
import type { Locale } from '../../i18n/config';

const WIKILINK_REGEX = /\[\[(.*?)\]\]/g;

interface TextNode {
  type: 'text';
  value: string;
}

interface LinkNode {
  type: 'link';
  url: string;
  children: TextNode[];
}

interface ParentNode {
  type: string;
  children: (TextNode | LinkNode | unknown)[];
}

export interface RemarkWikilinksOptions {
  lang: Locale;
}

/**
 * Plugin Remark para transformar [[slug]] e [[slug|label]] em links da Wiki
 */
export function remarkWikilinks(options: RemarkWikilinksOptions) {
  const { lang } = options;

  return (tree: Root) => {
    function visit(node: unknown) {
      if (!node || typeof node !== 'object') return;
      const parent = node as ParentNode;

      if (Array.isArray(parent.children)) {
        const newChildren: (TextNode | LinkNode | unknown)[] = [];

        for (const child of parent.children) {
          const textNode = child as TextNode;
          if (textNode.type === 'text' && typeof textNode.value === 'string' && textNode.value.includes('[[')) {
            const text = textNode.value;
            let lastIndex = 0;
            let match: RegExpExecArray | null;

            while ((match = WIKILINK_REGEX.exec(text)) !== null) {
              const matchStart = match.index;
              const matchEnd = WIKILINK_REGEX.lastIndex;

              // Adiciona texto anterior ao match se houver
              if (matchStart > lastIndex) {
                newChildren.push({
                  type: 'text',
                  value: text.slice(lastIndex, matchStart),
                });
              }

              const rawTarget = match[1].trim();
              const [rawSlug, rawLabel] = rawTarget.split('|').map((s) => s.trim());
              const targetSlug = rawSlug.replace(/^\/+|\/+$/g, '');
              const label = rawLabel || targetSlug;

              newChildren.push({
                type: 'link',
                url: `/${lang}/wiki/${targetSlug}`,
                children: [{ type: 'text', value: label }],
              });

              lastIndex = matchEnd;
            }

            // Adiciona o restante do texto após o último match
            if (lastIndex < text.length) {
              newChildren.push({
                type: 'text',
                value: text.slice(lastIndex),
              });
            }
          } else {
            newChildren.push(child);
            visit(child);
          }
        }

        parent.children = newChildren;
      }
    }

    visit(tree);
  };
}
