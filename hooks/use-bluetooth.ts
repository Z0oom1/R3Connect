import { useState, useCallback, useEffect, useRef } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { BleManager, Device, State } from "react-native-ble-plx";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BLUETOOTH_STORAGE_KEY = "@r3connect/bluetooth";
// O BleManager deve ser instanciado apenas em dispositivos nativos (iOS/Android)
// e preferencialmente como um singleton para evitar múltiplas instâncias.
let manager: BleManager | null = null;

try {
  if (Platform.OS !== "web") {
    manager = new BleManager();
  }
} catch (e) {
  console.error("Falha ao inicializar BleManager:", e);
}

export function useBluetooth() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState("Yamaha R3 CCU");
  const [isLoading, setIsLoading] = useState(true);
  const [foundDevices, setFoundDevices] = useState<Device[]>([]);
  const connectedDevice = useRef<Device | null>(null);

  // Solicitar permissões no Android
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  };

  useEffect(() => {
    requestPermissions();
    
    if (!manager) {
      setIsLoading(false);
      return;
    }

    const subscription = manager.onStateChange((state) => {
      if (state === State.PoweredOn) {
        setIsLoading(false);
      }
    }, true);

    return () => subscription.remove();
  }, []);

  const connect = useCallback(async (device?: Device) => {
    if (!manager) {
      console.warn("Bluetooth não disponível nesta plataforma");
      return;
    }

    setIsConnecting(true);
    
    try {
      // Se um dispositivo específico for passado, conecta a ele
      // Caso contrário, inicia o scan por dispositivos com nome "Yamaha" ou "R3"
      if (device) {
        const connected = await device.connect();
        await connected.discoverAllServicesAndCharacteristics();
        connectedDevice.current = connected;
        setIsConnected(true);
      } else {
        // Scan simplificado para demonstração real
        manager.startDeviceScan(null, null, async (error, scannedDevice) => {
          if (error) {
            console.error("Erro no scan:", error);
            setIsConnecting(false);
            return;
          }

          if (scannedDevice?.name?.includes("Yamaha") || scannedDevice?.name?.includes("R3")) {
            manager?.stopDeviceScan();
            const connected = await scannedDevice.connect();
            await connected.discoverAllServicesAndCharacteristics();
            connectedDevice.current = connected;
            setDeviceName(scannedDevice.name || "Yamaha R3");
            setIsConnected(true);
            setIsConnecting(false);
          }
        });

        // Timeout de scan (10 segundos)
        setTimeout(() => {
          manager?.stopDeviceScan();
          if (!isConnected) setIsConnecting(false);
        }, 10000);
      }
    } catch (error) {
      console.error("Erro ao conectar Bluetooth:", error);
      setIsConnecting(false);
    }
  }, [isConnected]);

  const disconnect = useCallback(async () => {
    if (connectedDevice.current) {
      await connectedDevice.current.cancelConnection();
      connectedDevice.current = null;
    }
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    isConnecting,
    isLoading,
    deviceName,
    connect,
    disconnect,
    foundDevices,
  };
}
