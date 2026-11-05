# gabrielblindado.com.br

coisas aleatórias de Gabriel Blindado. Espaço pessoal na web: posts, receitas, notas rápidas e projetos pessoais. Estética limpa, minimalista e tipográfica, focada nas palavras, na tranquilidade e sem ruído de algoritmos.

Construído com **Next.js 16 (App Router + Cache Components)**, **React 19**, **Tailwind CSS v4** e geração estática (SSG) de alta velocidade sem overhead de JavaScript em páginas de leitura.

---

## Como Adicionar Conteúdo (Markdown)

Você **não precisa mexer em código React nem TypeScript** para publicar no site. Todo o conteúdo é gerenciado em arquivos Markdown normais na pasta `content/pt/`.

### 1. Adicionar um Post (Ensaio, Reflexão ou Receita)

A seção de **Posts** organiza textos mais aprofundados, reflexões e receitas culinárias.

- **Local:** `content/pt/posts/<categoria>/<nome-do-arquivo>.md`
- **Exemplos:**
  - `content/pt/posts/receitas/bolo-de-cenoura.md` &rarr; `/pt/posts/receitas/bolo-de-cenoura`
  - `content/pt/posts/reflexoes/sobre-desacelerar.md` &rarr; `/pt/posts/reflexoes/sobre-desacelerar`

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
  - afeto
---

# Bolo de Cenoura com Calda Crocante

Texto de introdução e história da receita...

> [!TIP]
> Use ovos em temperatura ambiente.

## Ingredientes

| Ingrediente | Quantidade |
|---|---|
| Cenoura média | 3 unidades |
| Ovos | 3 unidades |

## Modo de Preparo
1. Bata no liquidificador...
```

---

### 2. Adicionar uma Nota

As **Notas** servem para fragmentos curtos, observações da rotina e ideias breves.

- **Local:** `content/pt/notas/YYYY-MM-DD-<titulo-curto>.md`
- **Exemplo:** `content/pt/notas/2026-11-04-o-silencio-da-manha.md`
- **URL gerada:** `/pt/notas/2026-11-04-o-silencio-da-manha`

#### Template:

```markdown
---
title: "O silêncio da manhã e o ritual do café"
description: "A tranquilidade de acordar cedo e começar o dia sem pressa."
date: 2026-11-04
status: evergreen
tags:
  - rotina
  - cafe
---

# O silêncio da manhã e o ritual do café

Acordei cedo hoje e moí o café com calma...
```

---

### 3. Adicionar um Projeto Pessoal

A seção de **Projetos** serve para catalogar coisas que você criou, tirou do papel ou iniciativas que você tem orgulho de compartilhar.

- **Local:** `content/pt/projetos/<slug>.md`
- **Exemplo:** `content/pt/projetos/meu-canto-na-web.md`
- **URL gerada:** `/pt/projetos/meu-canto-na-web`

#### Template:

```markdown
---
title: "Minha Primeira Horta em Vasos"
description: "Como comecei a plantar temperos frescos na varanda de casa."
date: 2026-11-04
status: budding
tags:
  - projetos
  - plantas
---

# Minha Primeira Horta em Vasos

Relato do projeto, fotos e aprendizados...
```

---

## Recursos Embutidos

- **Wikilinks internos:** Conecte textos digitando `[[receitas/bolo-de-cenoura]]` ou `[[receitas/bolo-de-cenoura|meu bolo de cenoura]]`. O site gera o link automaticamente e calcula a seção de **Backlinks (Notas que mencionam esta)** no rodapé de cada texto.
- **Busca Rápida Offline (`Ctrl+K` ou `Cmd+K`):** Filtra instantaneamente por título, tags e descrição de qualquer publicação.
- **Tema Claro / Escuro / Auto:** Alternador sem flash de hidratação no cabeçalho.
- **Feed RSS 2.0:** Disponível em `/pt/feed.xml` para leitores de RSS.
- **Sitemap & Robots:** Gerados automaticamente para mecanismos de busca.

---

## Comandos de Desenvolvimento

```bash
# Rodar servidor de desenvolvimento
pnpm dev

# Rodar a suíte de testes
pnpm test

# Validação completa (lint, tipos, testes, fronteiras e build estático)
pnpm validate
```
