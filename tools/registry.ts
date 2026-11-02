import type { Localized } from '@/lib/i18n/config';

export type ToolCategory = 'calc' | 'format' | 'convert' | 'encode' | 'misc';

export interface ToolConfig {
  slug: string; // == nome da pasta em app/[lang]/tools/<slug>/
  title: Localized;
  description: Localized;
  category: ToolCategory;
  keywords: readonly string[];
  status: 'stable' | 'beta' | 'wip';
  addedAt: string; // YYYY-MM-DD
}

export const TOOLS_REGISTRY: readonly ToolConfig[] = [
  {
    slug: 'base-converter',
    title: {
      pt: 'Conversor de Bases & Bitwise',
      en: 'Base Converter & Bitwise',
    },
    description: {
      pt: 'Conversão em tempo real entre Decimal, Hexadecimal, Binário e Octal com manipulação de bits.',
      en: 'Real-time conversion between Decimal, Hexadecimal, Binary, and Octal com manipulação de bits.',
    },
    category: 'convert',
    keywords: ['hex', 'binary', 'decimal', 'octal', 'bitwise', 'and', 'or', 'xor', 'shift', 'bits'],
    status: 'stable',
    addedAt: '2026-11-02',
  },
] as const;

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug);
}
