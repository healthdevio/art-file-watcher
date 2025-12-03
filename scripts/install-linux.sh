#!/bin/bash
#
# Script de Instalação do art-file-watcher no Linux
# Compatível com Ubuntu, CentOS, RHEL e outras distribuições baseadas em systemd
#

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações padrão
DEFAULT_VERSION="latest"
DEFAULT_INSTALL_DIR="/opt/art-file-watcher"
DEFAULT_DATA_DIR="/var/art"
REPO="healthdevio/art-file-watcher"
REPO_URL="https://github.com/${REPO}/releases/download"
SERVICE_NAME="art-file-watcher"

# Funções auxiliares
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Verificar se está rodando como root ou com sudo
check_permissions() {
    if [ "$EUID" -ne 0 ]; then
        print_warning "Este script precisa de privilégios de root/sudo"
        print_info "Tente novamente com: sudo $0 $@"
        exit 1
    fi
}

# Detectar distribuição
detect_distro() {
    if [ -f /etc/os-release ]; then
        # Carrega apenas as variáveis que precisamos, sem sobrescrever VERSION
        DISTRO=$(grep "^ID=" /etc/os-release | cut -d= -f2 | tr -d '"')
        DISTRO_VERSION=$(grep "^VERSION_ID=" /etc/os-release | cut -d= -f2 | tr -d '"')
    else
        print_error "Não foi possível detectar a distribuição Linux"
        exit 1
    fi
    
    if [ -z "$DISTRO" ] || [ -z "$DISTRO_VERSION" ]; then
        print_error "Não foi possível detectar informações da distribuição"
        exit 1
    fi
    
    print_info "Distribuição detectada: $DISTRO $DISTRO_VERSION"
}

# Instalar dependências se necessário
install_dependencies() {
    print_step "Verificando dependências"
    
    case $DISTRO in
        ubuntu|debian)
            # Verifica se curl ou wget está instalado
            if ! command -v curl &> /dev/null && ! command -v wget &> /dev/null; then
                print_info "Instalando curl..."
                apt-get update -qq
                apt-get install -y curl
            fi
            ;;
        centos|rhel|fedora)
            # Verifica se curl ou wget está instalado
            if ! command -v curl &> /dev/null && ! command -v wget &> /dev/null; then
                print_info "Instalando curl..."
                if command -v dnf &> /dev/null; then
                    dnf install -y curl
                else
                    yum install -y curl
                fi
            fi
            
            # Instala libstdc++ se necessário
            print_info "Verificando libstdc++..."
            if ! ldconfig -p | grep -q libstdc++; then
                print_info "Instalando libstdc++..."
                if command -v dnf &> /dev/null; then
                    dnf install -y libstdc++
                else
                    yum install -y libstdc++
                fi
            fi
            ;;
        *)
            print_warning "Distribuição não reconhecida. Continuando..."
            ;;
    esac
    
    print_success "Dependências verificadas"
}

