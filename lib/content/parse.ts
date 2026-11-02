import fs from 'node:fs/promises';
import matter from 'gray-matter';
import { PostFrontmatterSchema, type PostFrontmatter } from './schema';
import { ContentError } from './errors';
import { calculateReadingMinutes, type DiscoveredFile } from './fs';
import type { PostMeta } from '../types';

export interface ParsedMarkdown {
  meta: PostMeta;
  content: string;
}

/**
 * Lê e valida um arquivo Markdown a partir de um DiscoveredFile
 */
export async function parseMarkdownFile(file: DiscoveredFile): Promise<ParsedMarkdown> {
  let fileContent: string;
  try {
    fileContent = await fs.readFile(file.absolutePath, 'utf-8');
  } catch (err) {
    throw new ContentError(
      file.sourcePath,
      `Falha ao ler o arquivo: ${(err as Error).message}`
    );
  }

  return parseMarkdownString(fileContent, file);
}

/**
 * Faz parse e validação de uma string Markdown com frontmatter
 */
export function parseMarkdownString(
  rawSource: string,
  fileContext: DiscoveredFile
): ParsedMarkdown {
  let parsedMatter: matter.GrayMatterFile<string>;
  try {
    parsedMatter = matter(rawSource);
  } catch (err) {
    throw new ContentError(
      fileContext.sourcePath,
      `Erro de sintaxe no YAML/Frontmatter: ${(err as Error).message}`
    );
  }

  const parseResult = PostFrontmatterSchema.safeParse(parsedMatter.data);

  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    throw new ContentError(
      fileContext.sourcePath,
      'Frontmatter inválido ou faltando campos obrigatórios',
      issues
    );
  }

  const frontmatter: PostFrontmatter = parseResult.data;
  const translationKey = frontmatter.translationKey || fileContext.defaultTranslationKey;
  const readingMinutes = calculateReadingMinutes(parsedMatter.content);

  // Determina a rota final (href)
  const slugPath = fileContext.slug.join('/');
  const href = slugPath
    ? `/${fileContext.lang}/${fileContext.collection}/${slugPath}`
    : `/${fileContext.lang}/${fileContext.collection}`;

  const meta: PostMeta = {
    ...frontmatter,
    lang: fileContext.lang,
    collection: fileContext.collection,
    slug: fileContext.slug,
    href,
    translationKey,
    translations: {}, // preenchido posteriormente no cruzamento
    sourcePath: fileContext.sourcePath,
    readingMinutes,
  };

  return {
    meta,
    content: parsedMatter.content,
  };
}
