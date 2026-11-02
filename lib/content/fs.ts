import fs from 'node:fs/promises';
import path from 'node:path';
import type { Locale } from '../i18n/config';
import type { Collection } from '../types';

export interface DiscoveredFile {
  absolutePath: string;
  sourcePath: string; // ex: content/pt/wiki/linux/systemd.md
  lang: Locale;
  collection: Collection;
  slug: string[]; // ex: ['linux', 'systemd']
  defaultTranslationKey: string; // ex: 'wiki/linux/systemd'
}

/**
 * Caminho absoluto para a pasta content/ na raiz do projeto
 */
export function getContentRoot(): string {
  return path.join(process.cwd(), 'content');
}

/**
 * Caminho absoluto para a pasta de uma coleção em um idioma específico
 */
export function getCollectionDir(lang: Locale, collection: Collection): string {
  return path.join(getContentRoot(), lang, collection);
}

/**
 * Varre recursivamente um diretório procurando arquivos .md
 */
async function getMarkdownFilesRecursively(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          return getMarkdownFilesRecursively(fullPath);
        }
        if (entry.isFile() && entry.name.endsWith('.md')) {
          return [fullPath];
        }
        return [];
      })
    );
    return files.flat();
  } catch (error) {
    // Se o diretório não existir ainda (ex: content/en antes de ser ativado), retorna lista vazia
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Descobre todos os arquivos markdown de uma coleção e locale
 */
export async function discoverFiles(
  lang: Locale,
  collection: Collection
): Promise<DiscoveredFile[]> {
  const collectionDir = getCollectionDir(lang, collection);
  const filePaths = await getMarkdownFilesRecursively(collectionDir);
  const root = process.cwd();

  return filePaths.map((absPath) => {
    const relFromCollection = path
      .relative(collectionDir, absPath)
      .replace(/\\/g, '/');
    const sourcePath = path.relative(root, absPath).replace(/\\/g, '/');

    // Remove a extensão .md
    const cleanRel = relFromCollection.replace(/\.md$/, '');
    const parts = cleanRel.split('/').filter(Boolean);

    // Se o arquivo for index.md na raiz da coleção, o slug é []
    const isIndex = parts.length === 1 && parts[0] === 'index';
    const slug = isIndex ? [] : parts;

    const defaultTranslationKey = `${collection}/${cleanRel}`;

    return {
      absolutePath: absPath,
      sourcePath,
      lang,
      collection,
      slug,
      defaultTranslationKey,
    };
  });
}

/**
 * Calcula o tempo estimado de leitura em minutos
 */
export function calculateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
