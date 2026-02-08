import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useColors } from "@/hooks/use-colors";

export interface BluetoothConnectionAnimationProps {
  isConnecting: boolean;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function BluetoothConnectionAnimation({
  isConnecting,
  isConnected,
  onConnect,
  onDisconnect,
}: BluetoothConnectionAnimationProps) {
  const colors = useColors();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isConnecting) {
      // Animação de conexão
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        ),
      ]).start();
    } else {
      scaleAnim.setValue(1);
      opacityAnim.setValue(1);
      rotateAnim.setValue(0);
    }
  }, [isConnecting, scaleAnim, opacityAnim, rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {isConnecting && (
        <Animated.View
          style={[
            styles.pulseContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View
            style={[
              styles.pulseRing,
              {
                borderColor: colors.primary,
              },
            ]}
          />
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
      >
        <Text style={styles.icon}>
          {isConnected ? "🔵" : isConnecting ? "🔄" : "⚪"}
        </Text>
      </Animated.View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.statusText,
            {
              color: isConnected
                ? "#34C759"
                : isConnecting
                  ? colors.primary
                  : colors.muted,
            },
          ]}
        >
          {isConnected
            ? "Conectado à Moto"
            : isConnecting
              ? "Conectando..."
              : "Desconectado"}
        </Text>
      </View>

      <Pressable
        onPress={isConnected ? onDisconnect : onConnect}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: isConnected ? "#FF3B30" : colors.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={styles.buttonText}>
          {isConnected ? "Desconectar" : "Conectar"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 24,
  },
  pulseContainer: {
    position: "absolute",
    width: 120,
    height: 120,
  },
  pulseRing: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    borderWidth: 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  icon: {
    fontSize: 48,
  },
  textContainer: {
    marginTop: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
