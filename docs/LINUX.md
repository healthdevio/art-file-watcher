# Guia de Instalação no Linux

Este guia cobre a instalação completa do **art-file-watcher** no Linux, desde o download da release até a configuração como serviço systemd. Compatível com **Ubuntu**, **CentOS**, **RHEL** e outras distribuições baseadas em systemd.

## 📋 Pré-requisitos

- Distribuição Linux com systemd (Ubuntu 16.04+, CentOS 7+, RHEL 7+)
- Acesso root ou sudo para configuração do serviço
- Acesso à internet para download da release
- Diretórios criados para:
  - Instalação da aplicação (ex: `/opt/art-file-watcher`)
  - Diretório de monitoramento (ex: `/var/art/input`)
  - Logs (ex: `/var/art/logs`)
  - Cache (ex: `/var/art/cache`)

> 💡 **Dica**: Este projeto inclui scripts automatizados para facilitar a instalação e atualização:
>
> - `scripts/install-linux.sh` - Instalação automatizada completa
> - `scripts/update-linux.sh` - Atualização automatizada com backup

---

## 🚀 Instalação Rápida

### Opção 1: Instalação Automatizada (Recomendado)

O método mais simples é usar o script de instalação automatizado:

```bash
# Baixe o script de instalação
curl -L -o install-linux.sh https://raw.githubusercontent.com/healthdevio/art-file-watcher/main/scripts/install-linux.sh

# Ou se você já clonou o repositório:
cd /caminho/para/art-file-watcher

# Torne o script executável
chmod +x scripts/install-linux.sh

# Execute a instalação (versão mais recente)
sudo ./scripts/install-linux.sh

# Ou instale uma versão específica
sudo ./scripts/install-linux.sh -v v1.0.3

# Ou instale em diretórios customizados
sudo ./scripts/install-linux.sh -d /opt/app -D /var/app-data
```

O script automaticamente:

- ✅ Detecta a distribuição Linux (Ubuntu/CentOS/RHEL)
- ✅ Instala dependências necessárias (curl, libstdc++)
- ✅ Baixa a versão mais recente ou especificada
- ✅ Cria os diretórios necessários
- ✅ Configura o serviço systemd
- ✅ Define permissões apropriadas

**Ver opções disponíveis:**

```bash
sudo ./scripts/install-linux.sh --help
```

### Opção 2: Instalação Manual

Se preferir instalar manualmente, siga os passos abaixo:

#### Instalação Manual (Passo a Passo)

#### 1. Download da Release do GitHub

```bash
# Defina a versão desejada (substitua v1.0.3 pela versão mais recente)
VERSION="v1.0.3"
REPO_URL="https://github.com/healthdevio/art-file-watcher/releases/download"

# Crie o diretório de instalação
sudo mkdir -p /opt/art-file-watcher
cd /opt/art-file-watcher

# Baixe o binário
sudo curl -L -o art-w "${REPO_URL}/${VERSION}/art-w"
sudo chmod +x art-w

# Verifique a versão instalada
./art-w --version
```

**Nota para CentOS/RHEL**: O mesmo binário funciona em CentOS/RHEL. Se houver problemas com dependências, você pode precisar instalar libstdc++:

```bash
# CentOS/RHEL 7
sudo yum install -y libstdc++

# CentOS/RHEL 8+
sudo dnf install -y libstdc++
```

#### 2. Criação de Diretórios

```bash
# Crie os diretórios necessários
sudo mkdir -p /var/art/{input,logs,cache}

# Defina permissões apropriadas
sudo chown -R $USER:$USER /var/art
sudo chmod -R 755 /var/art
```

#### 3. Configuração Inicial

```bash
cd /opt/art-file-watcher

# Use o comando config para gerar o arquivo .env
sudo ./art-w config \
  --watch-dir /var/art/input \
  --log-dir /var/art/logs \
  --api-endpoint https://gestao-art-back.mutua.com.br/watcher-extraction/upload \
  --api-key SUA_API_KEY_AQUI \
  --cache-dir /var/art/cache \
  --extensions .ret,.txt \
  --queue-concurrency 3

# Ou edite manualmente o arquivo .env
sudo nano .env
```

**Exemplo de arquivo `.env`:**

```env
WATCH_DIR=/var/art/input
API_ENDPOINT=https://gestao-art-back.mutua.com.br/watcher-extraction/upload
API_KEY=sua-api-key-aqui
LOG_DIR=/var/art/logs
CACHE_DIR=/var/art/cache
FILE_EXTENSION_FILTER=.ret,.txt
QUEUE_CONCURRENCY=3
LOG_LEVEL=info

# Auto-update (opcional mas recomendado)
AUTO_UPDATE_ENABLED=true
AUTO_UPDATE_CHECK_INTERVAL_HOURS=24
AUTO_UPDATE_REPOSITORY=healthdevio/art-file-watcher
AUTO_UPDATE_SERVICE_NAME=art-file-watcher
```

