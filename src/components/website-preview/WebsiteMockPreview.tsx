import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../../app/theme";
import {
  AnswerValue,
  OnboardingAnswers,
  OnboardingMediaAsset
} from "../../types/onboarding";

type WebsiteMockPreviewProps = {
  answers: OnboardingAnswers;
};

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

function getAnswerText(answer: AnswerValue | undefined, fallback: string) {
  if (isMediaAnswerValue(answer)) {
    return answer.length === 1 ? "1 image uploaded" : `${answer.length} images uploaded`;
  }

  if (isStringListAnswer(answer)) {
    return answer.length > 0 ? answer.join(", ") : fallback;
  }

  return answer && answer.length > 0 ? answer : fallback;
}

function getListAnswer(answer: AnswerValue | undefined, fallback: string[]) {
  if (isMediaAnswerValue(answer)) {
    return answer.map((asset) => asset.fileName ?? "Uploaded image");
  }

  if (isStringListAnswer(answer)) {
    return answer.length > 0 ? answer : fallback;
  }

  return answer ? [answer] : fallback;
}

function getMediaAnswer(answer: AnswerValue | undefined) {
  if (isMediaAnswerValue(answer)) {
    return answer;
  }

  return [];
}

function capitalizePhrase(value: string) {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildHeroHeadline(businessName: string, businessType: string) {
  return `${businessName} helps local customers with dependable ${businessType.toLowerCase()} support.`;
}

function buildHeroCopy(
  serviceAreas: string,
  primaryAction: string,
  voice: string,
  visualStyle: string
) {
  return `Built with a ${voice.toLowerCase()} voice and a ${visualStyle.toLowerCase()} look, this first mock site is aimed at helping nearby customers ${primaryAction.toLowerCase()} across ${serviceAreas}.`;
}

function buildReviewQuote(reviewDetails: string, businessName: string) {
  if (
    reviewDetails.length > 0 &&
    reviewDetails !== "No extra review details yet"
  ) {
    return reviewDetails;
  }

  return `${businessName} showed up on time, kept the job moving, and made the whole project feel easy.`;
}

function buildAboutCopy(
  businessName: string,
  businessType: string,
  differentiators: string[],
  credentials: string
) {
  const lead = `${businessName} is positioned here as a reliable ${businessType.toLowerCase()} business for homeowners and local commercial customers.`;
  const highlights = differentiators.length > 0
    ? ` The site leans on proof points like ${differentiators.slice(0, 3).join(", ")}.`
    : "";
  const trust = credentials.length > 0 && credentials !== "Details coming soon"
    ? ` It also calls out ${credentials.toLowerCase()} to build trust early.`
    : "";

  return `${lead}${highlights}${trust}`;
}

export function WebsiteMockPreview({ answers }: WebsiteMockPreviewProps) {
  const businessName = getAnswerText(answers.businessName, "Your Business");
  const businessType = getAnswerText(answers.businessType, "Local service business");
  const primaryAction = getAnswerText(answers.primaryAction, "Request a quote");
  const serviceAreas = getAnswerText(answers.serviceAreas, "your local service area");
  const voice = getAnswerText(answers.voice, "Professional");
  const visualStyle = getAnswerText(answers.visualStyle, "Clean and professional");
  const contact = getAnswerText(answers.contact, "Phone and email coming soon");
  const domain = getAnswerText(answers.domain, "Domain details not provided yet");
  const reviews = getAnswerText(answers.reviews, "Reviews can be connected later");
  const reviewDetails = getAnswerText(answers.reviewDetails, "No extra review details yet");
  const credentials = getAnswerText(answers.credentials, "Details coming soon");
  const services = getListAnswer(answers.services, [
    "Core service",
    "Free estimates",
    "Reliable local support"
  ]);
  const differentiators = getListAnswer(answers.differentiators, [
    "Fast response",
    "High-quality work",
    "Clear communication"
  ]);
  const photoAssets = getMediaAnswer(answers.photoUpload);
  const logoAssets = getMediaAnswer(answers.logoUpload);
  const reviewQuote = buildReviewQuote(reviewDetails, businessName);
  const aboutCopy = buildAboutCopy(
    businessName,
    businessType,
    differentiators,
    credentials
  );

  return (
    <View style={styles.shell}>
      <View style={styles.chromeRow}>
        <View style={styles.chromeDots}>
          <View style={[styles.chromeDot, styles.chromeDotMuted]} />
          <View style={[styles.chromeDot, styles.chromeDotPrimary]} />
          <View style={[styles.chromeDot, styles.chromeDotMuted]} />
        </View>
        <Text style={styles.chromeLabel}>Generated first website preview</Text>
      </View>

      <View style={styles.siteFrame}>
        <View style={styles.topBar}>
          <View style={styles.brandLockup}>
            {logoAssets.length > 0 ? (
              <Image source={{ uri: logoAssets[0].uri }} style={styles.logoImage} />
            ) : (
              <View style={styles.logoFallback}>
                <Text style={styles.logoFallbackText}>
                  {businessName.slice(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.brandCopy}>
              <Text style={styles.brandName}>{businessName}</Text>
              <Text style={styles.brandType}>{businessType}</Text>
            </View>
          </View>
          <View style={styles.topBarMeta}>
            <Text style={styles.topBarMetaText}>{serviceAreas}</Text>
            <Text style={styles.topBarMetaCta}>{primaryAction}</Text>
          </View>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.heroCopyColumn}>
            <Text style={styles.kicker}>Phone-first launch mock</Text>
            <Text style={styles.heroHeadline}>
              {buildHeroHeadline(businessName, businessType)}
            </Text>
            <Text style={styles.heroBody}>
              {buildHeroCopy(serviceAreas, primaryAction, voice, visualStyle)}
            </Text>
            <View style={styles.ctaRow}>
              <View style={styles.primaryCta}>
                <Text style={styles.primaryCtaText}>{primaryAction}</Text>
              </View>
              <View style={styles.secondaryPill}>
                <Text style={styles.secondaryPillText}>{contact}</Text>
              </View>
            </View>
          </View>

          <View style={styles.heroAccentCard}>
            <Text style={styles.accentEyebrow}>Site direction</Text>
            <Text style={styles.accentTitle}>{capitalizePhrase(visualStyle)}</Text>
            <Text style={styles.accentCopy}>
              {capitalizePhrase(voice)} messaging, trust-forward sections, and a clear local-service CTA flow.
            </Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{services.length}</Text>
                <Text style={styles.metricLabel}>Core services</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{photoAssets.length || 1}</Text>
                <Text style={styles.metricLabel}>Gallery tiles</Text>
              </View>
              <View style={styles.metricCardWide}>
                <Text style={styles.metricValueSmall}>{domain}</Text>
                <Text style={styles.metricLabel}>Domain status</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.ribbonRow}>
          <View style={styles.ribbonCard}>
            <Text style={styles.ribbonLabel}>Service area</Text>
            <Text style={styles.ribbonValue}>{serviceAreas}</Text>
          </View>
          <View style={styles.ribbonCard}>
            <Text style={styles.ribbonLabel}>Proof points</Text>
            <Text style={styles.ribbonValue}>{differentiators.slice(0, 3).join(" • ")}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Services</Text>
            <Text style={styles.sectionTitle}>What this website would feature first</Text>
          </View>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <View key={`${service}-${index}`} style={styles.serviceCard}>
                <Text style={styles.serviceIndex}>{String(index + 1).padStart(2, "0")}</Text>
                <Text style={styles.serviceName}>{service}</Text>
                <Text style={styles.serviceCopy}>
                  Clear benefit-driven copy for customers looking for fast local help.
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Gallery</Text>
            <Text style={styles.sectionTitle}>Job photos shaped into a visual proof section</Text>
          </View>
          {photoAssets.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.galleryRow}>
                {photoAssets.map((asset, index) => (
                  <View key={asset.uri} style={styles.galleryCard}>
                    <Image source={{ uri: asset.uri }} style={styles.galleryImage} />
                    <View style={styles.galleryCaption}>
                      <Text style={styles.galleryCaptionIndex}>
                        Project {String(index + 1).padStart(2, "0")}
                      </Text>
                      <Text style={styles.galleryCaptionText}>
                        Added from onboarding and ready for a hero, gallery, or before-and-after slot.
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyGallery}>
              <Text style={styles.emptyGalleryTitle}>Photo-ready layout</Text>
              <Text style={styles.emptyGalleryCopy}>
                The structure is here already, and uploaded project photos will snap into this section as soon as they are added.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.storyRow}>
          <View style={[styles.section, styles.storyColumn]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>About</Text>
              <Text style={styles.sectionTitle}>How the site would position the business</Text>
            </View>
            <Text style={styles.bodyCopy}>{aboutCopy}</Text>
            <View style={styles.badgeRow}>
              {differentiators.map((item) => (
                <View key={item} style={styles.badge}>
                  <Text style={styles.badgeText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.section, styles.reviewColumn]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>Reviews</Text>
              <Text style={styles.sectionTitle}>Trust signals the AI would emphasize</Text>
            </View>
            <Text style={styles.reviewType}>{reviews}</Text>
            <Text style={styles.reviewQuote}>"{reviewQuote}"</Text>
          </View>
        </View>

        <View style={styles.contactPanel}>
          <View style={styles.contactCopy}>
            <Text style={styles.contactEyebrow}>Contact section</Text>
            <Text style={styles.contactTitle}>Built to convert local visitors quickly</Text>
            <Text style={styles.contactText}>
              This footer area is where the app would place tap-to-call, lead form, service area reminders, and domain setup details in later phases.
            </Text>
          </View>
          <View style={styles.contactRail}>
            <Text style={styles.contactRailLabel}>Primary action</Text>
            <Text style={styles.contactRailValue}>{primaryAction}</Text>
            <Text style={styles.contactRailLabel}>Business contact</Text>
            <Text style={styles.contactRailValue}>{contact}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 32,
    borderWidth: 1,
    overflow: "hidden"
  },
  chromeRow: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  chromeDots: {
    flexDirection: "row",
    gap: 6
  },
  chromeDot: {
    borderRadius: 999,
    height: 8,
    width: 8
  },
  chromeDotMuted: {
    backgroundColor: colors.border
  },
  chromeDotPrimary: {
    backgroundColor: colors.primary
  },
  chromeLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600"
  },
  siteFrame: {
    backgroundColor: colors.background,
    gap: spacing.lg,
    padding: spacing.lg
  },
  topBar: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    paddingBottom: spacing.md
  },
  brandLockup: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    gap: spacing.sm
  },
  logoImage: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    height: 48,
    width: 48
  },
  logoFallback: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  logoFallbackText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "900"
  },
  brandCopy: {
    flex: 1,
    gap: 2
  },
  brandName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  brandType: {
    color: colors.textMuted,
    fontSize: 13
  },
  topBarMeta: {
    alignItems: "flex-end",
    gap: 4,
    maxWidth: "46%"
  },
  topBarMetaText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "right"
  },
  topBarMetaCta: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right"
  },
  heroSection: {
    gap: spacing.md
  },
  heroCopyColumn: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  heroHeadline: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36
  },
  heroBody: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24
  },
  ctaRow: {
    gap: spacing.sm
  },
  primaryCta: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm
  },
  primaryCtaText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: "900"
  },
  secondaryPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  secondaryPillText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600"
  },
  heroAccentCard: {
    backgroundColor: "#c8ff3d",
    borderRadius: 28,
    gap: spacing.md,
    padding: spacing.lg
  },
  accentEyebrow: {
    color: "#243000",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  accentTitle: {
    color: "#0f1404",
    fontSize: 24,
    fontWeight: "900"
  },
  accentCopy: {
    color: "#213000",
    fontSize: 14,
    lineHeight: 22
  },
  metricsGrid: {
    gap: spacing.sm
  },
  metricCard: {
    backgroundColor: "rgba(5, 7, 6, 0.12)",
    borderRadius: 20,
    gap: 2,
    padding: spacing.md
  },
  metricCardWide: {
    backgroundColor: "rgba(5, 7, 6, 0.12)",
    borderRadius: 20,
    gap: 6,
    padding: spacing.md
  },
  metricValue: {
    color: "#101608",
    fontSize: 28,
    fontWeight: "900"
  },
  metricValueSmall: {
    color: "#101608",
    fontSize: 15,
    fontWeight: "800"
  },
  metricLabel: {
    color: "#314200",
    fontSize: 12,
    fontWeight: "700"
  },
  ribbonRow: {
    gap: spacing.sm
  },
  ribbonCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 6,
    padding: spacing.md
  },
  ribbonLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  ribbonValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22
  },
  section: {
    gap: spacing.md
  },
  sectionHeader: {
    gap: 4
  },
  sectionEyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28
  },
  servicesGrid: {
    gap: spacing.sm
  },
  serviceCard: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  serviceIndex: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800"
  },
  serviceName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  serviceCopy: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21
  },
  galleryRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingRight: spacing.sm
  },
  galleryCard: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    width: 252
  },
  galleryImage: {
    backgroundColor: colors.surfaceMuted,
    height: 180,
    width: "100%"
  },
  galleryCaption: {
    gap: 6,
    padding: spacing.md
  },
  galleryCaptionIndex: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800"
  },
  galleryCaptionText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20
  },
  emptyGallery: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 24,
    borderStyle: "dashed",
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg
  },
  emptyGalleryTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  emptyGalleryCopy: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22
  },
  storyRow: {
    gap: spacing.md
  },
  storyColumn: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 26,
    borderWidth: 1,
    padding: spacing.lg
  },
  reviewColumn: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 26,
    borderWidth: 1,
    padding: spacing.lg
  },
  bodyCopy: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  badge: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700"
  },
  reviewType: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  reviewQuote: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 30
  },
  contactPanel: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 30,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  contactCopy: {
    gap: spacing.sm
  },
  contactEyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  contactTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  contactText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22
  },
  contactRail: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 6,
    padding: spacing.md
  },
  contactRailLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  contactRailValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22
  }
});
