> **Nota do Desenvolvedor:** O documento a seguir foi gerado para o proprietário do projeto R3Connect e detalha as alterações realizadas para substituir as funcionalidades simuladas por integrações reais, além de fornecer as instruções necessárias para a configuração e teste.

# Atualização do Projeto R3Connect: Integrações Reais

Olá! Conforme solicitado, atualizei o projeto R3Connect para substituir as simulações de GPS e Spotify por implementações que funcionam com os serviços reais. A conexão com a moto via Bluetooth (BLE) também foi atualizada para um modelo que permite a busca e conexão com dispositivos reais, embora a lógica de telemetria ainda precise ser conectada aos dados recebidos do hardware específico.

Abaixo, detalho as mudanças e os passos necessários para você configurar e testar o aplicativo.

## Resumo das Alterações

| Funcionalidade | Status Anterior | Novo Status e Detalhes |
| :--- | :--- | :--- |
| **GPS / Localização** | **Real** | A implementação com `expo-location` foi mantida e integrada ao controle de início/fim de viagem. O app agora utiliza o GPS do dispositivo para rastrear o percurso em tempo real. |
| **Integração com Spotify** | **Simulada** | **Substituída por integração real.** Utilizando `expo-auth-session`, o app agora realiza a autenticação OAuth 2.0 com a conta do Spotify. Após a conexão, ele busca e exibe a música em reprodução, permitindo controlar o play/pause e pular de faixa através da API Web do Spotify. |
| **Conexão com a Moto (Bluetooth)** | **Simulada** | **Substituída por busca real de dispositivos.** A simulação foi trocada por uma implementação que utiliza `react-native-ble-plx` para buscar e se conectar a dispositivos Bluetooth Low Energy (BLE) reais. A tela de telemetria, no entanto, ainda exibe dados simulados, pois a decodificação dos dados da moto (protocolo OBD/CCU) precisa ser implementada. |

## Instruções para Configuração e Teste

Para que a integração com o Spotify funcione, você precisa criar um aplicativo no painel de desenvolvedor do Spotify e configurar as suas credenciais no projeto.

### 1. Obter as Credenciais do Spotify

1.  **Acesse o Dashboard de Desenvolvedor do Spotify:** Faça login em [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard).
2.  **Crie um Aplicativo:** Clique em "Create App". Dê um nome e uma descrição (ex: "R3Connect App").
3.  **Copie o Client ID:** Após criar o app, você verá o **Client ID**. Copie este valor.
4.  **Configure o Redirect URI:**
    *   Vá em "Edit Settings" no seu aplicativo do Spotify.
    *   No campo "Redirect URIs", adicione o seguinte valor: `exp://<seu-ip-local>:8081` (você pode obter o IP local ao iniciar o Expo).
    *   Adicione também o URI para o Expo Go: `exp://127.0.0.1:8081`
    *   **Importante:** O `scheme` do seu app foi definido como `manus-r3connect`. O Redirect URI correto para a autenticação será `exp://<seu-ip-local>:8081`.

### 2. Configurar as Variáveis de Ambiente

1.  **Crie o arquivo `.env`:** Na raiz do projeto `R3Connect`, renomeie o arquivo `.env.example` para `.env`.
2.  **Adicione seu Client ID:** Abra o arquivo `.env` e cole o Client ID que você copiou do painel do Spotify:

    ```
    EXPO_PUBLIC_SPOTIFY_CLIENT_ID=seu_client_id_aqui
    ```

### 3. Testar o Aplicativo

Após configurar as credenciais, você pode rodar o aplicativo no seu iPhone usando o Expo Go, como explicado anteriormente:

1.  **Instale as dependências:**
    ```bash
    pnpm install
    ```
2.  **Inicie o servidor de desenvolvimento:**
    ```bash
    pnpm run ios
    ```
3.  **Escaneie o QR Code:** Use o app Expo Go no seu iPhone para escanear o QR Code que aparecerá no terminal.

Ao abrir o app, vá para a tela do Spotify e toque para conectar. Você será redirecionado para a página de login do Spotify para autorizar o aplicativo. Após a autorização, a música que estiver tocando no seu Spotify aparecerá no R3Connect.

## Próximos Passos Sugeridos

*   **Telemetria da Moto:** Para que os dados de RPM, temperatura, etc., sejam reais, é necessário implementar a lógica para ler e interpretar os dados recebidos do dispositivo Bluetooth da moto. Isso envolve conhecer o protocolo de comunicação (serviços e características BLE) do seu hardware específico (CCU da Yamaha).
*   **Refresh Token do Spotify:** A implementação atual usa o `access_token`, que expira após um tempo. Para uma experiência mais robusta, o fluxo de "Refresh Token" deve ser implementado para renovar a sessão automaticamente.

O código-fonte atualizado com todas essas modificações está pronto. Se tiver qualquer dúvida durante a configuração, estou à disposição para ajudar!
