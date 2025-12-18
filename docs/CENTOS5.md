# Guia de Instalação no CentOS 5.11

Este guia cobre a instalação completa do **art-file-watcher** no CentOS 5.11, desde o download da release até a configuração como serviço SysV init. Compatível com **CentOS 5.x** e **RHEL 5.x**.

> ⚠️ **Aviso**: O CentOS 5.11 foi lançado em 2014 e atingiu o fim de sua vida útil em março de 2017. Não recebe mais atualizações de segurança ou suporte oficial. Recomenda-se considerar versões mais recentes do CentOS ou outras distribuições Linux suportadas.

## 📋 Pré-requisitos

- CentOS 5.11 ou RHEL 5.x
- Acesso root ou sudo para configuração do serviço
- Acesso à internet para download da release
- curl ou wget instalado
- Diretórios criados para:
  - Instalação da aplicação (ex: `/opt/art-file-watcher`)
  - Diretório de monitoramento (ex: `/var/art/input`)
  - Logs (ex: `/var/art/logs`)
  - Cache (ex: `/var/art/cache`)

---

## 🚀 Instalação Manual

#### 1. Verificar Distribuição

```bash
# Verificar versão do CentOS
cat /etc/redhat-release
# ou
lsb_release -a
```

#### 2. Instalar Dependências

```bash
# Instalar curl ou wget (se não estiver instalado)
sudo yum install -y curl
# ou
sudo yum install -y wget

# Instalar libstdc++ (se necessário)
sudo yum install -y libstdc++
```

#### 3. Download da Release do GitHub

```bash
# Defina a versão desejada (substitua v1.0.3 pela versão mais recente)
VERSION="v1.0.3"
REPO_URL="https://github.com/healthdevio/art-file-watcher/releases/download"

# Crie o diretório de instalação
sudo mkdir -p /opt/art-file-watcher
cd /opt/art-file-watcher

# Baixe o binário usando curl
sudo curl -L -o art-w "${REPO_URL}/${VERSION}/art-w"

# Ou usando wget
# sudo wget -O art-w "${REPO_URL}/${VERSION}/art-w"

# Defina permissões de execução
sudo chmod +x art-w

# Verifique a versão instalada (se possível)
./art-w --version
```

**Nota**: O binário do Linux funciona no CentOS 5.11, mas verifique a compatibilidade das bibliotecas (glibc, libstdc++).

#### 4. Criação de Diretórios

```bash
# Crie os diretórios necessários
sudo mkdir -p /var/art/input
sudo mkdir -p /var/art/logs
sudo mkdir -p /var/art/cache

# Defina permissões apropriadas
sudo chmod -R 755 /var/art
```

#### 5. Configuração Inicial

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
sudo vi .env
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

#### 6. Teste Manual

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

## ⚙️ Configuração como Serviço SysV init

### 1. Criar Script de Serviço

```bash
sudo vi /etc/init.d/art-file-watcher
```

Cole o seguinte conteúdo (ajuste o `INSTALL_DIR` se necessário):

