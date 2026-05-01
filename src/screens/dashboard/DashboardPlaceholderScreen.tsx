import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../../app/theme";
import { Button } from "../../components/common/Button";
import { Screen } from "../../components/common/Screen";

type DashboardPlaceholderScreenProps = {
  onBack: () => void;
};

const dashboardCards = [
  "Website status",
  "Domain status",
  "Recent leads",
  "Suggested improvements"
];

export function DashboardPlaceholderScreen({
  onBack
}: DashboardPlaceholderScreenProps) {
  return (
    <Screen
      eyebrow="Dashboard"
      title="The owner dashboard starts here."
      description="This placeholder keeps Phase 1 focused while giving us a clear landing point for the future live-site management experience."
    >
      <View style={styles.grid}>
        {dashboardCards.map((card) => (
          <View key={card} style={styles.card}>
            <Text style={styles.cardTitle}>{card}</Text>
            <Text style={styles.cardText}>Coming in a later phase.</Text>
          </View>
        ))}
      </View>

      <Button label="Back to Preview" onPress={onBack} variant="secondary" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing.lg
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.xs
  },
  cardText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22
  }
});
