import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface TripData {
  id: string;
  startTime: number;
  endTime?: number;
  startLocation: { latitude: number; longitude: number };
  endLocation?: { latitude: number; longitude: number };
  distance: number;
  duration: number;
  averageSpeed: number;
  maxSpeed: number;
  fuelConsumed: number;
  waypoints: Array<{ latitude: number; longitude: number; speed: number; timestamp: number }>;
}

const STORAGE_KEY = "@r3connect/trips";

export function useTripData() {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar histórico de viagens do AsyncStorage
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setTrips(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Erro ao carregar viagens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, []);

  // Salvar viagens no AsyncStorage
  const saveTrips = useCallback(async (updatedTrips: TripData[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
      setTrips(updatedTrips);
    } catch (error) {
      console.error("Erro ao salvar viagens:", error);
    }
  }, []);

  // Iniciar uma nova viagem
  const startTrip = useCallback(
    (startLocation: { latitude: number; longitude: number }) => {
      const newTrip: TripData = {
        id: `trip_${Date.now()}`,
        startTime: Date.now(),
        startLocation,
        distance: 0,
        duration: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        fuelConsumed: 0,
        waypoints: [],
      };
      setCurrentTrip(newTrip);
    },
    []
  );

  // Adicionar ponto de rastreamento
  const addWaypoint = useCallback(
    (location: { latitude: number; longitude: number }, speed: number) => {
      if (!currentTrip) return;

      const updatedTrip = {
        ...currentTrip,
        waypoints: [
          ...currentTrip.waypoints,
          {
            latitude: location.latitude,
            longitude: location.longitude,
            speed,
            timestamp: Date.now(),
          },
        ],
      };
      setCurrentTrip(updatedTrip);
    },
    [currentTrip]
  );

  // Finalizar viagem
  const endTrip = useCallback(
    async (endLocation: { latitude: number; longitude: number }) => {
      if (!currentTrip) return;

      const completedTrip: TripData = {
        ...currentTrip,
        endTime: Date.now(),
        endLocation,
        duration: (Date.now() - currentTrip.startTime) / 1000 / 60, // em minutos
      };

      // Calcular distância e velocidades
      if (completedTrip.waypoints.length > 0) {
        const speeds = completedTrip.waypoints.map((wp) => wp.speed);
        completedTrip.maxSpeed = Math.max(...speeds);
        completedTrip.averageSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      }

      const updatedTrips = [...trips, completedTrip];
      await saveTrips(updatedTrips);
      setCurrentTrip(null);

      return completedTrip;
    },
    [currentTrip, trips, saveTrips]
  );

  // Obter histórico de viagens
  const getTripsHistory = useCallback(() => {
    return trips.sort((a, b) => b.startTime - a.startTime);
  }, [trips]);

  // Limpar histórico
  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setTrips([]);
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
    }
  }, []);

  return {
    currentTrip,
    trips: getTripsHistory(),
    isLoading,
    startTrip,
    addWaypoint,
    endTrip,
    clearHistory,
  };
}