### 4. Teste Manual

Antes de configurar como serviço, teste manualmente:

```bash
cd /opt/art-file-watcher
./art-w start
```

Pressione `Ctrl+C` para parar. Verifique os logs para confirmar que está funcionando:

```bash
tail -f /var/art/logs/combined.log
```

---

## ⚙️ Configuração como Serviço systemd

> **Nota**: Se você usou o script de instalação automatizada (`install-linux.sh`), o serviço systemd já foi configurado automaticamente. Você só precisa configurar o arquivo `.env` e habilitar o serviço.

### 1. Criar Arquivo de Serviço (Apenas se instalou manualmente)

Se instalou manualmente, crie o arquivo de serviço:

```bash
sudo nano /etc/systemd/system/art-file-watcher.service
```

Cole o seguinte conteúdo:

```ini
[Unit]
Description=ART File Watcher - Monitor de arquivos de retorno de convênios ART
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/opt/art-file-watcher
ExecStart=/opt/art-file-watcher/art-w start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
EnvironmentFile=/opt/art-file-watcher/.env

# Limites de segurança
LimitNOFILE=65536
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target
```

**Nota**: Se você criar um usuário dedicado (recomendado para produção), altere `User` e `Group`:

```bash
# Criar usuário dedicado (opcional mas recomendado)
sudo useradd -r -s /bin/false artwatcher

# Definir permissões
sudo chown -R artwatcher:artwatcher /opt/art-file-watcher
sudo chown -R artwatcher:artwatcher /var/art

# Atualizar o arquivo de serviço para usar o usuário
# User=artwatcher
# Group=artwatcher

# Recarregar e reiniciar
sudo systemctl daemon-reload
sudo systemctl restart art-file-watcher
```

### 2. Recarregar e Habilitar o Serviço

```bash
# Recarregar configurações do systemd
sudo systemctl daemon-reload

# Habilitar o serviço para iniciar no boot
sudo systemctl enable art-file-watcher

# Iniciar o serviço
sudo systemctl start art-file-watcher

# Verificar status
sudo systemctl status art-file-watcher
```

### 3. Verificar Logs

```bash
# Logs do systemd
sudo journalctl -u art-file-watcher -f

# Logs da aplicação
tail -f /var/art/logs/combined.log

# Logs de erros apenas
tail -f /var/art/logs/error.log
```

---

## 🔧 Comandos Úteis

### Gerenciamento do Serviço

```bash
# Iniciar
sudo systemctl start art-file-watcher

# Parar
sudo systemctl stop art-file-watcher

# Reiniciar
sudo systemctl restart art-file-watcher

# Status
sudo systemctl status art-file-watcher

# Habilitar no boot
sudo systemctl enable art-file-watcher

# Desabilitar no boot
sudo systemctl disable art-file-watcher
```

### Verificação e Monitoramento

```bash
# Verificar se o processo está rodando
ps aux | grep art-w

# Ver logs em tempo real
sudo journalctl -u art-file-watcher -f --lines=50

# Ver logs das últimas 100 linhas
sudo journalctl -u art-file-watcher -n 100

# Ver logs desde hoje
sudo journalctl -u art-file-watcher --since today

# Verificar portas em uso (se aplicável)
sudo netstat -tlnp | grep art-w
# ou
sudo ss -tlnp | grep art-w
```

### Verificar Configuração

```bash
# Verificar variáveis de ambiente carregadas
sudo systemctl show art-file-watcher --property=Environment

# Testar configuração sem iniciar o serviço
cd /opt/art-file-watcher
./art-w --help
```

---

## 📦 Atualização

Se o auto-update estiver desabilitado ou você preferir atualizar manualmente:

### Método Recomendado: Script de Atualização

O projeto inclui um script de atualização automatizado:

```bash
# Baixe o script de atualização
curl -L -o update-linux.sh https://raw.githubusercontent.com/healthdevio/art-file-watcher/main/scripts/update-linux.sh

# Ou se você já clonou o repositório:
cd /caminho/para/art-file-watcher

# Torne o script executável
chmod +x scripts/update-linux.sh

# Atualizar para versão mais recente
sudo ./scripts/update-linux.sh

# Atualizar para versão específica
sudo ./scripts/update-linux.sh -v v1.0.4

# Atualizar instalação em diretório customizado
sudo ./scripts/update-linux.sh -d /opt/app
```

O script automaticamente:

- ✅ Verifica a instalação atual
- ✅ Cria backup do binário atual
- ✅ Baixa a nova versão
- ✅ Valida o binário antes de substituir
- ✅ Para e reinicia o serviço se necessário
- ✅ Restaura backup em caso de erro

**Ver opções disponíveis:**

```bash
sudo ./scripts/update-linux.sh --help
```

### Método Manual: Download e Substituição Direta

Se preferir atualizar manualmente:

