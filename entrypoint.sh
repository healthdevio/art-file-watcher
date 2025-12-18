#!/bin/bash
# Script para montar o compartilhamento SMB usando mount.cifs (compatível com CentOS 5.11 / SMB1)

# Variáveis de ambiente com valores padrão (homologação)
SAMBA_HOST="${SAMBA_HOST:-10.128.0.6}"
SHARE_NAME="${SHARE_NAME:-RetornoParticao}"
SAMBA_USERNAME="${SAMBA_USERNAME:-ext.s4s.pedro}"
SAMBA_PASSWORD="${SAMBA_PASSWORD:-&pnKH+7f}"
SAMBA_WORKGROUP="${SAMBA_WORKGROUP:-WORKGROUP}"

MOUNT_POINT="/monitor/share"
CREDENTIALS_FILE="/tmp/cifs_credentials"

echo "-> Tentando montar o compartilhamento SMB de: //${SAMBA_HOST}/${SHARE_NAME} usando mount.cifs..."

# 1. Cria o arquivo de credenciais
echo "username=${SAMBA_USERNAME}" > "${CREDENTIALS_FILE}"
echo "password=${SAMBA_PASSWORD}" >> "${CREDENTIALS_FILE}"
echo "workgroup=${SAMBA_WORKGROUP}" >> "${CREDENTIALS_FILE}"
chmod 600 "${CREDENTIALS_FILE}"

# 2. Monta o compartilhamento SMB/CIFS
# vers=1.0: Força SMB1 (compatível com CentOS 5.11 / Samba 3.x)
# nounix: Desabilita extensões UNIX para melhor compatibilidade
# iocharset=utf8: Suporte a caracteres UTF-8
# uid=0, gid=0: Mapeia arquivos para root
mount -t cifs "//${SAMBA_HOST}/${SHARE_NAME}" "${MOUNT_POINT}" \
    -o "credentials=${CREDENTIALS_FILE},vers=1.0,iocharset=utf8,nounix,uid=0,gid=0"

# 3. Verifica se a montagem foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "-> Montagem bem-sucedida em ${MOUNT_POINT}"
    echo "-> Compartilhamento SMB disponível para a aplicação"
    
    # Remove o arquivo de credenciais por segurança (opcional, pois está em /tmp)
    # O arquivo será removido automaticamente quando o container for encerrado
    
    # Executa o art-w start
    echo "-> Iniciando art-file-watcher..."
    cd /opt/art-file-watcher
    exec ./art-w start
else
    echo "ERRO FATAL: Falha ao montar o compartilhamento SMB via mount.cifs."
    echo "Verifique as credenciais e a conectividade de rede com ${SAMBA_HOST}"
    exit 1
fi

