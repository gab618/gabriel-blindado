'use client';

import 'client-only';
import React, { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries/pt';

export interface ThemeToggleProps {
  labels: Dictionary['theme'];
}

type ThemeMode = 'auto' | 'light' | 'dark';

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'auto';
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // LocalStorage desabilitado
    }
    return 'auto';
  });

  function handleCycle() {
    const next: ThemeMode = mode === 'auto' ? 'dark' : mode === 'dark' ? 'light' : 'auto';
    setMode(next);

    try {
      if (next === 'auto') {
        localStorage.removeItem('theme');
        document.documentElement.removeAttribute('data-theme');
      } else {
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
      }
    } catch {
      // LocalStorage desabilitado
    }
  }

  const currentLabel = labels[mode];

  return (
    <button
      type="button"
      onClick={handleCycle}
      title={labels.toggleTheme}
      aria-label={labels.toggleTheme}
      className="font-mono text-xs px-1.5 py-0.5 border border-border bg-bg hover:border-fg text-muted hover:text-fg transition-colors cursor-pointer select-none"
    >
      [{currentLabel}]
    </button>
  );
}
