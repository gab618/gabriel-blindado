import React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import * as runtime from 'react/jsx-runtime';
import type { Root as HastRoot } from 'hast';
import type { Locale } from '../i18n/config';
import { Admonition, type AdmonitionType } from '@/components/ui/Admonition';

export interface RenderContentOptions {
  lang: Locale;
}

/**
 * Converte a árvore HAST gerada pelo Unified em elementos JSX nativos
 */
export function renderHastToJsx(hast: HastRoot, options: RenderContentOptions): React.ReactNode {
  const { lang } = options;

  const components = {
    // Links inteligentes
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const { href, children, className = '', ...rest } = props;

      if (!href) {
        return <a {...props} />;
      }

      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      const isAnchor = href.startsWith('#');

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-link hover:underline inline-flex items-center gap-0.5 ${className}`}
            {...rest}
          >
            {children}
            <span className="text-muted text-xs" aria-hidden="true">
              ↗
            </span>
          </a>
        );
      }

      if (isAnchor) {
        return (
          <a href={href} className={className} {...rest}>
            {children}
          </a>
        );
      }

      // Link interno: garante que o locale esteja presente
      let targetPath = href;
      if (targetPath.startsWith('/') && !targetPath.startsWith(`/${lang}/`) && targetPath !== `/${lang}`) {
        targetPath = `/${lang}${targetPath}`;
      }

      return (
        <Link href={targetPath as Route} className={`text-link hover:underline ${className}`} {...rest}>
          {children}
        </Link>
      );
    },

    // Tabelas responsivas com bordas de 1px
    table: (props: React.TableHTMLAttributes<HTMLTableElement>) => {
      return (
        <div className="w-full overflow-x-auto my-4 border border-border">
          <table className="w-full border-collapse text-left text-sm" {...props} />
        </div>
      );
    },

    // Admonitions / Callouts
    admonition: (props: { type?: string; children?: React.ReactNode }) => {
      const validTypes: AdmonitionType[] = ['note', 'tip', 'important', 'warning', 'caution'];
      const type = (validTypes.includes(props.type as AdmonitionType)
        ? props.type
        : 'note') as AdmonitionType;

      return <Admonition type={type}>{props.children}</Admonition>;
    },

    // Blocos pré-formatados com Shiki
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
      return (
        <pre
          className="my-3 p-3 bg-code-bg border border-code-border overflow-x-auto font-mono text-xs leading-relaxed"
          {...props}
        />
      );
    },
  };

  return toJsxRuntime(hast, {
    Fragment: runtime.Fragment,
    jsx: runtime.jsx,
    jsxs: runtime.jsxs,
    components,
  });
}
