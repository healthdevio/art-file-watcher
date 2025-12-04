# Guia de Teste dos Scripts do CentOS 5.11

Este guia mostra como testar os scripts de instalação e atualização do CentOS 5.11 usando Docker ou WSL.

> ⚠️ **IMPORTANTE**: A imagem oficial `centos:5.11` **NÃO FUNCIONA** no Docker moderno devido a incompatibilidades de arquitetura/kernel que causam segfaults (exit code 139). Use as alternativas abaixo.

## 🐳 Opção 1: Testando com Docker (Recomendado)

### Problema com CentOS 5.11 no Docker

A imagem `centos:5.11` está disponível no Docker Hub, mas **não funciona** em Docker moderno:

- Causa segfaults (exit code 139) mesmo em comandos simples
- Incompatibilidade de arquitetura/kernel
- Problemas com bibliotecas antigas

### Solução: Usar CentOS 6.10

O **CentOS 6.10** é a melhor alternativa para testes, pois:

- ✅ Funciona perfeitamente no Docker moderno
- ✅ Ainda usa SysV init (como CentOS 5.11)
- ✅ Simula bem o comportamento do CentOS 5.11
- ✅ Compatível com os scripts criados

### Pré-requisitos

- Docker instalado e rodando
- Acesso à internet para baixar imagens e releases

### Passo a Passo

#### 1. Verificar Docker

```bash
docker --version
docker ps
```

#### 2. Baixar Imagem do CentOS 6.10

```bash
docker pull centos:6.10
```

#### 3. Construir a Imagem de Teste

O Dockerfile já está configurado para usar CentOS 6.10:

```bash
docker build -f Dockerfile.centos5-test -t centos5-test .
```

#### 4. Executar Container Interativo

```bash
docker run -it --rm \
    -v "$(pwd)/scripts:/scripts:ro" \
    --name centos5-test-container \
    centos5-test /bin/bash
```

#### 5. Dentro do Container - Testar Scripts

```bash
# Verificar versão (será CentOS 6.10, mas compatível)
cat /etc/redhat-release

# Configurar repositórios se necessário
/scripts/setup-centos5-container.sh

# Testar script de instalação
/scripts/install-centos5.sh --help

# Ou baixar e testar diretamente
curl -L -o install.sh https://raw.githubusercontent.com/healthdevio/art-file-watcher/main/scripts/install-centos5.sh
chmod +x install.sh
./install.sh --help
```

#### 6. Limpar Container após Teste

```bash
# Sair do container
exit

# Container será removido automaticamente com --rm
# Ou manualmente:
docker rm centos5-test-container
```

### Script de Teste Automatizado

Use o script automatizado:

```bash
chmod +x scripts/test-centos5-docker.sh
./scripts/test-centos5-docker.sh test
# ou modo interativo:
./scripts/test-centos5-docker.sh interactive
```

---

## 🪟 Opção 2: Testando com WSL (Windows)

WSL pode ser usado, mas **não pode rodar CentOS 5.11 nativamente**. Você pode testar a lógica dos scripts em uma distribuição Linux moderna instalada no WSL.

### Limitações do WSL

- WSL não suporta CentOS 5.11 diretamente
- WSL2 não suporta systemd por padrão (pode ser habilitado)
- Melhor para testar lógica básica dos scripts

### Passo a Passo no WSL

#### 1. Instalar WSL (se ainda não tiver)

```powershell
# No PowerShell como Administrador
wsl --install
```

Ou instalar uma distribuição específica:

```powershell
wsl --install -d Ubuntu
```

#### 2. Verificar WSL

```bash
wsl --list --verbose
```

#### 3. Acessar WSL

```bash
wsl
# ou
ubuntu  # se instalou Ubuntu
```

#### 4. Usar Docker dentro do WSL

A melhor opção é usar Docker dentro do WSL para testar CentOS:

```bash
# Instalar Docker no WSL
sudo apt update
sudo apt install -y docker.io
sudo service docker start

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Reiniciar WSL ou fazer logout/login

# Agora seguir os passos da Opção 1 (Docker)
```

---

## 💻 Opção 3: Testar em Ambiente Real

Para testes mais fiéis ao CentOS 5.11 real, considere:

### Máquina Virtual

1. **VirtualBox ou VMware**
   - Baixar ISO do CentOS 5.11
   - Criar VM e instalar
   - Testar scripts diretamente

