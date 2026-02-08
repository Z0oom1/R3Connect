import { ScrollView, Text, View, Pressable, StyleSheet, Animated, Image } from "react-native";
import { useEffect, useState, useRef } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useTripData } from "@/hooks/use-trip-data";
import { useBluetooth } from "@/hooks/use-bluetooth";
import { useGPS } from "@/hooks/use-gps";
import { useSpotify } from "@/hooks/use-spotify";
import { GlassCard } from "@/components/glass-card";
import { NotificationBanner } from "@/components/notification-banner";
import { TripHistoryModal } from "@/components/trip-history-modal";

export default function HomeScreen() {
  const colors = useColors();
  const [isTracking, setIsTracking] = useState(false);
  const [showTripHistory, setShowTripHistory] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message?: string;
  } | null>(null);

  const { trips, startTrip, addWaypoint, endTrip } = useTripData();
  const { isConnected: bluetoothConnected } = useBluetooth();
  const { location, permission, startTracking, stopTracking } = useGPS();
  const { currentTrack, isPlaying, togglePlayPause, isConnected: spotifyConnected, connect: connectSpotify } = useSpotify();
  const speedometerScale = useRef(new Animated.Value(1)).current;

  // Iniciar/parar rastreamento GPS real
  useEffect(() => {
    if (isTracking) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [isTracking, startTracking, stopTracking]);

  // Adicionar waypoint quando localização mudar
  useEffect(() => {
    if (isTracking && location) {
      addWaypoint(
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        location.speed
      );
    }
  }, [location, isTracking, addWaypoint]);

  const speed = location?.speed || 0;
  const speedPercentage = Math.min((speed / 200) * 100, 100);
  const rpm = Math.round((speed / 200) * 15000);

  const handleStartTracking = async () => {
    if (!isTracking && location) {
      startTrip({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setIsTracking(true);
      setNotification({
        type: "success",
        title: "Viagem Iniciada",
        message: "Rastreamento ativo",
      });
    }
  };

  const handleStopTracking = async () => {
    if (isTracking && location) {
      const trip = await endTrip({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setIsTracking(false);
      if (trip) {
        setNotification({
          type: "success",
          title: "Viagem Finalizada",
          message: `${trip.distance.toFixed(1)} km percorridos`,
        });
      }
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-5">
          {/* Notification Banner */}
          {notification && (
            <NotificationBanner
              visible={!!notification}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              onDismiss={() => setNotification(null)}
            />
          )}

          {/* Header */}
          <View className="gap-1 pt-2">
            <Text className="text-5xl font-bold text-foreground">R3 Connect</Text>
            <View className="flex-row items-center gap-2 mt-2">
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isTracking ? "#34C759" : "#8E8E93",
                  },
                ]}
              />
              <Text className="text-sm font-semibold text-muted">
                {isTracking ? "Rastreando" : "Parado"}
              </Text>
              {bluetoothConnected && (
                <>
                  <View style={{ width: 1, height: 12, backgroundColor: colors.border, marginHorizontal: 8 }} />
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: "#0066CC",
                      },
                    ]}
                  />
                  <Text className="text-sm font-semibold text-muted">
                    Conectado
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Speedometer Card - Premium Design */}
          <Animated.View
            style={[
              {
                transform: [{ scale: speedometerScale }],
              },
            ]}
          >
            <GlassCard variant="secondary">
              <View style={styles.speedometerContainer}>
                <View style={styles.speedometerContent}>
                  <Text style={styles.speedValue}>{Math.round(speed)}</Text>
                  <Text style={styles.speedUnit}>km/h</Text>
                </View>
                <View
                  style={[
                    styles.speedometerBar,
                    {
                      backgroundColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.speedometerFill,
                      {
                        width: `${speedPercentage}%`,
                        backgroundColor: speed > 150 ? "#FF3B30" : colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* RPM & Status Grid */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <GlassCard>
                <View className="gap-2">
                  <Text className="text-xs font-semibold text-muted">RPM</Text>
                  <Text className="text-3xl font-bold text-foreground">
                    {rpm.toLocaleString("pt-BR")}
                  </Text>
                  <View
                    style={[
                      styles.miniBar,
                      {
                        backgroundColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.miniBarFill,
                        {
                          width: `${(rpm / 15000) * 100}%`,
                          backgroundColor: colors.primary,
                        },
                      ]}
                    />
                  </View>
                </View>
              </GlassCard>
            </View>

            <View className="flex-1">
              <GlassCard>
                <View className="gap-2">
                  <Text className="text-xs font-semibold text-muted">COMBUSTÍVEL</Text>
                  <Text className="text-3xl font-bold text-foreground">75%</Text>
                  <Text className="text-xs text-muted">~150 km</Text>
                </View>
              </GlassCard>
            </View>
          </View>

          {/* Spotify Mini Player - Real Integration */}
          <Pressable onPress={spotifyConnected ? togglePlayPause : connectSpotify}>
            <GlassCard variant="tertiary">
              <View className="flex-row items-center gap-3">
                <View
                  style={[
                    styles.albumArt,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  {currentTrack?.albumArt ? (
                    <Image source={{ uri: currentTrack.albumArt }} style={styles.albumArtImage} />
                  ) : (
                    <Text className="text-2xl">🎵</Text>
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                    {currentTrack?.title || "Spotify"}
                  </Text>
                  <Text className="text-xs text-muted" numberOfLines={1}>
                    {currentTrack?.artist || (spotifyConnected ? "Nada tocando" : "Toque para conectar")}
                  </Text>
                </View>
                <View
                  style={[
                    styles.playButton,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <Text className="text-lg text-white">{isPlaying ? "⏸" : "▶"}</Text>
                </View>
              </View>
            </GlassCard>
          </Pressable>

          {/* Action Buttons */}
          <View className="gap-3">
            <Pressable
              onPress={isTracking ? handleStopTracking : handleStartTracking}
              disabled={!permission}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: isTracking ? "#FF3B30" : colors.primary,
                  opacity: pressed ? 0.85 : !permission ? 0.5 : 1,
                },
              ]}
            >
              <Text className="text-white font-semibold text-center text-base">
                {isTracking ? "⏹ Parar Rastreamento" : "▶ Iniciar Viagem"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowTripHistory(true)}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-foreground font-semibold text-center text-base">
                📊 Histórico ({trips.length})
              </Text>
            </Pressable>
          </View>

          {/* Location Info */}
          {location && (
            <GlassCard variant="secondary">
              <View className="gap-1">
                <Text className="text-xs font-bold text-muted mb-2">
                  LOCALIZAÇÃO REAL
                </Text>
                <Text className="text-xs text-foreground font-mono">
                  Lat: {location.latitude.toFixed(4)}
                </Text>
                <Text className="text-xs text-foreground font-mono">
                  Lon: {location.longitude.toFixed(4)}
                </Text>
                <Text className="text-xs text-foreground font-mono mt-1">
                  Velocidade: {Math.round(location.speed)} km/h
                </Text>
              </View>
            </GlassCard>
          )}
        </View>
      </ScrollView>

      {/* Trip History Modal */}
      <TripHistoryModal
        visible={showTripHistory}
        trips={trips}
        onClose={() => setShowTripHistory(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  speedometerContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  speedometerContent: {
    alignItems: "center",
  },
  speedValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#0066CC",
  },
  speedUnit: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 4,
  },
  speedometerBar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  speedometerFill: {
    height: "100%",
    borderRadius: 3,
  },
  miniBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  miniBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  albumArtImage: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});
