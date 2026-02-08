import { ScrollView, Text, View, Pressable, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  progress: number;
  isPlaying: boolean;
}

export default function SpotifyScreen() {
  const colors = useColors();
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack>({
    id: "1",
    title: "Conecte ao Spotify",
    artist: "R3 Connect Plus",
    album: "Seu Spotify",
    duration: 0,
    progress: 0,
    isPlaying: false,
  });

  const [queue, setQueue] = useState<SpotifyTrack[]>([
    {
      id: "2",
      title: "Próxima Música",
      artist: "Artista",
      album: "Álbum",
      duration: 240,
      progress: 0,
      isPlaying: false,
    },
  ]);

  // Simular progresso da música
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTrack((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + 1, prev.duration),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleConnect = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      setCurrentTrack({
        id: "spotify-1",
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: 200,
        progress: 45,
        isPlaying: true,
      });
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setCurrentTrack((prev) => ({
      ...prev,
      isPlaying: !isPlaying,
    }));
  };

  const handleSkip = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setCurrentTrack({
        ...next,
        progress: 0,
        isPlaying: true,
      });
      setQueue((prev) => prev.slice(1));
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = currentTrack.duration
    ? (currentTrack.progress / currentTrack.duration) * 100
    : 0;

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Spotify</Text>
            <Text className="text-sm text-muted">
              {isConnected ? "🟢 Conectado" : "⚪ Desconectado"}
            </Text>
          </View>

          {/* Album Art */}
          <View className="items-center">
            <View
              style={[
                styles.albumArt,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text className="text-6xl">🎵</Text>
            </View>
          </View>

          {/* Track Info */}
          <View className="items-center gap-2">
            <Text className="text-2xl font-bold text-foreground text-center">
              {currentTrack.title}
            </Text>
            <Text className="text-base text-muted text-center">
              {currentTrack.artist}
            </Text>
            <Text className="text-sm text-muted">{currentTrack.album}</Text>
          </View>

          {/* Progress Bar */}
          <View className="gap-2">
            <View
              style={[
                styles.progressBar,
                {
                  backgroundColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">
                {formatTime(currentTrack.progress)}
              </Text>
              <Text className="text-xs text-muted">
                {formatTime(currentTrack.duration)}
              </Text>
            </View>
          </View>

          {/* Playback Controls */}
          <View className="flex-row justify-center items-center gap-8">
            <Pressable
              style={({ pressed }) => [
                styles.controlButton,
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <Text className="text-2xl">⏮</Text>
            </Pressable>

            <Pressable
              onPress={handlePlayPause}
              disabled={!isConnected}
              style={({ pressed }) => [
                styles.playButton,
                {
                  backgroundColor: colors.primary,
                  opacity: !isConnected ? 0.5 : pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-3xl">
                {isPlaying ? "⏸" : "▶"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSkip}
              disabled={!isConnected}
              style={({ pressed }) => [
                styles.controlButton,
                {
                  opacity: !isConnected ? 0.5 : pressed ? 0.6 : 1,
                },
              ]}
            >
              <Text className="text-2xl">⏭</Text>
            </Pressable>
          </View>

          {/* Secondary Controls */}
          <View className="flex-row justify-around gap-4">
            <Pressable
              style={({ pressed }) => [
                styles.playButton,
                {
                  backgroundColor: colors.primary,
                  opacity: !isConnected ? 0.5 : pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-lg">🔀</Text>
              <Text className="text-xs text-muted mt-1">Shuffle</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-lg">🔁</Text>
              <Text className="text-xs text-muted mt-1">Repeat</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-lg">❤️</Text>
              <Text className="text-xs text-muted mt-1">Like</Text>
            </Pressable>
          </View>

          {/* Connect Button */}
          <Pressable
            onPress={handleConnect}
            style={({ pressed }) => [
              styles.connectButton,
              {
                backgroundColor: isConnected ? "#EF4444" : colors.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-white font-semibold text-center">
              {isConnected ? "Desconectar do Spotify" : "Conectar ao Spotify"}
            </Text>
          </Pressable>

          {/* Queue */}
          {queue.length > 0 && (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">
                Próximas Músicas
              </Text>
              {queue.map((track, index) => (
                <View
                  key={track.id}
                  className="bg-surface rounded-lg p-4 border border-border flex-row gap-3"
                >
                  <View
                    style={[
                      styles.queueAlbumArt,
                      {
                        backgroundColor: colors.primary,
                      },
                    ]}
                  >
                    <Text className="text-xl">🎵</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      {index + 1}. {track.title}
                    </Text>
                    <Text className="text-xs text-muted">{track.artist}</Text>
                    <Text className="text-xs text-muted mt-1">
                      {formatTime(track.duration)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Connection Info */}
          {!isConnected && (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm font-semibold text-foreground mb-2">
                ℹ️ Como Conectar
              </Text>
              <Text className="text-xs text-muted leading-relaxed">
                1. Certifique-se de que o Spotify está instalado no seu iPhone{"\n"}
                2. Toque em "Conectar ao Spotify"{"\n"}
                3. Autorize o acesso na tela do Spotify{"\n"}
                4. Pronto! Agora você pode controlar a música
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  albumArt: {
    width: 240,
    height: 240,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  connectButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  queueAlbumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
