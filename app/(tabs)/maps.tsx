import { ScrollView, Text, View, Pressable, StyleSheet, TextInput } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Route {
  id: string;
  destination: string;
  distance: string;
  time: string;
  active: boolean;
}

export default function MapsScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [routes, setRoutes] = useState<Route[]>([
    {
      id: "1",
      destination: "Casa",
      distance: "12.5 km",
      time: "18 min",
      active: false,
    },
    {
      id: "2",
      destination: "Trabalho",
      distance: "8.3 km",
      time: "12 min",
      active: false,
    },
    {
      id: "3",
      destination: "Pista de Moto",
      distance: "45 km",
      time: "35 min",
      active: false,
    },
  ]);

  const [favorites] = useState([
    { id: "home", name: "Casa", icon: "🏠" },
    { id: "work", name: "Trabalho", icon: "💼" },
    { id: "track", name: "Pista", icon: "🏁" },
  ]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  const handleStartNavigation = (destination: string) => {
    setIsNavigating(true);
    setRoutes((prev) =>
      prev.map((route) => ({
        ...route,
        active: route.destination === destination,
      }))
    );
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    setRoutes((prev) => prev.map((route) => ({ ...route, active: false })));
  };

  const activeRoute = routes.find((r) => r.active);

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2 pt-2">
            <Text className="text-4xl font-bold text-foreground">Navegação</Text>
            <View className="flex-row items-center gap-2">
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isNavigating ? "#34C759" : "#8E8E93",
                  },
                ]}
              />
              <Text className="text-sm font-semibold text-muted">
                {isNavigating ? "Navegando" : "Parado"}
              </Text>
            </View>
          </View>

          {/* Map Preview - iOS 26 Style */}
          <View
            style={[
              styles.mapPreview,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View className="flex-1 justify-center items-center gap-2">
              <Text className="text-5xl">🗺️</Text>
              <Text className="text-sm font-semibold text-muted text-center">
                Mapbox GL
              </Text>
              {currentLocation && (
                <Text className="text-xs text-muted text-center font-mono">
                  {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                </Text>
              )}
            </View>

            {/* Map Controls */}
            <View className="absolute top-4 right-4 gap-2">
              <Pressable
                style={({ pressed }) => [
                  styles.mapButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-lg">➕</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.mapButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-lg">➖</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.mapButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-lg">📍</Text>
              </Pressable>
            </View>
          </View>

          {/* Search Bar - iOS 26 Style */}
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text className="text-lg mr-2">🔍</Text>
            <TextInput
              placeholder="Procurar destino..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[
                styles.searchInput,
                {
                  color: colors.foreground,
                },
              ]}
            />
          </View>

          {/* Active Navigation */}
          {isNavigating && activeRoute && (
            <View
              style={[
                styles.activeNavigation,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-bold text-lg">
                    {activeRoute.destination}
                  </Text>
                  <Text className="text-white opacity-90 text-sm">
                    {activeRoute.distance} • {activeRoute.time}
                  </Text>
                </View>
                <Text className="text-3xl">📍</Text>
              </View>

              <Pressable
                onPress={handleStopNavigation}
                style={({ pressed }) => [
                  styles.stopButton,
                  {
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-white font-semibold text-center text-sm">
                  Parar Navegação
                </Text>
              </Pressable>
            </View>
          )}

          {/* Favorites */}
          <View className="gap-3">
            <Text className="text-sm font-bold text-foreground">
              Favoritos
            </Text>
            <View className="flex-row gap-3">
              {favorites.map((fav) => (
                <Pressable
                  key={fav.id}
                  onPress={() => handleStartNavigation(fav.name)}
                  style={({ pressed }) => [
                    styles.favoriteButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text className="text-2xl">{fav.icon}</Text>
                  <Text className="text-xs text-foreground mt-1 text-center font-semibold">
                    {fav.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Recent Routes */}
          <View className="gap-3">
            <Text className="text-sm font-bold text-foreground">
              Rotas Recentes
            </Text>
            {routes.map((route) => (
              <Pressable
                key={route.id}
                onPress={() => handleStartNavigation(route.destination)}
                style={({ pressed }) => [
                  styles.routeCard,
                  {
                    backgroundColor: route.active ? colors.primary : colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View className="flex-1">
                  <Text
                    className={`font-semibold ${
                      route.active ? "text-white" : "text-foreground"
                    }`}
                  >
                    {route.destination}
                  </Text>
                  <Text
                    className={`text-sm ${
                      route.active ? "text-white opacity-90" : "text-muted"
                    }`}
                  >
                    {route.distance} • {route.time}
                  </Text>
                </View>
                <Text className="text-lg font-semibold">
                  {route.active ? "✓" : "→"}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Info Box */}
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
              ℹ️ Sobre Mapas
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              • Navegação otimizada para motos{"\n"}
              • Evitar rodovias (configurável){"\n"}
              • Histórico de viagens automático{"\n"}
              • Offline com cache de mapas
            </Text>
          </View>
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
  mapPreview: {
    height: 300,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  activeNavigation: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 12,
  },
  stopButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    borderRadius: 12,
  },
  favoriteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  routeCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  infoBox: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
});
