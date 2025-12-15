# Usa uma base Ubuntu estável e leve
FROM ubuntu:22.04

# 1. Instala ferramentas essenciais (smbnetfs para montagem FUSE)
RUN apt update && \
    DEBIAN_FRONTEND=noninteractive apt install -y smbnetfs bash && \
    rm -rf /var/lib/apt/lists/*

# 2. Cria o diretório onde o smbnetfs será montado e a pasta simplificada
RUN mkdir -p /monitor/network_root \
    /monitor/share \
    /root/.smb

# ----------------------------------------------------
# 3. Copie sua aplicação file-watcher para o container
#    SUBSTITUA estas linhas pelos arquivos da sua aplicação
# COPY ./sua_app_aqui /monitor/app/
# ----------------------------------------------------

# 4. Copia e define permissão ao entrypoint.sh
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Define o ponto de entrada (montagem + execução)
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# 5. Comando Padrão: Ação que sua aplicação deve executar após a montagem.
#    SUBSTITUA PELA CHAMADA REAL DA SUA APLICAÇÃO FILE-WATCHER
CMD ["/bin/bash", "-c", "echo 'Monitoramento iniciado em /monitor/share.' && sleep infinity"]

