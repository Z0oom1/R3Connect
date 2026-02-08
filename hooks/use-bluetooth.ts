import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BLUETOOTH_STORAGE_KEY = "@r3connect/bluetooth";

export function useBluetooth() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState("Yamaha R3 CCU");
  const [isLoading, setIsLoading] = useState(true);

  // Carregar estado de conexão anterior
  useEffect(() => {
    const loadBluetoothState = async () => {
      try {
        const stored = await AsyncStorage.getItem(BLUETOOTH_STORAGE_KEY);
        if (stored) {
          const { isConnected: wasConnected } = JSON.parse(stored);
          // Não restaurar conexão automaticamente por segurança
          setIsConnected(false);
        }
      } catch (error) {
        console.error("Erro ao carregar estado Bluetooth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBluetoothState();
  }, []);

  // Conectar ao dispositivo
  const connect = useCallback(async () => {
    setIsConnecting(true);
    
    // Simular delay de conexão (2 segundos)
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        setIsConnected(true);
        setIsConnecting(false);

        // Salvar estado
        try {
          await AsyncStorage.setItem(
            BLUETOOTH_STORAGE_KEY,
            JSON.stringify({
              isConnected: true,
              deviceName,
              timestamp: Date.now(),
            })
          );
        } catch (error) {
          console.error("Erro ao salvar estado Bluetooth:", error);
        }

        resolve();
      }, 2000);
    });
  }, [deviceName]);

  // Desconectar do dispositivo
  const disconnect = useCallback(async () => {
    setIsConnected(false);

    try {
      await AsyncStorage.setItem(
        BLUETOOTH_STORAGE_KEY,
        JSON.stringify({
          isConnected: false,
          deviceName,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Erro ao salvar estado Bluetooth:", error);
    }
  }, [deviceName]);

  return {
    isConnected,
    isConnecting,
    isLoading,
    deviceName,
    connect,
    disconnect,
  };
}
