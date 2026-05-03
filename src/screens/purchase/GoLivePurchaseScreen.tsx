import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useDeviceScreenProfile } from "../../app/deviceScreen";
import { colors, spacing } from "../../app/theme";
import { OnboardingAnswers } from "../../types/onboarding";

const PLAN_PRICE = "$49/mo";
const PLAN_NAME = "SiteSnap Launch";

const BENEFITS = [
  "Instant website access after purchase",
  "Temporary SiteSnap domain activated automatically",
  "Contact form sends quote requests to your email",
  "AI Editor access for text, services, and photo updates",
  "Mobile-ready hosting and site updates included",
  "Custom domain setup checklist included",
] as const;

type GoLivePurchaseScreenProps = {
  answers: OnboardingAnswers;
  onBack: () => void;
  onPurchaseComplete: () => void;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 32);
}

function getStringAnswer(answers: OnboardingAnswers, key: keyof OnboardingAnswers): string {
  const val = answers[key];
  return typeof val === "string" ? val : "";
}

export function GoLivePurchaseScreen({
  answers,
  onBack,
  onPurchaseComplete,
}: GoLivePurchaseScreenProps) {
  const screenProfile = useDeviceScreenProfile();
  const [isActivating, setIsActivating] = useState(false);

  const businessName = getStringAnswer(answers, "businessName") || "Your Business";
  const slug = slugify(businessName) || "your-business";
  const domain = `${slug}.sitesnap.com`;

  const isCompact = !screenProfile.isLargePhone;

  const handleLaunch = () => {
    if (isActivating) return;
    setIsActivating(true);
    setTimeout(() => {
      onPurchaseComplete();
    }, 1500);
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: screenProfile.topInset,
          paddingBottom: screenProfile.bottomInset,
        },
      ]}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <View style={[styles.header, isCompact && styles.headerCompact]}>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusBadgeText}>Website ready</Text>
        </View>
        <Text style={[styles.headline, isCompact && styles.headlineCompact]}>
          Launch {businessName} today.
        </Text>
        <Text style={[styles.subheadline, isCompact && styles.subheadlineCompact]}>
          Your website, contact form, and temporary SiteSnap domain are ready to activate instantly.
        </Text>
        <View style={styles.domainPill}>
          <View style={styles.domainLockDot} />
          <Text style={styles.domainText} numberOfLines={1}>{domain}</Text>
        </View>
      </View>

      {/* ── Plan card (scrollable on very small devices) ───────────────────── */}
      <ScrollView
        style={styles.planScroll}
        contentContainerStyle={styles.planScrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={isCompact}
      >
        <View style={styles.planCard}>
          {/* Plan header */}
          <View style={[styles.planHeader, isCompact && styles.planHeaderCompact]}>
            <View style={styles.planNameRow}>
              <Text style={styles.planName}>{PLAN_NAME}</Text>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>Monthly</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{PLAN_PRICE}</Text>
              <Text style={styles.priceSub}>billed monthly</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Conversion copy */}
          <Text style={[styles.conversionCopy, isCompact && styles.conversionCopyCompact]}>
            Your draft is built. This unlocks the live version and your editing dashboard.
          </Text>

          {/* Benefits */}
          <View style={[styles.benefitsList, isCompact && styles.benefitsListCompact]}>
            {BENEFITS.map((benefit) => (
              <View key={benefit} style={styles.benefitRow}>
                <View style={styles.checkDot} />
                <Text style={[styles.benefitText, isCompact && styles.benefitTextCompact]}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>

          {/* Compliance copy */}
          <Text style={styles.complianceCopy}>
            Renews monthly. Cancel anytime in App Store settings.
          </Text>
        </View>

        {/* Conversion callouts */}
        <View style={[styles.callouts, isCompact && styles.calloutsCompact]}>
          <Text style={styles.calloutText}>No hosting setup. No plugins. No website builder to learn.</Text>
          <Text style={styles.calloutText}>Make changes later by asking the AI Editor.</Text>
        </View>
      </ScrollView>

      {/* ── Footer / CTA ──────────────────────────────────────────────────── */}
      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Launch my website"
          disabled={isActivating}
          onPress={handleLaunch}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && !isActivating && styles.primaryButtonPressed,
            isActivating && styles.primaryButtonActivating,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {isActivating ? "Activating..." : "Launch My Website"}
          </Text>
          {!isActivating && <Text style={styles.primaryButtonArrow}>→</Text>}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to preview"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <Text style={styles.backButtonText}>Back to Preview</Text>
        </Pressable>

        <Text style={styles.trustCopy}>Secure App Store purchase. Restore purchases available.</Text>

        <View style={styles.footerLinks}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Restore purchase"
            style={({ pressed }) => pressed && styles.footerLinkPressed}
          >
            <Text style={styles.footerLinkText}>Restore Purchase</Text>
          </Pressable>
          <Text style={styles.footerLinkDivider}>·</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Terms of service"
            style={({ pressed }) => pressed && styles.footerLinkPressed}
          >
            <Text style={styles.footerLinkText}>Terms</Text>
          </Pressable>
          <Text style={styles.footerLinkDivider}>·</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Privacy policy"
            style={({ pressed }) => pressed && styles.footerLinkPressed}
          >
            <Text style={styles.footerLinkText}>Privacy</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  // ── Header
  header: {
    gap: 8,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerCompact: {
    gap: 6,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  statusBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(200, 255, 61, 0.10)",
    borderColor: "rgba(200, 255, 61, 0.26)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  statusDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 6,
    width: 6,
  },
  statusBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  headline: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  headlineCompact: {
    fontSize: 24,
    lineHeight: 30,
  },
  subheadline: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  subheadlineCompact: {
    fontSize: 13,
    lineHeight: 19,
  },
  domainPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  domainLockDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 5,
    opacity: 0.8,
    width: 5,
  },
  domainText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Plan card scroll
  planScroll: {
    flex: 1,
  },
  planScrollContent: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  planCard: {
    backgroundColor: colors.panelRaised,
    borderColor: "rgba(200, 255, 61, 0.22)",
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
  },
  planHeader: {
    gap: 6,
    paddingBottom: 2,
  },
  planHeaderCompact: {
    gap: 4,
  },
  planNameRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  planName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  planBadge: {
    backgroundColor: "rgba(200, 255, 61, 0.10)",
    borderColor: "rgba(200, 255, 61, 0.24)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  planBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  priceRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 7,
  },
  price: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  priceSub: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: 2,
  },
  conversionCopy: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  conversionCopyCompact: {
    fontSize: 12,
    lineHeight: 17,
  },
  benefitsList: {
    gap: 9,
  },
  benefitsListCompact: {
    gap: 7,
  },
  benefitRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  checkDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 7,
    marginTop: 5,
    width: 7,
  },
  benefitText: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },
  benefitTextCompact: {
    fontSize: 12,
    lineHeight: 17,
  },
  complianceCopy: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },

  // ── Callouts
  callouts: {
    gap: 6,
    paddingHorizontal: 2,
  },
  calloutsCompact: {
    gap: 4,
  },
  calloutText: {
    color: "rgba(143, 157, 145, 0.65)",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
    textAlign: "center",
  },

  // ── Footer
  footer: {
    gap: 8,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 56,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
  primaryButtonPressed: {
    backgroundColor: colors.primaryPressed,
    shadowOpacity: 0,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonActivating: {
    backgroundColor: colors.primaryPressed,
    opacity: 0.75,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: "800",
  },
  primaryButtonArrow: {
    color: colors.background,
    fontSize: 17,
    fontWeight: "800",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  backButtonPressed: {
    opacity: 0.55,
  },
  backButtonText: {
    color: "rgba(244, 255, 243, 0.45)",
    fontSize: 15,
    fontWeight: "600",
  },
  trustCopy: {
    color: "rgba(143, 157, 145, 0.55)",
    fontSize: 11,
    textAlign: "center",
  },
  footerLinks: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  footerLinkText: {
    color: "rgba(143, 157, 145, 0.50)",
    fontSize: 11,
    fontWeight: "600",
  },
  footerLinkDivider: {
    color: "rgba(143, 157, 145, 0.30)",
    fontSize: 11,
  },
  footerLinkPressed: {
    opacity: 0.55,
  },
});