```bash
#!/bin/bash
#
# art-file-watcher    Inicia/para o ART File Watcher
#
# chkconfig: 2345 90 10
# description: ART File Watcher - Monitor de arquivos de retorno de convênios ART
#
### BEGIN INIT INFO
# Provides: art-file-watcher
# Required-Start: $network $remote_fs
# Required-Stop: $network $remote_fs
# Default-Start: 2 3 4 5
# Default-Stop: 0 1 6
# Short-Description: ART File Watcher
# Description: ART File Watcher - Monitor de arquivos de retorno de convênios ART
### END INIT INFO

# Configurações
INSTALL_DIR="/opt/art-file-watcher"
BINARY="${INSTALL_DIR}/art-w"
PIDFILE="/var/run/art-file-watcher.pid"
ENV_FILE="${INSTALL_DIR}/.env"

# Carregar variáveis de ambiente se o arquivo existir
if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
fi

# Funções
start() {
    if [ -f "$PIDFILE" ]; then
        PID=$(cat "$PIDFILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            echo "art-file-watcher já está rodando (PID: $PID)"
            return 1
        else
            rm -f "$PIDFILE"
        fi
    fi

    echo "Iniciando art-file-watcher..."
    cd "$INSTALL_DIR"
    nohup "$BINARY" start > /dev/null 2>&1 &
    PID=$!
    echo $PID > "$PIDFILE"

    # Aguardar um pouco para verificar se iniciou corretamente
    sleep 2
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "art-file-watcher iniciado (PID: $PID)"
        return 0
    else
        echo "Falha ao iniciar art-file-watcher"
        rm -f "$PIDFILE"
        return 1
    fi
}

stop() {
    if [ ! -f "$PIDFILE" ]; then
        echo "art-file-watcher não está rodando"
        return 1
    fi

    PID=$(cat "$PIDFILE")
    if ! ps -p "$PID" > /dev/null 2>&1; then
        echo "art-file-watcher não está rodando (PID file existe mas processo não)"
        rm -f "$PIDFILE"
        return 1
    fi

    echo "Parando art-file-watcher (PID: $PID)..."
    kill "$PID"

    # Aguardar até 30 segundos para o processo terminar
    for i in {1..30}; do
        if ! ps -p "$PID" > /dev/null 2>&1; then
            echo "art-file-watcher parado"
            rm -f "$PIDFILE"
            return 0
        fi
        sleep 1
    done

    # Se ainda estiver rodando, forçar kill
    echo "Forçando parada do art-file-watcher..."
    kill -9 "$PID" 2>/dev/null
    rm -f "$PIDFILE"
    echo "art-file-watcher forçado a parar"
    return 0
}

restart() {
    stop
    sleep 2
    start
}

status() {
    if [ -f "$PIDFILE" ]; then
        PID=$(cat "$PIDFILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            echo "art-file-watcher está rodando (PID: $PID)"
            return 0
        else
            echo "art-file-watcher não está rodando (PID file existe mas processo não)"
            return 1
        fi
    else
        echo "art-file-watcher não está rodando"
        return 1
    fi
}

# Caso principal
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    *)
        echo "Uso: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac

exit $?
```

Torne o script executável:

```bash
sudo chmod +x /etc/init.d/art-file-watcher
```

### 2. Configurar chkconfig e Habilitar o Serviço

```bash
# Adicionar o serviço ao chkconfig
sudo chkconfig --add art-file-watcher

# Habilitar o serviço para iniciar no boot (runlevels 2, 3, 4, 5)
sudo chkconfig art-file-watcher on

# Verificar configuração
sudo chkconfig --list art-file-watcher

# Iniciar o serviço
sudo service art-file-watcher start

# Verificar status
sudo service art-file-watcher status
```

### 3. Verificar Logs

```bash
# Logs da aplicação
tail -f /var/art/logs/combined.log

# Logs de erros apenas
tail -f /var/art/logs/error.log

# Verificar processo
ps aux | grep art-w
```

---

## 🔧 Comandos Úteis

### Gerenciamento do Serviço

```bash
# Iniciar
sudo service art-file-watcher start

# Parar
sudo service art-file-watcher stop

# Reiniciar
sudo service art-file-watcher restart

# Status
sudo service art-file-watcher status
```

### Verificação e Monitoramento

```bash
# Verificar se o processo está rodando
ps aux | grep art-w

# Verificar PID file
cat /var/run/art-file-watcher.pid

# Ver logs em tempo real
tail -f /var/art/logs/combined.log

# Verificar portas em uso (se aplicável)
netstat -tlnp | grep art-w
```

### Verificar Configuração

```bash
# Verificar variáveis de ambiente do arquivo .env
cd /opt/art-file-watcher
cat .env | grep -v "^#" | grep -v "^$"

# Testar configuração sem iniciar o serviço
cd /opt/art-file-watcher
./art-w --help
```

---

## 📦 Atualização

Se o auto-update estiver desabilitado ou você preferir atualizar manualmente:

### Download e Substituição Direta

