/**
 * Configuração central da galeria.
 * A base de URLs das imagens vem de NEXT_PUBLIC_GALERIA_IMAGE_BASE_URL
 * (ex: https://pub-xxxx.r2.dev/ ou https://img.gabrielblindado.com.br/).
 */

export function normalizeGaleriaBaseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error(
      'NEXT_PUBLIC_GALERIA_IMAGE_BASE_URL está vazia. Defina a URL base do bucket R2 (ex: https://pub-xxxx.r2.dev/).'
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_GALERIA_IMAGE_BASE_URL inválida ("${trimmed}"). Deve ser uma URL http/https válida.`
    );
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(
      `NEXT_PUBLIC_GALERIA_IMAGE_BASE_URL deve usar http ou https (recebido: "${parsed.protocol}").`
    );
  }

  return parsed.toString().replace(/\/?$/, '/');
}

export function getGaleriaImageBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_GALERIA_IMAGE_BASE_URL;
  if (!raw) {
    throw new Error(
      'NEXT_PUBLIC_GALERIA_IMAGE_BASE_URL não está definida. Configure-a em .env.local e nas variáveis de ambiente da Vercel.'
    );
  }
  return normalizeGaleriaBaseUrl(raw);
}

/**
 * Resolve a chave relativa de uma imagem (ex: "desenhos/sonic.webp") para a URL completa.
 */
export function imageUrl(src: string, baseUrl?: string): string {
  const normalizedBase = baseUrl ? normalizeGaleriaBaseUrl(baseUrl) : getGaleriaImageBaseUrl();
  const cleanKey = src.replace(/^\/+/, '');
  return new URL(cleanKey, normalizedBase).toString();
}
