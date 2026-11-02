---
title: "Systemd: Gestão de Serviços e Timers"
description: "Guia prático para criação, controle e automação de serviços em nível de sistema e usuário no Linux."
date: 2026-11-02
updated: 2026-11-02
status: evergreen
tags:
  - linux
  - systemd
  - devops
aliases:
  - systemd-guide
---

# Systemd: Gestão de Serviços e Timers

O **systemd** é o sistema de inicialização (*init system*) e gerenciador de serviços padrão na maioria das distribuições Linux modernas, incluindo Debian, Arch Linux, Fedora e Ubuntu.

> [!NOTE]
> Este guia foca no gerenciamento prático de units com foco em servidores e ambientes de desenvolvimento.

## Comandos Fundamentais de Controle

O utilitário principal de interação é o `systemctl`. A tabela a seguir resume as operações mais comuns:

| Ação | Comando do Sistema | Modo de Usuário (Sem Root) |
|---|---|---|
| Iniciar unit | `systemctl start <unit>` | `systemctl --user start <unit>` |
| Parar unit | `systemctl stop <unit>` | `systemctl --user stop <unit>` |
| Reiniciar unit | `systemctl restart <unit>` | `systemctl --user restart <unit>` |
| Checar status | `systemctl status <unit>` | `systemctl --user status <unit>` |
| Habilitar no boot | `systemctl enable <unit>` | `systemctl --user enable <unit>` |

## Criando uma Unit Customizada

Para registrar um novo serviço, crie um arquivo com a extensão `.service` em `/etc/systemd/system/` (ou em `~/.config/systemd/user/` para serviços de usuário):

```ini
[Unit]
Description=Meu Servidor de Backup
After=network.target

[Service]
Type=simple
User=gabriel
ExecStart=/usr/local/bin/backup-sync.sh
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=default.target
```

Após criar ou editar qualquer arquivo de unit, execute sempre:

```bash
systemctl daemon-reload
```

> [!WARNING]
> Sem executar o `daemon-reload`, o systemd continuará executando a definição anterior em memória.

## Referências e Links Internos

- Veja também as notas gerais em [[index|Wiki Principal]].
