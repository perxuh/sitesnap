import { useEffect, useMemo, useRef, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "./src/app/theme";
import {
  clearPersistedOnboardingSession,
  loadPersistedOnboardingSession,
  savePersistedOnboardingSession
} from "./src/lib/storage/onboardingPersistence";
import { DashboardPlaceholderScreen } from "./src/screens/dashboard/DashboardPlaceholderScreen";
import { WelcomeScreen } from "./src/screens/onboarding/WelcomeScreen";
import { WebsitePreviewScreen } from "./src/screens/preview/WebsitePreviewScreen";
import { AppScreen } from "./src/types/navigation";
import {
  onboardingStepOrder,
  OnboardingAnswers,
  OnboardingDraftState,
  StepId
} from "./src/types/onboarding";

export default function App() {
  const lastPersistedSessionRef = useRef<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("welcome");
  const [welcomeKey, setWelcomeKey] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>({});
  const [welcomeDraft, setWelcomeDraft] = useState<OnboardingDraftState | null>(null);

  useEffect(() => {
    let isMounted = true;

    const hydratePersistedSession = async () => {
      const persistedSession = await loadPersistedOnboardingSession();
      if (!isMounted) return;

      if (persistedSession) {
        setOnboardingAnswers(persistedSession.onboardingAnswers);
        setWelcomeDraft(persistedSession.welcomeDraft);
        setCurrentScreen(
          persistedSession.currentScreen === "welcome"
            ? "welcome"
            : "preview"
        );
      }

      setIsHydrating(false);
    };

    void hydratePersistedSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasSavedOnboardingState = useMemo(
    () =>
      Object.keys(onboardingAnswers).length > 0 ||
      welcomeDraft !== null ||
      currentScreen !== "welcome",
    [currentScreen, onboardingAnswers, welcomeDraft]
  );

  useEffect(() => {
    if (isHydrating) return;

    if (!hasSavedOnboardingState) {
      lastPersistedSessionRef.current = null;
      void clearPersistedOnboardingSession();
      return;
    }

    const sessionToPersist = {
      version: 1,
      currentScreen: currentScreen === "dashboard" ? "preview" : currentScreen,
      onboardingAnswers,
      welcomeDraft
    };
    const serializedSession = JSON.stringify(sessionToPersist);

    if (serializedSession === lastPersistedSessionRef.current) {
      return;
    }

    lastPersistedSessionRef.current = serializedSession;
    void savePersistedOnboardingSession(sessionToPersist);
  }, [
    currentScreen,
    hasSavedOnboardingState,
    isHydrating,
    onboardingAnswers,
    welcomeDraft
  ]);

  const resetToWelcome = () => {
    setOnboardingAnswers({});
    setWelcomeDraft(null);
    setWelcomeKey((current) => current + 1);
    setCurrentScreen("welcome");
    void clearPersistedOnboardingSession();
  };

  const returnToOnboardingReview = () => {
    const completedSteps = onboardingStepOrder.filter(
      (stepId): stepId is StepId => onboardingAnswers[stepId] !== undefined
    );

    setWelcomeDraft({
      answers: onboardingAnswers,
      completedSteps,
      draft: "",
      editingStepId: null,
      introStage: "review",
      stepIndex: Math.max(completedSteps.length - 1, 0)
    });
    setWelcomeKey((current) => current + 1);
    setCurrentScreen("welcome");
  };

  if (isHydrating) {
    return (
      <SafeAreaProvider>
        <View style={styles.root} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <View style={[styles.app, currentScreen !== "dashboard" && styles.fullscreenApp]}>
          <View style={styles.content}>
            {currentScreen === "welcome" && (
              <WelcomeScreen
                key={welcomeKey}
                initialDraft={welcomeDraft}
                onContinue={(answers) => {
                  setOnboardingAnswers(answers);
                  setWelcomeDraft(null);
                  setCurrentScreen("preview");
                }}
              />
            )}
            {currentScreen === "preview" && (
              <WebsitePreviewScreen
                onboardingData={onboardingAnswers}
                onEditAnswers={returnToOnboardingReview}
              />
            )}
            {currentScreen === "dashboard" && (
              <DashboardPlaceholderScreen onBack={() => setCurrentScreen("preview")} />
            )}
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
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
  fullscreenApp: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  content: {
    flex: 1
  }
});