```bash
# Parar o serviço
sudo service art-file-watcher stop

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
sudo service art-file-watcher start

# Verificar se iniciou corretamente
sudo service art-file-watcher status
```

---

## 🔍 Troubleshooting

### Serviço não inicia

```bash
# Verificar erros no script de serviço
sudo service art-file-watcher start
sudo service art-file-watcher status

# Verificar logs
tail -f /var/art/logs/error.log

# Verificar permissões
ls -la /opt/art-file-watcher/art-w
ls -la /opt/art-file-watcher/.env

# Testar manualmente
cd /opt/art-file-watcher
sudo ./art-w start
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

### Problemas específicos do CentOS 5.11

```bash
# Verificar versão do glibc (pode ser necessário em versões antigas)
ldd --version

# Verificar dependências do binário
ldd /opt/art-file-watcher/art-w

# Instalar dependências adicionais se necessário
sudo yum install -y glibc libstdc++

# Verificar compatibilidade do binário
file /opt/art-file-watcher/art-w
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

### Problemas com chkconfig

```bash
# Verificar se o serviço está no chkconfig
sudo chkconfig --list art-file-watcher

# Re-adicionar se necessário
sudo chkconfig --add art-file-watcher
sudo chkconfig art-file-watcher on

# Verificar todos os serviços
sudo chkconfig --list | grep art-file-watcher
```

---

## 📝 Checklist de Instalação

- [ ] Binário baixado e com permissões de execução
- [ ] Diretórios criados (`/var/art/input`, `/var/art/logs`, `/var/art/cache`)
- [ ] Arquivo `.env` configurado com todas as variáveis necessárias
- [ ] Teste manual bem-sucedido
- [ ] Script de serviço SysV init criado em `/etc/init.d/art-file-watcher`
- [ ] Serviço configurado no chkconfig para iniciar no boot
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

# Atualizar script de serviço para usar o usuário
sudo vi /etc/init.d/art-file-watcher
# Adicionar no início da função start():
# su - artwatcher -c "..."

# Recarregar e reiniciar
sudo service art-file-watcher restart
```

### Configurar SELinux (CentOS/RHEL)

```bash
# Se SELinux estiver habilitado
sudo getenforce

# Configurar para permissivo (temporário para teste)
sudo setenforce 0

# Ou configurar permanentemente
sudo vi /etc/selinux/config
# Alterar: SELINUX=permissive
```

### Configurar Firewall (iptables)

```bash
# Verificar regras do firewall
sudo iptables -L -n

# Se necessário, permitir tráfego de saída (geralmente já permitido)
# O serviço faz conexões de saída para a API
```

---

## 📚 Recursos Adicionais

- [Documentação do Auto-Update](./AUTO_UPDATE.md)
- [GitHub Releases](https://github.com/healthdevio/art-file-watcher/releases)
- [README Principal](../README.md)
- [Guia Linux Moderno (CentOS 7+)](./LINUX.md)

---

## 💡 Dicas

1. **Sempre faça backup** antes de atualizar
2. **Monitore os logs** após instalação ou atualização
3. **Teste manualmente** antes de configurar como serviço
4. **Use auto-update** para simplificar atualizações futuras
5. **Documente as configurações** específicas do seu ambiente
6. **Considere atualizar** para uma versão mais recente do CentOS para segurança e suporte

---

## ⚠️ Notas Importantes sobre CentOS 5.11

1. **Fim de Suporte**: O CentOS 5.11 não recebe mais atualizações de segurança desde março de 2017
2. **Compatibilidade de Binários**: Binários modernos podem requerer versões mais recentes de glibc/libstdc++
3. **Auto-Update**: O sistema de auto-update pode não funcionar corretamente devido a limitações do sistema
4. **Recomendação**: Considere migrar para CentOS 7+ ou RHEL 7+ quando possível

---

## 📞 Suporte

Para problemas específicos do CentOS 5.11, consulte:

- Logs da aplicação em `/var/art/logs/`
- Status do serviço: `sudo service art-file-watcher status`
- Processos: `ps aux | grep art-w`
