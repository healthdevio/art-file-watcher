# file-watcher

## Configuração do File Watcher como Serviço systemd

Utilizar o systemd é a forma mais robusta de garantir que seu aplicativo Node.js empacotado (file-watcher) rode de forma contínua, com alta disponibilidade e que inicie automaticamente após qualquer reinicialização do servidor Linux.

### 1. Pré-requisitos e Estrutura de Arquivos

- Gerar o binário executável para Linux usando o pkg (ou nexe).
- Criar o arquivo .env com as variáveis de ambiente.
- Criar o usuário do sistema dedicado ao serviço.
- Criar o diretório para o binário e a configuração.
- Criar o arquivo file-watcher.service no diretório de configuração do sistema.

### 2. Criação do Unit File (.service)

O arquivo de serviço (Unit File) diz ao systemd como executar e gerenciar seu aplicativo. Crie o arquivo file-watcher.service no diretório de configuração do sistema:

/etc/systemd/system/file-watcher.service

```text/plain
[Unit]
Description=File Watcher Service (Node.js/chokidar)
After=network.target

[Service]
# Tipo de serviço simples, o processo principal é a própria aplicação
Type=simple

# Usuário e Grupo com os quais o serviço será executado (RECOMENDADO)
# Troque 'watcher' pelo usuário que você criar para o serviço.
User=watcher
Group=watcher

# Diretório de trabalho onde o binário deve carregar o arquivo .env
WorkingDirectory=/etc/file-watcher

# Comando de execução: aponta para o binário. 
# Garanta que o caminho esteja correto!
ExecStart=/usr/local/bin/file-watcher

# Garante que a aplicação será reiniciada se ela falhar (com um delay opcional)
Restart=always
RestartSec=5s

# Configura as variáveis de ambiente a partir do arquivo .env
# O seu código 'import 'dotenv/config'' garante que ele será lido.

# Limites de recursos (opcional, para estabilidade)
LimitNOFILE=65536
StandardOutput=journal
StandardError=journal

[Install]
# Define em qual "fase" do boot o serviço deve ser ativado
WantedBy=multi-user.target
```

### 3. Comandos de Instalação e Gerenciamento

Após salvar o arquivo file-watcher.service, execute os seguintes comandos no terminal com privilégios de root (ou sudo):

Passo 3.1: Criar Usuário e Diretórios (Se ainda não existirem)

a) Cria o diretório para o binário e a configuração
  `sudo mkdir -p /etc/file-watcher`
b) Cria o usuário do sistema dedicado ao serviço
  `sudo useradd -r -s /bin/false watcher`

c) Garante que o usuário 'watcher' possa ler o arquivo .env
  `sudo chown -R watcher:watcher /etc/file-watcher`


Passo 3.2: Recarregar, Habilitar e Iniciar o Serviço

1. Recarrega o systemd para reconhecer o novo arquivo .service
  `sudo systemctl daemon-reload`

2. Habilita o serviço. Isso garante que ele inicie no próximo boot.
  `sudo systemctl enable file-watcher.service`

3. Inicia o serviço imediatamente
  `sudo systemctl start file-watcher.service`

### Verificação e Monitoramento

Use estes comandos para verificar o status e ver os logs:

| Comando | Descrição | 
|---------|-----------|
| `sudo systemctl status file-watcher` | Mostra o status atual (ativo/inativo) e as últimas linhas de log. |
| `journalctl -u file-watcher -f` | Abre um stream contínuo (tail) dos logs do serviço (substitui o console.log e console.error). |
| `sudo systemctl stop file-watcher` | Para o serviço. |
| `sudo systemctl restart file-watcher` | Reinicia o serviço (necessário após qualquer alteração no binário ou no .env). |


