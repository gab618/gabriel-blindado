---
title: "Next.js 16 Cache Components e Renderização Estática"
description: "Aprendizados sobre a transição do App Router para o paradigma unificado de Cache Components."
date: 2026-11-02
status: seedling
tags:
  - nextjs
  - react
  - ssr
---

# Next.js 16 Cache Components e Renderização Estática

Hoje explorei a nova abordagem de Cache Components introduzida no Next.js 16.

> [!TIP]
> Em vez de flags estáticas de rota inteira, `use cache` e `cacheLife` fornecem controle atômico e determinístico por função.

## Pontos Chave

- `ensureStatic = 'navigation'` previne vazamentos dinâmicos não intencionais no build.
- `next/root-params` permite resolver o locale em qualquer Server Component da árvore.
