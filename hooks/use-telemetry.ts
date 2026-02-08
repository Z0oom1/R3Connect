import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface TelemetrySnapshot {
  timestamp: number;
  temperature: number;
  rpm: number;
  fuel: number;
  battery: number;
  pressure: number;
}

const TELEMETRY_STORAGE_KEY = "@r3connect/telemetry";
const MAX_HISTORY = 1440; // 24 horas com leitura a cada minuto

export function useTelemetry() {
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetrySnapshot[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState<TelemetrySnapshot | null>(null);

  // Carregar histórico de telemetria
  useEffect(() => {
    const loadTelemetry = async () => {
      try {
        const stored = await AsyncStorage.getItem(TELEMETRY_STORAGE_KEY);
        if (stored) {
          setTelemetryHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Erro ao carregar telemetria:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTelemetry();
  }, []);

  // Simular dados de telemetria em tempo real
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const snapshot: TelemetrySnapshot = {
        timestamp: Date.now(),
        temperature: Math.random() * 40 + 50,
        rpm: Math.random() * 15000,
        fuel: Math.random() * 100,
        battery: Math.random() * 3 + 11,
        pressure: Math.random() * 1 + 1.5,
      };

      setCurrentData(snapshot);
      addSnapshot(snapshot);
    }, 1500);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Adicionar snapshot de telemetria
  const addSnapshot = useCallback(
    async (snapshot: TelemetrySnapshot) => {
      let updatedHistory = [...telemetryHistory, snapshot];

      // Manter apenas os últimos MAX_HISTORY snapshots
      if (updatedHistory.length > MAX_HISTORY) {
        updatedHistory = updatedHistory.slice(-MAX_HISTORY);
      }

      try {
        await AsyncStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(updatedHistory));
        setTelemetryHistory(updatedHistory);
      } catch (error) {
        console.error("Erro ao salvar telemetria:", error);
      }
    },
    [telemetryHistory]
  );

  // Conectar ao dispositivo (com animação)
  const connect = useCallback(async () => {
    setIsConnecting(true);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsConnected(true);
        setIsConnecting(false);
        resolve();
      }, 2000);
    });
  }, []);

  // Desconectar
  const disconnect = useCallback(() => {
    setIsConnected(false);
    setCurrentData(null);
  }, []);

  // Obter histórico filtrado por período
  const getHistoryByPeriod = useCallback(
    (periodMinutes: number) => {
      const now = Date.now();
      const periodMs = periodMinutes * 60 * 1000;
      return telemetryHistory.filter((s) => now - s.timestamp <= periodMs);
    },
    [telemetryHistory]
  );

  // Obter estatísticas
  const getStatistics = useCallback(
    (periodMinutes: number = 1440) => {
      const history = getHistoryByPeriod(periodMinutes);

      if (history.length === 0) {
        return null;
      }

      const temperatures = history.map((s) => s.temperature);
      const rpms = history.map((s) => s.rpm);
      const fuels = history.map((s) => s.fuel);
      const batteries = history.map((s) => s.battery);

      return {
        avgTemperature: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
        maxTemperature: Math.max(...temperatures),
        minTemperature: Math.min(...temperatures),
        avgRpm: rpms.reduce((a, b) => a + b, 0) / rpms.length,
        maxRpm: Math.max(...rpms),
        minRpm: Math.min(...rpms),
        avgFuel: fuels.reduce((a, b) => a + b, 0) / fuels.length,
        minFuel: Math.min(...fuels),
        maxFuel: Math.max(...fuels),
        avgBattery: batteries.reduce((a, b) => a + b, 0) / batteries.length,
        minBattery: Math.min(...batteries),
        maxBattery: Math.max(...batteries),
      };
    },
    [getHistoryByPeriod]
  );

  // Limpar histórico
  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TELEMETRY_STORAGE_KEY);
      setTelemetryHistory([]);
    } catch (error) {
      console.error("Erro ao limpar histórico de telemetria:", error);
    }
  }, []);

  return {
    isConnected,
    isConnecting,
    isLoading,
    telemetryHistory,
    currentData,
    addSnapshot,
    connect,
    disconnect,
    getHistoryByPeriod,
    getStatistics,
    clearHistory,
  };
}
