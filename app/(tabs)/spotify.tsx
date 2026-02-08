import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
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
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2 pt-2">
            <Text className="text-4xl font-bold text-foreground">Spotify</Text>
            <View className="flex-row items-center gap-2">
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isConnected ? "#34C759" : "#8E8E93",
                  },
                ]}
              />
              <Text className="text-sm font-semibold text-muted">
                {isConnected ? "Conectado" : "Desconectado"}
              </Text>
            </View>
          </View>

          {/* Album Art - iOS 26 Style com Sombra */}
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

          {/* Progress Bar Moderna */}
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
              <Text className="text-xs text-muted font-semibold">
                {formatTime(currentTrack.progress)}
              </Text>
              <Text className="text-xs text-muted font-semibold">
                {formatTime(currentTrack.duration)}
              </Text>
            </View>
          </View>

          {/* Playback Controls - iOS 26 Style */}
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
                  opacity: !isConnected ? 0.5 : pressed ? 0.85 : 1,
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
          <View className="flex-row gap-3">
            <Pressable
              style={({ pressed }) => [
                styles.secondaryControlButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: !isConnected ? 0.5 : pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-lg">🔀</Text>
              <Text className="text-xs text-muted mt-1 font-semibold">Shuffle</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryControlButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-lg">🔁</Text>
              <Text className="text-xs text-muted mt-1 font-semibold">Repeat</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryControlButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-lg">❤️</Text>
              <Text className="text-xs text-muted mt-1 font-semibold">Like</Text>
            </Pressable>
          </View>

          {/* Connect Button */}
          <Pressable
            onPress={handleConnect}
            style={({ pressed }) => [
              styles.connectButton,
              {
                backgroundColor: isConnected ? "#FF3B30" : colors.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text className="text-white font-semibold text-center text-base">
              {isConnected ? "Desconectar do Spotify" : "Conectar ao Spotify"}
            </Text>
          </Pressable>

          {/* Queue */}
          {queue.length > 0 && (
            <View className="gap-3">
              <Text className="text-sm font-bold text-foreground">
                Próximas Músicas
              </Text>
              {queue.map((track, index) => (
                <View
                  key={track.id}
                  style={[
                    styles.queueItem,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.queueAlbumArt,
                      {
                        backgroundColor: colors.primary,
                      },
                    ]}
                  >
                    <Text className="text-lg">🎵</Text>
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
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text className="text-sm font-bold text-foreground mb-2">
                ℹ️ Como Conectar
              </Text>
              <Text className="text-xs text-muted leading-relaxed">
                1. Certifique-se de que o Spotify está instalado{"\n"}
                2. Toque em &quot;Conectar ao Spotify&quot;{"\n"}
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  albumArt: {
    width: 240,
    height: 240,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryControlButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  connectButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  queueAlbumArt: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
});
