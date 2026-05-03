import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDeviceScreenProfile } from "../../app/deviceScreen";
import { colors, spacing } from "../../app/theme";
import { OnboardingAnswers } from "../../types/onboarding";

type WebsitePreviewScreenProps = {
  onboardingData?: OnboardingAnswers;
  onEditAnswers?: () => void;
  onGoLive?: () => void;
};

type ChecklistItem = {
  label: string;
};

function getStringAnswer(answers: OnboardingAnswers, key: keyof OnboardingAnswers): string {
  const val = answers[key];
  return typeof val === "string" ? val : "";
}

function getListAnswer(answers: OnboardingAnswers, key: keyof OnboardingAnswers): string[] {
  const val = answers[key];
  return Array.isArray(val) && val.every((v) => typeof v === "string") ? (val as string[]) : [];
}

function getDynamicChecklistItems(answers: OnboardingAnswers): ChecklistItem[] {
  const services = getListAnswer(answers, "services").filter((service) => service !== "Add later");
  const serviceAreas = getStringAnswer(answers, "serviceAreas");
  const primaryAction = getStringAnswer(answers, "primaryAction");
  const contact = getStringAnswer(answers, "contact");
  const reviews = getStringAnswer(answers, "reviews");
  const reviewDetails = getStringAnswer(answers, "reviewDetails");
  const differentiators = getListAnswer(answers, "differentiators");
  const credentials = getStringAnswer(answers, "credentials");
  const visualStyle = getStringAnswer(answers, "visualStyle");
  const logo = getStringAnswer(answers, "logo");
  const photos = getListAnswer(answers, "photos").filter((photo) => photo !== "Add later");

  const candidateItems: ChecklistItem[] = [
    ...(services.length > 0
      ? [{ label: `${services.length} services added` }]
      : []),
    ...(contact
      ? [{ label: `${primaryAction || "Contact"} CTA connected` }]
      : []),
    ...(serviceAreas
      ? [{ label: "Service area added" }]
      : []),
    ...(reviews !== "Skip" && (reviews || reviewDetails)
      ? [{ label: "Trust section prepared" }]
      : []),
    ...(differentiators.length > 0 || credentials
      ? [{ label: "Credibility signals added" }]
      : []),
    ...(visualStyle
      ? [{ label: "Design style applied" }]
      : []),
    ...(logo
      ? [{ label: "Branding prepared" }]
      : []),
    ...(photos.length > 0
      ? [{ label: "Gallery plan included" }]
      : []),
    { label: "SEO foundation prepared" },
    { label: "Temporary domain ready" },
    { label: "Mobile layout optimized" }
  ];

  return candidateItems.slice(0, 3);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 32);
}

