---
title: "Git Rebase Interativo e Fixup"
description: "Dica rápida para manter histórico limpo no Git com commits de fixup e autosquash."
date: 2026-11-01
status: evergreen
tags:
  - git
  - devops
---

# Git Rebase Interativo e Fixup

Ao trabalhar em PRs com revisões sucessivas, o uso de `git commit --fixup` evita commits poluídos como "ajuste", "fix teste".

> [!TIP]
> Execute `git commit --fixup <commit-hash>` e depois `git rebase -i --autosquash HEAD~5` para mesclar as alterações automaticamente no commit alvo.

```bash
# Comita diretamente como fixup de um commit anterior
git commit --fixup HEAD~1

# Executa rebase aplicando os fixups automaticamente
git rebase -i --autosquash main
```
