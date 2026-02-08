import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppSettings {
  theme: "light" | "dark" | "auto";
  units: "km" | "mi";
  avoidHighways: boolean;
  notificationsEnabled: boolean;
  temperatureAlertThreshold: number;
  fuelAlertThreshold: number;
  spotifyQuality: "low" | "normal" | "high" | "very_high";
  bluetoothAutoConnect: boolean;
  savedLocations: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    icon: string;
  }>;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "auto",
  units: "km",
  avoidHighways: false,
  notificationsEnabled: true,
  temperatureAlertThreshold: 90,
  fuelAlertThreshold: 25,
  spotifyQuality: "high",
  bluetoothAutoConnect: true,
  savedLocations: [
    {
      id: "home",
      name: "Casa",
      latitude: -23.5505,
      longitude: -46.6333,
      icon: "🏠",
    },
    {
      id: "work",
      name: "Trabalho",
      latitude: -23.5505,
      longitude: -46.6333,
      icon: "💼",
    },
    {
      id: "track",
      name: "Pista de Moto",
      latitude: -23.5505,
      longitude: -46.6333,
      icon: "🏁",
    },
  ],
};

const SETTINGS_STORAGE_KEY = "@r3connect/settings";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configurações
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          setSettings(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Salvar configurações
  const saveSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      setSettings(updated);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  }, [settings]);

  // Atualizar tema
  const setTheme = useCallback(
    (theme: "light" | "dark" | "auto") => {
      saveSettings({ theme });
    },
    [saveSettings]
  );

  // Atualizar unidades
  const setUnits = useCallback(
    (units: "km" | "mi") => {
      saveSettings({ units });
    },
    [saveSettings]
  );

  // Adicionar localização salva
  const addSavedLocation = useCallback(
    (location: AppSettings["savedLocations"][0]) => {
      const updated = {
        savedLocations: [...settings.savedLocations, location],
      };
      saveSettings(updated);
    },
    [settings.savedLocations, saveSettings]
  );

  // Remover localização salva
  const removeSavedLocation = useCallback(
    (locationId: string) => {
      const updated = {
        savedLocations: settings.savedLocations.filter((l) => l.id !== locationId),
      };
      saveSettings(updated);
    },
    [settings.savedLocations, saveSettings]
  );

  // Resetar para padrão
  const resetToDefault = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(SETTINGS_STORAGE_KEY);
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Erro ao resetar configurações:", error);
    }
  }, []);

  return {
    settings,
    isLoading,
    saveSettings,
    setTheme,
    setUnits,
    addSavedLocation,
    removeSavedLocation,
    resetToDefault,
  };
}
