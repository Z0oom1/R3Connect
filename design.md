# Design - R3 Connect Plus

## Visão Geral

**R3 Connect Plus** é um aplicativo iOS/Android para motociclistas da Yamaha R3 2026, oferecendo navegação GPS, controle de Spotify, telemetria da moto e multimídia integrada em um único painel. O design segue as **Apple Human Interface Guidelines (HIG)** para parecer um app nativo de primeira parte, otimizado para **uso com uma mão em modo retrato (9:16)**.

---

## Paleta de Cores

A marca reflete a energia e performance da Yamaha R3 - velocidade, precisão e confiabilidade.

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Primária** | `#0066CC` (Azul Yamaha) | Botões, destaques, ícones ativos |
| **Secundária** | `#FF6B35` (Laranja Quente) | Alertas, status crítico, RPM alto |
| **Fundo** | `#FFFFFF` (Claro) / `#0F0F0F` (Escuro) | Background principal |
| **Superfícies** | `#F5F5F5` (Claro) / `#1A1A1A` (Escuro) | Cards, modais |
| **Texto Primário** | `#1A1A1A` (Claro) / `#FFFFFF` (Escuro) | Títulos, corpo |
| **Texto Secundário** | `#666666` (Claro) / `#AAAAAA` (Escuro) | Labels, hints |
| **Sucesso** | `#22C55E` (Verde) | Conexão OK, motor OK |
| **Aviso** | `#F59E0B` (Amarelo) | Avisos, manutenção próxima |
| **Erro** | `#EF4444` (Vermelho) | Desconexão, falhas |

---

## Lista de Telas

### 1. **Home (Dashboard Principal)**
**Propósito**: Visão geral em tempo real da moto e viagem  
**Layout**: Tab principal, acessível com um toque

**Conteúdo Principal**:
- **Velocímetro Digital** (topo): Velocidade atual grande e legível, RPM em gráfico circular
- **Status da Moto** (cards): Temperatura do motor, combustível, bateria (quando conectado)
- **Música Atual** (mini player): Capa do álbum, artista, título com botões play/pause/skip
- **Próxima Viagem** (card): Destino salvo ou "Começar Viagem"
- **Botão FAB** (flutuante): "+ Iniciar Viagem"

**Funcionalidades**:
- Atualização em tempo real de velocidade via GPS
- Indicador de conexão Bluetooth (ícone no topo)
- Modo escuro automático à noite

---

### 2. **Navegação (Maps)**
**Propósito**: Navegação GPS com integração Mapbox  
**Layout**: Mapa fullscreen com controles na base

**Conteúdo**:
- **Mapa Mapbox** (fullscreen): Mostra localização atual, rota, pontos de interesse
- **Barra de Pesquisa** (topo): "Procurar destino..."
- **Controles de Mapa** (lado direito): Zoom +/-, Centralizar, Modo 3D
- **Painel de Rota** (base): Distância, tempo estimado, próxima manobra
- **Botões de Ação** (base): Iniciar, Pausar, Cancelar

**Funcionalidades**:
- Busca de endereços e POIs
- Rota otimizada para motos (evitar rodovias se preferir)
- Histórico de viagens
- Salvar favoritos (home, trabalho, pistas)

---

### 3. **Spotify (Controle de Música)**
**Propósito**: Controle remoto de Spotify integrado  
**Layout**: Vertical com foco na capa do álbum

**Conteúdo**:
- **Capa do Álbum** (grande, centro): Imagem do álbum com animação sutil
- **Informações da Música** (abaixo): Artista, título, duração
- **Barra de Progresso**: Posição atual / duração total
- **Controles de Playback** (abaixo):
  - Botão Anterior (esquerda)
  - Play/Pause (centro, grande)
  - Próximo (direita)
- **Controles Secundários** (abaixo):
  - Shuffle (ícone)
  - Repeat (ícone)
  - Volume (slider horizontal)
- **Fila de Música** (expandível): Lista de próximas músicas

**Funcionalidades**:
- Controle remoto de playback (play, pause, skip)
- Busca de músicas/playlists
- Favoritar músicas
- Modo offline (se Spotify Premium)

---

### 4. **Telemetria (Dados da Moto)**
**Propósito**: Monitorar saúde e performance da moto  
**Layout**: Cards empilhados com indicadores

**Conteúdo**:
- **Status Geral** (topo): "Conectado" / "Desconectado" com ícone
- **Cards de Telemetria**:
  - **Motor**: Temperatura, RPM, status
  - **Combustível**: Nível, autonomia estimada
  - **Bateria**: Voltagem, status de carga
  - **Pneus**: Pressão (se sensor disponível)
  - **Manutenção**: Próxima revisão, alertas
- **Histórico** (expandível): Gráfico de temperatura ao longo do tempo

