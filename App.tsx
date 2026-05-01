import { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";

import { colors } from "./src/app/theme";
import { DashboardPlaceholderScreen } from "./src/screens/dashboard/DashboardPlaceholderScreen";
import { WelcomeScreen } from "./src/screens/onboarding/WelcomeScreen";
import { PreviewPlaceholderScreen } from "./src/screens/preview/PreviewPlaceholderScreen";
import { AppScreen } from "./src/types/navigation";
import { OnboardingAnswers } from "./src/types/onboarding";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("welcome");
  const [welcomeKey, setWelcomeKey] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>({});

  const resetToWelcome = () => {
    setOnboardingAnswers({});
    setWelcomeKey((current) => current + 1);
    setCurrentScreen("welcome");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.app, currentScreen === "welcome" && styles.welcomeApp]}>
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
  content: {
    flex: 1
  }
});
