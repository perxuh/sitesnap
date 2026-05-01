import { Pressable, StyleSheet, Text } from "react-native";

import { colors, spacing } from "../../app/theme";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        pressed && !disabled && (variant === "primary" ? styles.primaryPressed : styles.secondaryPressed),
        disabled && styles.disabled
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "secondary" && styles.secondaryLabel,
          disabled && styles.disabledLabel
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: 16,
    minHeight: 54,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  primary: {
    backgroundColor: colors.primary
  },
  primaryPressed: {
    backgroundColor: colors.primaryPressed
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1
  },
  secondaryPressed: {
    backgroundColor: colors.surfaceMuted
  },
  label: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "800"
  },
  secondaryLabel: {
    color: colors.text
  },
  disabled: {
    opacity: 0.45
  },
  disabledLabel: {
    color: colors.textMuted
  }
});