```bash
# Parar o serviço
sudo systemctl stop art-file-watcher

# Fazer backup do binário atual
cd /opt/art-file-watcher
sudo cp art-w art-w.backup

# Definir nova versão
VERSION="v1.0.4"  # Substitua pela versão desejada
REPO_URL="https://github.com/healthdevio/art-file-watcher/releases/download"

# Baixar nova versão
sudo curl -L -o art-w.new "${REPO_URL}/${VERSION}/art-w"
sudo chmod +x art-w.new

# Substituir o binário
sudo mv art-w.new art-w

# Reiniciar o serviço
sudo systemctl start art-file-watcher

# Verificar se iniciou corretamente
sudo systemctl status art-file-watcher
```

---

## 🔍 Troubleshooting

### Serviço não inicia

```bash
# Verificar erros detalhados
sudo journalctl -u art-file-watcher -n 50 --no-pager

# Verificar permissões
ls -la /opt/art-file-watcher/art-w
ls -la /opt/art-file-watcher/.env

# Testar manualmente
cd /opt/art-file-watcher
sudo -u root ./art-w start
```

### Problemas com permissões

```bash
# Verificar propriedade dos arquivos
ls -la /opt/art-file-watcher/
ls -la /var/art/

# Corrigir permissões
sudo chown -R root:root /opt/art-file-watcher
sudo chmod +x /opt/art-file-watcher/art-w
sudo chmod 644 /opt/art-file-watcher/.env
```

### Problemas de rede/conectividade

```bash
# Verificar acesso à API
curl -I https://gestao-art-back.mutua.com.br/watcher-extraction/upload

# Verificar DNS
nslookup gestao-art-back.mutua.com.br

# Testar com proxy (se necessário)
export HTTP_PROXY=http://proxy:port
export HTTPS_PROXY=http://proxy:port
```

### Verificar configuração do .env

```bash
# Verificar se todas as variáveis estão definidas
cd /opt/art-file-watcher
cat .env | grep -v "^#" | grep -v "^$"

# Validar formato do arquivo
cat .env
```

### Problemas específicos do CentOS/RHEL

```bash
# Verificar versão do glibc (pode ser necessário em versões antigas)
ldd --version

# Instalar dependências adicionais (CentOS/RHEL 7)
sudo yum install -y glibc libstdc++

# Instalar dependências adicionais (CentOS/RHEL 8+)
sudo dnf install -y glibc libstdc++
```

### Logs não estão sendo gerados

```bash
# Verificar permissões do diretório de logs
ls -la /var/art/logs/

# Verificar se o diretório existe
test -d /var/art/logs && echo "Diretório existe" || echo "Diretório não existe"

# Criar e corrigir permissões
sudo mkdir -p /var/art/logs
sudo chown -R root:root /var/art/logs
sudo chmod -R 755 /var/art/logs
```

---

## 📝 Checklist de Instalação

- [ ] Binário baixado e com permissões de execução
- [ ] Diretórios criados (`/var/art/input`, `/var/art/logs`, `/var/art/cache`)
- [ ] Arquivo `.env` configurado com todas as variáveis necessárias
- [ ] Teste manual bem-sucedido
- [ ] Arquivo de serviço systemd criado em `/etc/systemd/system/art-file-watcher.service`
- [ ] Serviço habilitado para iniciar no boot
- [ ] Serviço rodando e status OK
- [ ] Logs sendo gerados corretamente
- [ ] Auto-update configurado (opcional mas recomendado)
- [ ] Firewall configurado (se necessário)

---

## 🔒 Segurança (Opcional mas Recomendado)

### Criar usuário dedicado

```bash
# Criar usuário e grupo
sudo useradd -r -s /bin/false -d /opt/art-file-watcher artwatcher

# Definir propriedade
sudo chown -R artwatcher:artwatcher /opt/art-file-watcher
sudo chown -R artwatcher:artwatcher /var/art

# Atualizar serviço para usar o usuário
sudo nano /etc/systemd/system/art-file-watcher.service
# Alterar: User=artwatcher
#          Group=artwatcher

# Recarregar e reiniciar
sudo systemctl daemon-reload
sudo systemctl restart art-file-watcher
```

### Configurar SELinux (CentOS/RHEL)

```bash
# Se SELinux estiver habilitado
sudo setenforce 0  # Temporário para teste
# ou
sudo setsebool -P httpd_can_network_connect 1  # Se necessário
```

---

## 📚 Recursos Adicionais

- [Documentação do Auto-Update](./AUTO_UPDATE.md)
- [GitHub Releases](https://github.com/healthdevio/art-file-watcher/releases)
- [README Principal](../README.md)

---

## 💡 Dicas

1. **Sempre faça backup** antes de atualizar
2. **Monitore os logs** após instalação ou atualização
3. **Teste manualmente** antes de configurar como serviço
4. **Use auto-update** para simplificar atualizações futuras
5. **Documente as configurações** específicas do seu ambiente
