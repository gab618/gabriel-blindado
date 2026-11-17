---
title: "Cadê a Rosenda"
description: "Fiz esse site pra saber onde minha mãe está."
date: 2026-11-10
status: evergreen
cover: "/projetos/cade-a-rosenda.webp"
url: "https://cade-a-rosenda.vercel.app"
order: 2
tags:
  - web
  - pwa
  - familia
---

# Cadê a Rosenda?

Fiz esse site para responder a uma pergunta muito simples do dia a dia: **onde minha mãe está hoje?**

A Rosenda trabalha em escala hospitalar (12x36), e entre plantões, descansos, trocas de folga e as viagens para visitar a Violeta em Brasília, tentar adivinhar a rotina dela de cabeça era uma confusão. Então resolvi criar uma aplicação PWA leve e prática para acompanhar tudo num piscar de olhos.

## O que o app faz

O app exibe de imediato o status do dia:
- 🏥 **No plantão no hospital**
- 🏠 **No conforto do lar** (descanso da escala)
- ✈️ **Em Brasília**, visitando a família

Além do status diário com animações, tem:
- **Cálculo automático da escala 12x36**
- **Calendário mensal visual** com marcação rápida de folgas extras e plantões
- **Sincronização em nuvem via GitHub Gist** (sem necessidade de banco de dados complexo, usando uma rota de API segura no Next.js)
- **Offline First (PWA)** com suporte local via Service Worker (Serwist), funcionando mesmo sem conexão
- **Acesso rápido com PIN** para ela mesma conseguir registrar e trocar folgas com um único toque

## Acesso e Código-Fonte

- **Aplicação no ar**: acesse diretamente em [cade-a-rosenda.vercel.app](https://cade-a-rosenda.vercel.app).
- **Repositório no GitHub**: o código completo está aberto em [github.com/gab618/cade-a-rosenda](https://github.com/gab618/cade-a-rosenda).
