# Sistema de Auto-Update

O sistema de auto-update permite que a aplicação verifique e instale automaticamente novas versões do GitHub Releases.

## Funcionalidades

- ✅ Verifica automaticamente por novas versões no GitHub Releases
- ✅ Compara versões e detecta atualizações disponíveis
- ✅ Baixa o binário correto para a plataforma (Linux/Windows)
- ✅ Substitui o binário atual com backup de segurança
- ✅ Reinicia automaticamente o serviço (se configurado)
- ✅ Funciona mesmo quando rodando como serviço systemd/Windows Service
- ✅ Configurável via variáveis de ambiente

## Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Habilita o auto-update (padrão: false)
AUTO_UPDATE_ENABLED=true

# Intervalo de verificação em horas (padrão: 24)
AUTO_UPDATE_CHECK_INTERVAL_HOURS=24

# Repositório GitHub no formato owner/repo (padrão: healthdevio/art-file-watcher)
AUTO_UPDATE_REPOSITORY=healthdevio/art-file-watcher

# Nome do serviço systemd/Windows Service (opcional, mas ALTAMENTE RECOMENDADO)
# Sem isso, você precisará reiniciar manualmente o serviço após cada atualização
AUTO_UPDATE_SERVICE_NAME=art-file-watcher
```

### Configuração Mínima

Para habilitar o auto-update, basta adicionar:

```env
AUTO_UPDATE_ENABLED=true
```

### Configuração Completa

```env
AUTO_UPDATE_ENABLED=true
AUTO_UPDATE_CHECK_INTERVAL_HOURS=24
AUTO_UPDATE_REPOSITORY=healthdevio/art-file-watcher
AUTO_UPDATE_SERVICE_NAME=art-file-watcher
```

## Como Funciona

### 1. Verificação de Versões

- A aplicação verifica a primeira vez após 5 minutos do início (para não interferir na inicialização)
- Depois, verifica periodicamente conforme o intervalo configurado
- Usa a GitHub Releases API para buscar a última release disponível
- Compara com a versão atual do aplicativo

### 2. Download e Instalação

Quando uma nova versão é detectada:

1. **Download**: Baixa o binário correto para a plataforma atual (Linux: `art-w`, Windows: `art-w.exe`)
2. **Backup**: Cria um backup do binário atual (`art-w.backup` ou `art-w.backup.exe`)
3. **Substituição**: Substitui o binário atual pelo novo
4. **Permissões**: Define permissões de execução (no Linux)
5. **Reinicialização**: Reinicia o serviço (se configurado)

### 3. Reinicialização do Serviço

**⚠️ IMPORTANTE**: O `AUTO_UPDATE_SERVICE_NAME` é necessário para reiniciar automaticamente o serviço após a atualização. Sem ele, o binário será atualizado, mas a aplicação continuará rodando a versão antiga até você reiniciar manualmente.

O sistema tenta reiniciar o serviço automaticamente:

- **Linux (systemd)**: Usa `systemctl restart <service-name>`
- **Windows Service**: Usa `sc stop <service-name>` e `sc start <service-name>`

**Por que é importante?**
Quando uma atualização é instalada:
1. ✅ O novo binário é baixado e substitui o antigo
2. ✅ Um backup do binário anterior é criado
3. ⚠️ **O processo atual continua rodando a versão antiga** (já carregada em memória)
4. ✅ **Com `AUTO_UPDATE_SERVICE_NAME`**: O serviço é reiniciado automaticamente → nova versão ativa
5. ❌ **Sem `AUTO_UPDATE_SERVICE_NAME`**: Você precisa reiniciar manualmente → mais trabalho

Se a reinicialização automática falhar, você verá um aviso nos logs e precisará reiniciar manualmente.

## Exemplos de Uso

### Linux (systemd)

1. Configure o arquivo `.env`:

```env
AUTO_UPDATE_ENABLED=true
AUTO_UPDATE_SERVICE_NAME=art-file-watcher
```

2. Configure o serviço systemd (exemplo em `/etc/systemd/system/art-file-watcher.service`):

```ini
[Unit]
Description=ART File Watcher
After=network.target

[Service]
Type=simple
User=artwatcher
WorkingDirectory=/opt/art-file-watcher
ExecStart=/opt/art-file-watcher/art-w start
Restart=always
RestartSec=10
EnvironmentFile=/opt/art-file-watcher/.env

[Install]
WantedBy=multi-user.target
```

3. O auto-update funcionará automaticamente e reiniciará o serviço quando houver atualizações.

### Windows Service

1. Configure o arquivo `.env`:

```env
AUTO_UPDATE_ENABLED=true
AUTO_UPDATE_SERVICE_NAME=ArtFileWatcher
```

2. Configure o serviço do Windows usando `nssm` ou similar.

3. O auto-update funcionará automaticamente e reiniciará o serviço quando houver atualizações.

## Logs

O sistema de auto-update registra todas as operações nos logs:

- **Info**: Quando auto-update é habilitado/iniciado
- **Debug**: Verificações periódicas e comparação de versões
- **Info**: Quando uma nova versão é detectada e download inicia
- **Info**: Progresso da instalação
- **Warn**: Se a reinicialização automática falhar
- **Error**: Erros durante verificação ou instalação

## Segurança

- ✅ Usa HTTPS para todas as comunicações com o GitHub
- ✅ Valida a existência do binário antes de substituir
- ✅ Cria backup do binário atual antes de substituir
- ✅ Mantém permissões de arquivo apropriadas

## Limitações

1. **Permissões**: O serviço precisa ter permissões para:
   - Escrever no diretório do binário
   - Reiniciar o serviço (pode precisar de privilégios elevados)

2. **Rede**: Requer acesso à internet para verificar e baixar atualizações.

3. **Espaço em Disco**: Precisa de espaço suficiente para:
   - O novo binário
   - O backup do binário atual

## Troubleshooting

### Auto-update não está funcionando

1. Verifique se `AUTO_UPDATE_ENABLED=true` está configurado
2. Verifique os logs para erros
3. Verifique se há acesso à internet
4. Verifique se o repositório está correto: `AUTO_UPDATE_REPOSITORY`

### Reinicialização automática não funciona

1. Verifique se `AUTO_UPDATE_SERVICE_NAME` está configurado corretamente
2. Verifique se o serviço tem permissões para reiniciar
3. No Linux, pode precisar configurar sudoers ou rodar como root
4. Nos logs, você verá um aviso se a reinicialização falhar

### Binário não é encontrado para a plataforma

1. Verifique se a release no GitHub contém o binário correto:
   - Linux: `art-w`
   - Windows: `art-w.exe`
2. Verifique se o nome do repositório está correto

## Desabilitar Auto-Update

Para desabilitar o auto-update temporariamente:

```env
AUTO_UPDATE_ENABLED=false
```

Ou remova a variável completamente (desabilitado por padrão).

## Desenvolvimento

O auto-update está implementado em `src/services/auto-update.ts` e integrado ao `src/file-watcher.ts`.

### Testes

Para testar o auto-update localmente:

1. Configure `AUTO_UPDATE_ENABLED=true`
2. Configure um intervalo menor: `AUTO_UPDATE_CHECK_INTERVAL_HOURS=0.1` (6 minutos)
3. Monitore os logs para verificar o comportamento

