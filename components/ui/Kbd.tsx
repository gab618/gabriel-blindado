import React from 'react';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Kbd({ children, className = '', ...props }: KbdProps) {
  return (
    <kbd
      className={`inline-block px-1.5 py-0.5 font-mono text-xs border border-border bg-code-bg text-fg ${className}`}
      {...props}
    >
      {children}
    </kbd>
  );
}
