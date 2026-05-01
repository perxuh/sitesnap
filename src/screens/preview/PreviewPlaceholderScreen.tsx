import { StyleSheet, View } from "react-native";

import { spacing } from "../../app/theme";
import { Button } from "../../components/common/Button";
import { Screen } from "../../components/common/Screen";
import { WebsiteMockPreview } from "../../components/website-preview/WebsiteMockPreview";
import { OnboardingAnswers } from "../../types/onboarding";

type PreviewPlaceholderScreenProps = {
  answers: OnboardingAnswers;
  onBack: () => void;
  onContinue: () => void;
};

export function PreviewPlaceholderScreen({
  answers,
  onBack,
  onContinue
}: PreviewPlaceholderScreenProps) {
  return (
    <Screen
      eyebrow="Preview"
      title="Generated website direction"
      description="This Phase 2 preview now reads more like a first-pass website instead of a summary list. It is still fully local and mock-driven, but the sections now reflect how SiteSnap could shape the business into a real launch-ready layout."
    >
      <WebsiteMockPreview answers={answers} />

      <View style={styles.actions}>
        <Button label="Back" onPress={onBack} variant="secondary" />
        <Button label="Open Dashboard Shell" onPress={onContinue} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm
  }
});
