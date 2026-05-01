import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { colors, spacing } from "../../app/theme";
import { Button } from "../../components/common/Button";
import { SiteSnapMark } from "../../components/common/SiteSnapMark";
import {
  onboardingStepLabels,
  OnboardingAnswers,
  OnboardingMediaAsset,
  StepId
} from "../../types/onboarding";

type WelcomeScreenProps = {
  onContinue: (answers: OnboardingAnswers) => void;
};

type IntroStage = "logo" | "bridge" | "chat" | "review";
type StepKind = "text" | "choice" | "multiChoice" | "asset";

type AnswerValue = string | string[] | OnboardingMediaAsset[];
type AssetSource = "library" | "camera" | "skip";
type AssetAction = {
  label: string;
  source: AssetSource;
  value?: string;
};

type StepConfig = {
  id: StepId;
  kind: StepKind;
  prompt: (answers: OnboardingAnswers) => string;
  placeholder?: string;
  hint: string;
  options?: readonly string[];
  assetActions?: readonly AssetAction[];
  assetLimit?: "single" | "multiple";
  required?: boolean;
  shouldShow?: (answers: OnboardingAnswers) => boolean;
};

const TYPE_INTERVAL_MS = 14;
const businessTypes = [
  "Excavation",
  "Landscaping",
  "Roofing",
  "Plumbing / HVAC",
  "Cleaning",
  "Painting",
  "Concrete",
  "Other"
] as const;

const stepConfig: readonly StepConfig[] = [
  {
    id: "businessName",
    kind: "text",
    hint: "Type your business name",
    placeholder: "Type your answer...",
    prompt: () =>
      "Hi. I'm your AI website builder.\n\nI'll ask a few quick questions and shape the website around your answers.\n\nWhat's the name of your business?"
  },
  {
    id: "businessType",
    kind: "choice",
    hint: "Choose the closest fit",
    prompt: (answers) =>
      `Nice${getTextAnswer(answers, "businessName") ? `, ${getTextAnswer(answers, "businessName")}` : ""}. What type of business do you run?`,
    options: businessTypes
  },
  {
    id: "services",
    kind: "multiChoice",
    hint: "Choose services or add them later",
    prompt: () => "What services do you offer? Pick the ones that matter most for your website.",
    options: [
      "Installation",
      "Repairs",
      "Maintenance",
      "Emergency service",
      "Free estimates",
      "Commercial work",
      "Residential work",
      "Custom projects"
    ]
  },
  {
    id: "serviceAreas",
    kind: "text",
    hint: "Cities, counties, or radius",
    placeholder: "Naples, Fort Myers, Cape Coral...",
    prompt: () => "What areas do you serve?"
  },
  {
    id: "primaryAction",
    kind: "choice",
    hint: "Choose the main lead action",
    prompt: () => "What is the main thing you want customers to do?",
    options: ["Call", "Text", "Request a quote", "Book online", "Email"]
  },
  {
    id: "contact",
    kind: "text",
    hint: "Phone and email",
    placeholder: "239-555-0142, hello@company.com",
    prompt: () => "What phone number and email should customers use?"
  },
  {
    id: "logo",
    kind: "choice",
    hint: "Choose one",
    prompt: () => "Do you have a logo?",
    options: [
      "Yes, upload it",
      "No, make me a simple one",
      "Use my business name for now"
    ]
  },
  {
    id: "logoUpload",
    kind: "asset",
    hint: "Add one logo image",
    prompt: () => "Upload your logo here so the AI can use it in your first website preview.",
    assetActions: [
      { label: "Choose from phone", source: "library" },
      { label: "Take a photo", source: "camera" },
      { label: "Send it later", source: "skip", value: "Send it later" }
    ],
    assetLimit: "single",
    shouldShow: (answers) => answers.logo === "Yes, upload it"
  },
  {
    id: "visualStyle",
    kind: "choice",
    hint: "Pick a style direction",
    prompt: () => "What style do you want for the website?",
    options: [
      "Clean and professional",
      "Bold and rugged",
      "Dark and premium",
      "Simple and local",
      "Use my logo colors",
      "Let AI choose"
    ]
  },
  {
    id: "photos",
    kind: "multiChoice",
    hint: "Choose what you have",
    prompt: () => "Do you have photos of past jobs?",
    options: [
      "Finished jobs",
      "Before and afters",
      "Equipment",
      "Truck or trailer",
      "Team photos",
      "Add later"
    ]
  },
  {
    id: "photoUpload",
    kind: "asset",
    hint: "Pick one or more job photos",
    prompt: () =>
      "Add a few job photos now so the AI can use them in your gallery and hero sections.",
    assetActions: [
      { label: "Upload from phone", source: "library" },
      { label: "Take new photos", source: "camera" },
      { label: "Add them later", source: "skip", value: "Add them later" }
    ],
    assetLimit: "multiple",
    shouldShow: (answers) => {
      const photos = answers.photos;
      return (
        isStringListAnswer(photos) &&
        photos.length > 0 &&
        !photos.includes("Add later")
      );
    }
  },
  {
    id: "reviews",
    kind: "choice",
    hint: "Choose one",
    prompt: () => "Do you have reviews we can use?",
    options: [
      "Connect Google Business Profile",
      "Paste reviews",
      "Add later",
      "Skip"
    ]
  },
  {
    id: "reviewDetails",
    kind: "text",
    hint: "Optional details",
    placeholder: "Paste a review, Google profile name, or type Add later",
    prompt: (answers) =>
      answers.reviews === "Connect Google Business Profile"
        ? "What Google Business Profile name or note should we use for this mock connection?"
        : "Paste a sample review or a quick note so we can shape the preview.",
    required: false,
    shouldShow: (answers) =>
      answers.reviews === "Connect Google Business Profile" ||
      answers.reviews === "Paste reviews"
  },
  {
    id: "differentiators",
    kind: "multiChoice",
    hint: "Select anything that applies",
    prompt: () => "What makes your business different?",
    options: [
      "Family owned",
      "Licensed and insured",
      "Free estimates",
      "Fast response",
      "Years of experience",
      "Fair pricing",
      "High-quality work",
      "Warranty offered",
      "Emergency service"
    ]
  },
  {
    id: "credentials",
    kind: "text",
    hint: "Optional",
    placeholder: "Licensed, insured, certified, bonded, warranty-backed...",
    prompt: () =>
      "Are you licensed, insured, certified, bonded, or warranty-backed?",
    required: false
  },
  {
    id: "domain",
    kind: "choice",
    hint: "Choose one",
    prompt: () => "Do you already have a website or domain?",
    options: [
      "I have a website",
      "I have a domain",
      "I need a domain",
      "I am not sure"
    ]
  },
  {
    id: "voice",
    kind: "choice",
    hint: "Pick the writing tone",
    prompt: () => "What do you want your website to sound like?",
    options: [
      "Professional",
      "Friendly",
      "Straight to the point",
      "Premium",
      "Local and personal",
      "Let AI choose"
    ]
  }
];