# Obter versão mais recente se necessário
get_latest_version() {
    local requested_version="$1"
    
    if [ "$requested_version" = "latest" ] || [ -z "$requested_version" ]; then
        print_info "Buscando versão mais recente..."
        local latest_version=$(curl -s "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
        
        if [ -z "$latest_version" ]; then
            print_error "Não foi possível obter a versão mais recente"
            exit 1
        fi
        
        VERSION="$latest_version"
        print_success "Versão mais recente encontrada: $VERSION"
    else
        VERSION="$requested_version"
    fi
    
    # Validar que a versão não está vazia
    if [ -z "$VERSION" ]; then
        print_error "Versão não pode estar vazia"
        exit 1
    fi
}

# Download do binário
download_binary() {
    print_step "Baixando binário (versão: $VERSION)"
    
    INSTALL_DIR="${2:-$DEFAULT_INSTALL_DIR}"
    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    
    DOWNLOAD_URL="${REPO_URL}/${VERSION}/art-w"
    print_info "URL: $DOWNLOAD_URL"
    
    # Tenta curl primeiro, depois wget
    if command -v curl &> /dev/null; then
        curl -L -f -o art-w "$DOWNLOAD_URL" || {
            print_error "Falha ao baixar binário com curl"
            exit 1
        }
    elif command -v wget &> /dev/null; then
        wget -O art-w "$DOWNLOAD_URL" || {
            print_error "Falha ao baixar binário com wget"
            exit 1
        }
    else
        print_error "Nenhum utilitário de download encontrado (curl ou wget)"
        exit 1
    fi
    
    chmod +x art-w
    
    # Verificar se o binário é válido
    if ! ./art-w --version &> /dev/null; then
        print_error "Binário baixado parece ser inválido"
        exit 1
    fi
    
    INSTALLED_VERSION=$(./art-w --version 2>/dev/null || echo "desconhecida")
    print_success "Binário baixado e instalado com sucesso (versão: $INSTALLED_VERSION)"
}

# Criar diretórios
create_directories() {
    print_step "Criando diretórios"
    
    DATA_DIR="${1:-$DEFAULT_DATA_DIR}"
    
    mkdir -p "${DATA_DIR}"/{input,logs,cache}
    
    # Tenta manter propriedade do usuário atual se não for root
    if [ -n "$SUDO_USER" ]; then
        chown -R "$SUDO_USER:$SUDO_USER" "$DATA_DIR"
    fi
    
    chmod -R 755 "$DATA_DIR"
    
    print_success "Diretórios criados em: $DATA_DIR"
}

# Criar arquivo de serviço systemd
create_systemd_service() {
    print_step "Configurando serviço systemd"
    
    INSTALL_DIR="${1:-$DEFAULT_INSTALL_DIR}"
    SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
    
    cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=ART File Watcher - Monitor de arquivos de retorno de convênios ART
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=${INSTALL_DIR}
ExecStart=${INSTALL_DIR}/art-w start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
EnvironmentFile=${INSTALL_DIR}/.env

# Limites de segurança
LimitNOFILE=65536
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target
EOF
    
    systemctl daemon-reload
    
    print_success "Serviço systemd configurado: $SERVICE_FILE"
    print_info "Para personalizar o usuário, edite: $SERVICE_FILE"
}

# Resumo da instalação
print_summary() {
    INSTALL_DIR="${1:-$DEFAULT_INSTALL_DIR}"
    DATA_DIR="${2:-$DEFAULT_DATA_DIR}"
    
    print_step "Instalação Concluída!"
    
    echo ""
    echo "📦 Informações da Instalação:"
    echo "   Diretório de instalação: $INSTALL_DIR"
    echo "   Diretório de dados: $DATA_DIR"
    echo "   Versão instalada: $VERSION"
    echo ""
    echo "📝 Próximos Passos:"
    echo "   1. Configure o arquivo .env em: ${INSTALL_DIR}/.env"
    echo "   2. Execute: cd ${INSTALL_DIR} && ./art-w config --help"
    echo "   3. Teste manualmente: cd ${INSTALL_DIR} && ./art-w start"
    echo "   4. Para habilitar como serviço:"
    echo "      sudo systemctl enable $SERVICE_NAME"
    echo "      sudo systemctl start $SERVICE_NAME"
    echo ""
    echo "📚 Documentação:"
    echo "   Ver docs/LINUX.md para mais informações"
    echo ""
}

# Mostrar ajuda
show_help() {
    cat <<EOF
Script de Instalação do art-file-watcher no Linux

Uso: $0 [OPÇÕES]

Opções:
  -v, --version VERSION    Versão para instalar (padrão: latest)
  -d, --dir DIR            Diretório de instalação (padrão: /opt/art-file-watcher)
  -D, --data-dir DIR       Diretório de dados (padrão: /var/art)
  -h, --help               Mostra esta ajuda

Exemplos:
  sudo $0                                    # Instala versão mais recente
  sudo $0 -v v1.0.3                         # Instala versão específica
  sudo $0 -d /opt/app -D /var/app-data      # Instala em diretórios customizados

EOF
}

# Parse argumentos
VERSION="$DEFAULT_VERSION"
INSTALL_DIR="$DEFAULT_INSTALL_DIR"
DATA_DIR="$DEFAULT_DATA_DIR"

while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--version)
            VERSION="$2"
            shift 2
            ;;
        -d|--dir)
            INSTALL_DIR="$2"
            shift 2
            ;;
        -D|--data-dir)
            DATA_DIR="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Opção desconhecida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Executar instalação
main() {
    print_step "Iniciando Instalação do art-file-watcher"
    
    check_permissions
    detect_distro
    install_dependencies
    get_latest_version "$VERSION"
    download_binary "$VERSION" "$INSTALL_DIR"
    create_directories "$DATA_DIR"
    create_systemd_service "$INSTALL_DIR"
    print_summary "$INSTALL_DIR" "$DATA_DIR"
    
    print_success "Instalação concluída com sucesso! 🎉"
}

# Executar
main

