# Plano de Melhorias - R3Connect Plus (iOS 26 Style)

Este documento detalha as melhorias planejadas para o projeto R3Connect Plus, focando em um design moderno inspirado no iOS 26 e na funcionalidade completa do sistema.

## 1. Design iOS 26 (Moderno & Alinhado)

O design será atualizado para refletir a estética do futuro iOS 26, caracterizada por:
- **Neomorfismo Suave & Glassmorphism**: Uso de transparências (blur) e sombras suaves para criar profundidade.
- **Cantos Arredondados Extremos**: Uso de `rounded-3xl` e `rounded-[2rem]` para um visual mais orgânico.
- **Tipografia Dinâmica**: Uso de pesos de fonte variados (SF Pro Rounded) para hierarquia clara.
- **Cores Vibrantes & Gradientes**: Atualização da paleta para incluir gradientes sutis no Azul Yamaha.
- **Micro-interações**: Feedback visual ao tocar em qualquer elemento.

### Mudanças Específicas:
- **Cards**: Substituir bordas sólidas por sombras suaves e fundos levemente translúcidos.
- **Velocímetro**: Redesenhar com um visual mais futurista, usando gradientes e brilho (glow).
- **Barra de Abas**: Tornar flutuante com efeito de vidro (blur).

## 2. Funcionalidades Completas

### Home (Dashboard)
- [ ] **Velocímetro Real**: Integração aprimorada com GPS.
- [ ] **RPM Dinâmico**: Simulação mais realista baseada na velocidade e "marcha" teórica.
- [ ] **Status da Moto**: Conexão real simulada com persistência de estado.

### Mapas (Navegação)
- [ ] **Integração Mapbox**: Configurar o componente de mapa real (se possível no ambiente) ou melhorar drasticamente o simulador.
- [ ] **Busca de Destinos**: Implementar lógica de busca real usando API de geocoding.
- [ ] **Rotas**: Mostrar rotas reais no mapa.

### Spotify (Música)
- [ ] **Integração OAuth**: Garantir que o fluxo de login funcione.
- [ ] **Controle de Playback**: Implementar integração com a API do Spotify para controle real.
- [ ] **Visualizer**: Adicionar um visualizador de áudio animado.

### Telemetria
- [ ] **Gráficos em Tempo Real**: Usar `react-native-wagmi-charts` ou similar para gráficos de performance.
- [ ] **Alertas Inteligentes**: Sistema de notificações internas para temperatura alta ou combustível baixo.

## 3. Melhorias Técnicas
- **Persistência**: Usar `AsyncStorage` ou `SQLite` (Drizzle) para salvar histórico de viagens e configurações.
- **Performance**: Otimizar renderização de componentes pesados (mapas e gráficos).
- **Acessibilidade**: Garantir suporte total a leitores de tela.

## 4. Cronograma de Execução
1. **Fase 3**: Atualização do Sistema de Design (Cores, Componentes Base).
2. **Fase 4**: Implementação das Funcionalidades (Spotify, Mapas, Telemetria).
3. **Fase 5**: Polimento, Animações e Testes.
4. **Fase 6**: Git Push Final.
