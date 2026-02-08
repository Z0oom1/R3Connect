# Arquitetura Técnica - R3 Connect Plus

**Versão**: 1.0  
**Data**: Fevereiro de 2026  
**Autor**: Manus AI  
**Status**: Planejamento

---

## Sumário Executivo

O **R3 Connect Plus** é um aplicativo iOS/Android nativo desenvolvido em React Native com Expo, projetado para motociclistas da Yamaha R3 2026. O aplicativo oferece navegação GPS integrada, controle remoto de Spotify, telemetria da moto e multimídia em um único painel otimizado para uso com uma mão. A arquitetura foi concebida em três fases: (1) MVP local com funcionalidades de navegação e multimídia, (2) framework Bluetooth genérico preparado para integração futura, e (3) integração com a Unidade de Controle de Comunicação (CCU) da Yamaha quando o protocolo for conhecido.

---

## 1. Visão Geral da Arquitetura

### 1.1 Componentes Principais

A arquitetura do R3 Connect Plus é organizada em camadas bem definidas, permitindo desenvolvimento paralelo e fácil manutenção:

| Camada | Componentes | Responsabilidade |
|--------|------------|------------------|
| **Apresentação (UI)** | Screens, Components, Navigation | Interface do usuário, roteamento |
| **Lógica de Negócio** | Hooks, Context, Services | Orquestração de dados e estado |
| **Integração** | APIs, Bluetooth, GPS, Spotify | Comunicação com serviços externos |
| **Armazenamento** | AsyncStorage, SQLite | Persistência de dados locais |
| **Utilitários** | Helpers, Constants, Types | Funções reutilizáveis e tipos |

### 1.2 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface (Screens)                  │
│  [Home] [Maps] [Spotify] [Telemetry] [Settings] [History]  │
└────────────────────┬────────────────────────────────────────┘
                     │ useHooks()
┌────────────────────▼────────────────────────────────────────┐
│              Business Logic Layer (Context)                  │
│  [LocationContext] [SpotifyContext] [BluetoothContext]      │
└────────────────────┬────────────────────────────────────────┘
                     │ Services
┌────────────────────▼────────────────────────────────────────┐
│           Integration Layer (External Services)              │
│  [Mapbox] [Spotify SDK] [BLE] [Geolocation] [Storage]      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│        Native Platforms (iOS / Android)                      │
│  [CoreLocation] [Bluetooth] [MediaPlayer] [FileSystem]      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológico

### 2.1 Dependências Principais

| Tecnologia | Versão | Propósito | Justificativa |
|-----------|--------|----------|---------------|
| **React Native** | 0.81.5 | Framework base | Desenvolvimento iOS/Android unificado |
| **Expo** | 54.0 | Gerenciador de build | Simplifica configuração nativa, suporta Bare Workflow |
| **TypeScript** | 5.9 | Linguagem tipada | Type safety, melhor DX |
| **NativeWind** | 4.2 | Styling (Tailwind) | Consistência visual, rápido desenvolvimento |
| **Mapbox GL** | @rnmapbox/maps | Navegação e mapas | Melhor para motos, customização superior |
| **Spotify Remote** | @vanlesson/react-native-spotify-remote | Controle de música | SDK oficial, suporte iOS/Android |
| **React Native BLE PLX** | react-native-ble-plx | Bluetooth Low Energy | Mais robusto, melhor documentação |
| **Expo Location** | expo-location | Geolocalização | Integrado, permissões simplificadas |
| **React Query** | @tanstack/react-query | Cache de dados | Sincronização de estado remoto |
| **Drizzle ORM** | drizzle-orm | Banco de dados | Type-safe queries, migrations |

### 2.2 Dependências de Desenvolvimento

```json
{
  "devDependencies": {
    "typescript": "~5.9.3",
    "eslint": "^9.39.2",
    "prettier": "^3.7.4",
    "vitest": "^2.1.9",
    "tailwindcss": "^3.4.17"
  }
}
```

---

## 3. Estrutura de Diretórios

