# Usa uma base Ubuntu estável e leve
FROM ubuntu:22.04

# 1. Instala ferramentas essenciais (cifs-utils para montagem SMB/CIFS)
RUN apt update && \
    DEBIAN_FRONTEND=noninteractive apt install -y cifs-utils bash && \
    rm -rf /var/lib/apt/lists/*

# 2. Cria diretório da aplicação e estrutura de diretórios necessária
RUN mkdir -p /opt/art-file-watcher \
    /monitor/share \
    /var/art/logs \
    /var/art/cache

# 3. Copia o binário art-w para o container
COPY bin/art-w /opt/art-file-watcher/art-w
RUN chmod +x /opt/art-file-watcher/art-w

# 4. Cria arquivo .env vazio (valores serão fornecidos via variáveis de ambiente no Portainer)
RUN touch /opt/art-file-watcher/.env

# 5. Copia e define permissão ao entrypoint.sh
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Define o diretório de trabalho
WORKDIR /opt/art-file-watcher

# Define o ponto de entrada (montagem + execução)
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
