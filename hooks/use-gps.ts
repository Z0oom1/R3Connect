import { useState, useCallback, useEffect } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface GPSLocation {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  altitude: number;
  accuracy: number;
  timestamp: number;
}

const GPS_STORAGE_KEY = "@r3connect/gps";

export function useGPS() {
  const [location, setLocation] = useState<GPSLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Solicitar permissão de localização
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermission(status === "granted");
      } catch (err) {
        setError("Erro ao solicitar permissão de localização");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    requestPermission();
  }, []);

  // Iniciar rastreamento
  const startTracking = useCallback(async () => {
    if (!permission) {
      setError("Permissão de localização não concedida");
      return;
    }

    try {
      setIsTracking(true);
      setError(null);

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc: Location.LocationObject) => {
          const newLocation: GPSLocation = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            speed: (loc.coords.speed || 0) * 3.6, // m/s para km/h
            heading: loc.coords.heading || 0,
            altitude: loc.coords.altitude || 0,
            accuracy: loc.coords.accuracy || 0,
            timestamp: Date.now(),
          };

          setLocation(newLocation);

          // Salvar última localização
          AsyncStorage.setItem(GPS_STORAGE_KEY, JSON.stringify(newLocation)).catch(
            (err) => console.error("Erro ao salvar GPS:", err)
          );
        }
      );

      return () => {
        subscription.remove();
        setIsTracking(false);
      };
    } catch (err) {
      setError("Erro ao iniciar rastreamento");
      console.error(err);
      setIsTracking(false);
    }
  }, [permission]);

  // Parar rastreamento
  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  // Obter localização atual uma vez
  const getCurrentLocation = useCallback(async () => {
    if (!permission) {
      setError("Permissão de localização não concedida");
      return null;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation: GPSLocation = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        speed: (loc.coords.speed || 0) * 3.6,
        heading: loc.coords.heading || 0,
        altitude: loc.coords.altitude || 0,
        accuracy: loc.coords.accuracy || 0,
        timestamp: Date.now(),
      };

      setLocation(newLocation);
      return newLocation;
    } catch (err) {
      setError("Erro ao obter localização");
      console.error(err);
      return null;
    }
  }, [permission]);

  // Calcular distância entre dois pontos (Haversine)
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Raio da Terra em km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  return {
    location,
    isTracking,
    permission,
    isLoading,
    error,
    startTracking,
    stopTracking,
    getCurrentLocation,
    calculateDistance,
  };
}
