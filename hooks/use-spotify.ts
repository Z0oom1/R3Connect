import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  progress: number;
}

const SPOTIFY_STORAGE_KEY = "@r3connect/spotify";

export function useSpotify() {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [queue, setQueue] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar estado anterior
  useEffect(() => {
    const loadSpotifyState = async () => {
      try {
        const stored = await AsyncStorage.getItem(SPOTIFY_STORAGE_KEY);
        if (stored) {
          const { isConnected: wasConnected } = JSON.parse(stored);
          setIsConnected(wasConnected);
        }
      } catch (error) {
        console.error("Erro ao carregar estado Spotify:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpotifyState();
  }, []);

  // Conectar ao Spotify
  const connect = useCallback(async () => {
    try {
      // Simular autenticação OAuth
      setIsConnected(true);
      setIsPlaying(true);

      // Carregar faixa inicial
      const initialTrack: SpotifyTrack = {
        id: "1",
        title: "Midnight City",
        artist: "M83",
        duration: 244,
        progress: 0,
      };

      setCurrentTrack(initialTrack);

      // Carregar fila
      const initialQueue: SpotifyTrack[] = [
        { id: "2", title: "Electric Feel", artist: "MGMT", duration: 236, progress: 0 },
        { id: "3", title: "Take On Me", artist: "a-ha", duration: 225, progress: 0 },
        { id: "4", title: "Synthwave Dreams", artist: "The Midnight", duration: 256, progress: 0 },
      ];

      setQueue(initialQueue);

      // Salvar estado
      await AsyncStorage.setItem(
        SPOTIFY_STORAGE_KEY,
        JSON.stringify({
          isConnected: true,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Erro ao conectar ao Spotify:", error);
    }
  }, []);

  // Desconectar do Spotify
  const disconnect = useCallback(async () => {
    try {
      setIsConnected(false);
      setIsPlaying(false);
      setCurrentTrack(null);
      setQueue([]);

      await AsyncStorage.setItem(
        SPOTIFY_STORAGE_KEY,
        JSON.stringify({
          isConnected: false,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Erro ao desconectar do Spotify:", error);
    }
  }, []);

  // Play/Pause
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Skip para próxima faixa
  const skipToNext = useCallback(() => {
    if (queue.length > 0) {
      const [nextTrack, ...rest] = queue;
      setCurrentTrack(nextTrack);
      setQueue(rest);
    }
  }, [queue]);

  // Voltar para faixa anterior
  const skipToPrevious = useCallback(() => {
    if (currentTrack) {
      setQueue([currentTrack, ...queue]);
    }
  }, [currentTrack, queue]);

  // Atualizar progresso da faixa
  const updateProgress = useCallback((progress: number) => {
    setCurrentTrack((prev) => {
      if (!prev) return prev;
      return { ...prev, progress };
    });
  }, []);

  return {
    isConnected,
    isPlaying,
    isLoading,
    currentTrack,
    queue,
    connect,
    disconnect,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    updateProgress,
  };
}
