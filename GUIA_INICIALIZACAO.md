# Guia de Inicialização do R3Connect (Windows)

Pelo log que você enviou, o erro `Filename too long` acontece porque o Windows tem um limite padrão de caracteres para caminhos de arquivos, e o `pnpm` cria pastas muito profundas.

Siga estes passos para resolver o erro e rodar o projeto:

## 1. Corrigir o erro "Filename too long"

Abra o seu terminal (Git Bash ou PowerShell como Administrador) e execute o comando abaixo para permitir caminhos longos no Git:

```bash
git config --global core.longpaths true
```

Depois disso, apague a pasta `R3Connect` que foi criada incompleta e tente clonar novamente:

```bash
git clone https://github.com/Z0oom1/R3Connect.git
cd R3Connect
```

## 2. Instalar as Dependências

O projeto utiliza o **pnpm**. Se você não o tiver instalado, instale-o via npm:

```bash
npm install -g pnpm
```

Agora, instale as dependências do projeto:

```bash
pnpm install
```

## 3. Configurar as Chaves de API

Para que o Spotify e outras funções funcionem, você precisa configurar o arquivo de ambiente:

1.  Renomeie o arquivo `.env.example` para `.env`.
2.  Abra o `.env` e coloque o seu **Spotify Client ID** (conforme as instruções no arquivo `INSTRUCOES_ATUALIZACAO.md`).

## 4. Iniciar o Projeto

Para rodar o aplicativo e testar no seu iPhone:

1.  Inicie o servidor de desenvolvimento:
    ```bash
    pnpm run ios
    ```
2.  O terminal exibirá um **QR Code**.
3.  Abra o app **Expo Go** no seu iPhone e escaneie o código.

---

### Dicas Adicionais:
*   **Mesma Rede Wi-Fi:** Certifique-se de que seu computador e seu iPhone estejam conectados na mesma rede Wi-Fi.
*   **Firewall:** Se o Expo Go não conseguir conectar, verifique se o firewall do Windows não está bloqueando a porta `8081`.