```
r3-connect-plus/
├── app/                          # Expo Router (roteamento)
│   ├── _layout.tsx              # Layout raiz com providers
│   └── (tabs)/
│       ├── _layout.tsx          # Configuração de abas
│       ├── index.tsx            # Home (Dashboard)
│       ├── maps.tsx             # Navegação
│       ├── spotify.tsx          # Controle de música
│       ├── telemetry.tsx        # Dados da moto
│       ├── media.tsx            # Multimídia (Rádio, Podcasts)
│       ├── history.tsx          # Histórico de viagens
│       └── settings.tsx         # Configurações
├── components/
│   ├── screen-container.tsx     # SafeArea wrapper
│   ├── themed-view.tsx          # View com tema
│   ├── ui/
│   │   ├── icon-symbol.tsx      # Mapeamento de ícones
│   │   ├── buttons.tsx          # Componentes de botão
│   │   ├── cards.tsx            # Cards reutilizáveis
│   │   └── modals.tsx           # Modais
│   ├── maps/
│   │   ├── map-view.tsx         # Wrapper do Mapbox
│   │   ├── route-panel.tsx      # Painel de rota
│   │   └── poi-marker.tsx       # Marcadores de POI
│   ├── spotify/
│   │   ├── mini-player.tsx      # Mini player
│   │   ├── full-player.tsx      # Player completo
│   │   └── queue-list.tsx       # Fila de música
│   └── telemetry/
│       ├── speedometer.tsx      # Velocímetro
│       ├── status-cards.tsx     # Cards de status
│       └── chart-history.tsx    # Gráficos
├── hooks/
│   ├── use-colors.ts            # Cores do tema
│   ├── use-location.ts          # Geolocalização
│   ├── use-spotify.ts           # Spotify
│   ├── use-bluetooth.ts         # Bluetooth
│   └── use-trip-history.ts      # Histórico
├── lib/
│   ├── utils.ts                 # Utilitários (cn, etc)
│   ├── theme-provider.tsx       # Tema global
│   ├── trpc.ts                  # Cliente TRPC
│   └── constants.ts             # Constantes
├── services/
│   ├── location-service.ts      # Serviço de GPS
│   ├── spotify-service.ts       # Serviço de Spotify
│   ├── bluetooth-service.ts     # Serviço de BLE
│   ├── storage-service.ts       # Persistência
│   └── telemetry-service.ts     # Dados da moto
├── types/
│   ├── index.ts                 # Tipos globais
│   ├── location.ts              # Tipos de localização
│   ├── spotify.ts               # Tipos de Spotify
│   ├── bluetooth.ts             # Tipos de BLE
│   └── telemetry.ts             # Tipos de telemetria
├── constants/
│   ├── theme.ts                 # Paleta de cores
│   ├── mapbox-styles.ts         # Estilos de mapa
│   └── app-config.ts            # Configurações
├── server/                       # Backend (opcional)
│   ├── _core/
│   │   ├── index.ts             # Servidor Express
│   │   ├── router.ts            # Rotas TRPC
│   │   └── db.ts                # Conexão BD
│   └── README.md                # Documentação
├── assets/
│   ├── images/
│   │   ├── icon.png             # Ícone do app
│   │   ├── splash-icon.png      # Splash screen
│   │   ├── favicon.png          # Web favicon
│   │   └── android-icon-*.png   # Ícones Android
│   └── fonts/                   # Fontes customizadas
├── app.config.ts                # Configuração Expo
├── tailwind.config.js           # Configuração Tailwind
├── theme.config.js              # Paleta de cores
├── tsconfig.json                # Configuração TypeScript
├── package.json                 # Dependências
├── design.md                    # Design system
├── TECHNICAL_RESEARCH.md        # Pesquisa técnica
├── INTEGRATION_GUIDE.md         # Guia de integração
├── ARCHITECTURE.md              # Este arquivo
└── todo.md                      # Tarefas do projeto
```

---

## 4. Camada de Apresentação (UI)

### 4.1 Estrutura de Navegação

O aplicativo utiliza **Expo Router** com navegação em abas (tab-based), permitindo acesso rápido às principais funcionalidades:

```
Root Layout
├── (tabs) Layout
│   ├── Home (Dashboard)
│   ├── Maps (Navegação)
│   ├── Spotify (Música)
│   ├── Telemetry (Dados da Moto)
│   ├── Media (Rádio, Podcasts)
│   ├── History (Histórico)
│   └── Settings (Configurações)
└── oauth/ (Callbacks de autenticação)
```

