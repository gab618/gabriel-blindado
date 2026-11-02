# gabrielblindado.com.br

Site pessoal, digital garden (wiki técnica/TIL) e laboratório de utilitários interativos com estética brutalista inspirada no Debian.org e Arch Wiki.

Construído com **Next.js 16 (App Router + Cache Components)**, **React 19**, **Tailwind CSS v4** e geração estática (SSG) de alta densidade sem overhead de JavaScript em páginas de texto.

---

## Como Adicionar Conteúdo (Markdown)

Você **não precisa mexer em código React/TypeScript** para escrever no site. Todo o conteúdo é gerenciado em arquivos Markdown locais na pasta `content/pt/`.

### 1. Adicionar uma Página na Wiki Técnica

A Wiki é hierárquica e categorizada por assuntos de longo prazo.

- **Local:** `content/pt/wiki/<categoria>/<nome-do-arquivo>.md`
- **Exemplo de caminho:** `content/pt/wiki/linux/systemd.md`
- **URL gerada:** `/pt/wiki/linux/systemd`

#### Template para nota de Wiki:

```markdown
---
title: "Guia de Systemd Units"
description: "Como criar serviços e timers locais no Linux."
date: 2026-11-02
status: evergreen
tags:
  - linux
  - devops
aliases:
  - systemd-guide
---

# Guia de Systemd Units

Texto introdutório sobre o tema...

> [!NOTE]
> Você pode usar caixas de aviso para destacar informações.

## Como Iniciar um Serviço

Instruções e comandos com syntax highlighting em build-time:

```bash
systemctl --user start meu-servico.service
```

### Wikilinks internos

Você pode referenciar outras notas da wiki usando a sintaxe de wikilink:
- `[[linux/arch]]`
- `[[linux/arch|Guia de Instalação do Arch]]`
```

---

### 2. Adicionar uma Entrada no TIL (Today I Learned)

O TIL é uma coleção cronológica rápida de aprendizados diários atômicos.

- **Local:** `content/pt/til/<yyyy-mm-dd>-<slug>.md`
- **Exemplo de caminho:** `content/pt/til/2026-11-02-docker-rootless.md`
- **URL gerada:** `/pt/til/2026-11-02-docker-rootless`

#### Template para entrada de TIL:

```markdown
---
title: "Docker em modo Rootless"
description: "Executando containers com segurança sem usuário root."
date: 2026-11-02
status: seedling
tags:
  - docker
  - seguranca
---

# Docker em modo Rootless

Hoje configurei o daemon do Docker para rodar no user namespace...
```

---

## Campos do Frontmatter (Metadados)

O cabeçalho no topo de cada arquivo Markdown (`---`) é validado rigorosamente no build pelo Zod. Se houver algum erro, o build indica exatamente o arquivo e o campo que precisa de correção.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|:---:|---|
| `title` | `string` | **Sim** | Título do post (1 a 120 caracteres). |
| `date` | `YYYY-MM-DD` | **Sim** | Data de publicação ou registro. |
| `description` | `string` | Não | Resumo para SEO e listagens (máx. 200 caracteres). |
| `updated` | `YYYY-MM-DD` | Não | Data da última revisão substancial. |
| `tags` | `string[]` | Não | Lista de tags em minúsculas com hífen (`[linux, react]`). |
| `status` | `enum` | Não | Fase da nota: `seedling` (semente), `budding` (em broto), `evergreen` (madura). Padrão: `seedling`. |
| `draft` | `boolean` | Não | Se `true`, aparece em `pnpm dev` mas é omitido no build de produção. Padrão: `false`. |
| `aliases` | `string[]` | Não | Apelidos para resolução de wikilinks. |
| `translationKey` | `string` | Não | Identificador para associar a versão traduzida (default: `<collection>/<caminho>`). |

---

## Recursos e Sintaxes Especiais Suportadas

### 1. Caixas de Aviso Técnicas (Admonitions)
Use o padrão do GitHub Flavored Markdown:

```markdown
> [!NOTE]
> Informação contextual ou documentação de apoio.

> [!TIP]
> Sugestão de boas práticas ou otimização de performance.

> [!IMPORTANT]
> Requisito crucial ou detalhe fundamental.

> [!WARNING]
> Aviso de potencial incompatibilidade ou deprecation.

> [!CAUTION]
> Ação de risco com chance de quebra ou perda de dados.
```

### 2. Wikilinks
- `[[caminho/da-nota]]` gera um link para `/pt/wiki/caminho/da-nota`.
- `[[caminho/da-nota|Texto Personalizado]]` define um rótulo visível para o link.

### 3. Tabelas Limpas
Tabelas Markdown convencionais são renderizadas com bordas nítidas de 1px e rolagem horizontal em telas pequenas:

```markdown
| Comando | Descrição |
|---|---|
| `ls -la` | Lista todos os arquivos detalhadamente |
| `df -h` | Exibe o uso de disco legível |
```

---

## Adicionando Novas Páginas e Ferramentas

| Tipo de Conteúdo | Onde criar | Como implementar |
|---|---|---|
| **Nota de Wiki** | `content/pt/wiki/<categoria>/<post>.md` | Apenas Markdown |
| **Nota de TIL** | `content/pt/til/<yyyy-mm-dd>-<post>.md` | Apenas Markdown |
| **Página estática comum** (ex: `/pt/sobre`) | `app/[lang]/sobre/page.tsx` | Server Component React (RSC) |
| **Ferramenta/calculadora interativa** | `app/[lang]/tools/<slug>/tool.tsx` | Client Component (`'use client'`) |

---

## Comandos do Projeto

```bash
# Iniciar o servidor de desenvolvimento
pnpm dev

# Executar a suíte de testes unitários (Vitest)
pnpm test

# Checar tipagem TypeScript (sem emitir arquivos)
pnpm typecheck

# Executar o linter (ESLint)
pnpm lint

# Compilar build estático de produção
pnpm build

# Testar build compilado localmente
pnpm start
```
