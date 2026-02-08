# R3 Connect Plus - TODO

## Fase 1: MVP Local (Semanas 1-3)

### Design & Setup

- [x] Gerar logo/ícone do app

- [x] Atualizar app.config.ts com branding

- [x] Configurar tema de cores (tailwind.config.js)

- [x] Criar wireframes das telas principais

### Home Screen (Dashboard)

- [x] Implementar layout base com SafeArea

- [x] Velocímetro digital (GPS-based)

- [x] Mini player do Spotify

- [x] Cards de status da moto (simulado)

- [x] Botão FAB "Iniciar Viagem"

- [x] Indicador de conexão Bluetooth

### Navegação & GPS

- [ ] Integrar Mapbox GL

- [x] Implementar tela de Maps

- [x] Busca de endereços/POIs

- [x] Rota otimizada para motos

- [x] Salvar favoritos (Home, Trabalho, Pistas)

- [ ] Histórico de viagens

### Spotify Integration

- [ ] Integrar @vanlesson/react-native-spotify-remote

- [x] Tela de controle de música

- [x] Play/Pause/Skip

- [x] Busca de músicas/playlists

- [x] Fila de música

- [ ] Favoritar músicas

### Telemetria (Simulada)

- [x] Tela de dados da moto

- [x] Cards: Temperatura, RPM, Combustível, Bateria

- [ ] Gráfico de histórico (temperatura ao longo do tempo)

- [x] Alertas de temperatura alta

- [ ] Notificações de manutenção

### Multimídia

- [ ] Abas: Spotify | Rádio | Podcasts | Audiobooks

- [ ] Integração com rádio online (Shoutcast/Icecast)

- [ ] Suporte a podcasts (RSS)

- [ ] Reprodutor de audiobooks

### Configurações

- [ ] Tela de Bluetooth (pareamento)

- [ ] Preferências de navegação

- [ ] Configurações de Spotify

- [ ] Notificações

- [ ] Sobre o app

### Histórico de Viagens

- [ ] Tela de histórico

- [ ] Cards com resumo de viagens

- [ ] Gráfico de velocidade

- [ ] Compartilhar viagem

- [ ] Exportar dados (GPX, CSV)

---

## Fase 2: Framework Bluetooth (Semana 4)

### BLE Infrastructure

- [ ] Instalar react-native-ble-plx

- [ ] Implementar BLE scanner genérico

- [ ] Descoberta de dispositivos

- [ ] Emparelhamento seguro

- [ ] Estrutura para parsing de dados

- [ ] Testes unitários de BLE

### Preparação para Yamaha CCU

- [ ] Documentar estrutura de serviços/características

- [ ] Criar parser genérico para dados

- [ ] Implementar retry logic

- [ ] Logging de comunicação BLE

---

## Fase 3: Integração Yamaha (TBD)

### Pesquisa & Reverse Engineering

- [ ] Contato com Yamaha para documentação

- [ ] Análise de protocolo CCU (se possível)

- [ ] Mapeamento de serviços/características

- [ ] Documentação de payload

### Integração Real

- [ ] Conectar à CCU real

- [ ] Ler temperatura do motor

- [ ] Ler nível de combustível

- [ ] Ler voltagem da bateria

- [ ] Ler RPM

- [ ] Ler status de alertas

- [ ] Testes em moto real

---

## Bugs & Melhorias

- [ ] Otimizar consumo de bateria (GPS contínuo)

- [ ] Suporte a modo offline (cache de mapas)

- [ ] Sincronização com iCloud (opcional)

- [ ] Suporte a Apple Watch (futuro)

- [ ] Suporte a CarPlay (futuro)

---

## Checklist de Entrega

### Antes do Primeiro Checkpoint

- [x] Logo/ícone gerado e atualizado

- [x] Home screen funcional

- [x] Navegação GPS básica

- [x] Spotify conectando

- [ ] Sem erros de console

- [ ] Testado em iOS (Expo Go)

### Antes de Publicar

- [ ] Todas as telas implementadas

- [ ] Testes end-to-end

- [ ] Performance otimizada

- [ ] Privacidade verificada

- [ ] Termos de serviço

- [ ] Checkpoint criado

