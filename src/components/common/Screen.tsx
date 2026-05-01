import { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../../app/theme";

type ScreenProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function Screen({ eyebrow, title, description, children }: ScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.body}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38
  },
  description: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm
  },
  body: {
    marginTop: spacing.lg,
    gap: spacing.md
  }
});