2. **Vagrant** (se disponível para CentOS 5.11)

### Servidor Físico

Se você tiver acesso a um servidor com CentOS 5.11, pode testar diretamente:

```bash
# No servidor CentOS 5.11
curl -L -o install-centos5.sh https://raw.githubusercontent.com/healthdevio/art-file-watcher/main/scripts/install-centos5.sh
chmod +x install-centos5.sh
sudo ./install-centos5.sh --help
```

---

## 📋 Checklist de Teste

Use este checklist para validar os scripts:

- [ ] Script baixa corretamente do GitHub
- [ ] Script detecta CentOS (5.11 ou 6.10)
- [ ] Script instala dependências necessárias
- [ ] Script baixa binário corretamente
- [ ] Script valida binário (tamanho, tipo, permissões)
- [ ] Script cria diretórios necessários
- [ ] Script cria serviço SysV init corretamente
- [ ] Script configura chkconfig
- [ ] Script de atualização cria backup
- [ ] Script de atualização restaura backup em caso de erro
- [ ] Serviço inicia e para corretamente

---

## 🔍 Comandos Úteis para Debug

### No Docker:

```bash
# Ver logs do container
docker logs centos5-test-container

# Executar comando no container rodando
docker exec -it centos5-test-container /bin/bash

# Copiar arquivos do host para container
docker cp arquivo.txt centos5-test-container:/tmp/

# Copiar arquivos do container para host
docker cp centos5-test-container:/tmp/arquivo.txt ./
```

### Verificar Scripts:

```bash
# Verificar sintaxe bash
bash -n scripts/install-centos5.sh

# Verificar com shellcheck (se instalado)
shellcheck scripts/install-centos5.sh

# Executar em modo debug
bash -x scripts/install-centos5.sh --help
```

---

## 💡 Dicas

1. **Use Docker com CentOS 6.10**: É a melhor alternativa para testes em ambiente isolado
2. **Teste incrementalmente**: Teste cada função do script separadamente
3. **Use modo dry-run**: Crie versões de teste que não modificam o sistema
4. **Documente problemas**: Anote qualquer problema encontrado durante os testes
5. **Teste casos de erro**: Teste também situações de erro (sem internet, permissões, etc.)
6. **Para testes reais**: Use VM ou servidor físico com CentOS 5.11 real

---

## 🐛 Troubleshooting

### Docker não inicia

```bash
# Verificar status do Docker
sudo systemctl status docker  # Linux
# ou
docker info  # Verifica se está rodando
```

### Container não acessa internet

```bash
# Verificar configuração de rede do Docker
docker network ls
docker network inspect bridge
```

### Scripts não executam no container

```bash
# Verificar permissões
ls -la scripts/install-centos5.sh

# Verificar line endings (pode ser problema no Windows)
file scripts/install-centos5.sh
# Deve mostrar: ASCII text, not CRLF

# Converter se necessário
dos2unix scripts/install-centos5.sh
```

### Binário não baixa

```bash
# Testar conectividade
curl -I https://github.com

# Testar URL específica
curl -I https://github.com/healthdevio/art-file-watcher/releases/latest

# Verificar proxy se necessário
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

### Erro de segfault com centos:5.11

Este é o problema conhecido. **Solução**: Use CentOS 6.10 como alternativa, conforme descrito acima.

---

## 📚 Recursos Adicionais

- [Documentação Docker](https://docs.docker.com/)
- [WSL Documentation](https://docs.microsoft.com/windows/wsl/)
- [CentOS 5.11 Documentation](https://wiki.centos.org/Manuals/ReleaseNotes/CentOS5.11)
- [CentOS 6.10 Documentation](https://wiki.centos.org/Manuals/ReleaseNotes/CentOS6.10)
- [Guia de Instalação CentOS 5](./CENTOS5.md)

---

## ⚠️ Notas Importantes

1. **CentOS 5.11 no Docker**: A imagem oficial `centos:5.11` não funciona no Docker moderno. Use CentOS 6.10 para testes.
2. **Fim de Suporte**: O CentOS 5.11 não recebe mais atualizações de segurança desde março de 2017
3. **Para testes reais**: Use VM ou servidor físico com CentOS 5.11
4. **Recomendação**: Considere migrar para CentOS 7+ ou RHEL 7+ quando possível
