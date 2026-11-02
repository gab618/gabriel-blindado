---
title: "Next.js: Arquitetura de Cache Components"
description: "Como funciona a nova primitiva unificada de cache e geração estática do Next.js."
date: 2026-11-02
status: budding
tags:
  - nextjs
  - react
  - arquitetura
---

# Next.js: Arquitetura de Cache Components

Com a introdução do `cacheComponents: true`, o Next.js unificou as antigas flags de rota (`dynamic = 'force-static'`, `revalidate = 3600`) em diretivas granulares por função: `'use cache'` e `cacheLife()`.

> [!IMPORTANT]
> A fronteira de renderização estática e dinâmica deixou de ser uma escolha no nível da rota e passou a ser tratada como um espectro no nível de componentes e funções.

## Comparativo de Modelos

| Recurso | Modelo Legado (Next ≤ 15) | Cache Components (Next 16+) |
|---|---|---|
| Granularidade | Rota inteira (`page.tsx`) | Por função ou componente (`'use cache'`) |
| Invalidação | `revalidate = 60` no arquivo | `cacheLife('hours')` ou perfil inline |
| Validação Estática | `dynamic = 'error'` | `ensureStatic = 'navigation'` |
| Parâmetros Dinâmicos | `dynamicParams = false` | `notFound()` explícito se ausente |

## Exemplo com `cacheLife`

```tsx
import { cacheLife } from 'next/cache';

export async function getArtigos() {
  'use cache';
  cacheLife('max');
  return carregarDoDisco();
}
```

> [!TIP]
> Use `cacheLife('max')` para conteúdos que só mudam quando um novo deploy do site é executado. Para orquestrar daemons e deploys no servidor, veja [[linux/systemd]].
