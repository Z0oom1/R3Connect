import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useTripData } from "@/hooks/use-trip-data";
import { useTelemetry } from "@/hooks/use-telemetry";
import { useSettings } from "@/hooks/use-settings";
import { NotificationBanner } from "@/components/notification-banner";
import { TripHistoryModal } from "@/components/trip-history-modal";

interface LocationData {
  speed: number;
  heading: number;
  latitude: number;
  longitude: number;
}

export default function HomeScreen() {
  const colors = useColors();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const [showTripHistory, setShowTripHistory] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message?: string;
  } | null>(null);

  const { trips, startTrip, addWaypoint, endTrip } = useTripData();
  const { isConnected: telemetryConnected, addSnapshot } = useTelemetry();
  const { settings } = useSettings();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      if (permission) {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (loc: Location.LocationObject) => {
            const speed = (loc.coords.speed || 0) * 3.6; // m/s to km/h
            const newLocation = {
              speed: Math.round(speed * 10) / 10,
              heading: loc.coords.heading || 0,
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            setLocation(newLocation);

            // Adicionar waypoint se estiver rastreando
            if (isTracking) {
              addWaypoint(
                {
                  latitude: newLocation.latitude,
                  longitude: newLocation.longitude,
                },
                newLocation.speed
              );
            }
          }
        );
      }
    };

    if (isTracking && permission) {
      startTracking();
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isTracking, permission, addWaypoint]);

  // Simular telemetria quando conectado
  useEffect(() => {
    if (!telemetryConnected) return;

    const interval = setInterval(() => {
      const temperature = Math.random() * 40 + 50;
      const rpm = Math.random() * 15000;
      const fuel = Math.random() * 100;
      const battery = Math.random() * 3 + 11;
      const pressure = Math.random() * 1 + 1.5;

      addSnapshot({ temperature, rpm, fuel, battery, pressure });

      // Verificar alertas
      if (temperature > settings.temperatureAlertThreshold) {
        setNotification({
          type: "warning",
          title: "Temperatura Alta",
          message: `Motor em ${Math.round(temperature)}°C`,
        });
      }

      if (fuel < settings.fuelAlertThreshold) {
        setNotification({
          type: "warning",
          title: "Combustível Baixo",
          message: `Apenas ${Math.round(fuel)}% de combustível`,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [telemetryConnected, addSnapshot, settings]);

  const speed = location?.speed || 0;
  const speedPercentage = Math.min((speed / 200) * 100, 100);
  const rpm = Math.round((speed / 200) * 15000);
  const rpmPercentage = Math.min((rpm / 15000) * 100, 100);

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
        <View className="flex-1 gap-6">
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

          {/* Header com Status */}
          <View className="gap-2 pt-2">
            <Text className="text-4xl font-bold text-foreground">R3 Connect</Text>
            <View className="flex-row items-center gap-2">
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
              {telemetryConnected && (
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
                    Telemetria
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Velocímetro Digital - iOS 26 Style */}
          <View className="items-center gap-4">
            <View
              style={[
                styles.speedometerContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Velocímetro Circular com Gradiente */}
              <View
                style={[
                  styles.speedometerCircle,
                  {
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Agulha Animada */}
                <View
                  style={[
                    styles.needle,
                    {
                      backgroundColor: speed > 150 ? "#FF3B30" : colors.primary,
                      transform: [
                        {
                          rotate: `${(speedPercentage / 100) * 180 - 90}deg`,
                        },
                      ],
                    },
                  ]}
                />

                {/* Centro do Velocímetro */}
                <View className="items-center justify-center">
                  <Text className="text-6xl font-bold text-foreground">
                    {Math.round(speed)}
                  </Text>
                  <Text className="text-xs font-semibold text-muted">km/h</Text>
                </View>
              </View>

              {/* Marcas de Velocidade */}
              <View className="flex-row justify-between w-full px-6 mt-3">
                <Text className="text-xs font-semibold text-muted">0</Text>
                <Text className="text-xs font-semibold text-muted">100</Text>
                <Text className="text-xs font-semibold text-muted">200</Text>
              </View>
            </View>

            {/* RPM com Barra de Progresso Moderna */}
            <View
              style={[
                styles.rpmCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm font-semibold text-foreground">RPM</Text>
                <Text className="text-lg font-bold text-primary">
                  {rpm.toLocaleString('pt-BR')}
                </Text>
              </View>
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
                      width: `${rpmPercentage}%`,
                      backgroundColor: speed > 150 ? "#FF3B30" : colors.primary,
                    },
                  ]}
                />
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-xs text-muted">0</Text>
                <Text className="text-xs text-muted">15000</Text>
              </View>
            </View>
          </View>

          {/* Mini Player Spotify - Glassmorphism */}
          <Pressable
            style={({ pressed }) => [
              styles.spotifyCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View className="flex-row items-center gap-3">
              <View
                style={[
                  styles.albumArt,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Text className="text-2xl">🎵</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">
                  Spotify
                </Text>
                <Text className="text-xs text-muted">Toque para conectar</Text>
              </View>
              <View
                style={[
                  styles.playButton,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Text className="text-lg">▶</Text>
              </View>
            </View>
          </Pressable>

          {/* Status Cards - Grid 2x2 */}
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View
                className="flex-1"
                style={[
                  styles.statusCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text className="text-xs font-semibold text-muted mb-2">Combustível</Text>
                <Text className="text-2xl font-bold text-foreground">75%</Text>
                <Text className="text-xs text-muted mt-2">~150 km</Text>
              </View>
              <View
                className="flex-1"
                style={[
                  styles.statusCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text className="text-xs font-semibold text-muted mb-2">Temperatura</Text>
                <Text className="text-2xl font-bold text-foreground">68°C</Text>
                <Text className="text-xs text-muted mt-2">Normal</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <View
                className="flex-1"
                style={[
                  styles.statusCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text className="text-xs font-semibold text-muted mb-2">Bateria</Text>
                <Text className="text-2xl font-bold text-foreground">12.6V</Text>
                <Text className="text-xs text-muted mt-2">OK</Text>
              </View>
              <View
                className="flex-1"
                style={[
                  styles.statusCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text className="text-xs font-semibold text-muted mb-2">Bluetooth</Text>
                <Text className="text-2xl font-bold text-foreground">🔵</Text>
                <Text className="text-xs text-muted mt-2">Desconectado</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <Pressable
              onPress={isTracking ? handleStopTracking : handleStartTracking}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: isTracking ? "#FF3B30" : colors.primary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text className="text-white font-semibold text-center text-base">
                {isTracking ? "Parar Rastreamento" : "Iniciar Viagem"}
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
                Histórico de Viagens ({trips.length})
              </Text>
            </Pressable>
          </View>

          {/* Location Info */}
          {location && (
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text className="text-xs font-bold text-muted mb-2">
                LOCALIZAÇÃO
              </Text>
              <Text className="text-xs text-foreground font-mono">
                Lat: {location.latitude.toFixed(6)}
              </Text>
              <Text className="text-xs text-foreground font-mono">
                Lon: {location.longitude.toFixed(6)}
              </Text>
              <Text className="text-xs text-foreground font-mono mt-1">
                Rumo: {Math.round(location.heading)}°
              </Text>
            </View>
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
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  speedometerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  needle: {
    position: "absolute",
    width: 4,
    height: 100,
    borderRadius: 2,
    bottom: "50%",
  },
  rpmCard: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
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
  spotifyCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statusCard: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
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
  infoCard: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
});