### 4.2 Componentes Principais

#### Home Screen (Dashboard)
Exibe informações em tempo real da moto e da viagem atual. Componentes:
- Velocímetro digital (GPS-based)
- Mini player do Spotify
- Cards de status (temperatura, combustível, bateria)
- Botão FAB para iniciar viagem
- Indicador de conexão Bluetooth

#### Maps Screen
Integração com Mapbox GL para navegação:
- Mapa fullscreen com controles
- Busca de endereços e POIs
- Rota otimizada para motos
- Painel de rota na base
- Histórico de viagens

#### Spotify Screen
Controle remoto de Spotify:
- Capa do álbum (grande, animada)
- Controles de playback (play, pause, skip)
- Barra de progresso
- Fila de música
- Busca de músicas/playlists

#### Telemetry Screen
Monitoramento da saúde da moto:
- Status de conexão Bluetooth
- Cards de telemetria (motor, combustível, bateria)
- Gráficos de histórico
- Alertas de manutenção

#### Settings Screen
Configuração do aplicativo:
- Emparelhamento Bluetooth
- Preferências de navegação
- Configurações de Spotify
- Notificações
- Sobre o app

### 4.3 Padrões de Design

**Feedback Háptico**: Todos os botões primários fornecem feedback tátil (Light impact).

**Animações**: Transições suaves (200ms) entre telas, scale 0.97 ao pressionar botões.

**Acessibilidade**: Suporte a VoiceOver, contraste WCAG AA, labels descritivos.

---

## 5. Camada de Lógica de Negócio

### 5.1 Context API

O estado global é gerenciado com **React Context** e `useReducer`, evitando complexidade desnecessária:

```tsx
// LocationContext
interface LocationState {
  currentLocation: Location | null;
  isTracking: boolean;
  speed: number;
  heading: number;
}

// SpotifyContext
interface SpotifyState {
  isConnected: boolean;
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
}

// BluetoothContext
interface BluetoothState {
  isScanning: boolean;
  devices: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
  telemetry: MotorTelemetry | null;
}

// TripContext
interface TripState {
  isRecording: boolean;
  currentTrip: Trip | null;
  trips: Trip[];
}
```

### 5.2 Custom Hooks

Hooks reutilizáveis para lógica comum:

```tsx
// useLocation() - Rastreia localização em tempo real
const { location, speed, heading, startTracking, stopTracking } = useLocation();

// useSpotify() - Gerencia conexão e playback do Spotify
const { isConnected, currentTrack, play, pause, skip } = useSpotify();

// useBluetooth() - Gerencia scanning e conexão BLE
const { devices, connect, disconnect, telemetry } = useBluetooth();

// useTripHistory() - Gerencia histórico de viagens
const { trips, saveTrip, deleteTrip, exportTrip } = useTripHistory();
```

### 5.3 Services

Serviços encapsulam lógica de integração com APIs externas:

```tsx
// LocationService
export const LocationService = {
  startTracking: async () => { /* ... */ },
  stopTracking: async () => { /* ... */ },
  getCurrentLocation: async () => { /* ... */ },
};

// SpotifyService
export const SpotifyService = {
  authorize: async (credentials) => { /* ... */ },
  connect: async () => { /* ... */ },
  play: async (uri) => { /* ... */ },
  pause: async () => { /* ... */ },
};

// BluetoothService
export const BluetoothService = {
  scanDevices: async () => { /* ... */ },
  connect: async (deviceId) => { /* ... */ },
  disconnect: async () => { /* ... */ },
  readCharacteristic: async (uuid) => { /* ... */ },
};
```

---

## 6. Camada de Integração

### 6.1 Mapbox GL

**Responsabilidade**: Fornecer navegação GPS e exibição de mapas.

**Fluxo**:
1. Usuário busca destino
2. Mapbox calcula rota otimizada
3. Mapa exibe rota em tempo real
4. GPS atualiza posição a cada 1 segundo
5. Ao chegar, viagem é salva no histórico

**Tratamento de Erros**:
- Token inválido → Mostrar modal de configuração
- Sem permissão de localização → Solicitar permissão
- Sem conexão → Usar cache de mapas offline

### 6.2 Spotify Remote SDK