**Funcionalidades**:
- Alertas de temperatura alta
- Notificações de manutenção
- Histórico de viagens (consumo, velocidade média)
- Modo de diagnóstico (para oficina)

---

### 5. **Multimídia (Rádio, Podcasts, Audiobooks)**
**Propósito**: Reprodução de áudio além do Spotify  
**Layout**: Similar ao Spotify, com abas para diferentes fontes

**Conteúdo**:
- **Abas**: Spotify | Rádio | Podcasts | Audiobooks
- **Rádio**:
  - Lista de estações salvas
  - Busca de estações
  - Reprodutor simples
- **Podcasts**:
  - Episódios recentes
  - Inscrições
  - Reprodutor com velocidade ajustável
- **Audiobooks**:
  - Biblioteca pessoal
  - Progresso de leitura
  - Marcadores

**Funcionalidades**:
- Streaming de rádio online
- Download de episódios para offline
- Sincronização de progresso

---

### 6. **Configurações**
**Propósito**: Personalizar app e conectar dispositivos  
**Layout**: Lista com seções

**Conteúdo**:
- **Conexão Bluetooth**:
  - Dispositivos pareados
  - Botão "Conectar Moto"
  - Status de conexão
- **Preferências de Navegação**:
  - Evitar rodovias (toggle)
  - Unidades (km/h ou mph)
  - Modo noturno (automático/manual)
- **Spotify**:
  - Conectar conta
  - Qualidade de áudio
  - Download automático
- **Notificações**:
  - Alertas de temperatura
  - Alertas de combustível
  - Alertas de manutenção
- **Sobre**:
  - Versão do app
  - Termos de serviço
  - Privacidade

**Funcionalidades**:
- Logout de Spotify
- Limpar dados locais
- Exportar histórico de viagens

---

### 7. **Histórico de Viagens**
**Propósito**: Revisar e analisar viagens passadas  
**Layout**: Lista com cards de resumo

**Conteúdo**:
- **Filtros** (topo): Data, distância, duração
- **Cards de Viagem**:
  - Data e hora
  - Distância total
  - Tempo de viagem
  - Velocidade média/máxima
  - Consumo de combustível
  - Mapa em miniatura
- **Detalhes** (ao tocar): Gráfico de velocidade, rota completa, fotos

**Funcionalidades**:
- Compartilhar viagem (via WhatsApp, etc.)
- Exportar dados (GPX, CSV)
- Comparar viagens

---

## Fluxos de Usuário Principais

### Fluxo 1: Iniciar Viagem
```
Home (Dashboard)
  ↓ [Toca "+ Iniciar Viagem"]
Navegação (Maps)
  ↓ [Busca destino ou seleciona favorito]
Rota Ativa
  ↓ [Navega até destino]
Viagem Finalizada
  ↓ [Toca "Finalizar"]
Resumo da Viagem
  ↓ [Salva no histórico]
Home (Dashboard)
```

### Fluxo 2: Controlar Spotify
```
Home (Dashboard)
  ↓ [Toca mini player ou vai para aba Spotify]
Spotify (Controle)
  ↓ [Play/Pause/Skip]
Música Toca
  ↓ [Busca nova música ou playlist]
Reprodução Contínua
```

### Fluxo 3: Conectar Moto
```
Home (Dashboard)
  ↓ [Ícone de desconexão no topo]
Configurações → Bluetooth
  ↓ [Toca "Conectar Moto"]
Scanning de Dispositivos
  ↓ [Seleciona "Yamaha R3 CCU"]
Emparelhamento
  ↓ [Insere código (se necessário)]
Conectado ✓
  ↓ [Volta para Home]
Dashboard com Telemetria
```

---

## Padrões de Interação

### Feedback Háptico
- **Tap leve**: Botões secundários, toggles
- **Tap médio**: Botões primários, play/pause
- **Sucesso**: Conexão estabelecida, viagem salva
- **Erro**: Falha de conexão, combustível baixo

### Animações
- **Transições de tela**: Fade suave (200ms)
- **Botões**: Scale 0.97 ao pressionar
- **Indicadores**: Rotação suave para loading
- **Cards**: Slide-in ao aparecer

### Acessibilidade
- Todos os ícones têm labels de acessibilidade
- Contraste suficiente (WCAG AA)
- Suporte a VoiceOver (iOS)

---

## Considerações de Segurança

- **Bluetooth**: Emparelhamento seguro com PIN/código
- **GPS**: Localização solicitada com permissão explícita
- **Spotify**: OAuth seguro, token armazenado em Keychain
- **Dados**: Histórico de viagens criptografado localmente

---

## Próximos Passos

1. ✅ Design finalizado
2. ⏳ Criar wireframes em Figma
3. ⏳ Implementar Home e Navegação
4. ⏳ Integrar Spotify
5. ⏳ Adicionar Telemetria (simulada inicialmente)
6. ⏳ Testar em dispositivo físico
