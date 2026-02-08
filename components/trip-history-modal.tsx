import { View, Text, ScrollView, Pressable, StyleSheet, Modal } from "react-native";
import { useColors } from "@/hooks/use-colors";
import type { TripData } from "@/hooks/use-trip-data";

export interface TripHistoryModalProps {
  visible: boolean;
  trips: TripData[];
  onClose: () => void;
  onSelectTrip?: (trip: TripData) => void;
}

export function TripHistoryModal({
  visible,
  trips,
  onClose,
  onSelectTrip,
}: TripHistoryModalProps) {
  const colors = useColors();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Histórico de Viagens
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: colors.foreground }]}>
              ✕
            </Text>
          </Pressable>
        </View>

        {/* Trips List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {trips.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateIcon]}>📭</Text>
              <Text
                style={[
                  styles.emptyStateText,
                  { color: colors.muted },
                ]}
              >
                Nenhuma viagem registrada
              </Text>
            </View>
          ) : (
            <View style={styles.tripsList}>
              {trips.map((trip) => (
                <Pressable
                  key={trip.id}
                  onPress={() => {
                    onSelectTrip?.(trip);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.tripCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View style={styles.tripHeader}>
                    <Text
                      style={[
                        styles.tripDate,
                        { color: colors.foreground },
                      ]}
                    >
                      {formatDate(trip.startTime)}
                    </Text>
                    <Text
                      style={[
                        styles.tripDuration,
                        { color: colors.muted },
                      ]}
                    >
                      {formatDuration(trip.duration)}
                    </Text>
                  </View>

                  <View style={styles.tripStats}>
                    <View style={styles.statItem}>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: colors.muted },
                        ]}
                      >
                        Distância
                      </Text>
                      <Text
                        style={[
                          styles.statValue,
                          { color: colors.foreground },
                        ]}
                      >
                        {trip.distance.toFixed(1)} km
                      </Text>
                    </View>

                    <View style={styles.statItem}>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: colors.muted },
                        ]}
                      >
                        Velocidade Média
                      </Text>
                      <Text
                        style={[
                          styles.statValue,
                          { color: colors.foreground },
                        ]}
                      >
                        {trip.averageSpeed.toFixed(1)} km/h
                      </Text>
                    </View>

                    <View style={styles.statItem}>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: colors.muted },
                        ]}
                      >
                        Velocidade Máxima
                      </Text>
                      <Text
                        style={[
                          styles.statValue,
                          { color: colors.foreground },
                        ]}
                      >
                        {trip.maxSpeed.toFixed(1)} km/h
                      </Text>
                    </View>

                    <View style={styles.statItem}>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: colors.muted },
                        ]}
                      >
                        Combustível
                      </Text>
                      <Text
                        style={[
                          styles.statValue,
                          { color: colors.foreground },
                        ]}
                      >
                        {trip.fuelConsumed.toFixed(2)} L
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tripsList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  tripCard: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tripDate: {
    fontSize: 14,
    fontWeight: "600",
  },
  tripDuration: {
    fontSize: 12,
    fontWeight: "500",
  },
  tripStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
  },
});