function getTextAnswer(answers: OnboardingAnswers, stepId: StepId) {
  const answer = answers[stepId];
  return typeof answer === "string" ? answer : "";
}

function isMediaAnswerValue(
  answer: AnswerValue | undefined
): answer is OnboardingMediaAsset[] {
  return (
    Array.isArray(answer) &&
    answer.every((item) => typeof item === "object" && item !== null && "uri" in item)
  );
}

function isStringListAnswer(answer: AnswerValue | undefined): answer is string[] {
  return Array.isArray(answer) && answer.every((item) => typeof item === "string");
}

function getMediaAnswer(answers: OnboardingAnswers, stepId: StepId) {
  const answer = answers[stepId];

  if (isMediaAnswerValue(answer)) {
    return answer;
  }

  return [];
}

function getVisibleSteps(answers: OnboardingAnswers) {
  return stepConfig.filter((step) => step.shouldShow?.(answers) ?? true);
}

function formatAnswer(answer: AnswerValue | undefined) {
  if (isMediaAnswerValue(answer)) {
    if (answer.length === 0) {
      return "No files selected";
    }

    return answer.length === 1
      ? `${answer[0].fileName ?? "1 image"} selected`
      : `${answer.length} images selected`;
  }

  if (isStringListAnswer(answer)) {
    return answer.join(", ");
  }

  return answer ?? "";
}

