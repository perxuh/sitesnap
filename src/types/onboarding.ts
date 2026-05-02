export type OnboardingMediaAsset = {
  fileName?: string | null;
  height: number;
  mimeType?: string | null;
  uri: string;
  width: number;
};

export type StepId =
  | "businessName"
  | "businessType"
  | "services"
  | "serviceAreas"
  | "primaryAction"
  | "contact"
  | "logo"
  | "logoUpload"
  | "visualStyle"
  | "photos"
  | "photoUpload"
  | "reviews"
  | "reviewDetails"
  | "differentiators"
  | "credentials"
  | "domain"
  | "voice";

export type AnswerValue = string | string[] | OnboardingMediaAsset[];
export type OnboardingAnswers = Partial<Record<StepId, AnswerValue>>;
export type OnboardingIntroStage = "logo" | "bridge" | "chat" | "review";
export type OnboardingDraftState = {
  introStage: OnboardingIntroStage;
  stepIndex: number;
  draft: string;
  answers: OnboardingAnswers;
  completedSteps: StepId[];
  editingStepId: StepId | null;
};

export const onboardingStepOrder: StepId[] = [
  "businessName",
  "businessType",
  "services",
  "serviceAreas",
  "primaryAction",
  "contact",
  "logo",
  "logoUpload",
  "visualStyle",
  "photos",
  "photoUpload",
  "reviews",
  "reviewDetails",
  "differentiators",
  "credentials",
  "domain",
  "voice"
];

export const onboardingStepLabels: Record<StepId, string> = {
  businessName: "Business name",
  businessType: "Business type",
  services: "Services",
  serviceAreas: "Service areas",
  primaryAction: "Primary customer action",
  contact: "Contact details",
  logo: "Logo plan",
  logoUpload: "Logo upload",
  visualStyle: "Visual style",
  photos: "Photos",
  photoUpload: "Photo upload",
  reviews: "Reviews",
  reviewDetails: "Review details",
  differentiators: "What makes you different",
  credentials: "Credentials",
  domain: "Website or domain",
  voice: "Website voice"
};
