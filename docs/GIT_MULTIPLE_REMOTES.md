# Trabalhando com Múltiplos Remotes (GitHub + GitLab)

Este guia explica como trabalhar com dois repositórios Git simultaneamente.

## Configuração Atual

- **origin** (GitHub): `https://github.com/healthdevio/art-file-watcher.git`
- **gitlab** (GitLab Mutua): `git@git.mutua.com.br:mutua-360/art-file-watcher.git`

## Configuração

### 1. Adicionar o remote do GitLab

```bash
# Remote já configurado:
git remote add gitlab git@git.mutua.com.br:mutua-360/art-file-watcher.git
```

**Nota**: O remote `gitlab` já está configurado. Se precisar reconfigurar, use:

```bash
git remote set-url gitlab git@git.mutua.com.br:mutua-360/art-file-watcher.git
```

### 2. Verificar os remotes configurados

```bash
git remote -v
```

Deve mostrar algo como:

```
gitlab  git@git.mutua.com.br:mutua-360/art-file-watcher.git (fetch)
gitlab  git@git.mutua.com.br:mutua-360/art-file-watcher.git (push)
origin  https://github.com/healthdevio/art-file-watcher.git (fetch)
origin  https://github.com/healthdevio/art-file-watcher.git (push)
```

### 3. Configurar branch padrão no GitLab

Para definir a branch `main` como branch padrão (principal) no GitLab:

#### Via Interface Web (Recomendado)

1. Acesse o repositório no GitLab: `https://git.mutua.com.br/mutua-360/art-file-watcher`
2. Vá em **Settings** → **Repository**
3. Role até a seção **Default branch**
4. Selecione `main` no dropdown
5. Clique em **Save changes**

#### Via GitLab API (Alternativa)

Se preferir usar a linha de comando, você pode usar a API do GitLab:

**Opção 1: Usando o script PowerShell**

```powershell
.\scripts\set-gitlab-default-branch.ps1 -Token "seu-token" -ProjectId "123" -Branch "main"
```

**Opção 2: Usando curl diretamente**

```bash
# Substitua GITLAB_TOKEN pelo seu token de acesso pessoal
# Substitua PROJECT_ID pelo ID do projeto (encontre em Settings → General)

curl --request PUT \
  --header "PRIVATE-TOKEN: GITLAB_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{"default_branch": "main"}' \
  "https://git.mutua.com.br/api/v4/projects/PROJECT_ID"
```

**Como obter o Project ID:**

1. Acesse o repositório no GitLab
2. Vá em **Settings** → **General**
3. O **Project ID** está no topo da página

**Como criar um Personal Access Token:**

1. No GitLab, clique no seu avatar (canto superior direito)
2. Vá em **Preferences** → **Access Tokens**
3. Crie um novo token com:
   - **Name**: `art-file-watcher-api`
   - **Scopes**: Marque `api` ou `write_repository`
   - **Expiration date**: (opcional)
4. Clique em **Create personal access token**
5. **Copie o token imediatamente** (ele não será mostrado novamente)

**Nota**: Você precisa criar um Personal Access Token no GitLab com permissão `api` ou `write_repository`.

## Uso Diário

### Push para GitHub (origin)

```bash
# Push da branch atual para GitHub
git push origin <nome-da-branch>

# Exemplo: push da branch develop
git push origin develop

# Ou simplesmente (se a branch já está rastreando origin)
git push origin
```

### Push para GitLab (gitlab)

```bash
# Push da branch atual para GitLab
git push gitlab <nome-da-branch>

# Exemplo: push da branch develop
git push gitlab develop
```

### Push para ambos simultaneamente

```bash
# Push para ambos os remotes de uma vez
git push origin <branch> && git push gitlab <branch>

# Ou criar um alias (veja seção de Aliases abaixo)
```

### Fetch de ambos os remotes

```bash
# Buscar atualizações de ambos os remotes
git fetch origin
git fetch gitlab

# Ou buscar de todos os remotes de uma vez
git fetch --all
```

## Configuração de Tracking Branches

### Configurar branch para rastrear GitHub

```bash
git branch --set-upstream-to=origin/<branch> <branch>
```

### Configurar branch para rastrear GitLab

```bash
git branch --set-upstream-to=gitlab/<branch> <branch>
```

## Aliases Úteis (Opcional)

Você pode adicionar aliases ao seu `.gitconfig` para facilitar:

```bash
# Push para ambos os remotes
git config --global alias.pushall '!git push origin && git push gitlab'

# Push para GitHub
git config --global alias.pushgh 'push origin'

# Push para GitLab
git config --global alias.pushgl 'push gitlab'

# Fetch de todos os remotes
git config --global alias.fetchall 'fetch --all'
```

Depois você pode usar:

```bash
git pushall          # Push para ambos
git pushgh develop   # Push para GitHub
git pushgl develop   # Push para GitLab
```

## Scripts Auxiliares

### Script para push seletivo

Crie um script `push-to.sh`:

```bash
#!/bin/bash
# Uso: ./push-to.sh [github|gitlab|both] [branch]

REMOTE=$1
BRANCH=${2:-$(git branch --show-current)}

if [ "$REMOTE" = "github" ]; then
    git push origin $BRANCH
elif [ "$REMOTE" = "gitlab" ]; then
    git push gitlab $BRANCH
elif [ "$REMOTE" = "both" ]; then
    git push origin $BRANCH && git push gitlab $BRANCH
else
    echo "Uso: $0 [github|gitlab|both] [branch]"
    exit 1
fi
```

## Gerenciamento de Remotes

### Remover um remote

```bash
# Remover o remote gitlab (se necessário)
git remote remove gitlab
```

### Alterar URL de um remote

```bash
# Alterar URL do remote gitlab
git remote set-url gitlab <nova-url>
```

### Ver informações detalhadas de um remote

```bash
git remote show origin
git remote show gitlab
```

## Dicas Importantes

1. **Sincronização**: Mantenha ambos os repositórios sincronizados fazendo push para ambos após commits importantes.

2. **Branches**: Certifique-se de que as branches existem em ambos os remotes antes de fazer push.

3. **CI/CD**: O GitLab CI/CD será acionado apenas quando você fizer push para o remote `gitlab`.

4. **Conflitos**: Se houver diferenças entre os remotes, você precisará fazer merge ou rebase antes de fazer push.

## Exemplo de Fluxo de Trabalho

```bash
# 1. Fazer alterações e commit
git add .
git commit -m "Minhas alterações"

# 2. Push para GitHub
git push origin develop

# 3. Push para GitLab (para acionar CI/CD)
git push gitlab develop

# Ou fazer ambos de uma vez
git push origin develop && git push gitlab develop
```
