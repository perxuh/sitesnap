import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../app/theme";

type SiteSnapMarkProps = {
  compact?: boolean;
};

export function SiteSnapMark({ compact = false }: SiteSnapMarkProps) {
  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <View style={styles.badge}>
        <View style={styles.badgeGlow} />
        <Text style={styles.badgeText}>S</Text>
      </View>
      <View>
        <Text style={[styles.wordmark, compact && styles.wordmarkCompact]}>SiteSnap</Text>
        <Text style={styles.caption}>AI website builder</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14
  },
  rowCompact: {
    gap: 10
  },
  badge: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    height: 56,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: 56
  },
  badgeGlow: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 30,
    opacity: 0.25,
    position: "absolute",
    width: 30
  },
  badgeText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800"
  },
  wordmark: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.2
  },
  wordmarkCompact: {
    fontSize: 22
  },
  caption: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2
  }
});
