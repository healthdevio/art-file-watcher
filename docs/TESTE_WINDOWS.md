# Guia de Teste no Windows

## Pré-requisitos

1. O executável `art-w.exe` já foi gerado
2. Um diretório para monitorar arquivos
3. Um arquivo `.env` com as variáveis de ambiente necessárias

## Passo 1: Criar o arquivo .env

Crie um arquivo chamado `.env` na **mesma pasta** onde está o `art-w.exe` com o seguinte conteúdo:

```env
WATCH_DIR=./volumes/input
API_ENDPOINT=https://httpbin.org/post
API_KEY=sua-chave-teste-123
LOG_DIR=./volumes/logs
```

**Nota**:

- `WATCH_DIR`: Caminho relativo ou absoluto do diretório a ser monitorado
- `API_ENDPOINT`: URL da API para onde os hashes serão enviados (use httpbin.org/post para testes)
- `API_KEY`: Chave de autenticação da API
- `LOG_DIR`: Diretório onde os logs serão armazenados

### Exemplo de caminhos no Windows:

```env
# Caminho relativo (relativo à pasta do .exe)
WATCH_DIR=./volumes/input

# Caminho absoluto no Windows
WATCH_DIR=C:\Users\seu-usuario\teste\arquivos
```

## Passo 2: Criar o diretório de monitoramento (se necessário)

Se você configurou um diretório que não existe, crie-o antes de executar:

```powershell
# No PowerShell
New-Item -ItemType Directory -Path ".\volumes\input" -Force
New-Item -ItemType Directory -Path ".\volumes\logs" -Force
```

## Passo 3: Executar o aplicativo

### Opção A: Pelo Explorador de Arquivos

1. Navegue até a pasta onde está o `art-w.exe`
2. Verifique se o arquivo `.env` está na mesma pasta
3. Dê duplo clique no `art-w.exe`

### Opção B: Pelo PowerShell/CMD

1. Abra o PowerShell ou CMD
2. Navegue até a pasta do executável:
   ```powershell
   cd C:\Users\dell\projects\s4s\mutua\file-watcher
   ```
3. Execute o aplicativo:
   ```powershell
   .\art-w.exe
   ```

### Opção C: Pelo Terminal do VS Code

```powershell
.\art-w.exe
```

## Passo 4: Verificar se está funcionando

Quando o aplicativo iniciar, você verá mensagens como:

```text/plain
[INFO] O monitoramento será iniciado em: ./volumes/input
[INFO] Os hashes serão enviados para: https://httpbin.org/post
[INFO] Monitoramento iniciado com sucesso. Aguardando novos arquivos...
```

## Passo 5: Testar adicionando arquivos

1. **Mantenha o aplicativo rodando** (não feche a janela)
2. Adicione um arquivo no diretório monitorado (`WATCH_DIR`):

   ```powershell
   # Exemplo: copiar um arquivo para o diretório monitorado
   Copy-Item ".\algum-arquivo.txt" -Destination ".\volumes\input\"
   ```

   Ou simplesmente arraste um arquivo para a pasta usando o Explorador do Windows.

3. Você deverá ver no console:
   ```
   [HASH] Arquivo detectado: nome-do-arquivo.txt
   [HASH] Hash Gerado (SHA256): abc123def456...
   [SUCCESS] Hash enviado com sucesso para https://httpbin.org/post. Status: 200
   ```

## Passo 6: Parar o aplicativo

Para parar o aplicativo:

1. **Se estiver em uma janela do console**: Pressione `Ctrl+C`
2. **Se estiver rodando em background**: Use o Gerenciador de Tarefas do Windows

## Testes Adicionais

### Teste com múltiplos arquivos

Adicione vários arquivos simultaneamente para verificar se todos são processados:

```powershell
# Criar vários arquivos de teste
1..5 | ForEach-Object { "Conteúdo do arquivo $_" | Out-File ".\volumes\input\arquivo$_.txt" }
```

### Teste com arquivos grandes

Teste com arquivos maiores para verificar o processamento de streams:

```powershell
# Criar um arquivo de 10MB
$bytes = New-Object byte[] 10485760
(New-Object Random).NextBytes($bytes)
[System.IO.File]::WriteAllBytes(".\volumes\input\arquivo-grande.bin", $bytes)
```

### Verificar logs

Os logs estão disponíveis em `LOG_DIR` conforme configurado no `.env`.

## Solução de Problemas

### Erro: "Variáveis de ambiente ausentes"

- Verifique se o arquivo `.env` está na mesma pasta do executável
- Verifique se as variáveis estão escritas corretamente (sem espaços extras)
- Verifique se não há aspas desnecessárias nos valores

### Erro: "Arquivo não encontrado" no WATCH_DIR

- Verifique se o caminho está correto (use caminho absoluto se necessário)
- Verifique se o diretório existe
- No Windows, use `\` ou `/` nos caminhos (ambos funcionam)

### Erro de conexão com a API

- Verifique se a URL da API está correta
- Verifique sua conexão com a internet
- Para testes, use `https://httpbin.org/post` que sempre retorna sucesso

### O aplicativo não detecta arquivos

- Verifique se o aplicativo está rodando
- Verifique se o arquivo foi realmente adicionado ao diretório correto
- Verifique se não há problemas de permissão no diretório

## Notas Importantes

⚠️ **O arquivo `.env` deve estar na mesma pasta do executável**

⚠️ **Não feche a janela do console enquanto o aplicativo estiver rodando**

⚠️ **Use caminhos absolutos se tiver problemas com caminhos relativos**
