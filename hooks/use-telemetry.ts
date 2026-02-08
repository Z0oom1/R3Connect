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
  const [isLoading, setIsLoading] = useState(true);

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

  // Adicionar snapshot de telemetria
  const addSnapshot = useCallback(
    async (snapshot: Omit<TelemetrySnapshot, "timestamp">) => {
      const newSnapshot: TelemetrySnapshot = {
        ...snapshot,
        timestamp: Date.now(),
      };

      let updatedHistory = [...telemetryHistory, newSnapshot];

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

  // Conectar ao dispositivo (simulado)
  const connect = useCallback(() => {
    setIsConnected(true);
  }, []);

  // Desconectar
  const disconnect = useCallback(() => {
    setIsConnected(false);
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

      return {
        avgTemperature: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
        maxTemperature: Math.max(...temperatures),
        minTemperature: Math.min(...temperatures),
        avgRpm: rpms.reduce((a, b) => a + b, 0) / rpms.length,
        maxRpm: Math.max(...rpms),
        avgFuel: fuels.reduce((a, b) => a + b, 0) / fuels.length,
        minFuel: Math.min(...fuels),
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
    isLoading,
    telemetryHistory,
    addSnapshot,
    connect,
    disconnect,
    getHistoryByPeriod,
    getStatistics,
    clearHistory,
  };
}
