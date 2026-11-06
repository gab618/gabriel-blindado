'use client';

import 'client-only';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries/pt';

export interface SearchIndexItem {
  title: string;
  href: string;
  collection: 'posts';
  tags: string[];
  description: string;
}

export interface QuickSearchProps {
  lang: Locale;
  labels: Dictionary['search'];
}

export function QuickSearch({ lang, labels }: QuickSearchProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchIndexItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Carrega o índice JSON na primeira abertura
  useEffect(() => {
    if (!isOpen || items.length > 0) return;

    fetch(`/${lang}/search.json`)
      .then((res) => res.json())
      .then((data: SearchIndexItem[]) => setItems(data))
      .catch(() => {});
  }, [isOpen, lang, items.length]);

  function openDialog() {
    setQuery('');
    setSelectedIndex(0);
    setIsOpen(true);
  }

  function closeDialog() {
    setIsOpen(false);
  }

  // Foco no input ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Atalho global Cmd+K / Ctrl+K e Esc
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setQuery('');
            setSelectedIndex(0);
          }
          return !prev;
        });
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filtragem local
  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? items.filter((item) => {
        return (
          item.title.toLowerCase().includes(trimmed) ||
          item.description.toLowerCase().includes(trimmed) ||
          item.tags.some((t) => t.toLowerCase().includes(trimmed)) ||
          item.href.toLowerCase().includes(trimmed)
        );
      })
    : items;

  function handleSelect(item: SearchIndexItem) {
    setIsOpen(false);
    router.push(item.href as Route);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        title={labels.placeholder}
        aria-label={labels.placeholder}
        className="font-mono text-xs px-2 py-0.5 border border-border bg-bg hover:border-fg text-muted hover:text-fg transition-colors cursor-pointer select-none flex items-center gap-1.5"
      >
        <span>[{labels.openSearch}]</span>
        <kbd className="text-[10px] bg-code-bg px-1 border border-border">Ctrl+K</kbd>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 pt-16 sm:pt-24"
          onClick={closeDialog}
        >
          <div
            className="w-full max-w-xl bg-bg border border-border shadow-2xl p-4 font-mono text-xs space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold uppercase tracking-wider text-fg">
                &gt; {labels.openSearch}
              </span>
              <button
                type="button"
                onClick={closeDialog}
                className="text-muted hover:text-fg"
              >
                [{labels.close}]
              </button>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder={labels.placeholder}
              className="w-full border border-border bg-code-bg px-3 py-2 text-fg font-mono text-sm focus:outline-none focus:ring-1 focus:ring-link"
            />

            <div className="text-[11px] text-muted">
              {filtered.length} {labels.resultsFound}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border/60 border border-border">
              {filtered.length === 0 ? (
                <div className="p-4 text-center text-muted">{labels.noResults}</div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.href}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-2.5 cursor-pointer transition-colors ${
                        isSelected ? 'bg-code-bg text-link font-bold' : 'hover:bg-code-bg/60 text-fg'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm">{item.title}</span>
                        <span className="text-[10px] px-1 border border-border text-muted uppercase">
                          {item.collection}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-muted font-normal mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-muted font-normal">
                          {item.tags.map((t) => (
                            <span key={t}>#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
