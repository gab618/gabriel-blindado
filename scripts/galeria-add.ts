import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import YAML from 'yaml';
import { z } from 'zod';
import { GaleriaItemSchema, GaleriaTemaSchema } from '../lib/galeria/schema.ts';

function loadLocalEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile(envPath);
    } catch {
      // .env.local opcional se variáveis já vierem do ambiente
    }
  }
}

function toKebabId(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'imagem';
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name} (verifique seu .env.local).`);
  }
  return value;
}

function printUsage() {
  console.log(`Uso:
  pnpm galeria:add <caminho-da-imagem> --title "Título" [opções]

Opções:
  --tema <slug>          Tema em content/galeria/temas.yaml (padrão: desenhos)
  --title <texto>        Título da imagem (obrigatório)
  --description <texto>  Descrição opcional
  --medium <texto>       Técnica/material opcional (ex: "Lápis 2B")
  --tags <a,b,c>         Tags separadas por vírgula
  --date <YYYY-MM-DD>    Data (padrão: hoje)`);
}

async function main() {
  loadLocalEnv();

  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      tema: { type: 'string', default: 'desenhos' },
      title: { type: 'string' },
      description: { type: 'string' },
      medium: { type: 'string' },
      tags: { type: 'string' },
      date: { type: 'string' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  if (values.help || positionals.length === 0) {
    printUsage();
    process.exit(values.help ? 0 : 1);
  }

  const imagePath = path.resolve(process.cwd(), positionals[0]);
  const title = values.title?.trim();
  const tema = (values.tema || 'desenhos').trim();

  if (!title) {
    console.error('Erro: --title é obrigatório.');
    printUsage();
    process.exit(1);
  }

  // 1. Verificar se o arquivo de imagem existe
  await fs.access(imagePath);

  // 2. Verificar se o tema existe em content/galeria/temas.yaml
  const galeriaDir = path.resolve(process.cwd(), 'content/galeria');
  const temasRaw = await fs.readFile(path.join(galeriaDir, 'temas.yaml'), 'utf-8');
  const temas = z.array(GaleriaTemaSchema).parse(YAML.parse(temasRaw) ?? []);
  if (!temas.some((t) => t.slug === tema)) {
    throw new Error(
      `Tema "${tema}" não encontrado em content/galeria/temas.yaml. Disponíveis: ${temas.map((t) => t.slug).join(', ')}`
    );
  }

  // 3. Ler itens atuais do tema para evitar id duplicado
  const temaFile = path.join(galeriaDir, `${tema}.yaml`);
  let existingRaw: unknown[] = [];
  try {
    const content = await fs.readFile(temaFile, 'utf-8');
    const parsed = YAML.parse(content);
    if (Array.isArray(parsed)) {
      existingRaw = parsed;
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err;
    }
  }

  const existingIds = new Set(
    existingRaw
      .map((row) => (row && typeof row === 'object' && 'id' in row ? String(row.id) : ''))
      .filter(Boolean)
  );

  const baseId = toKebabId(title);
  let id = baseId;
  let suffix = 2;
  while (existingIds.has(id)) {
    id = `${baseId}-${suffix++}`;
  }

  // 4. Processar imagem com sharp (auto-orientação, resize <= 2400px, WebP q85 + blurDataURL)
  const inputBuffer = await fs.readFile(imagePath);
  const { data: webpBuffer, info } = await sharp(inputBuffer)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  const blurBuffer = await sharp(webpBuffer)
    .resize({ width: 10 })
    .webp({ quality: 40 })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  const hash = crypto.createHash('sha1').update(webpBuffer).digest('hex').slice(0, 6);
  const key = `${tema}/${id}-${hash}.webp`;

  // 5. Upload para o Cloudflare R2
  const accountId = requireEnv('R2_ACCOUNT_ID');
  const accessKeyId = requireEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = requireEnv('R2_SECRET_ACCESS_KEY');
  const bucket = requireEnv('R2_BUCKET');

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  console.log(`Enviando ${key} (${info.width}x${info.height}, ${(webpBuffer.length / 1024).toFixed(1)} KB) para R2...`);
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: webpBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  // 6. Montar entrada e validar com Zod antes de gravar
  const dateStr = values.date?.trim() || new Date().toISOString().slice(0, 10);
  const tags = values.tags
    ? values.tags
        .split(',')
        .map((t) => toKebabId(t))
        .filter(Boolean)
    : [];

  const entry: Record<string, unknown> = {
    id,
    title,
    ...(values.description?.trim() ? { description: values.description.trim() } : {}),
    date: dateStr,
    src: key,
    width: info.width,
    height: info.height,
    ...(values.medium?.trim() ? { medium: values.medium.trim() } : {}),
    blurDataURL,
    ...(tags.length > 0 ? { tags } : {}),
  };

  GaleriaItemSchema.parse(entry);

  const updatedList = [entry, ...existingRaw];
  await fs.writeFile(temaFile, YAML.stringify(updatedList), 'utf-8');

  console.log(`✓ Adicionado "${title}" (${id}) em content/galeria/${tema}.yaml`);
}

main().catch((err) => {
  console.error('❌ Falha em galeria:add:', err instanceof Error ? err.message : err);
  process.exit(1);
});
