import React from 'react';

export type AdmonitionType = 'note' | 'tip' | 'important' | 'warning' | 'caution';

export interface AdmonitionProps {
  type?: AdmonitionType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const typeStyles: Record<
  AdmonitionType,
  {
    container: string;
    title: string;
    defaultPrefix: string;
  }
> = {
  note: {
    container: 'bg-adm-note-bg border-adm-note-border text-fg',
    title: 'text-adm-note-text',
    defaultPrefix: '[NOTA]',
  },
  tip: {
    container: 'bg-adm-tip-bg border-adm-tip-border text-fg',
    title: 'text-adm-tip-text',
    defaultPrefix: '[DICA]',
  },
  important: {
    container: 'bg-adm-important-bg border-adm-important-border text-fg',
    title: 'text-adm-important-text',
    defaultPrefix: '[IMPORTANTE]',
  },
  warning: {
    container: 'bg-adm-warning-bg border-adm-warning-border text-fg',
    title: 'text-adm-warning-text',
    defaultPrefix: '[ATENÇÃO]',
  },
  caution: {
    container: 'bg-adm-caution-bg border-adm-caution-border text-fg',
    title: 'text-adm-caution-text',
    defaultPrefix: '[CUIDADO]',
  },
};

export function Admonition({
  type = 'note',
  title,
  children,
  className = '',
}: AdmonitionProps) {
  const styles = typeStyles[type];
  const headerTitle = title || styles.defaultPrefix;

  return (
    <aside
      className={`my-3 border-l-4 p-3 text-sm border-t border-r border-b border-border ${styles.container} ${className}`}
      role="note"
    >
      <div className={`font-mono font-bold text-xs tracking-wider mb-1 uppercase ${styles.title}`}>
        {headerTitle}
      </div>
      <div className="prose-wiki-admonition">{children}</div>
    </aside>
  );
}
