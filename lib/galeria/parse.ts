import YAML from 'yaml';
import { ContentError } from '@/lib/content/errors';
import { imageUrl } from './config';
import {
  GaleriaItemSchema,
  GaleriaTemaSchema,
  type GaleriaItemRaw,
  type GaleriaTemaRaw,
} from './schema';

export interface GaleriaItem extends GaleriaItemRaw {
  tema: string;
  url: string;
  href: string;
}

export interface GaleriaTema extends GaleriaTemaRaw {
  count: number;
  coverItem: GaleriaItem | null;
  href: string;
}

export interface GaleriaItemWithNeighbors {
  item: GaleriaItem;
  prev: GaleriaItem | null;
  next: GaleriaItem | null;
}

function parseYamlArray(rawYaml: string, filePath: string): unknown[] {
  let parsed: unknown;
  try {
    parsed = YAML.parse(rawYaml);
  } catch (err) {
    throw new ContentError(
      filePath,
      `YAML inválido: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (parsed === null || parsed === undefined) {
    return [];
  }

  if (!Array.isArray(parsed)) {
    throw new ContentError(filePath, 'O arquivo YAML da galeria deve conter uma lista (array).');
  }

  return parsed;
}

export function parseTemasYaml(rawYaml: string, filePath = 'content/galeria/temas.yaml'): GaleriaTemaRaw[] {
  const rows = parseYamlArray(rawYaml, filePath);
  const seenSlugs = new Set<string>();
  const temas: GaleriaTemaRaw[] = [];

  for (let i = 0; i < rows.length; i++) {
    const result = GaleriaTemaSchema.safeParse(rows[i]);
    if (!result.success) {
      throw new ContentError(
        filePath,
        `Tema inválido no índice ${i}`,
        result.error.issues.map((iss) => ({
          path: `[${i}].${iss.path.join('.')}`,
          message: iss.message,
        }))
      );
    }

    if (seenSlugs.has(result.data.slug)) {
      throw new ContentError(filePath, `Slug de tema duplicado: "${result.data.slug}" (índice ${i}).`);
    }
    seenSlugs.add(result.data.slug);
    temas.push(result.data);
  }

  return temas.sort((a, b) => a.order - b.order);
}

export function parseItensYaml(
  rawYaml: string,
  tema: string,
  filePath: string,
  baseUrl?: string
): GaleriaItem[] {
  const rows = parseYamlArray(rawYaml, filePath);
  const seenIds = new Set<string>();
  const itens: GaleriaItem[] = [];

  for (let i = 0; i < rows.length; i++) {
    const result = GaleriaItemSchema.safeParse(rows[i]);
    if (!result.success) {
      throw new ContentError(
        filePath,
        `Item inválido no índice ${i}`,
        result.error.issues.map((iss) => ({
          path: `[${i}].${iss.path.join('.')}`,
          message: iss.message,
        }))
      );
    }

    if (seenIds.has(result.data.id)) {
      throw new ContentError(
        filePath,
        `ID duplicado "${result.data.id}" no tema "${tema}" (índice ${i}).`
      );
    }
    seenIds.add(result.data.id);

    itens.push({
      ...result.data,
      tema,
      url: imageUrl(result.data.src, baseUrl),
      href: `/pt/galeria/${tema}/${result.data.id}`,
    });
  }

  return itens.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function resolveItemNeighbors(
  itens: GaleriaItem[],
  id: string
): GaleriaItemWithNeighbors | null {
  const index = itens.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  return {
    item: itens[index],
    prev: index > 0 ? itens[index - 1] : null,
    next: index < itens.length - 1 ? itens[index + 1] : null,
  };
}