export function WebsitePreviewScreen({ onboardingData, onEditAnswers, onGoLive }: WebsitePreviewScreenProps) {
  const screenProfile = useDeviceScreenProfile();
  const answers = onboardingData ?? {};

  const businessName = getStringAnswer(answers, "businessName") || "Summit Roofing Co.";
  const businessType = getStringAnswer(answers, "businessType") || "Roofing";
  const serviceAreas = getStringAnswer(answers, "serviceAreas") || "Naples, Fort Myers & Cape Coral";
  const services = getListAnswer(answers, "services");
  const primaryAction = getStringAnswer(answers, "primaryAction") || "Call";
  const contact = getStringAnswer(answers, "contact") || "239-555-0142";

  const displayServices =
    services.length > 0
      ? services.slice(0, 3)
      : ["Free Estimates", "Residential Work", "Emergency Service"];

  const ctaLabel =
    primaryAction === "Request a quote"
      ? "Get a Free Quote"
      : primaryAction === "Book online"
        ? "Book Now"
        : primaryAction === "Text"
          ? "Text Us"
          : primaryAction === "Email"
            ? "Email Us"
            : "Call Now";

  const domain = `${slugify(businessName) || "your-business"}.sitesnap.com`;
  const previewUrl = `https://${domain}`;
  const tagline = `${businessType} you can trust in ${serviceAreas.split(",")[0].trim()}.`;
  const checklistItems = getDynamicChecklistItems(answers);
  const availableHeight =
    screenProfile.height - screenProfile.topInset - screenProfile.bottomInset;
  const shouldUseRoomyLayout = screenProfile.isLargePhone && availableHeight > 760;

  const handleOpenPreview = () => {
    Alert.alert("Opening Preview", previewUrl);
  };

  const handleGoLive = () => {
    if (onGoLive) {
      onGoLive();
    }
  };

  return (
    <View
      accessibilityLabel={`SiteSnap preview optimized for ${screenProfile.modelName}`}
      style={styles.root}
    >
      <View style={styles.bgBase} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          shouldUseRoomyLayout && styles.scrollRoomy,
          {
            minHeight: screenProfile.height,
            paddingBottom: screenProfile.bottomInset + (shouldUseRoomyLayout ? 18 : 24),
            paddingTop: screenProfile.topInset + (shouldUseRoomyLayout ? spacing.lg : spacing.sm)
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.contentFrame, shouldUseRoomyLayout && styles.contentFrameRoomy]}>
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusBadgeText}>Draft ready</Text>
          </View>
          <Text style={styles.headline}>Your website is ready.</Text>
          <Text style={styles.subheadline}>
            Review your draft, then go live when you&apos;re ready.
          </Text>
        </View>

        {/* ── Preview card ─────────────────────────────────────────────────── */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open full preview of ${businessName}`}
          onPress={handleOpenPreview}
          style={({ pressed }) => [
            styles.previewCard,
            shouldUseRoomyLayout && styles.previewCardRoomy,
            pressed && styles.previewCardPressed
          ]}
        >
          {/* Browser chrome */}
          <View style={styles.browserBar}>
            <View style={styles.browserDots}>
              <View style={[styles.browserDot, styles.dotRed]} />
              <View style={[styles.browserDot, styles.dotYellow]} />
              <View style={[styles.browserDot, styles.dotGreen]} />
            </View>
            <View style={styles.addressBar}>
              <View style={styles.addressLockDot} />
              <Text style={styles.addressText} numberOfLines={1}>{domain}</Text>
            </View>
            <View style={styles.browserDotsSpacer} />
          </View>

          {/* Mini website */}
          <View style={styles.miniSite}>
            {/* Hero */}
            <View style={[styles.miniHero, shouldUseRoomyLayout && styles.miniHeroRoomy]}>
              <View style={styles.miniHeroBg} />
              <View style={styles.miniNavBar}>
                <View style={styles.miniLogoBlock}>
                  <View style={styles.miniLogoDot} />
                  <View style={styles.miniLogoLine} />
                </View>
                <View style={styles.miniNavLinks}>
                  <View style={styles.miniNavLink} />
                  <View style={styles.miniNavLink} />
                  <View style={[styles.miniNavLink, styles.miniNavLinkAccent]} />
                </View>
              </View>
              <View style={styles.miniHeroContent}>
                <Text style={styles.miniBusinessName} numberOfLines={1}>{businessName}</Text>
                <Text style={styles.miniTagline} numberOfLines={1}>{tagline}</Text>
                <View style={styles.miniHeroRow}>
                  <View style={styles.miniCtaButton}>
                    <Text style={styles.miniCtaText}>{ctaLabel}</Text>
                  </View>
                  <View style={styles.miniServicePills}>
                    {displayServices.slice(0, 2).map((svc) => (
                      <View key={svc} style={styles.miniServicePill}>
                        <Text style={styles.miniServicePillText} numberOfLines={1}>{svc}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Trust / footer strip */}
            <View style={styles.miniFooter}>
              <View style={styles.miniTrustStars}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View key={i} style={styles.miniStar} />
                ))}
              </View>
              <Text style={styles.miniFooterText}>4.9 · 120+ jobs</Text>
              <View style={styles.miniFooterDivider} />
              <Text style={styles.miniFooterText} numberOfLines={1}>
                {contact.split(",")[0].trim()}
              </Text>
            </View>
          </View>

          {/* Tap affordance */}
          <View style={styles.tapAffordance}>
            <Text style={styles.tapAffordanceText}>Tap to preview  →</Text>
          </View>
        </Pressable>

        {/* ── Three setup confirmation boxes ────────────────────────────────── */}
        <View style={styles.setupRow}>
          {checklistItems.map((item) => (
            <View key={item.label} style={styles.setupBox}>
              <View style={styles.setupCheck}>
                <View style={styles.setupCheckInner} />
              </View>
              <Text style={styles.setupLabel} numberOfLines={2}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ── CTA area ─────────────────────────────────────────────────────── */}
        <View style={styles.ctaSection}>
          <Pressable
            accessibilityRole="button"
            onPress={handleGoLive}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <Text style={styles.primaryButtonText}>Go Live</Text>
            <Text style={styles.primaryButtonArrow}>→</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onEditAnswers}
            style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
          >
            <Text style={styles.editButtonText}>Edit Answers</Text>
          </Pressable>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1
  },
  bgBase: {
    backgroundColor: colors.background,
    bottom: 0, left: 0, position: "absolute", right: 0, top: 0
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg
  },
  scrollRoomy: {
    justifyContent: "center"
  },
  contentFrame: {
    flex: 1
  },
  contentFrameRoomy: {
    justifyContent: "center",
    gap: 2
  },

  // ── Header
  header: {
    marginBottom: 14
  },
  statusBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(200, 255, 61, 0.1)",
    borderColor: "rgba(200, 255, 61, 0.26)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    marginBottom: 10,
    paddingHorizontal: 11,
    paddingVertical: 5
  },
  statusDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 6,
    width: 6
  },
  statusBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  headline: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.4,
    lineHeight: 36
  },
  subheadline: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 5
  },

  // ── Preview card
  previewCard: {
    backgroundColor: colors.panel,
    borderColor: "rgba(200, 255, 61, 0.28)",
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 22
  },
  previewCardRoomy: {
    marginBottom: 18
  },
  previewCardPressed: {
    borderColor: "rgba(200, 255, 61, 0.48)",
    shadowOpacity: 0.26,
    transform: [{ scale: 0.99 }]
  },

  // Browser chrome
  browserBar: {
    alignItems: "center",
    backgroundColor: "rgba(10, 14, 10, 0.98)",
    borderBottomColor: "rgba(244, 255, 243, 0.07)",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 10,
    height: 32,
    paddingHorizontal: 10
  },
  browserDots: { flexDirection: "row", gap: 5, width: 40 },
  browserDotsSpacer: { width: 40 },
  browserDot: { borderRadius: 999, height: 7, width: 7 },
  dotRed: { backgroundColor: "rgba(255, 95, 87, 0.7)" },
  dotYellow: { backgroundColor: "rgba(255, 188, 47, 0.7)" },
  dotGreen: { backgroundColor: "rgba(39, 201, 63, 0.7)" },
  addressBar: {
    alignItems: "center",
    backgroundColor: "rgba(244, 255, 243, 0.05)",
    borderColor: "rgba(244, 255, 243, 0.08)",
    borderRadius: 7,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 6,
    height: 22,
    paddingHorizontal: 8
  },
  addressLockDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 5,
    opacity: 0.7,
    width: 5
  },
  addressText: {
    color: "rgba(244, 255, 243, 0.5)",
    flex: 1,
    fontSize: 10,
    fontWeight: "500"
  },

  // Mini site
  miniSite: { overflow: "hidden" },

  miniHero: {
    backgroundColor: "rgba(7, 11, 7, 1)",
    overflow: "hidden"
  },
  miniHeroRoomy: {
    minHeight: 176
  },
  miniHeroBg: {
    backgroundColor: "rgba(200, 255, 61, 0.025)",
    bottom: 0, left: 0, position: "absolute", right: 0, top: 0
  },
  miniNavBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 10
  },
  miniLogoBlock: { alignItems: "center", flexDirection: "row", gap: 5 },
  miniLogoDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 7,
    width: 7
  },
  miniLogoLine: {
    backgroundColor: "rgba(244, 255, 243, 0.45)",
    borderRadius: 999,
    height: 4,
    width: 36
  },
  miniNavLinks: { flexDirection: "row", gap: 7 },
  miniNavLink: {
    backgroundColor: "rgba(244, 255, 243, 0.18)",
    borderRadius: 999,
    height: 4,
    width: 20
  },
  miniNavLinkAccent: { backgroundColor: colors.primary, width: 30 },

  miniHeroContent: {
    paddingBottom: 12,
    paddingHorizontal: 12,
    paddingTop: 10
  },
  miniBusinessName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
    lineHeight: 20
  },
  miniTagline: {
    color: "rgba(244, 255, 243, 0.5)",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3
  },
  miniHeroRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10
  },
  miniCtaButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5
  },
  miniCtaText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: "800"
  },
  miniServicePills: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  miniServicePill: {
    backgroundColor: "rgba(200, 255, 61, 0.07)",
    borderColor: "rgba(200, 255, 61, 0.18)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  miniServicePillText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: "600"
  },

  miniFooter: {
    alignItems: "center",
    backgroundColor: "rgba(5, 8, 5, 1)",
    borderTopColor: "rgba(200, 255, 61, 0.1)",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  miniTrustStars: { flexDirection: "row", gap: 2 },
  miniStar: {
    backgroundColor: "rgba(255, 196, 0, 0.65)",
    borderRadius: 1,
    height: 6,
    transform: [{ rotate: "45deg" }],
    width: 6
  },
  miniFooterText: {
    color: "rgba(244, 255, 243, 0.35)",
    fontSize: 9,
    fontWeight: "500"
  },
  miniFooterDivider: {
    backgroundColor: "rgba(244, 255, 243, 0.12)",
    height: 10,
    width: 1
  },

  // Tap affordance
  tapAffordance: {
    alignItems: "center",
    backgroundColor: "rgba(200, 255, 61, 0.04)",
    borderTopColor: "rgba(200, 255, 61, 0.12)",
    borderTopWidth: 1,
    paddingVertical: 9
  },
  tapAffordanceText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2
  },

  // ── Three setup boxes
  setupRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16
  },
  setupBox: {
    alignItems: "center",
    backgroundColor: "rgba(12, 16, 13, 0.92)",
    borderColor: "rgba(41, 50, 38, 0.8)",
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    gap: 7,
    paddingHorizontal: 8,
    paddingVertical: 12
  },
  setupCheck: {
    alignItems: "center",
    backgroundColor: "rgba(200, 255, 61, 0.12)",
    borderColor: "rgba(200, 255, 61, 0.3)",
    borderRadius: 999,
    borderWidth: 1,
    height: 22,
    justifyContent: "center",
    width: 22
  },
  setupCheckInner: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 9,
    width: 9
  },
  setupLabel: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 15,
    textAlign: "center"
  },

  // ── CTA section
  ctaSection: {
    gap: 10
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 58,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 18
  },
  primaryButtonPressed: {
    backgroundColor: colors.primaryPressed,
    shadowOpacity: 0,
    transform: [{ scale: 0.98 }]
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "800"
  },
  primaryButtonArrow: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "800"
  },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12
  },
  editButtonPressed: { opacity: 0.55 },
  editButtonText: {
    color: "rgba(244, 255, 243, 0.45)",
    fontSize: 15,
    fontWeight: "600"
  }
});
