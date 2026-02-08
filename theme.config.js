/** @type {const} */
const themeColors = {
  // Primária: Azul Yamaha moderno (iOS 26 style)
  primary: { light: '#0066CC', dark: '#0A84FF' },
  
  // Fundo: Branco puro (light) e preto profundo (dark)
  background: { light: '#FFFFFF', dark: '#000000' },
  
  // Superfícies: Cards com efeito glassmorphism
  surface: { light: '#F8F9FA', dark: '#1C1C1E' },
  
  // Texto primário
  foreground: { light: '#000000', dark: '#FFFFFF' },
  
  // Texto secundário (muted)
  muted: { light: '#8E8E93', dark: '#A1A1A6' },
  
  // Bordas e separadores
  border: { light: '#E5E5EA', dark: '#38383A' },
  
  // Estados de sucesso
  success: { light: '#34C759', dark: '#32D74B' },
  
  // Estados de aviso
  warning: { light: '#FF9500', dark: '#FFB340' },
  
  // Estados de erro
  error: { light: '#FF3B30', dark: '#FF453A' },
  
  // Cores adicionais para design iOS 26
  accent: { light: '#FF6B35', dark: '#FF9500' },
  
  // Fundo secundário para elementos flutuantes
  floatingBackground: { light: 'rgba(255, 255, 255, 0.8)', dark: 'rgba(28, 28, 30, 0.8)' },
};

module.exports = { themeColors };
