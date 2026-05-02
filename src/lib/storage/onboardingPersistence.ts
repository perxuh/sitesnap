import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppScreen } from "../../types/navigation";
import { OnboardingAnswers, OnboardingDraftState } from "../../types/onboarding";

const ONBOARDING_STORAGE_KEY = "sitesnap:onboarding-session";
const ONBOARDING_STORAGE_VERSION = 1;

export type PersistedOnboardingSession = {
  version: number;
  currentScreen: AppScreen;
  onboardingAnswers: OnboardingAnswers;
  welcomeDraft: OnboardingDraftState | null;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isValidCurrentScreen(value: unknown): value is AppScreen {
  return value === "welcome" || value === "preview" || value === "dashboard";
}

function isValidDraftState(value: unknown): value is OnboardingDraftState {
  if (!isObject(value)) return false;

  return (
    (value.introStage === "logo" ||
      value.introStage === "bridge" ||
      value.introStage === "chat" ||
      value.introStage === "review") &&
    typeof value.stepIndex === "number" &&
    typeof value.draft === "string" &&
    isObject(value.answers) &&
    isStringArray(value.completedSteps) &&
    (typeof value.editingStepId === "string" || value.editingStepId === null)
  );
}

function isValidSession(value: unknown): value is PersistedOnboardingSession {
  if (!isObject(value)) return false;

  return (
    value.version === ONBOARDING_STORAGE_VERSION &&
    isValidCurrentScreen(value.currentScreen) &&
    isObject(value.onboardingAnswers) &&
    (value.welcomeDraft === null || isValidDraftState(value.welcomeDraft))
  );
}

export async function loadPersistedOnboardingSession() {
  try {
    const rawValue = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!rawValue) return null;

    const parsedValue = JSON.parse(rawValue) as unknown;
    if (!isValidSession(parsedValue)) return null;

    return parsedValue;
  } catch {
    return null;
  }
}

export async function savePersistedOnboardingSession(
  session: PersistedOnboardingSession
) {
  await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(session));
}

export async function clearPersistedOnboardingSession() {
  await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
}
