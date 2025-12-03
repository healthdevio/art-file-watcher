#!/bin/bash
#
# Script de Atualização do art-file-watcher no Linux
# Atualiza o binário mantendo configurações e dados
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

# Obter versão mais recente se necessário
get_latest_version() {
    if [ "$1" = "latest" ] || [ -z "$1" ]; then
        print_info "Buscando versão mais recente..."
        VERSION=$(curl -s "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
        if [ -z "$VERSION" ]; then
            print_error "Não foi possível obter a versão mais recente"
            exit 1
        fi
        print_success "Versão mais recente encontrada: $VERSION"
    else
        VERSION=$1
    fi
}

# Verificar instalação atual
check_current_installation() {
    INSTALL_DIR="${1:-$DEFAULT_INSTALL_DIR}"
    
    if [ ! -f "${INSTALL_DIR}/art-w" ]; then
        print_error "Binário não encontrado em: ${INSTALL_DIR}/art-w"
        print_info "Execute o script de instalação primeiro: scripts/install-linux.sh"
        exit 1
    fi
    
    if [ -f "${INSTALL_DIR}/art-w" ]; then
        CURRENT_VERSION=$(cd "$INSTALL_DIR" && ./art-w --version 2>/dev/null | head -n1 || echo "desconhecida")
        print_info "Versão atual instalada: $CURRENT_VERSION"
    fi
    
    print_success "Instalação encontrada em: $INSTALL_DIR"
}

# Verificar se o serviço está rodando
check_service_status() {
    if systemctl is-active --quiet "$SERVICE_NAME" 2>/dev/null; then
        SERVICE_RUNNING=true
        print_info "Serviço $SERVICE_NAME está rodando"
    else
        SERVICE_RUNNING=false
        print_info "Serviço $SERVICE_NAME não está rodando"
    fi
}

# Fazer backup
create_backup() {
    INSTALL_DIR="${1:-$DEFAULT_INSTALL_DIR}"
    
    BACKUP_FILE="art-w.backup.$(date +%Y%m%d_%H%M%S)"
    
    if [ -f "${INSTALL_DIR}/art-w" ]; then
        cp "${INSTALL_DIR}/art-w" "${INSTALL_DIR}/${BACKUP_FILE}"
        print_success "Backup criado: ${BACKUP_FILE}"
        BACKUP_PATH="${INSTALL_DIR}/${BACKUP_FILE}"
    else
        print_error "Não foi possível criar backup - binário não encontrado"
        exit 1
    fi
}

# Download do novo binário
download_new_binary() {
    INSTALL_DIR="${1:-$DEFAULT_INSTALL_DIR}"
    
    DOWNLOAD_URL="${REPO_URL}/${VERSION}/art-w"
    print_info "Baixando de: $DOWNLOAD_URL"
    
    cd "$INSTALL_DIR"
    
    # Tenta curl primeiro, depois wget
    if command -v curl &> /dev/null; then
        curl -L -f -o art-w.new "$DOWNLOAD_URL" || {
            print_error "Falha ao baixar binário com curl"
            return 1
        }
    elif command -v wget &> /dev/null; then
        wget -O art-w.new "$DOWNLOAD_URL" || {
            print_error "Falha ao baixar binário com wget"
            return 1
        }
    else
        print_error "Nenhum utilitário de download encontrado (curl ou wget)"
        return 1
    fi
    
    chmod +x art-w.new
    
    # Verificar se o binário é válido
    if ! ./art-w.new --version &> /dev/null; then
        print_error "Binário baixado parece ser inválido"
        rm -f art-w.new
        return 1
    fi
    
    NEW_VERSION=$(./art-w.new --version 2>/dev/null | head -n1 || echo "desconhecida")
    print_success "Novo binário baixado com sucesso (versão: $NEW_VERSION)"
}

# Substituir binário
replace_binary() {
    INSTALL_DIR="${1:-$DEFAULT_INSTALL_DIR}"
    
    cd "$INSTALL_DIR"
    
    # Remove o binário antigo e move o novo
    if [ -f "art-w.new" ]; then
        mv art-w art-w.old 2>/dev/null || true
        mv art-w.new art-w
        print_success "Binário substituído com sucesso"
        
        # Remove o .old se tudo deu certo
        rm -f art-w.old
    else
        print_error "Binário novo não encontrado"
        return 1
    fi
}

# Restaurar backup em caso de erro
restore_backup() {
    INSTALL_DIR="${1:-$DEFAULT_INSTALL_DIR}"
    BACKUP="${2:-}"
    
    if [ -n "$BACKUP" ] && [ -f "$BACKUP" ]; then
        print_warning "Restaurando backup..."
        cd "$INSTALL_DIR"
        rm -f art-w art-w.new art-w.old
        cp "$BACKUP" art-w
        chmod +x art-w
        print_info "Backup restaurado"
    fi
}

# Reiniciar serviço
restart_service() {
    if [ "$SERVICE_RUNNING" = true ]; then
        print_info "Reiniciando serviço $SERVICE_NAME..."
        
        if systemctl restart "$SERVICE_NAME"; then
            sleep 2
            
            if systemctl is-active --quiet "$SERVICE_NAME"; then
                print_success "Serviço reiniciado com sucesso"
                systemctl status "$SERVICE_NAME" --no-pager -l | head -n 10
            else
                print_error "Serviço não iniciou corretamente após atualização"
                return 1
            fi
        else
            print_error "Falha ao reiniciar serviço"
            return 1
        fi
    else
        print_info "Serviço não estava rodando - não será reiniciado"
    fi
}

# Mostrar ajuda
show_help() {
    cat <<EOF
Script de Atualização do art-file-watcher no Linux

Uso: $0 [OPÇÕES]

Opções:
  -v, --version VERSION    Versão para instalar (padrão: latest)
  -d, --dir DIR            Diretório de instalação (padrão: /opt/art-file-watcher)
  -h, --help               Mostra esta ajuda

Exemplos:
  sudo $0                  # Atualiza para versão mais recente
  sudo $0 -v v1.0.4       # Atualiza para versão específica
  sudo $0 -d /opt/app     # Atualiza instalação em diretório customizado

EOF
}

# Parse argumentos
VERSION="$DEFAULT_VERSION"
INSTALL_DIR="$DEFAULT_INSTALL_DIR"

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

# Executar atualização
main() {
    print_step "Iniciando Atualização do art-file-watcher"
    
    check_permissions
    check_current_installation "$INSTALL_DIR"
    check_service_status
    get_latest_version "$VERSION"
    
    # Parar serviço se estiver rodando
    if [ "$SERVICE_RUNNING" = true ]; then
        print_info "Parando serviço para atualização..."
        systemctl stop "$SERVICE_NAME" || true
    fi
    
    # Criar backup
    create_backup "$INSTALL_DIR"
    BACKUP_PATH="${INSTALL_DIR}/art-w.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Tentar atualização
    if download_new_binary "$INSTALL_DIR" && replace_binary "$INSTALL_DIR"; then
        print_success "Atualização concluída com sucesso!"
        
        # Reiniciar serviço
        if ! restart_service; then
            print_warning "Falha ao reiniciar serviço - restaurando backup..."
            restore_backup "$INSTALL_DIR" "$BACKUP_PATH"
            
            if [ "$SERVICE_RUNNING" = true ]; then
                systemctl start "$SERVICE_NAME" || true
            fi
            
            print_error "Atualização revertida devido a erro no serviço"
            exit 1
        fi
        
        print_info "Versão anterior: $CURRENT_VERSION"
        print_info "Versão atual: $VERSION"
        
    else
        print_error "Falha durante a atualização - restaurando backup..."
        restore_backup "$INSTALL_DIR" "$BACKUP_PATH"
        
        if [ "$SERVICE_RUNNING" = true ]; then
            systemctl start "$SERVICE_NAME" || true
        fi
        
        exit 1
    fi
    
    print_success "Atualização concluída com sucesso! 🎉"
    print_info "Backup disponível em: $BACKUP_PATH"
}

# Executar
main

