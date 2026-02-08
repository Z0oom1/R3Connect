import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface TelemetryData {
  temperature: number;
  rpm: number;
  fuel: number;
  battery: number;
  pressure: number;
}

export default function TelemetryScreen() {
  const colors = useColors();
  const [isConnected, setIsConnected] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    temperature: 68,
    rpm: 2500,
    fuel: 75,
    battery: 12.6,
    pressure: 2.0,
  });

  // Simular variação de dados
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        temperature: Math.min(
          Math.max(prev.temperature + (Math.random() - 0.5) * 4, 50),
          95
        ),
        rpm: Math.max(
          Math.min(prev.rpm + (Math.random() - 0.5) * 500, 15000),
          800
        ),
        fuel: Math.max(Math.min(prev.fuel + (Math.random() - 0.5) * 0.5, 100), 0),
        battery: Math.max(
          Math.min(prev.battery + (Math.random() - 0.5) * 0.1, 14),
          11
        ),
        pressure: Math.max(
          Math.min(prev.pressure + (Math.random() - 0.5) * 0.05, 2.5),
          1.5
        ),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const getTemperatureStatus = () => {
    if (telemetry.temperature < 50) return { text: "Frio", color: "#0066CC" };
    if (telemetry.temperature < 80) return { text: "Normal", color: "#22C55E" };
    if (telemetry.temperature < 90) return { text: "Quente", color: "#F59E0B" };
    return { text: "Crítico", color: "#EF4444" };
  };

  const getFuelStatus = () => {
    if (telemetry.fuel > 50) return { text: "Cheio", color: "#22C55E" };
    if (telemetry.fuel > 25) return { text: "Médio", color: "#F59E0B" };
    return { text: "Baixo", color: "#EF4444" };
  };

  const getBatteryStatus = () => {
    if (telemetry.battery > 12) return { text: "OK", color: "#22C55E" };
    if (telemetry.battery > 11.5) return { text: "Baixa", color: "#F59E0B" };
    return { text: "Crítica", color: "#EF4444" };
  };

  const tempStatus = getTemperatureStatus();
  const fuelStatus = getFuelStatus();
  const batteryStatus = getBatteryStatus();

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Telemetria</Text>
            <Text className="text-sm text-muted">
              {isConnected ? "🟢 Conectado" : "⚪ Desconectado"}
            </Text>
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
              {isConnected ? "Desconectar da Moto" : "Conectar à Moto (Bluetooth)"}
            </Text>
          </Pressable>

          {/* Temperature Card */}
          <View
            style={[
              styles.telemetryCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View className="flex-row justify-between items-start mb-3">
              <View>
                <Text className="text-sm text-muted mb-1">Temperatura do Motor</Text>
                <Text className="text-3xl font-bold text-foreground">
                  {Math.round(telemetry.temperature)}°C
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: tempStatus.color,
                  },
                ]}
              >
                <Text className="text-white text-xs font-semibold">
                  {tempStatus.text}
                </Text>
              </View>
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
                    width: `${(telemetry.temperature / 100) * 100}%`,
                    backgroundColor: tempStatus.color,
                  },
                ]}
              />
            </View>
          </View>

          {/* RPM Card */}
          <View
            style={[
              styles.telemetryCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View className="flex-row justify-between items-start mb-3">
              <View>
                <Text className="text-sm text-muted mb-1">RPM</Text>
                <Text className="text-3xl font-bold text-foreground">
                  {Math.round(telemetry.rpm / 100) * 100}
                </Text>
              </View>
              <Text className="text-xs text-muted">/ 15000</Text>
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
                    width: `${(telemetry.rpm / 15000) * 100}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          </View>

          {/* Fuel Card */}
          <View
            style={[
              styles.telemetryCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View className="flex-row justify-between items-start mb-3">
              <View>
                <Text className="text-sm text-muted mb-1">Combustível</Text>
                <Text className="text-3xl font-bold text-foreground">
                  {Math.round(telemetry.fuel)}%
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: fuelStatus.color,
                  },
                ]}
              >
                <Text className="text-white text-xs font-semibold">
                  {fuelStatus.text}
                </Text>
              </View>
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
                    width: `${telemetry.fuel}%`,
                    backgroundColor: fuelStatus.color,
                  },
                ]}
              />
            </View>
            <Text className="text-xs text-muted mt-2">
              ~{Math.round(telemetry.fuel * 1.5)} km de autonomia
            </Text>
          </View>

          {/* Battery & Pressure */}
          <View className="flex-row gap-3">
            <View
              className="flex-1"
              style={[
                styles.telemetryCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text className="text-sm text-muted mb-2">Bateria</Text>
              <Text className="text-2xl font-bold text-foreground mb-2">
                {telemetry.battery.toFixed(1)}V
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: batteryStatus.color,
                  },
                ]}
              >
                <Text className="text-white text-xs font-semibold">
                  {batteryStatus.text}
                </Text>
              </View>
            </View>

            <View
              className="flex-1"
              style={[
                styles.telemetryCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text className="text-sm text-muted mb-2">Pressão Pneu</Text>
              <Text className="text-2xl font-bold text-foreground mb-2">
                {telemetry.pressure.toFixed(1)} bar
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Text className="text-white text-xs font-semibold">OK</Text>
              </View>
            </View>
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
            <Text className="text-sm font-semibold text-foreground mb-2">
              ℹ️ Sobre Telemetria
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              • Dados em tempo real via Bluetooth{"\n"}• Histórico de 24 horas{"\n"}•
              Alertas automáticos{"\n"}• Requer moto com CCU Yamaha
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  connectButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  telemetryCard: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
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
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  infoBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
});
