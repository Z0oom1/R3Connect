import { View, ViewProps, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";

export interface GlassCardProps extends ViewProps {
  variant?: "primary" | "secondary" | "tertiary";
  children?: React.ReactNode;
}

export function GlassCard({
  variant = "primary",
  children,
  style,
  ...props
}: GlassCardProps) {
  const colors = useColors();

  const getBackgroundColor = () => {
    switch (variant) {
      case "primary":
        return colors.surface;
      case "secondary":
        return "rgba(255, 255, 255, 0.05)";
      case "tertiary":
        return "rgba(0, 102, 204, 0.08)";
      default:
        return colors.surface;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: colors.border,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backdropFilter: "blur(20px)",
  },
});
