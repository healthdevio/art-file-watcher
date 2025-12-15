#!/bin/bash
# Script para montar o compartilhamento SMB usando smbnetfs (FUSE)

SAMBA_HOST="${SAMBA_HOST}"
SHARE_NAME="${SHARE_NAME}"
NETWORK_ROOT="/monitor/network_root" # Ponto de montagem principal do smbnetfs
TARGET_SHARE_PATH="${NETWORK_ROOT}/${SAMBA_HOST}/${SHARE_NAME}" # Caminho complexo real
FINAL_LINK_PATH="/monitor/share" # Caminho simplificado para a aplicação

echo "-> Tentando montar o compartilhamento SMB de: //${SAMBA_HOST}/${SHARE_NAME} usando smbnetfs (FUSE)..."

# 1. Cria o arquivo de credenciais (Guest Access)
# smbnetfs precisa de uma entrada para o host/share mesmo em modo Guest
echo "//${SAMBA_HOST}/${SHARE_NAME} -" > /root/.smb/smbnetfs.auth

# 2. Monta o smbnetfs no ponto de raiz de rede
# O "-o allow_other" permite que usuários dentro do container acessem a montagem FUSE
smbnetfs ${NETWORK_ROOT} -o allow_other

# 3. Verifica se a montagem foi bem-sucedida (código de saída 0)
if [ $? -eq 0 ]; then
    rm -rf "${FINAL_LINK_PATH}"
    echo "-> Montagem FUSE bem-sucedida em ${NETWORK_ROOT}."
    
    # Verifica se o caminho final existe (demora um pouco para o smbnetfs criar o link virtual)
    for i in {1..5}; do
        if [ -d "${TARGET_SHARE_PATH}" ]; then
            break
        fi
        echo "Aguardando o smbnetfs criar o caminho ${TARGET_SHARE_PATH}..."
        sleep 1
    done

    # Cria um link simbólico para simplificar o acesso
    ln -sf "${TARGET_SHARE_PATH}" "${FINAL_LINK_PATH}"
    
    echo "-> Caminho simplificado criado: ${FINAL_LINK_PATH} -> ${TARGET_SHARE_PATH}"
    echo "-> Aplicação deve monitorar: ${FINAL_LINK_PATH}"
    
    # Executa o comando CMD definido no Dockerfile (sua aplicação file-watcher)
    exec "$@"
else
    echo "ERRO FATAL: Falha ao montar o compartilhamento SMB via smbnetfs. Verifique logs ou configuração de rede."
    exit 1
fi