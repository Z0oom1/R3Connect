import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useColors } from "@/hooks/use-colors";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationBannerProps {
  type: NotificationType;
  title: string;
  message?: string;
  visible: boolean;
  onDismiss?: () => void;
  duration?: number; // em ms, 0 = manual dismiss
}

export function NotificationBanner({
  type,
  title,
  message,
  visible,
  onDismiss,
  duration = 3000,
}: NotificationBannerProps) {
  const colors = useColors();
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const dismissNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss?.();
    });
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          dismissNotification();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, duration, slideAnim]);

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#34C759";
      case "error":
        return "#FF3B30";
      case "warning":
        return "#FF9500";
      case "info":
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "•";
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.banner,
          {
            backgroundColor: getBackgroundColor(),
          },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.icon}>{getIcon()}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
          </View>
        </View>
        {duration === 0 && (
          <Pressable onPress={dismissNotification} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  icon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  message: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