function formatSummaryAnswer(answer: AnswerValue | undefined) {
  const formatted = formatAnswer(answer);
  return formatted.length > 0 ? formatted : "Not provided";
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const { height, width } = useWindowDimensions();
  const [introStage, setIntroStage] = useState<IntroStage>("logo");
  const [stepIndex, setStepIndex] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [draft, setDraft] = useState("");
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [completedSteps, setCompletedSteps] = useState<StepId[]>([]);
  const [editingStepId, setEditingStepId] = useState<StepId | null>(null);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.94)).current;
  const bridgeOpacity = useRef(new Animated.Value(0)).current;
  const bridgeTranslate = useRef(new Animated.Value(18)).current;
  const chatOpacity = useRef(new Animated.Value(0)).current;
  const chatTranslate = useRef(new Animated.Value(18)).current;
  const scrollRef = useRef<ScrollView | null>(null);

  const activeSteps = useMemo(() => getVisibleSteps(answers), [answers]);
  const safeStepIndex = Math.min(stepIndex, activeSteps.length - 1);
  const currentStep = activeSteps[safeStepIndex];
  const currentPrompt = useMemo(
    () => currentStep.prompt(answers),
    [answers, currentStep]
  );
  const totalSteps = activeSteps.length;
  const trimmedDraft = draft.trim();
  const isCompactIntro = height < 780 || width < 380;
  const currentAnswer = answers[currentStep.id];
  const selectedOptions = isStringListAnswer(currentAnswer) ? currentAnswer : [];
  const selectedChoice = typeof currentAnswer === "string" ? currentAnswer : "";
  const selectedMedia = getMediaAnswer(answers, currentStep.id);

  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        })
      ]),
      Animated.delay(720),
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 360,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    ]);

    sequence.start(({ finished }) => {
      if (!finished) {
        return;
      }

      setIntroStage("bridge");

      Animated.parallel([
        Animated.timing(bridgeOpacity, {
          toValue: 1,
          duration: 360,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(bridgeTranslate, {
          toValue: 0,
          duration: 360,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        })
      ]).start();
    });

    return () => {
      sequence.stop();
    };
  }, [bridgeOpacity, bridgeTranslate, logoOpacity, logoScale]);

  useEffect(() => {
    if (introStage !== "chat") {
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    setTypedPrompt("");
    setIsTyping(true);

    const tick = (index: number) => {
      if (cancelled) {
        return;
      }

      setTypedPrompt(currentPrompt.slice(0, index + 1));

      if (index + 1 < currentPrompt.length) {
        timers.push(setTimeout(() => tick(index + 1), TYPE_INTERVAL_MS));
        return;
      }

      timers.push(
        setTimeout(() => {
          if (!cancelled) {
            setIsTyping(false);
          }
        }, 110)
      );
    };

    if (currentPrompt.length === 0) {
      setIsTyping(false);
      return;
    }

    timers.push(setTimeout(() => tick(0), TYPE_INTERVAL_MS));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [currentPrompt, introStage, stepIndex]);

  useEffect(() => {
    if (stepIndex !== safeStepIndex) {
      setStepIndex(safeStepIndex);
    }
  }, [safeStepIndex, stepIndex]);

  const scrollToBottom = (animated: boolean) => {
    scrollRef.current?.scrollToEnd({ animated });
  };

  const normalizePickedAssets = (
    assets: ImagePicker.ImagePickerAsset[]
  ): OnboardingMediaAsset[] =>
    assets.map((asset) => ({
      fileName: asset.fileName,
      height: asset.height,
      mimeType: asset.mimeType,
      uri: asset.uri,
      width: asset.width
    }));

  const handleGetStarted = () => {
    Animated.parallel([
      Animated.timing(bridgeOpacity, {
        toValue: 0,
        duration: 260,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(bridgeTranslate, {
        toValue: -12,
        duration: 260,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    ]).start(({ finished }) => {
      if (!finished) {
        return;
      }

      setIntroStage("chat");

      Animated.parallel([
        Animated.timing(chatOpacity, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(chatTranslate, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        })
      ]).start();
    });
  };

  const advanceStep = (continueEditingFlow = false) => {
    if (editingStepId && !continueEditingFlow) {
      setEditingStepId(null);
      setDraft("");
      setTimeout(() => setIntroStage("review"), 180);
      return;
    }

    if (safeStepIndex >= activeSteps.length - 1) {
      setTimeout(() => setIntroStage("review"), 320);
      return;
    }

    setStepIndex((current) => current + 1);
    setDraft("");
  };

  const saveAnswer = (stepId: StepId, value: AnswerValue) => {
    const needsFollowUpStep =
      (stepId === "logo" &&
        value === "Yes, upload it" &&
        !getTextAnswer(answers, "logoUpload")) ||
      (stepId === "photos" &&
        isStringListAnswer(value) &&
        value.length > 0 &&
        !value.includes("Add later") &&
        !getTextAnswer(answers, "photoUpload")) ||
      (stepId === "reviews" &&
        (value === "Connect Google Business Profile" || value === "Paste reviews") &&
        !getTextAnswer(answers, "reviewDetails"));

    setAnswers((current) => {
      const nextAnswers: OnboardingAnswers = {
        ...current,
        [stepId]: value
      };

      if (stepId === "logo" && value !== "Yes, upload it") {
        delete nextAnswers.logoUpload;
      }

      if (stepId === "photos") {
        const photoSelections = isStringListAnswer(value) ? value : [];
        if (photoSelections.length === 0 || photoSelections.includes("Add later")) {
          delete nextAnswers.photoUpload;
        }
      }

      if (
        stepId === "reviews" &&
        value !== "Connect Google Business Profile" &&
        value !== "Paste reviews"
      ) {
        delete nextAnswers.reviewDetails;
      }

      return nextAnswers;
    });
    setCompletedSteps((current) =>
      current.includes(stepId) ? current : [...current, stepId]
    );
    advanceStep(needsFollowUpStep);
  };

  const startEditingStep = (stepId: StepId) => {
    const targetIndex = activeSteps.findIndex((step) => step.id === stepId);

    if (targetIndex < 0) {
      return;
    }

    setEditingStepId(stepId);
    setStepIndex(targetIndex);
    setDraft(getTextAnswer(answers, stepId));
    setIntroStage("chat");
  };

  const handleSelectAssetAction = async (action: AssetAction) => {
    if (isTyping || currentStep.kind !== "asset") {
      return;
    }

    if (action.source === "skip") {
      saveAnswer(currentStep.id, action.value ?? "Add later");
      return;
    }

    if (action.source === "camera") {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Camera access needed",
          "Please allow camera access so SiteSnap can collect your images."
        );
        return;
      }
    }

    const pickerResult =
      action.source === "library"
        ? await ImagePicker.launchImageLibraryAsync({
            allowsEditing: currentStep.assetLimit === "single",
            allowsMultipleSelection: currentStep.assetLimit === "multiple",
            mediaTypes: ["images"],
            quality: 1,
            selectionLimit: currentStep.assetLimit === "multiple" ? 10 : 1
          })
        : await ImagePicker.launchCameraAsync({
            allowsEditing: currentStep.assetLimit === "single",
            mediaTypes: ["images"],
            quality: 1
          });

    if (pickerResult.canceled) {
      return;
    }

    const pickedAssets = normalizePickedAssets(pickerResult.assets);

    if (pickedAssets.length === 0) {
      return;
    }

    saveAnswer(currentStep.id, pickedAssets);
  };

  const handleSend = () => {
    if (introStage !== "chat" || isTyping) {
      return;
    }

    if (currentStep.kind !== "text") {
      return;
    }

    if (trimmedDraft.length === 0 && currentStep.required !== false) {
      return;
    }

    saveAnswer(currentStep.id, trimmedDraft.length > 0 ? trimmedDraft : "Add later");
  };

  const handleSelectChoice = (option: string) => {
    if (isTyping || currentStep.kind !== "choice") {
      return;
    }

    saveAnswer(currentStep.id, option);
  };

  const handleToggleMultiChoice = (option: string) => {
    if (isTyping || currentStep.kind !== "multiChoice") {
      return;
    }

    setAnswers((current) => {
      const existing = current[currentStep.id];
      const currentOptions = isStringListAnswer(existing) ? existing : [];
      const nextOptions = currentOptions.includes(option)
        ? currentOptions.filter((item) => item !== option)
        : [...currentOptions, option];

      return {
        ...current,
        [currentStep.id]: nextOptions
      };
    });
  };

  const handleContinueMultiChoice = () => {
    if (isTyping || currentStep.kind !== "multiChoice" || selectedOptions.length === 0) {
      return;
    }

    setCompletedSteps((current) =>
      current.includes(currentStep.id) ? current : [...current, currentStep.id]
    );
    advanceStep();
  };

  if (introStage === "logo") {
    return (
      <View style={styles.fullscreen}>
        <BackgroundTexture />
        <Animated.View
          style={[
            styles.logoWrap,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }]
            }
          ]}
        >
          <SiteSnapMark />
        </Animated.View>
      </View>
    );
  }

  if (introStage === "bridge") {
    return (
      <View style={styles.fullscreen}>
        <BackgroundTexture />
        <Animated.ScrollView
          contentContainerStyle={[
            styles.introScreen,
            isCompactIntro && styles.introScreenCompact
          ]}
          showsVerticalScrollIndicator={false}
          style={[
            styles.introScroll,
            {
              opacity: bridgeOpacity,
              transform: [{ translateY: bridgeTranslate }]
            }
          ]}
        >
          <View
            style={[
              styles.heroIllustrationWrap,
              isCompactIntro && styles.heroIllustrationWrapCompact
            ]}
          >
            <View style={styles.websiteMock}>
              <View style={styles.mockChrome}>
                <View style={styles.mockDots}>
                  <View style={styles.mockDot} />
                  <View style={styles.mockDot} />
                  <View style={styles.mockDot} />
                </View>
                <View style={styles.mockNav}>
                  <View style={styles.mockNavLine} />
                  <View style={styles.mockNavLine} />
                  <View style={styles.mockNavLineShort} />
                </View>
              </View>
              <View style={styles.mockBody}>
                <Text style={styles.mockTitle}>Built for your business.</Text>
                <View style={styles.mockLineLong} />
                <View style={styles.mockLineShort} />
                <View style={styles.mockButton} />
              </View>
              <View style={styles.mockRoof}>
                <View style={styles.mockRoofPeak} />
                <View style={styles.mockHouse} />
              </View>
            </View>
          </View>

          <View style={styles.introBadge}>
            <MiniIcon kind="spark" compact />
            <Text style={styles.introBadgeText}>AI website builder</Text>
          </View>

          <Text style={[styles.introTitle, isCompactIntro && styles.introTitleCompact]}>
            Professional websites.{"\n"}Built for{" "}
            <Text style={styles.introTitleAccent}>contractors.</Text>
          </Text>
          <Text style={[styles.introCopy, isCompactIntro && styles.introCopyCompact]}>
            The easiest way to get a high-converting, AI-powered website for your
            business. No coding. No stress. Only results.
          </Text>

          <View style={[styles.valueRow, isCompactIntro && styles.valueRowCompact]}>
            <ValuePillar title="AI-Powered" body="Smart websites tailored to you" icon="spark" />
            <ValuePillar title="Fast & Simple" body="Launch your site in minutes" icon="bolt" />
            <ValuePillar title="Built to Convert" body="Designed to win more clients" icon="chart" />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleGetStarted}
            style={({ pressed }) => [
              styles.getStartedButton,
              pressed && styles.getStartedButtonPressed
            ]}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Text style={styles.getStartedArrow}>-&gt;</Text>
          </Pressable>

          <Text style={styles.noCreditText}>No credit card required</Text>
        </Animated.ScrollView>
      </View>
    );
  }

  if (introStage === "review") {
    return (
      <View style={styles.fullscreen}>
        <BackgroundTexture />
        <ScrollView
          contentContainerStyle={styles.reviewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewEyebrow}>Review</Text>
            <Text style={styles.reviewTitle}>Your website setup is ready.</Text>
            <Text style={styles.reviewDescription}>
              Here&apos;s the information SiteSnap will use to shape your first
              website preview.
            </Text>
          </View>

          <View style={styles.reviewCard}>
            {activeSteps.map((step) => (
              <View key={step.id} style={styles.reviewRow}>
                <View style={styles.reviewRowHeader}>
                  <Text style={styles.reviewLabel}>{onboardingStepLabels[step.id]}</Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => startEditingStep(step.id)}
                    style={({ pressed }) => [
                      styles.editButton,
                      pressed && styles.editButtonPressed
                    ]}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewValue}>
                  {formatSummaryAnswer(answers[step.id])}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.reviewActions}>
            <Button
              label="Back To Answers"
              onPress={() => setIntroStage("chat")}
              variant="secondary"
            />
            <Button
              label="Build My Preview"
              onPress={() => onContinue(answers)}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardWrap}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: chatOpacity,
            transform: [{ translateY: chatTranslate }]
          }
        ]}
      >
        <BackgroundTexture />

        <View style={styles.progressShell}>
          <View style={styles.progressRow}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <View
                key={`progress-${index + 1}`}
                style={[
                  styles.progressSegment,
                  index <= safeStepIndex && styles.progressSegmentActive,
                  index === safeStepIndex && styles.progressSegmentCurrent
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressLabel}>
            Step {safeStepIndex + 1} of {totalSteps}
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chatContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollToBottom(true)}
          showsVerticalScrollIndicator={false}
          style={styles.chatScroll}
        >
          {activeSteps.map((step) => {
            if (!completedSteps.includes(step.id)) {
              return null;
            }

            return (
              <View key={step.id} style={styles.messageGroup}>
                <AssistantBubble text={step.prompt(answers)} archived />
                <UserBubble answer={answers[step.id]} />
              </View>
            );
          })}

          <AssistantBubble text={typedPrompt} />

          {(currentStep.kind === "choice" ||
            currentStep.kind === "multiChoice" ||
            currentStep.kind === "asset") &&
          !isTyping ? (
            <View style={styles.optionStack}>
              {currentStep.kind === "asset"
                ? currentStep.assetActions?.map((action) => (
                    <Pressable
                      key={action.label}
                      accessibilityRole="button"
                      onPress={() => {
                        void handleSelectAssetAction(action);
                      }}
                      style={styles.optionCard}
                    >
                      <View style={styles.optionLeading}>
                        <View style={styles.optionIcon} />
                        <Text style={styles.optionText}>{action.label}</Text>
                      </View>
                    </Pressable>
                  ))
                : currentStep.options?.map((option) => {
                    const selected =
                      currentStep.kind === "choice"
                        ? selectedChoice === option
                        : selectedOptions.includes(option);

                    return (
                      <Pressable
                        key={option}
                        accessibilityRole="button"
                        onPress={() =>
                          currentStep.kind === "choice"
                            ? handleSelectChoice(option)
                            : handleToggleMultiChoice(option)
                        }
                        style={[
                          styles.optionCard,
                          selected && styles.optionCardSelected
                        ]}
                      >
                        <View style={styles.optionLeading}>
                          <View
                            style={[
                              styles.optionIcon,
                              selected && styles.optionIconSelected
                            ]}
                          />
                          <Text
                            style={[
                              styles.optionText,
                              selected && styles.optionTextSelected
                            ]}
                          >
                            {option}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.optionCheck,
                            selected && styles.optionCheckSelected
                          ]}
                        >
                          <Text style={styles.optionCheckText}>
                            {selected ? "OK" : ""}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}

              {currentStep.kind === "asset" && selectedMedia.length > 0 ? (
                <View style={styles.uploadPreview}>
                  <Text style={styles.uploadPreviewLabel}>
                    {selectedMedia.length === 1
                      ? "1 image selected"
                      : `${selectedMedia.length} images selected`}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.uploadPreviewRow}>
                      {selectedMedia.map((asset) => (
                        <Image
                          key={asset.uri}
                          source={{ uri: asset.uri }}
                          style={styles.uploadPreviewImage}
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              ) : null}
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.composerDock}>
          <Text style={styles.composerHint}>{currentStep.hint}</Text>

          {currentStep.kind === "text" ? (
            <View style={styles.composerRow}>
              <TextInput
                autoCapitalize={currentStep.id === "businessName" ? "words" : "words"}
                autoCorrect={false}
                editable={!isTyping}
                placeholder={currentStep.placeholder}
                placeholderTextColor={colors.textMuted}
                returnKeyType="send"
                selectionColor={colors.accent}
                style={styles.composerInput}
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={handleSend}
              />
              <Pressable
                accessibilityRole="button"
                disabled={
                  isTyping ||
                  (trimmedDraft.length === 0 && currentStep.required !== false)
                }
                onPress={handleSend}
                style={[
                  styles.sendButton,
                  (isTyping ||
                    (trimmedDraft.length === 0 && currentStep.required !== false)) &&
                    styles.sendButtonDisabled
                ]}
              >
                <Text style={styles.sendButtonText}>
                  {trimmedDraft.length === 0 && currentStep.required === false ? "Skip" : "Go"}
                </Text>
              </Pressable>
            </View>
          ) : currentStep.kind === "multiChoice" ? (
            <View style={styles.choiceFooter}>
              <Button
                label="Continue"
                onPress={handleContinueMultiChoice}
                disabled={isTyping || selectedOptions.length === 0}
              />
            </View>
          ) : currentStep.kind === "asset" ? (
            <Text style={styles.choiceInstruction}>
              Tap an option to collect images in the chat.
            </Text>
          ) : (
            <Text style={styles.choiceInstruction}>Tap an answer to continue.</Text>
          )}
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

function AssistantBubble({
  archived = false,
  text
}: {
  archived?: boolean;
  text: string;
}) {
  return (
    <View style={styles.assistantRow}>
      <View style={[styles.assistantIconWrap, archived && styles.assistantIconWrapArchived]}>
        <View style={styles.assistantIconGlow} />
        <View style={styles.sparkleLarge} />
        <View style={styles.sparkleSmall} />
      </View>
      <View style={[styles.assistantBubble, archived && styles.assistantBubbleArchived]}>
        <Text style={[styles.assistantText, archived && styles.assistantTextArchived]}>
          {text}
        </Text>
      </View>
    </View>
  );
}

function UserBubble({ answer }: { answer: AnswerValue | undefined }) {
  const mediaAssets = isMediaAnswerValue(answer) ? answer : [];

  return (
    <View style={styles.userRow}>
      <View style={styles.userBubble}>
        {mediaAssets.length > 0 ? (
          <>
            <Text style={styles.userText}>
              {mediaAssets.length === 1
                ? "1 image uploaded"
                : `${mediaAssets.length} images uploaded`}
            </Text>
            <View style={styles.userMediaGrid}>
              {mediaAssets.map((asset) => (
                <Image
                  key={asset.uri}
                  source={{ uri: asset.uri }}
                  style={styles.userMediaImage}
                />
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.userText}>{formatAnswer(answer)}</Text>
        )}
      </View>
    </View>
  );
}

function MiniIcon({
  compact = false,
  kind
}: {
  compact?: boolean;
  kind: "spark" | "bolt" | "phone" | "chart";
}) {
  return (
    <View style={[styles.miniIcon, compact && styles.miniIconCompact]}>
      {kind === "spark" ? (
        <>
          <View style={styles.miniSparkLarge} />
          <View style={styles.miniSparkSmall} />
        </>
      ) : null}
      {kind === "bolt" ? <Text style={styles.miniIconGlyph}>Z</Text> : null}
      {kind === "phone" ? <View style={styles.phoneGlyph} /> : null}
      {kind === "chart" ? (
        <View style={styles.chartGlyph}>
          <View style={styles.chartBarSmall} />
          <View style={styles.chartBarMedium} />
          <View style={styles.chartBarTall} />
        </View>
      ) : null}
    </View>
  );
}

function ValuePillar({
  body,
  icon,
  title
}: {
  body: string;
  icon: "spark" | "bolt" | "chart";
  title: string;
}) {
  return (
    <View style={styles.valuePillar}>
      <MiniIcon kind={icon} />
      <Text style={styles.valueTitle}>{title}</Text>
      <Text style={styles.valueBody}>{body}</Text>
    </View>
  );
}

function BackgroundTexture() {
  return (
    <>
      <View style={styles.backgroundBase} />
      <View style={styles.backgroundLineTop} />
      <View style={styles.backgroundLineBottom} />
      <View style={styles.backgroundGridOne} />
      <View style={styles.backgroundGridTwo} />
    </>
  );
}

const styles = StyleSheet.create({
  keyboardWrap: {
    flex: 1
  },
  fullscreen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 18
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8
  },
  logoWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  introScroll: {
    flex: 1
  },
  introScreen: {
    alignItems: "center",
    alignSelf: "stretch",
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 18,
    paddingTop: 22
  },
  introScreenCompact: {
    paddingBottom: 12,
    paddingTop: 14
  },
  heroIllustrationWrap: {
    alignItems: "center",
    height: 190,
    justifyContent: "center",
    marginBottom: 22,
    width: "100%"
  },
  heroIllustrationWrapCompact: {
    height: 160,
    marginBottom: 14
  },
  websiteMock: {
    backgroundColor: "rgba(14, 19, 15, 0.96)",
    borderColor: "rgba(200, 255, 61, 0.42)",
    borderRadius: 16,
    borderWidth: 1,
    height: 158,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    width: "78%"
  },
  mockChrome: {
    alignItems: "center",
    backgroundColor: "rgba(200, 255, 61, 0.18)",
    flexDirection: "row",
    height: 24,
    justifyContent: "space-between",
    paddingHorizontal: 12
  },
  mockDots: {
    flexDirection: "row",
    gap: 5
  },
  mockDot: {
    backgroundColor: "rgba(5, 7, 6, 0.72)",
    borderRadius: 999,
    height: 5,
    width: 5
  },
  mockNav: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7
  },
  mockNavLine: {
    backgroundColor: "rgba(244, 255, 243, 0.26)",
    borderRadius: 999,
    height: 4,
    width: 22
  },
  mockNavLineShort: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 8,
    width: 34
  },
  mockBody: {
    paddingHorizontal: 16,
    paddingTop: 22
  },
  mockTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 27,
    maxWidth: 130
  },
  mockLineLong: {
    backgroundColor: "rgba(244, 255, 243, 0.2)",
    borderRadius: 999,
    height: 5,
    marginTop: 14,
    width: 96
  },
  mockLineShort: {
    backgroundColor: "rgba(244, 255, 243, 0.15)",
    borderRadius: 999,
    height: 5,
    marginTop: 8,
    width: 68
  },
  mockButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 14,
    marginTop: 16,
    width: 58
  },
  mockRoof: {
    bottom: 0,
    height: 82,
    opacity: 0.72,
    position: "absolute",
    right: -6,
    width: 104
  },
  mockRoofPeak: {
    backgroundColor: "rgba(244, 255, 243, 0.18)",
    height: 70,
    position: "absolute",
    right: 28,
    top: 16,
    transform: [{ rotate: "45deg" }],
    width: 70
  },
  mockHouse: {
    backgroundColor: "rgba(244, 255, 243, 0.1)",
    bottom: 0,
    height: 44,
    position: "absolute",
    right: 16,
    width: 70
  },
  introBadge: {
    alignItems: "center",
    backgroundColor: "rgba(200, 255, 61, 0.11)",
    borderColor: "rgba(200, 255, 61, 0.28)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  introBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  introTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
    marginTop: 20,
    textAlign: "center"
  },
  introTitleCompact: {
    fontSize: 29,
    lineHeight: 36,
    marginTop: 12
  },
  introTitleAccent: {
    color: colors.primary
  },
  introCopy: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 315,
    textAlign: "center"
  },
  introCopyCompact: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10
  },
  valueRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 26,
    width: "100%"
  },
  valueRowCompact: {
    marginTop: 18
  },
  valuePillar: {
    alignItems: "center",
    backgroundColor: "rgba(244, 255, 243, 0.025)",
    borderColor: "rgba(244, 255, 243, 0.08)",
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minHeight: 116,
    paddingHorizontal: 6,
    paddingVertical: 12
  },
  valueTitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 10,
    textAlign: "center"
  },
  valueBody: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 7,
    textAlign: "center"
  },
  getStartedButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.primary,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
    minHeight: 62,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 20
  },
  getStartedButtonPressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.99 }]
  },
  getStartedText: {
    color: colors.background,
    fontSize: 20,
    fontWeight: "800"
  },
  getStartedArrow: {
    color: colors.background,
    fontSize: 25,
    fontWeight: "800",
    marginLeft: 18
  },
  noCreditText: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 14,
    textAlign: "center"
  },
  miniIcon: {
    alignItems: "center",
    backgroundColor: "rgba(18, 24, 18, 0.94)",
    borderColor: "rgba(244, 255, 243, 0.12)",
    borderRadius: 18,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    position: "relative",
    width: 48
  },
  miniIconCompact: {
    backgroundColor: "transparent",
    borderWidth: 0,
    height: 18,
    width: 18
  },
  miniSparkLarge: {
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 10,
    transform: [{ rotate: "45deg" }],
    width: 10
  },
  miniSparkSmall: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 5,
    position: "absolute",
    right: 13,
    top: 12,
    width: 5
  },
  miniIconGlyph: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  phoneGlyph: {
    borderColor: colors.text,
    borderRadius: 4,
    borderWidth: 2,
    height: 26,
    width: 16
  },
  chartGlyph: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 4,
    height: 24
  },
  chartBarSmall: {
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 10,
    width: 4
  },
  chartBarMedium: {
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 16,
    width: 4
  },
  chartBarTall: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 22,
    width: 4
  },
  backgroundBase: {
    backgroundColor: colors.background,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  backgroundLineTop: {
    backgroundColor: "rgba(200, 255, 61, 0.08)",
    height: 1,
    left: 18,
    position: "absolute",
    right: 18,
    top: 58
  },
  backgroundLineBottom: {
    backgroundColor: "rgba(125, 255, 178, 0.06)",
    bottom: 82,
    height: 1,
    left: 18,
    position: "absolute",
    right: 18
  },
  backgroundGridOne: {
    backgroundColor: "rgba(255, 255, 255, 0.018)",
    height: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: "37%"
  },
  backgroundGridTwo: {
    backgroundColor: "rgba(255, 255, 255, 0.014)",
    bottom: "31%",
    height: 1,
    left: 0,
    position: "absolute",
    right: 0
  },
  progressShell: {
    alignItems: "center",
    marginBottom: spacing.md,
    paddingTop: 4
  },
  progressRow: {
    flexDirection: "row",
    gap: 8,
    width: "72%"
  },
  progressSegment: {
    backgroundColor: "rgba(244, 255, 243, 0.1)",
    borderRadius: 999,
    flex: 1,
    height: 6
  },
  progressSegmentActive: {
    backgroundColor: "rgba(200, 255, 61, 0.46)"
  },
  progressSegmentCurrent: {
    backgroundColor: colors.primary
  },
  progressLabel: {
    color: "rgba(200, 255, 61, 0.62)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12
  },
  reviewContent: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 28
  },
  reviewHeader: {
    marginBottom: spacing.lg
  },
  reviewEyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    textTransform: "uppercase"
  },
  reviewTitle: {
    color: colors.text,
    fontSize: 31,
    fontWeight: "800",
    lineHeight: 38
  },
  reviewDescription: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm
  },
  reviewCard: {
    backgroundColor: "rgba(12, 16, 13, 0.92)",
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  reviewRow: {
    borderBottomColor: "rgba(41, 50, 38, 0.7)",
    borderBottomWidth: 1,
    gap: 6,
    paddingBottom: spacing.md
  },
  reviewRowHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  reviewLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase"
  },
  editButton: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6
  },
  editButtonPressed: {
    opacity: 0.8
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  reviewValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 23
  },
  reviewActions: {
    gap: spacing.sm,
    marginTop: spacing.lg
  },
  chatScroll: {
    flex: 1
  },
  chatContent: {
    flexGrow: 1,
    gap: spacing.md,
    paddingBottom: spacing.md
  },
  messageGroup: {
    gap: spacing.md
  },
  assistantRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    paddingRight: 18
  },
  assistantIconWrap: {
    alignItems: "center",
    backgroundColor: "rgba(18, 24, 18, 0.94)",
    borderColor: "rgba(200, 255, 61, 0.14)",
    borderRadius: 20,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: 44
  },
  assistantIconWrapArchived: {
    opacity: 0.72
  },
  assistantIconGlow: {
    backgroundColor: "rgba(200, 255, 61, 0.22)",
    borderRadius: 999,
    height: 24,
    position: "absolute",
    width: 24
  },
  sparkleLarge: {
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 9,
    transform: [{ rotate: "45deg" }],
    width: 9
  },
  sparkleSmall: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 6,
    position: "absolute",
    right: 10,
    top: 10,
    width: 6
  },
  assistantBubble: {
    backgroundColor: "rgba(17, 22, 17, 0.96)",
    borderColor: "rgba(244, 255, 243, 0.1)",
    borderRadius: 20,
    borderTopLeftRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  assistantBubbleArchived: {
    opacity: 0.74
  },
  assistantText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 25
  },
  assistantTextArchived: {
    color: "rgba(242, 245, 251, 0.88)"
  },
  userRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 52
  },
  userBubble: {
    backgroundColor: "rgba(200, 255, 61, 0.1)",
    borderColor: "rgba(200, 255, 61, 0.58)",
    borderRadius: 18,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    maxWidth: "86%",
    minHeight: 54,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  userText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 25
  },
  userMediaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  userMediaImage: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    height: 84,
    width: 84
  },
  optionStack: {
    gap: 10,
    marginLeft: 54
  },
  optionCard: {
    alignItems: "center",
    backgroundColor: "rgba(15, 20, 15, 0.96)",
    borderColor: "rgba(244, 255, 243, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 58,
    paddingHorizontal: 14
  },
  optionCardSelected: {
    borderColor: "rgba(200, 255, 61, 0.82)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 18
  },
  optionLeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14
  },
  optionIcon: {
    backgroundColor: "rgba(200, 255, 61, 0.12)",
    borderColor: "rgba(200, 255, 61, 0.32)",
    borderRadius: 8,
    borderWidth: 1,
    height: 20,
    width: 20
  },
  optionIconSelected: {
    backgroundColor: "rgba(200, 255, 61, 0.24)"
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500"
  },
  optionTextSelected: {
    color: colors.text
  },
  optionCheck: {
    alignItems: "center",
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 999,
    borderWidth: 1,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  optionCheckSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  optionCheckText: {
    color: "#0b1020",
    fontSize: 10,
    fontWeight: "800"
  },
  uploadPreview: {
    backgroundColor: "rgba(15, 20, 15, 0.8)",
    borderColor: "rgba(244, 255, 243, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.sm
  },
  uploadPreviewLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.sm
  },
  uploadPreviewRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  uploadPreviewImage: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    height: 88,
    width: 88
  },
  composerDock: {
    backgroundColor: "rgba(7, 10, 7, 0.98)",
    borderColor: "rgba(244, 255, 243, 0.09)",
    borderRadius: 22,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: 10
  },
  composerHint: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 10,
    paddingHorizontal: 6
  },
  composerRow: {
    alignItems: "center",
    backgroundColor: "rgba(12, 17, 12, 0.98)",
    borderColor: "rgba(244, 255, 243, 0.1)",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 60,
    paddingLeft: 18,
    paddingRight: 8
  },
  composerInput: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    minHeight: 48
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  sendButtonDisabled: {
    opacity: 0.4
  },
  sendButtonText: {
    color: "#09101d",
    fontSize: 14,
    fontWeight: "800"
  },
  choiceFooter: {
    paddingTop: 4
  },
  choiceInstruction: {
    color: colors.textMuted,
    fontSize: 14,
    paddingBottom: 8,
    textAlign: "center"
  }
});
