import 'server-only';
import { cacheLife } from 'next/cache';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  parseItensYaml,
  parseTemasYaml,
  resolveItemNeighbors,
  type GaleriaItem,
  type GaleriaItemWithNeighbors,
  type GaleriaTema,
} from './parse';

export type { GaleriaItem, GaleriaItemWithNeighbors, GaleriaTema };
export { imageUrl, getGaleriaImageBaseUrl } from './config';

const GALERIA_DIR = path.resolve(process.cwd(), 'content/galeria');

async function readOptionalFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

export async function getItens(tema: string): Promise<GaleriaItem[]> {
  'use cache';
  cacheLife('max');

  const filePath = path.join(GALERIA_DIR, `${tema}.yaml`);
  const relPath = `content/galeria/${tema}.yaml`;
  const raw = await readOptionalFile(filePath);
  if (raw === null) {
    return [];
  }
  return parseItensYaml(raw, tema, relPath);
}

export async function getTemas(): Promise<GaleriaTema[]> {
  'use cache';
  cacheLife('max');

  const filePath = path.join(GALERIA_DIR, 'temas.yaml');
  const raw = await readOptionalFile(filePath);
  if (raw === null) {
    return [];
  }

  const rawTemas = parseTemasYaml(raw, 'content/galeria/temas.yaml');
  const temas: GaleriaTema[] = [];

  for (const t of rawTemas) {
    const itens = await getItens(t.slug);
    const coverItem = t.cover
      ? itens.find((item) => item.id === t.cover) ?? itens[0] ?? null
      : itens[0] ?? null;

    temas.push({
      ...t,
      count: itens.length,
      coverItem,
      href: `/pt/galeria/${t.slug}`,
    });
  }

  return temas;
}

export async function getTema(slug: string): Promise<GaleriaTema | null> {
  'use cache';
  cacheLife('max');

  const temas = await getTemas();
  return temas.find((t) => t.slug === slug) ?? null;
}

export async function getItem(
  tema: string,
  id: string
): Promise<GaleriaItemWithNeighbors | null> {
  'use cache';
  cacheLife('max');

  const itens = await getItens(tema);
  return resolveItemNeighbors(itens, id);
}
