import { describe, it, expect } from 'vitest';
import { ContentError } from '@/lib/content/errors';
import { imageUrl, normalizeGaleriaBaseUrl } from '../config';
import { parseItensYaml, parseTemasYaml, resolveItemNeighbors } from '../parse';
import { getTemas, getItens } from '../index';

const BASE = 'https://img.gabrielblindado.com.br/';

const VALID_ITEMS_YAML = `
- id: desenho-antigo
  title: Estudo de mãos
  description: Rascunho no caderno.
  date: 2026-10-01
  src: desenhos/maos.webp
  width: 1600
  height: 1200
  medium: Lápis 2B
  tags: [estudo]

- id: sonic-grafite
  title: Sonic em grafite
  description: Rascunho rápido de fim de noite.
  date: 2026-11-20
  src: desenhos/sonic-grafite.webp
  width: 2400
  height: 1800
  tags: [sonic, grafite]

- id: violeta-dormindo
  title: Violeta dormindo
  date: 2026-11-10
  src: desenhos/violeta.webp
  width: 1200
  height: 1600
`;

describe('Galeria Subsystem — Config, Schema e Parsing', () => {
  it('resolve imageUrl corretamente com e sem barra final na base', () => {
    expect(imageUrl('desenhos/sonic.webp', 'https://pub-abc.r2.dev')).toBe(
      'https://pub-abc.r2.dev/desenhos/sonic.webp'
    );
    expect(imageUrl('/desenhos/sonic.webp', 'https://img.gabrielblindado.com.br/')).toBe(
      'https://img.gabrielblindado.com.br/desenhos/sonic.webp'
    );
    expect(() => normalizeGaleriaBaseUrl('')).toThrow();
    expect(() => normalizeGaleriaBaseUrl('nao-e-url')).toThrow();
  });

  it('faz parse válido e ordena itens por data decrescente', () => {
    const itens = parseItensYaml(VALID_ITEMS_YAML, 'desenhos', 'test.yaml', BASE);
    expect(itens).toHaveLength(3);
    expect(itens.map((i) => i.id)).toEqual([
      'sonic-grafite',
      'violeta-dormindo',
      'desenho-antigo',
    ]);
    expect(itens[0].url).toBe('https://img.gabrielblindado.com.br/desenhos/sonic-grafite.webp');
    expect(itens[0].href).toBe('/pt/galeria/desenhos/sonic-grafite');
  });

  it('resolve prev e next corretamente inclusive nas bordas', () => {
    const itens = parseItensYaml(VALID_ITEMS_YAML, 'desenhos', 'test.yaml', BASE);

    const first = resolveItemNeighbors(itens, 'sonic-grafite');
    expect(first?.prev).toBeNull();
    expect(first?.next?.id).toBe('violeta-dormindo');

    const middle = resolveItemNeighbors(itens, 'violeta-dormindo');
    expect(middle?.prev?.id).toBe('sonic-grafite');
    expect(middle?.next?.id).toBe('desenho-antigo');

    const last = resolveItemNeighbors(itens, 'desenho-antigo');
    expect(last?.prev?.id).toBe('violeta-dormindo');
    expect(last?.next).toBeNull();

    expect(resolveItemNeighbors(itens, 'inexistente')).toBeNull();
  });

  it('rejeita id duplicado dentro do mesmo tema', () => {
    const dupYaml = `
- id: sonic
  title: Sonic 1
  date: 2026-11-20
  src: desenhos/sonic-1.webp
  width: 800
  height: 600
- id: sonic
  title: Sonic 2
  date: 2026-11-21
  src: desenhos/sonic-2.webp
  width: 800
  height: 600
`;
    expect(() => parseItensYaml(dupYaml, 'desenhos', 'dup.yaml', BASE)).toThrowError(ContentError);
  });

  it('rejeita src com URL absoluta (http/https)', () => {
    const absYaml = `
- id: sonic
  title: Sonic
  date: 2026-11-20
  src: https://img.gabrielblindado.com.br/desenhos/sonic.webp
  width: 800
  height: 600
`;
    expect(() => parseItensYaml(absYaml, 'desenhos', 'abs.yaml', BASE)).toThrowError(ContentError);
  });

  it('rejeita item sem width ou height', () => {
    const noWidthYaml = `
- id: sonic
  title: Sonic
  date: 2026-11-20
  src: desenhos/sonic.webp
  height: 600
`;
    expect(() => parseItensYaml(noWidthYaml, 'desenhos', 'nowidth.yaml', BASE)).toThrowError(
      ContentError
    );
  });

  it('faz parse de temas.yaml e rejeita slug duplicado', () => {
    const temas = parseTemasYaml(`
- slug: fotos
  title: Fotos
  order: 2
- slug: desenhos
  title: Desenhos
  order: 1
`);
    expect(temas.map((t) => t.slug)).toEqual(['desenhos', 'fotos']);

    expect(() =>
      parseTemasYaml(`
- slug: desenhos
  title: A
  order: 1
- slug: desenhos
  title: B
  order: 2
`)
    ).toThrowError(ContentError);
  });

  it('carrega temas reais do repositório sem erro', async () => {
    const temas = await getTemas();
    expect(temas.length).toBeGreaterThanOrEqual(1);
    expect(temas[0].slug).toBe('desenhos');

    const desenhos = await getItens('desenhos');
    expect(Array.isArray(desenhos)).toBe(true);
  });
});
