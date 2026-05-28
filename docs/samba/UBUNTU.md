# 📚 Tutorial de Conexão: Compartilhamento SMB Antigo (CentOS 5.11)

Este guia detalha como montar um diretório de rede em um servidor antigo (CentOS 5.11 / Samba 3.x), superando problemas de versão do protocolo (SMB1) e autenticação.

## 🛠️ Pré-requisitos e Instalação de Pacotes

Antes de montar o compartilhamento, você precisa garantir que as ferramentas necessárias estejam instaladas em sua distribuição Ubuntu.

| Ferramenta   | Descrição                                                                                         | Comando                                          |
| :----------- | :------------------------------------------------------------------------------------------------ | :----------------------------------------------- |
| `cifs-utils` | Contém o comando `mount.cifs`, essencial para montar compartilhamentos SMB/CIFS.                  | `sudo apt update && sudo apt install cifs-utils` |
| `smbclient`  | Usado para diagnóstico (listagem de compartilhamentos) e verificação de protocolo.                | `sudo apt install smbclient`                     |
| `nmap`       | Usado para verificar o status de portas TCP, crucial para diagnosticar problemas de firewall/VPN. | `sudo apt install nmap`                          |

## Diagnostico: Teste da Porta SMB

Antes de tentar a montagem, verifique se a porta 445 (SMB/CIFS) está aberta e acessível do seu PC ao servidor 192.168.10.42. Se esta porta estiver fechada, a montagem irá falhar, indicando um bloqueio por firewall ou problema na VPN.

1. Teste de Porta SMB (445). Verifique se a porta 445 (SMB/CIFS) está aberta e acessível.
   `nmap -p 445 192.168.10.42`
   Resultado Esperado: A saída deve indicar `445/tcp open`. Se for `filtered` ou `closed`, entre em contato com o administrador da rede para liberar a porta 445.
2. Teste de Listagem de Compartilhamentos
   `smbclient -L //192.168.10.42 -U ext.s4s.pedro%'&pnKH+7f' -m NT1`

### 🚨 Solução para Falha no Diagnóstico (Restrição de Segurança)

Se o `smbclient` falhar com o erro `lp_load_ex: Max protocol NT1 is less than min protocol SMB2_02`, significa que sua instalação local está bloqueando o uso do `SMB1` por segurança. Para forçar o diagnóstico, siga os passos abaixo:

1. Abra o arquivo de configuração do samba:
   `sudo nano /etc/samba/smb.conf`
2. Adicione a seguinte instrução em `[global]`:
   ```toml
   [global]
      client min protocol = NT1
   ```
3. Execute o teste novamente:
   `smbclient -L //192.168.10.42 -U ext.s4s.pedro%'&pnKH+7f'`

## 🛡️ Preparação do Arquivo de Credenciais

Devido à senha complexa e à necessidade de especificar o Workgroup, o método mais seguro e confiável é usar um arquivo de credenciais.

1. Crie o Arquivo `sudo nano /etc/cifs_credenciais_retorno`
2. Insira as Credenciais
   ```toml
   username=ext.s4s.pedro
   password=&pnKH+7f
   workgroup=WORKGROUP
   ```
3. Defina Permissões Seguras `sudo chmod 600 /etc/cifs_credenciais_retorno`

## 📂 Criação do Ponto de Montagem

Crie o diretório local onde os arquivos da rede serão acessados. Usar /mnt é o padrão para montagens temporárias.

`sudo mkdir -p /mnt/centos_hml_retorno`

## 🔗 Comando de Montagem Final Otimizado

O comando deve ser executado com opções específicas para superar as incompatibilidades do servidor (SMB1) e otimizar a velocidade e permissões locais.

| Parâmetro       | Valor                           | Justificativa                                                                      |
| :-------------- | :------------------------------ | :--------------------------------------------------------------------------------- |
| `credentials=`  | `/etc/cifs_credenciais_retorno` | Aponta para o arquivo de credenciais seguro.                                       |
| `vers=`         | `1.0`                           | Crucial: Força o protocolo SMB1, o único aceito pelo servidor 3.x.                 |
| `uid=` e `gid=` | `1000`                          | Mapeia os arquivos montados para o usuário local (UID 1000).                       |
| `nounix`        | (Sem valor)                     | Desabilita as extensões UNIX, melhorando a compatibilidade com servidores antigos. |

### Execução da Montagem

```bash
sudo mount -t cifs //192.168.10.42/RetornoParticao /mnt/centos_hml_retorno -o credentials=/etc/cifs_credenciais_retorno,vers=1.0,iocharset=utf8,nounix,uid=1000,gid=1000
```

## ✅ Verificação e Uso

Após a montagem, você pode listar o conteúdo do compartilhamento e trabalhar com os arquivos.

1. Listar Arquivos
   `ls -l /mnt/centos_hml_retorno`
2. Para desmontar
   `sudo umount /mnt/centos_hml_retorno`

---

## Implicações da Compatibilidade (Aviso)

> O Servidor Antigo: O servidor simplesmente não entende nem aceita versões de aplicações modernas.

Embora o vers=1.0 tenha resolvido o problema de acesso, é importante notar as implicações:

- Desempenho (Lentidão): O SMB1 é muito menos eficiente que as versões modernas, o que, combinado com a latência da VPN, resulta na lentidão que você notou no comando ls -l.

- Segurança: O SMB1 é amplamente conhecido por ter vulnerabilidades (como ataques man-in-the-middle) e é descontinuado pelo Windows e pela maioria das distribuições Linux modernas.