**Responsabilidade**: Controle remoto de playback do Spotify.

**Fluxo**:
1. Usuário autoriza app no Spotify
2. Token armazenado em Keychain (iOS) / Keystore (Android)
3. App se conecta ao Spotify via Remote SDK
4. Controles de playback enviados via Bluetooth
5. Mudanças de estado sincronizadas em tempo real

**Tratamento de Erros**:
- App Spotify não instalado → Mostrar link para App Store
- Sessão expirada → Solicitar re-autorização
- Sem conexão → Mostrar estado offline

### 6.3 React Native BLE PLX

**Responsabilidade**: Comunicação Bluetooth com a Yamaha R3 CCU.

**Fluxo**:
1. App inicia scanning de dispositivos BLE
2. Usuário seleciona "Yamaha R3 CCU"
3. App estabelece conexão
4. Descobre serviços e características
5. Lê dados de telemetria periodicamente
6. Escreve comandos (se suportado)

**Estrutura de Dados BLE** (a ser descoberta):
```
Service: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (Yamaha CCU)
├── Characteristic: Motor Data
│   ├── Temperature (float)
│   ├── RPM (uint16)
│   └── Fuel Level (uint8)
├── Characteristic: Battery
│   └── Voltage (float)
└── Characteristic: Alerts
    └── Status Flags (uint32)
```

### 6.4 Expo Location

**Responsabilidade**: Rastreamento contínuo de GPS.

**Configuração**:
- Precisão: `Accuracy.High`
- Intervalo: 1 segundo
- Distância mínima: 5 metros
- Background: Habilitado (com permissão)

**Otimização de Bateria**:
- Parar tracking quando app está em background
- Reduzir frequência em viagens longas
- Usar geofencing para alertas

---

## 7. Camada de Armazenamento

### 7.1 AsyncStorage

Dados simples e preferências do usuário:
```tsx
{
  "user_preferences": {
    "theme": "auto",
    "units": "km/h",
    "avoid_highways": false
  },
  "spotify_token": "...",
  "bluetooth_devices": [...]
}
```

### 7.2 SQLite (Drizzle ORM)

Dados estruturados e histórico:
```sql
-- Trips
CREATE TABLE trips (
  id TEXT PRIMARY KEY,
  start_time DATETIME,
  end_time DATETIME,
  distance REAL,
  avg_speed REAL,
  max_speed REAL,
  fuel_consumed REAL,
  route_geojson TEXT
);

-- Trip Points (GPS)
CREATE TABLE trip_points (
  id TEXT PRIMARY KEY,
  trip_id TEXT,
  latitude REAL,
  longitude REAL,
  speed REAL,
  timestamp DATETIME,
  FOREIGN KEY (trip_id) REFERENCES trips(id)
);

-- Telemetry Log
CREATE TABLE telemetry_logs (
  id TEXT PRIMARY KEY,
  trip_id TEXT,
  temperature REAL,
  rpm INTEGER,
  fuel_level REAL,
  battery_voltage REAL,
  timestamp DATETIME,
  FOREIGN KEY (trip_id) REFERENCES trips(id)
);
```

### 7.3 Keychain (iOS) / Keystore (Android)

Dados sensíveis:
- Tokens de Spotify
- Senhas de Bluetooth
- Credenciais de API

---

## 8. Fluxos de Usuário Críticos

### 8.1 Iniciar Viagem

```
┌─────────────────────────────────────────────────────┐
│ Home Screen                                         │
│ [+ Iniciar Viagem] Button                          │
└────────────┬────────────────────────────────────────┘
             │ onPress
┌────────────▼────────────────────────────────────────┐
│ Maps Screen                                         │
│ - Buscar destino ou selecionar favorito            │
│ - Mapbox calcula rota                              │
│ - [Iniciar Navegação] Button                       │
└────────────┬────────────────────────────────────────┘
             │ onPress
┌────────────▼────────────────────────────────────────┐
│ Active Trip State                                   │
│ - GPS rastreando em tempo real                     │
│ - Mapa atualiza a cada 1s                          │
│ - Telemetria da moto exibida (se conectada)       │
│ - Música toca no Spotify                           │
└────────────┬────────────────────────────────────────┘
             │ Chegar ao destino
┌────────────▼────────────────────────────────────────┐
│ Trip Summary                                        │
│ - Distância total                                  │
│ - Tempo de viagem                                  │
│ - Velocidade média/máxima                          │
│ - Combustível consumido                            │
│ - [Salvar] [Compartilhar] [Descartar]             │
└────────────┬────────────────────────────────────────┘
             │ onPress Salvar
┌────────────▼────────────────────────────────────────┐
│ Trip salvo no histórico                            │
│ Volta para Home Screen                             │
└─────────────────────────────────────────────────────┘
```

