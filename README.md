# gabrielblindado.com.br

coisas aleatórias de Gabriel Blindado.

Espaço pessoal na web com foco em posts e textos. Estética limpa, minimalista e tipográfica, focada nas palavras, na tranquilidade e sem ruído de algoritmos.

Construído com **Next.js 16 (App Router + Cache Components)**, **React 19**, **Tailwind CSS v4** e geração estática (SSG) de alta velocidade sem overhead de JavaScript em páginas de leitura.

---

## Como Adicionar Conteúdo (Markdown)

Você **não precisa mexer em código React nem TypeScript** para publicar no site. Todo o conteúdo é gerenciado em arquivos Markdown na pasta `content/pt/posts/`.

### Adicionar um Post

- **Local:** `content/pt/posts/<nome-do-arquivo>.md`
- **Exemplo:** `content/pt/posts/bolo-de-cenoura.md` &rarr; `/pt/posts/bolo-de-cenoura`

#### Template:

```markdown
---
title: "Bolo de Cenoura com Calda Crocante"
description: "A receita de família que nunca sola, com massa fofa e casquinha crocante."
date: 2026-11-04
status: evergreen
tags:
  - receitas
  - culinaria
---

# Bolo de Cenoura com Calda Crocante

Texto de introdução...

> [!TIP]
> Dica ou observação importante aqui.

## Ingredientes

| Ingrediente | Quantidade |
|---|---|
| Cenoura média | 3 unidades |
| Ovos | 3 unidades |

## Modo de Preparo
1. Bata no liquidificador...
```

---

## Desenvolvimento Local

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Validação Completa (Testes + Build + Tipos + Guardrails)

```bash
pnpm validate
```
