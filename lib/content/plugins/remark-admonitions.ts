import type { Root } from 'mdast';

const ADMONITION_REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*\n)?/i;

interface AstNode {
  type: string;
  value?: string;
  children?: AstNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
}

/**
 * Plugin Remark para transformar blockquotes do tipo `> [!NOTE]` em nós <admonition>
 */
export function remarkAdmonitions() {
  return (tree: Root) => {
    function visit(node: AstNode) {
      if (node.type === 'blockquote' && Array.isArray(node.children) && node.children.length > 0) {
        const firstParagraph = node.children[0];
        if (
          firstParagraph.type === 'paragraph' &&
          Array.isArray(firstParagraph.children) &&
          firstParagraph.children.length > 0
        ) {
          const firstTextNode = firstParagraph.children[0];
          if (firstTextNode.type === 'text' && typeof firstTextNode.value === 'string') {
            const match = firstTextNode.value.match(ADMONITION_REGEX);
            if (match) {
              const type = match[1].toLowerCase();
              // Remove o marcador [!NOTE] do texto
              firstTextNode.value = firstTextNode.value.replace(ADMONITION_REGEX, '');

              // Se o nó de texto ficou vazio, remove-o
              if (!firstTextNode.value.trim()) {
                firstParagraph.children.shift();
              }

              // Configura o nó para ser renderizado como elemento <admonition> pelo rehype
              node.data = node.data || {};
              node.data.hName = 'admonition';
              node.data.hProperties = {
                type,
              };
            }
          }
        }
      }

      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          visit(child);
        }
      }
    }

    visit(tree as unknown as AstNode);
  };
}
