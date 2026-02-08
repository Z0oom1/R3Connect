import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useSpotify } from "@/hooks/use-spotify";
import { GlassCard } from "@/components/glass-card";

export default function SpotifyScreen() {
  const colors = useColors();
  const {
    isConnected,
    isPlaying,
    currentTrack,
    queue,
    connect,
    disconnect,
    togglePlayPause,
    skipToNext,
  } = useSpotify();

  // Atualizar progresso da música
  useEffect(() => {
    if (!isPlaying || !isConnected || !currentTrack) return;

    const interval = setInterval(() => {
      if (currentTrack.progress >= currentTrack.duration) {
        skipToNext();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isConnected, currentTrack, skipToNext]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-5">
          {/* Header */}
          <View className="gap-1 pt-2">
            <Text className="text-5xl font-bold text-foreground">Spotify</Text>
            <View className="flex-row items-center gap-2 mt-2">
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isConnected ? "#1DB954" : "#8E8E93",
                  },
                ]}
              />
              <Text className="text-sm font-semibold text-muted">
                {isConnected ? "Conectado" : "Desconectado"}
              </Text>
            </View>
          </View>

          {/* Connection Card */}
          {!isConnected ? (
            <GlassCard variant="secondary">
              <View className="gap-4">
                <View className="items-center gap-2">
                  <Text className="text-4xl">🎵</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    Conectar ao Spotify
                  </Text>
                  <Text className="text-xs text-muted text-center">
                    Controle sua música enquanto pilota
                  </Text>
                </View>
                <Pressable
                  onPress={connect}
                  style={({ pressed }) => [
                    styles.connectButton,
                    {
                      backgroundColor: "#1DB954",
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Text className="text-white font-semibold text-center">
                    Conectar ao Spotify
                  </Text>
                </Pressable>
              </View>
            </GlassCard>
          ) : (
            <>
              {/* Now Playing Card */}
              <GlassCard variant="tertiary">
                <View className="gap-4">
                  {/* Album Art */}
                  <View style={styles.albumArtContainer}>
                    <View
                      style={[
                        styles.albumArt,
                        {
                          backgroundColor: colors.primary,
                        },
                      ]}
                    >
                      <Text style={styles.albumArtText}>🎵</Text>
                    </View>
                  </View>

                  {/* Song Info */}
                  <View className="gap-1">
                    <Text className="text-xs font-semibold text-muted">
                      TOCANDO AGORA
                    </Text>
                    <Text className="text-2xl font-bold text-foreground">
                      {currentTrack?.title || "Nenhuma música"}
                    </Text>
                    <Text className="text-sm text-muted font-semibold">
                      {currentTrack?.artist || "Desconectado"}
                    </Text>
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
                            width: `${currentTrack ? (currentTrack.progress / currentTrack.duration) * 100 : 0}%`,
                            backgroundColor: "#1DB954",
                          },
                        ]}
                      />
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted font-semibold">
                        {currentTrack ? formatTime(currentTrack.progress) : "0:00"}
                      </Text>
                      <Text className="text-xs text-muted font-semibold">
                        {currentTrack ? formatTime(currentTrack.duration) : "0:00"}
                      </Text>
                    </View>
                  </View>

                  {/* Controls */}
                  <View className="flex-row justify-center gap-6 mt-2">
                    <Pressable
                      onPress={() => {}}
                      style={({ pressed }) => [
                        styles.controlButton,
                        { opacity: pressed ? 0.6 : 1 },
                      ]}
                    >
                      <Text style={styles.controlIcon}>⏮</Text>
                    </Pressable>

                    <Pressable
                      onPress={togglePlayPause}
                      style={({ pressed }) => [
                        styles.playButton,
                        {
                          backgroundColor: "#1DB954",
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                    >
                      <Text style={styles.playIcon}>
                        {isPlaying ? "⏸" : "▶"}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={skipToNext}
                      style={({ pressed }) => [
                        styles.controlButton,
                        { opacity: pressed ? 0.6 : 1 },
                      ]}
                    >
                      <Text style={styles.controlIcon}>⏭</Text>
                    </Pressable>
                  </View>

                  {/* Secondary Controls */}
                  <View className="flex-row justify-between gap-2 mt-4">
                    <Pressable
                      style={({ pressed }) => [
                        styles.secondaryControl,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                    >
                      <Text style={styles.secondaryIcon}>🔀</Text>
                      <Text className="text-xs font-semibold text-foreground">
                        Shuffle
                      </Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.secondaryControl,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                    >
                      <Text style={styles.secondaryIcon}>🔁</Text>
                      <Text className="text-xs font-semibold text-foreground">
                        Repeat
                      </Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.secondaryControl,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                    >
                      <Text style={styles.secondaryIcon}>❤️</Text>
                      <Text className="text-xs font-semibold text-foreground">
                        Like
                      </Text>
                    </Pressable>
                  </View>

                  {/* Disconnect Button */}
                  <Pressable
                    onPress={disconnect}
                    style={({ pressed }) => [
                      styles.disconnectButton,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text className="text-foreground font-semibold text-center">
                      Desconectar
                    </Text>
                  </Pressable>
                </View>
              </GlassCard>

              {/* Queue */}
              {queue.length > 0 && (
                <GlassCard>
                  <View className="gap-3">
                    <Text className="text-sm font-bold text-foreground">
                      Próximas Músicas
                    </Text>
                    {queue.slice(0, 3).map((song, index) => (
                      <View
                        key={song.id}
                        style={[
                          styles.queueItem,
                          {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.queueNumber,
                            {
                              backgroundColor: colors.primary,
                            },
                          ]}
                        >
                          <Text className="text-white text-xs font-bold">
                            {index + 1}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-foreground">
                            {song.title}
                          </Text>
                          <Text className="text-xs text-muted">
                            {song.artist}
                          </Text>
                        </View>
                        <Text className="text-xs text-muted font-semibold">
                          {formatTime(song.duration)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </GlassCard>
              )}
            </>
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
  connectButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  albumArtContainer: {
    alignItems: "center",
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  albumArtText: {
    fontSize: 80,
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
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  controlIcon: {
    fontSize: 24,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    fontSize: 28,
    color: "white",
  },
  secondaryControl: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
  },
  secondaryIcon: {
    fontSize: 18,
  },
  disconnectButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  queueNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
