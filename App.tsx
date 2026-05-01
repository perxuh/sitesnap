import { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";

import { colors } from "./src/app/theme";
import { Button } from "./src/components/common/Button";
import { DashboardPlaceholderScreen } from "./src/screens/dashboard/DashboardPlaceholderScreen";
import { WelcomeScreen } from "./src/screens/onboarding/WelcomeScreen";
import { PreviewPlaceholderScreen } from "./src/screens/preview/PreviewPlaceholderScreen";
import { AppScreen, screenOrder } from "./src/types/navigation";
import { OnboardingAnswers } from "./src/types/onboarding";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("welcome");
  const [welcomeKey, setWelcomeKey] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>({});

  const currentIndex = screenOrder.indexOf(currentScreen) + 1;

  const resetToWelcome = () => {
    setOnboardingAnswers({});
    setWelcomeKey((current) => current + 1);
    setCurrentScreen("welcome");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.app, currentScreen === "welcome" && styles.welcomeApp]}>
        {currentScreen !== "welcome" ? (
          <View style={styles.progressRow}>
            {screenOrder.map((screenName, index) => (
              <View
                key={screenName}
                style={[
                  styles.progressSegment,
                  index <= currentIndex - 1 && styles.progressSegmentActive
                ]}
              />
            ))}
          </View>
        ) : null}

        <View style={styles.content}>
          {currentScreen === "welcome" && (
            <WelcomeScreen
              key={welcomeKey}
              onContinue={(answers) => {
                setOnboardingAnswers(answers);
                setCurrentScreen("preview");
              }}
            />
          )}
          {currentScreen === "preview" && (
            <PreviewPlaceholderScreen
              answers={onboardingAnswers}
              onBack={resetToWelcome}
              onContinue={() => setCurrentScreen("dashboard")}
            />
          )}
          {currentScreen === "dashboard" && (
            <DashboardPlaceholderScreen onBack={() => setCurrentScreen("preview")} />
          )}
        </View>

        {currentScreen !== "welcome" ? (
          <View style={styles.footer}>
            <Button
              label="Back To Welcome"
              variant="secondary"
              onPress={resetToWelcome}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  app: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16
  },
  welcomeApp: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  progressRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20
  },
  progressSegment: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.border
  },
  progressSegmentActive: {
    backgroundColor: colors.primary
  },
  content: {
    flex: 1
  },
  footer: {
    paddingTop: 12
  }
});
