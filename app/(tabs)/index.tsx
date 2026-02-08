import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

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
            setLocation({
              speed: Math.round(speed * 10) / 10,
              heading: loc.coords.heading || 0,
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
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
  }, [isTracking, permission]);

  const speed = location?.speed || 0;
  const speedPercentage = Math.min((speed / 200) * 100, 100);

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">R3 Connect Plus</Text>
            <Text className="text-sm text-muted">
              {isTracking ? "🟢 Rastreando" : "⚪ Parado"}
            </Text>
          </View>

          {/* Velocímetro Digital */}
          <View className="items-center gap-4">
            <View
              style={[
                styles.speedometer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Velocímetro Circular */}
              <View
                style={[
                  styles.speedometerCircle,
                  {
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Agulha */}
                <View
                  style={[
                    styles.needle,
                    {
                      backgroundColor: speed > 150 ? "#EF4444" : colors.primary,
                      transform: [
                        {
                          rotate: `${(speedPercentage / 100) * 180 - 90}deg`,
                        },
                      ],
                    },
                  ]}
                />

                {/* Velocidade Central */}
                <View className="items-center justify-center">
                  <Text className="text-5xl font-bold text-foreground">
                    {Math.round(speed)}
                  </Text>
                  <Text className="text-sm text-muted">km/h</Text>
                </View>
              </View>

              {/* Marcas de velocidade */}
              <View className="flex-row justify-between w-full px-4 mt-2">
                <Text className="text-xs text-muted">0</Text>
                <Text className="text-xs text-muted">100</Text>
                <Text className="text-xs text-muted">200</Text>
              </View>
            </View>

            {/* RPM Simulado */}
            <View className="w-full bg-surface rounded-lg p-4 border border-border">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-semibold text-foreground">RPM</Text>
                <Text className="text-lg font-bold text-primary">
                  {Math.round((speed / 200) * 15000)}
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
                      width: `${speedPercentage}%`,
                      backgroundColor: speed > 150 ? "#EF4444" : colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Mini Player Spotify */}
          <View className="bg-surface rounded-lg p-4 border border-border">
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
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-lg">▶</Text>
              </Pressable>
            </View>
          </View>

          {/* Status Cards */}
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-xs text-muted mb-1">Combustível</Text>
                <Text className="text-2xl font-bold text-foreground">75%</Text>
                <Text className="text-xs text-muted mt-1">~150 km</Text>
              </View>
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-xs text-muted mb-1">Temperatura</Text>
                <Text className="text-2xl font-bold text-foreground">68°C</Text>
                <Text className="text-xs text-muted mt-1">Normal</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-xs text-muted mb-1">Bateria</Text>
                <Text className="text-2xl font-bold text-foreground">12.6V</Text>
                <Text className="text-xs text-muted mt-1">OK</Text>
              </View>
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-xs text-muted mb-1">Bluetooth</Text>
                <Text className="text-2xl font-bold text-foreground">⚪</Text>
                <Text className="text-xs text-muted mt-1">Desconectado</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <Pressable
              onPress={() => setIsTracking(!isTracking)}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: isTracking ? "#EF4444" : colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-white font-semibold text-center">
                {isTracking ? "Parar Rastreamento" : "Iniciar Viagem"}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-foreground font-semibold text-center">
                Histórico de Viagens
              </Text>
            </Pressable>
          </View>

          {/* Location Info */}
          {location && (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs font-semibold text-muted mb-2">
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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  speedometer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  speedometerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 3,
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
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
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
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
