import { ScrollView, Text, View, Pressable, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { GlassCard } from "@/components/glass-card";

interface Route {
  id: string;
  name: string;
  distance: string;
  time: string;
  icon: string;
}

interface Favorite {
  id: string;
  name: string;
  icon: string;
}

export default function MapsScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  const [favorites] = useState<Favorite[]>([
    { id: "home", name: "Casa", icon: "🏠" },
    { id: "work", name: "Trabalho", icon: "💼" },
    { id: "track", name: "Pista", icon: "🏁" },
  ]);

  const [routes] = useState<Route[]>([
    {
      id: "1",
      name: "Av. Paulista",
      distance: "8.5 km",
      time: "12 min",
      icon: "🛣️",
    },
    {
      id: "2",
      name: "Parque Ibirapuera",
      distance: "5.2 km",
      time: "8 min",
      icon: "🌳",
    },
    {
      id: "3",
      name: "Pista de Moto",
      distance: "15.3 km",
      time: "18 min",
      icon: "🏁",
    },
  ]);

  const [recentRoutes] = useState<Route[]>([
    {
      id: "r1",
      name: "Casa → Trabalho",
      distance: "12.4 km",
      time: "18 min",
      icon: "🏠",
    },
    {
      id: "r2",
      name: "Trabalho → Pista",
      distance: "22.1 km",
      time: "28 min",
      icon: "💼",
    },
  ]);

  const handleNavigate = (route: Route) => {
    setIsNavigating(true);
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-5">
          {/* Header */}
          <View className="gap-1 pt-2">
            <Text className="text-5xl font-bold text-foreground">Navegação</Text>
            <View className="flex-row items-center gap-2 mt-2">
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isNavigating ? "#34C759" : "#8E8E93",
                  },
                ]}
              />
              <Text className="text-sm font-semibold text-muted">
                {isNavigating ? "Navegando" : "Pronto"}
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <GlassCard variant="secondary">
            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    color: colors.foreground,
                  },
                ]}
                placeholder="Buscar destino..."
                placeholderTextColor={colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Text style={styles.clearIcon}>✕</Text>
                </Pressable>
              )}
            </View>
          </GlassCard>

          {/* Navigation Status */}
          {isNavigating && (
            <GlassCard variant="tertiary">
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <View className="gap-1">
                    <Text className="text-sm font-semibold text-muted">
                      PRÓXIMA SAÍDA
                    </Text>
                    <Text className="text-2xl font-bold text-foreground">
                      Av. Paulista
                    </Text>
                  </View>
                  <Text className="text-3xl">➡️</Text>
                </View>
                <View className="flex-row justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-xs text-muted font-semibold">
                      DISTÂNCIA
                    </Text>
                    <Text className="text-xl font-bold text-foreground">
                      8.5 km
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted font-semibold">
                      TEMPO
                    </Text>
                    <Text className="text-xl font-bold text-foreground">
                      12 min
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={handleStopNavigation}
                  style={({ pressed }) => [
                    styles.stopButton,
                    {
                      backgroundColor: "#FF3B30",
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Text className="text-white font-semibold text-center">
                    Parar Navegação
                  </Text>
                </Pressable>
              </View>
            </GlassCard>
          )}

          {/* Favorites */}
          <View className="gap-2">
            <Text className="text-sm font-bold text-foreground">Favoritos</Text>
            <View className="flex-row gap-3">
              {favorites.map((fav) => (
                <Pressable
                  key={fav.id}
                  onPress={() => handleNavigate({ id: fav.id, name: fav.name, distance: "0 km", time: "0 min", icon: fav.icon })}
                  style={({ pressed }) => [
                    styles.favoriteButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={styles.favoriteIcon}>{fav.icon}</Text>
                  <Text className="text-xs font-semibold text-foreground text-center">
                    {fav.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Routes */}
          <GlassCard>
            <View className="gap-3">
              <Text className="text-sm font-bold text-foreground">
                Rotas Sugeridas
              </Text>
              {routes.map((route) => (
                <Pressable
                  key={route.id}
                  onPress={() => handleNavigate(route)}
                  style={({ pressed }) => [
                    styles.routeItem,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <Text style={styles.routeIcon}>{route.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {route.name}
                      </Text>
                      <Text className="text-xs text-muted">
                        {route.distance} • {route.time}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.arrowIcon}>›</Text>
                </Pressable>
              ))}
            </View>
          </GlassCard>

          {/* Recent Routes */}
          <GlassCard>
            <View className="gap-3">
              <Text className="text-sm font-bold text-foreground">
                Rotas Recentes
              </Text>
              {recentRoutes.map((route) => (
                <Pressable
                  key={route.id}
                  onPress={() => handleNavigate(route)}
                  style={({ pressed }) => [
                    styles.routeItem,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <Text style={styles.routeIcon}>{route.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {route.name}
                      </Text>
                      <Text className="text-xs text-muted">
                        {route.distance} • {route.time}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.arrowIcon}>›</Text>
                </Pressable>
              ))}
            </View>
          </GlassCard>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  clearIcon: {
    fontSize: 16,
    color: "#8E8E93",
  },
  stopButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  favoriteButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  routeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  routeIcon: {
    fontSize: 20,
  },
  arrowIcon: {
    fontSize: 20,
    color: "#8E8E93",
  },
});