### 8.2 Conectar à Moto

```
┌─────────────────────────────────────────────────────┐
│ Settings Screen                                     │
│ [Conectar Moto] Button                             │
└────────────┬────────────────────────────────────────┘
             │ onPress
┌────────────▼────────────────────────────────────────┐
│ Bluetooth Scanning                                  │
│ - BLE PLX inicia scanning                          │
│ - Lista de dispositivos encontrados                │
│ - Usuário seleciona "Yamaha R3 CCU"               │
└────────────┬────────────────────────────────────────┘
             │ onSelect
┌────────────▼────────────────────────────────────────┐
│ Emparelhamento                                      │
│ - Estabelece conexão                               │
│ - Descobre serviços/características                │
│ - Valida protocolo                                 │
└────────────┬────────────────────────────────────────┘
             │ Sucesso
┌────────────▼────────────────────────────────────────┐
│ Conectado ✓                                         │
│ - Telemetria começa a ser lida                     │
│ - Indicador de conexão no Home Screen              │
│ - Dados da moto exibidos em Telemetry Screen      │
└─────────────────────────────────────────────────────┘
```

---

## 9. Estratégia de Teste

### 9.1 Testes Unitários (Vitest)

```tsx
// services/__tests__/location-service.test.ts
describe('LocationService', () => {
  it('should start tracking and emit location updates', async () => {
    const locations = [];
    LocationService.onLocationChange((loc) => locations.push(loc));
    
    await LocationService.startTracking();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    expect(locations.length).toBeGreaterThan(0);
    expect(locations[0]).toHaveProperty('latitude');
  });
});
```

### 9.2 Testes de Integração

- Mapbox: Verificar se mapa carrega, rota é calculada
- Spotify: Verificar se autorização funciona, playback é controlado
- BLE: Verificar se scanning encontra dispositivos, conexão é estabelecida
- Geolocalização: Verificar se GPS rastreia corretamente

### 9.3 Testes E2E (Manual)

- Iniciar viagem do início ao fim
- Conectar à moto e ler telemetria
- Controlar Spotify durante viagem
- Salvar e compartilhar viagem

---

## 10. Considerações de Segurança

### 10.1 Autenticação

- **Spotify**: OAuth 2.0 com PKCE
- **Bluetooth**: Emparelhamento seguro com PIN
- **API**: Tokens JWT com expiração

### 10.2 Criptografia

- Tokens armazenados em Keychain/Keystore
- Dados sensíveis criptografados em repouso
- HTTPS para todas as comunicações

### 10.3 Permissões

- Localização: Solicitada ao iniciar primeira viagem
- Bluetooth: Solicitada ao conectar à moto
- Notificações: Solicitada ao configurar alertas

---

## 11. Roadmap de Desenvolvimento

### Fase 1: MVP Local (Semanas 1-3)
- ✅ Projeto inicializado
- ⏳ Home Screen com velocímetro
- ⏳ Integração Mapbox
- ⏳ Integração Spotify
- ⏳ Telemetria simulada
- ⏳ Histórico de viagens

### Fase 2: Framework Bluetooth (Semana 4)
- ⏳ BLE Scanner genérico
- ⏳ Emparelhamento seguro
- ⏳ Estrutura para parsing de dados

### Fase 3: Integração Yamaha (TBD)
- ⏳ Reverse engineering do protocolo CCU
- ⏳ Leitura de telemetria real
- ⏳ Testes em moto real

---

## 12. Referências

- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [Mapbox Maps SDK for React Native](https://docs.mapbox.com/help/tutorials/getting-started-react-native/)
- [Spotify iOS SDK](https://developer.spotify.com/documentation/ios)
- [React Native BLE PLX](https://github.com/dotintent/react-native-ble-plx)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
