import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  progress: number;
  albumArt?: string;
}

const SPOTIFY_STORAGE_KEY = "@r3connect/spotify_token";
const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || ""; // O usuário precisará configurar isso
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "manus-r3connect", // Deve coincidir com o scheme no app.config.ts
});

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export function useSpotify() {
  const [token, setToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [queue, setQueue] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [
        "user-read-currently-playing",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-recently-played",
      ],
      usePKCE: false,
      redirectUri: REDIRECT_URI,
    },
    discovery
  );

  // Carregar token salvo
  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem(SPOTIFY_STORAGE_KEY);
        if (savedToken) {
          setToken(savedToken);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Erro ao carregar token Spotify:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  // Lidar com a resposta da autenticação
  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
      setIsConnected(true);
      AsyncStorage.setItem(SPOTIFY_STORAGE_KEY, access_token);
    }
  }, [response]);

  // Buscar estado atual do player
  const fetchPlaybackState = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 && res.data) {
        const item = res.data.item;
        setIsPlaying(res.data.is_playing);
        setCurrentTrack({
          id: item.id,
          title: item.name,
          artist: item.artists.map((a: any) => a.name).join(", "),
          duration: item.duration_ms / 1000,
          progress: res.data.progress_ms / 1000,
          albumArt: item.album.images[0]?.url,
        });
      } else if (res.status === 204) {
        // Nada tocando
        setCurrentTrack(null);
        setIsPlaying(false);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expirado
        disconnect();
      }
      console.error("Erro ao buscar playback Spotify:", error);
    }
  }, [token]);

  // Atualizar periodicamente se estiver conectado
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected && token) {
      fetchPlaybackState();
      interval = setInterval(fetchPlaybackState, 5000);
    }
    return () => clearInterval(interval);
  }, [isConnected, token, fetchPlaybackState]);

  const connect = useCallback(async () => {
    if (!CLIENT_ID) {
      alert("Spotify Client ID não configurado. Verifique o arquivo .env");
      return;
    }
    promptAsync();
  }, [promptAsync]);

  const disconnect = useCallback(async () => {
    setToken(null);
    setIsConnected(false);
    setIsPlaying(false);
    setCurrentTrack(null);
    await AsyncStorage.removeItem(SPOTIFY_STORAGE_KEY);
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (!token) return;
    try {
      const endpoint = isPlaying ? "pause" : "play";
      await axios.put(`https://api.spotify.com/v1/me/player/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Erro ao alternar play/pause:", error);
    }
  }, [token, isPlaying]);

  const skipToNext = useCallback(async () => {
    if (!token) return;
    try {
      await axios.post("https://api.spotify.com/v1/me/player/next", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimeout(fetchPlaybackState, 500);
    } catch (error) {
      console.error("Erro ao pular música:", error);
    }
  }, [token, fetchPlaybackState]);

  const skipToPrevious = useCallback(async () => {
    if (!token) return;
    try {
      await axios.post("https://api.spotify.com/v1/me/player/previous", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimeout(fetchPlaybackState, 500);
    } catch (error) {
      console.error("Erro ao voltar música:", error);
    }
  }, [token, fetchPlaybackState]);

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
    updateProgress: () => {}, // O progresso agora vem da API
  };
}
