import { useRef, useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
import * as Haptics from "expo-haptics";

import { useDeviceScreenProfile } from "../../app/deviceScreen";
import { colors, spacing } from "../../app/theme";
import { OnboardingAnswers } from "../../types/onboarding";

// ─── Types ────────────────────────────────────────────────────────────────────

type DashboardTab = "ai" | "domain" | "contact" | "settings";

type DashboardPlaceholderScreenProps = {
  onBack: () => void;
  answers?: OnboardingAnswers;
  onEditAnswers?: () => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DASHBOARD_TABS: { id: DashboardTab; label: string }[] = [
  { id: "ai", label: "AI EDITOR" },
  { id: "domain", label: "DOMAIN" },
  { id: "contact", label: "CONTACT" },
  { id: "settings", label: "SETTINGS" }
];

const AI_CHIPS = [
  "Add a new service",
  "Upload recent job photos",
  "Make the homepage more premium",
  "Update my service area"
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStringAnswer(answers: OnboardingAnswers, key: keyof OnboardingAnswers): string {
  const val = answers[key];
  return typeof val === "string" ? val : "";
}

function getListAnswer(answers: OnboardingAnswers, key: keyof OnboardingAnswers): string[] {
  const val = answers[key];
  return Array.isArray(val) && val.every((v) => typeof v === "string") ? (val as string[]) : [];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 32);
}

function getPrimaryEmail(contact: string): string {
  const parts = contact.split(",").map((s) => s.trim());
  const email = parts.find((p) => p.includes("@"));
  return email ?? "owner@example.com";
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DashboardPlaceholderScreen({
  onBack,
  answers = {},
  onEditAnswers
}: DashboardPlaceholderScreenProps) {
  const screenProfile = useDeviceScreenProfile();
  const [activeTab, setActiveTab] = useState<DashboardTab>("ai");
  const [pageWidth, setPageWidth] = useState(screenProfile.width);
  const pageScrollRef = useRef<ScrollView>(null);
  const tabScrollRef = useRef<ScrollView>(null);

  // AI Editor state
  const [aiDraft, setAiDraft] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiPending, setAiPending] = useState(false);

  // Domain state
  const [domainSearch, setDomainSearch] = useState("");
  const [domainResult, setDomainResult] = useState<"idle" | "available" | "reserved">("idle");

  // Contact state
  const businessContact = getStringAnswer(answers, "contact");
  const [primaryEmail, setPrimaryEmail] = useState(getPrimaryEmail(businessContact));
  const [ccEmails, setCcEmails] = useState("");
  const [sendCopy, setSendCopy] = useState(true);
  const [markUrgent, setMarkUrgent] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);

  // Derived
  const businessName = getStringAnswer(answers, "businessName") || "Your Business";
  const businessType = getStringAnswer(answers, "businessType") || "Contractor";
  const serviceAreas = getStringAnswer(answers, "serviceAreas") || "Your area";
  const services = getListAnswer(answers, "services").filter((s) => s !== "Add later");
  const primaryAction = getStringAnswer(answers, "primaryAction") || "Call";
  const logo = getStringAnswer(answers, "logo");
  const photos = getListAnswer(answers, "photos").filter((p) => p !== "Add later");
  const reviews = getStringAnswer(answers, "reviews");
  const slug = slugify(businessName) || "your-business";
  const tempDomain = `${slug}.sitesnap.com`;

  const tabIndex = DASHBOARD_TABS.findIndex((t) => t.id === activeTab);

  const switchToTab = (tab: DashboardTab) => {
    const index = DASHBOARD_TABS.findIndex((t) => t.id === tab);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
    pageScrollRef.current?.scrollTo({ x: index * pageWidth, animated: false });
    // Scroll tab bar so active tab is visible
    tabScrollRef.current?.scrollTo({ x: Math.max(0, index * 90 - 40), animated: true });
  };

  const handlePageScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    const tab = DASHBOARD_TABS[index];
    if (tab && tab.id !== activeTab) {
      setActiveTab(tab.id);
      tabScrollRef.current?.scrollTo({ x: Math.max(0, index * 90 - 40), animated: true });
    }
  };

  const handlePagesLayout = (e: LayoutChangeEvent) => {
    const measuredWidth = e.nativeEvent.layout.width;
    if (measuredWidth > 0 && measuredWidth !== pageWidth) {
      setPageWidth(measuredWidth);
    }
  };

  const handleAiSubmit = () => {
    if (!aiDraft.trim()) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAiPending(true);
    setTimeout(() => {
      setAiPending(false);
      setAiResponse(aiDraft.trim());
      setAiDraft("");
    }, 900);
  };

  const handleDomainCheck = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDomainResult("available");
  };

  const handleDomainReserve = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDomainResult("reserved");
  };

  const handleSaveContact = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 2500);
  };

  const searchSlug = slugify(domainSearch) || slug;

  const contentHeight =
    screenProfile.height - screenProfile.topInset - screenProfile.bottomInset - 98;

  return (
    <View style={[styles.root, { paddingTop: screenProfile.topInset }]}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>Live</Text>
          </View>
          <Text style={styles.businessName} numberOfLines={1}>{businessName}</Text>
        </View>
        <Text style={styles.domainText} numberOfLines={1}>{tempDomain}</Text>
      </View>

      {/* ── Tab Bar ────────────────────────────────────────────────────────── */}
      <View style={styles.tabBarWrap}>
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          {DASHBOARD_TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <Pressable
                key={tab.id}
                accessibilityRole="tab"
                onPress={() => switchToTab(tab.id)}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                {active && <View style={styles.tabUnderline} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Pages ──────────────────────────────────────────────────────────── */}
      <ScrollView
        ref={pageScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handlePageScroll}
        onLayout={handlePagesLayout}
        scrollEventThrottle={16}
        style={styles.pages}
        contentOffset={{ x: tabIndex * pageWidth, y: 0 }}
      >
        {/* PAGE 1: AI EDITOR */}
        <ScrollView
          style={[styles.page, { width: pageWidth }]}
          contentContainerStyle={[styles.pageContent, { minHeight: contentHeight }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Live preview card */}
          <View style={styles.previewCard}>
            <View style={styles.previewCardHeader}>
              <View style={styles.smallLiveBadge}>
                <View style={styles.smallLiveDot} />
                <Text style={styles.smallLiveBadgeText}>Live site preview</Text>
              </View>
              <Text style={styles.previewDomain} numberOfLines={1}>{tempDomain}</Text>
            </View>
            <View style={styles.miniSitePreview}>
              <View style={styles.miniNav}>
                <View style={styles.miniLogoDot} />
                <View style={{ flex: 1 }} />
                <View style={styles.miniNavBtn} />
              </View>
              <View style={styles.miniHero}>
                <Text style={styles.miniHeroName} numberOfLines={1}>{businessName}</Text>
                <Text style={styles.miniHeroSub} numberOfLines={1}>
                  {businessType} · {serviceAreas.split(",")[0].trim()}
                </Text>
                <View style={styles.miniCta}>
                  <Text style={styles.miniCtaText}>{primaryAction}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.previewNote}>
              Changes are mocked until AI publishing is connected.
            </Text>
          </View>

          {/* Response area */}
          {aiResponse && (
            <View style={styles.aiResponseCard}>
              <View style={styles.aiResponseHeader}>
                <View style={styles.aiDot} />
                <Text style={styles.aiResponseTitle}>Draft edit ready</Text>
              </View>
              <Text style={styles.aiResponseBody}>
                &ldquo;{aiResponse}&rdquo;
              </Text>
              <Text style={styles.aiResponseSub}>
                SiteSnap would prepare a preview before publishing this change.
              </Text>
              <Pressable
                style={styles.publishBtn}
                accessibilityRole="button"
              >
                <Text style={styles.publishBtnText}>Publish Edit (coming soon)</Text>
              </Pressable>
            </View>
          )}

          {/* Chips */}
          <View style={styles.chipsRow}>
            {AI_CHIPS.map((chip) => (
              <Pressable
                key={chip}
                accessibilityRole="button"
                onPress={() => setAiDraft(chip)}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </Pressable>
            ))}
          </View>

          {/* Composer */}
          <View style={styles.composer}>
            <TextInput
              style={styles.composerInput}
              value={aiDraft}
              onChangeText={setAiDraft}
              placeholder="Ask SiteSnap to update your website..."
              placeholderTextColor={colors.textMuted}
              multiline
              returnKeyType="send"
              onSubmitEditing={handleAiSubmit}
              selectionColor={colors.accent}
            />
            <Pressable
              accessibilityRole="button"
              onPress={handleAiSubmit}
              disabled={!aiDraft.trim() || aiPending}
              style={({ pressed }) => [
                styles.composerSend,
                (!aiDraft.trim() || aiPending) && styles.composerSendDisabled,
                pressed && aiDraft.trim() && styles.composerSendPressed
              ]}
            >
              <Text style={styles.composerSendText}>{aiPending ? "..." : "→"}</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* PAGE 2: DOMAIN */}
        <ScrollView
          style={[styles.page, { width: pageWidth }]}
          contentContainerStyle={[styles.pageContent, { minHeight: contentHeight }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Active domain card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>Temporary Domain</Text>
              <View style={styles.activePill}>
                <View style={styles.activePillDot} />
                <Text style={styles.activePillText}>Active</Text>
              </View>
            </View>
            <Text style={styles.domainBig}>{tempDomain}</Text>
            <Text style={styles.cardSub}>
              Your website is live here while custom domain setup is prepared.
            </Text>
          </View>

          {/* Custom domain search */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Get a Custom Domain</Text>
            <View style={styles.domainSearchRow}>
              <TextInput
                style={styles.domainInput}
                value={domainSearch}
                onChangeText={setDomainSearch}
                placeholder={`${slug}.com`}
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor={colors.accent}
              />
              <Pressable
                accessibilityRole="button"
                onPress={handleDomainCheck}
                style={({ pressed }) => [styles.checkBtn, pressed && styles.checkBtnPressed]}
              >
                <Text style={styles.checkBtnText}>Check</Text>
              </Pressable>
            </View>

            {domainResult !== "idle" && (
              <View style={styles.domainResultCard}>
                <Text style={styles.domainResultName}>{searchSlug}.com</Text>
                <View style={styles.domainResultRight}>
                  {domainResult === "reserved" ? (
                    <Text style={styles.domainReservedText}>Reserved</Text>
                  ) : (
                    <>
                      <View style={styles.availablePill}>
                        <Text style={styles.availablePillText}>Available</Text>
                      </View>
                      <Text style={styles.domainPrice}>$14.99/yr</Text>
                      <Pressable
                        accessibilityRole="button"
                        onPress={handleDomainReserve}
                        style={({ pressed }) => [styles.reserveBtn, pressed && styles.reserveBtnPressed]}
                      >
                        <Text style={styles.reserveBtnText}>Reserve</Text>
                      </Pressable>
                    </>
                  )}
                </View>
              </View>
            )}

            {domainResult === "reserved" && (
              <Text style={styles.mockNote}>Domain reserved in mock mode.</Text>
            )}
          </View>

          {/* Connect existing */}
          <View style={[styles.card, styles.cardSecondary]}>
            <Text style={styles.cardLabel}>Connect Existing Domain</Text>
            <Text style={styles.cardSub}>
              Already own a domain? Point it to SiteSnap when custom domain routing is live.
            </Text>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
            >
              <Text style={styles.secondaryBtnText}>Connect Domain (coming soon)</Text>
            </Pressable>
          </View>

          <Text style={styles.footNote}>
            Custom domain purchasing will be connected later. Temporary SiteSnap domains are ready first.
          </Text>
        </ScrollView>

        {/* PAGE 3: CONTACT */}
        <ScrollView
          style={[styles.page, { width: pageWidth }]}
          contentContainerStyle={[styles.pageContent, { minHeight: contentHeight }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Status */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>Contact Routing</Text>
              <View style={styles.activePill}>
                <View style={styles.activePillDot} />
                <Text style={styles.activePillText}>Connected</Text>
              </View>
            </View>
            <Text style={styles.cardSub}>
              Quote requests from your website will be routed to your inbox.
            </Text>
          </View>

          {/* Email fields */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Primary Email</Text>
            <TextInput
              style={styles.fieldInput}
              value={primaryEmail}
              onChangeText={setPrimaryEmail}
              placeholder="owner@example.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor={colors.accent}
            />

            <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>CC Emails</Text>
            <TextInput
              style={styles.fieldInput}
              value={ccEmails}
              onChangeText={setCcEmails}
              placeholder="Add CC emails, separated by commas"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor={colors.accent}
            />

            {/* Toggles */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Send me a copy of every request</Text>
              <Switch
                value={sendCopy}
                onValueChange={setSendCopy}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Mark quote requests as urgent</Text>
              <Switch
                value={markUrgent}
                onValueChange={setMarkUrgent}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleSaveContact}
              style={({ pressed }) => [styles.primaryActionBtn, pressed && styles.primaryActionBtnPressed]}
            >
              <Text style={styles.primaryActionBtnText}>
                {contactSaved ? "Routing saved locally" : "Save Routing"}
              </Text>
            </Pressable>
          </View>

          {/* Mini email preview */}
          <View style={[styles.card, styles.cardSecondary]}>
            <Text style={styles.cardLabel}>Email Preview</Text>
            <View style={styles.emailPreview}>
              <Text style={styles.emailSubject}>New quote request</Text>
              <Text style={styles.emailLine}>Customer name, phone, message</Text>
              <Text style={styles.emailLine}>Requested service · {businessType}</Text>
              <Text style={styles.emailLine}>→ {primaryEmail}</Text>
            </View>
          </View>
        </ScrollView>

        {/* PAGE 4: SETTINGS */}
        <ScrollView
          style={[styles.page, { width: pageWidth }]}
          contentContainerStyle={[styles.pageContent, { minHeight: contentHeight }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Status card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>Website Status</Text>
              <View style={styles.activePill}>
                <View style={styles.activePillDot} />
                <Text style={styles.activePillText}>Live</Text>
              </View>
            </View>
            <Text style={styles.domainBig}>{tempDomain}</Text>
            <Text style={styles.cardSub}>Last updated: Just now</Text>
          </View>

          {/* Business profile */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Business Profile</Text>
            <View style={styles.profileRows}>
              <ProfileRow label="Name" value={businessName} />
              <ProfileRow label="Type" value={businessType} />
              <ProfileRow label="Areas" value={serviceAreas || "Not set"} />
              <ProfileRow
                label="Services"
                value={services.length > 0 ? services.slice(0, 3).join(", ") : "Not set"}
              />
            </View>
          </View>

          {/* Assets */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Content Assets</Text>
            <View style={styles.profileRows}>
              <AssetRow
                label="Logo"
                value={logo === "Yes, upload it" ? "Uploaded" : logo || "Not set"}
                ready={!!logo && logo !== "No, make me a simple one"}
              />
              <AssetRow
                label="Photos"
                value={photos.length > 0 ? `${photos.length} selected` : "Not added"}
                ready={photos.length > 0}
              />
              <AssetRow
                label="Reviews"
                value={reviews && reviews !== "Skip" ? reviews : "Not added"}
                ready={!!reviews && reviews !== "Skip"}
              />
            </View>
          </View>

          {/* Checklist */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Launch Checklist</Text>
            <View style={styles.checklist}>
              <ChecklistRow label="Website activated" done />
              <ChecklistRow label="Temporary domain ready" done />
              <ChecklistRow label="Contact form connected" done />
              <ChecklistRow label="AI Editor unlocked" done />
              <ChecklistRow label="Custom domain" done={false} optional />
            </View>
          </View>

          {/* Quick actions */}
          <View style={styles.actionsGroup}>
            <Pressable
              accessibilityRole="button"
              onPress={onEditAnswers ?? onBack}
              style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            >
              <Text style={styles.actionBtnText}>Edit Onboarding Answers</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            >
              <Text style={styles.actionBtnText}>Preview Public Site</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            >
              <Text style={styles.actionBtnText}>Request Support</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileRowLabel}>{label}</Text>
      <Text style={styles.profileRowValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function AssetRow({ label, value, ready }: { label: string; value: string; ready: boolean }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileRowLabel}>{label}</Text>
      <View style={styles.assetRowRight}>
        <View style={[styles.assetDot, ready && styles.assetDotReady]} />
        <Text style={[styles.profileRowValue, !ready && { color: colors.textMuted }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function ChecklistRow({ label, done, optional }: { label: string; done: boolean; optional?: boolean }) {
  return (
    <View style={styles.checklistRow}>
      <View style={[styles.checkBox, done && styles.checkBoxDone]}>
        {done && <View style={styles.checkMark} />}
      </View>
      <Text style={[styles.checklistLabel, !done && styles.checklistLabelMuted]}>
        {label}
        {optional ? "  (optional)" : ""}
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1
  },

  // Header
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 10,
    paddingTop: 6
  },
  headerTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 3
  },
  liveBadge: {
    alignItems: "center",
    backgroundColor: "rgba(200, 255, 61, 0.1)",
    borderColor: "rgba(200, 255, 61, 0.28)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4
  },
  liveDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 6,
    width: 6
  },
  liveBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase"
  },
  businessName: {
    color: colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2
  },
  domainText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.1
  },

  // Tab bar
  tabBarWrap: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1
  },
  tabBarContent: {
    flexDirection: "row",
    paddingHorizontal: spacing.md
  },
  tab: {
    alignItems: "center",
    marginRight: 4,
    paddingBottom: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    position: "relative"
  },
  tabActive: {},
  tabLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6
  },
  tabLabelActive: {
    color: colors.primary
  },
  tabUnderline: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    bottom: 0,
    height: 2,
    left: 12,
    position: "absolute",
    right: 12
  },

  // Pages
  pages: {
    flex: 1
  },
  page: {
    flex: 1
  },
  pageContent: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md
  },

  // Cards
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: spacing.md
  },
  cardSecondary: {
    backgroundColor: colors.panel,
    borderColor: "rgba(41, 50, 38, 0.6)"
  },
  cardHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  cardSub: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6
  },

  // Status pills
  activePill: {
    alignItems: "center",
    backgroundColor: "rgba(200, 255, 61, 0.1)",
    borderColor: "rgba(200, 255, 61, 0.25)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3
  },
  activePillDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 5,
    width: 5
  },
  activePillText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700"
  },

  // AI Editor
  previewCard: {
    backgroundColor: colors.panel,
    borderColor: "rgba(200, 255, 61, 0.22)",
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden"
  },
  previewCardHeader: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 3,
    padding: spacing.md
  },
  smallLiveBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(200, 255, 61, 0.08)",
    borderColor: "rgba(200, 255, 61, 0.2)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  smallLiveDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 5,
    width: 5
  },
  smallLiveBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase"
  },
  previewDomain: {
    color: colors.textMuted,
    fontSize: 12
  },
  miniSitePreview: {
    backgroundColor: "rgba(7, 11, 7, 1)",
    padding: spacing.md
  },
  miniNav: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10
  },
  miniLogoDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 8,
    marginRight: 6,
    width: 8
  },
  miniNavBtn: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 8,
    width: 36
  },
  miniHero: {
    gap: 6
  },
  miniHeroName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  miniHeroSub: {
    color: colors.textMuted,
    fontSize: 11
  },
  miniCta: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: 999,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 5
  },
  miniCtaText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: "800"
  },
  previewNote: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    padding: spacing.md
  },

  aiResponseCard: {
    backgroundColor: "rgba(200, 255, 61, 0.05)",
    borderColor: "rgba(200, 255, 61, 0.2)",
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md
  },
  aiResponseHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  aiDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 8,
    width: 8
  },
  aiResponseTitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2
  },
  aiResponseBody: {
    color: colors.text,
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20
  },
  aiResponseSub: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17
  },
  publishBtn: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    paddingVertical: 10
  },
  publishBtnText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600"
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  chipPressed: {
    backgroundColor: "rgba(200, 255, 61, 0.08)",
    borderColor: "rgba(200, 255, 61, 0.3)"
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "500"
  },

  composer: {
    alignItems: "flex-end",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 10
  },
  composerInput: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    minHeight: 40,
    paddingTop: 4
  },
  composerSend: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 40,
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 40
  },
  composerSendDisabled: {
    opacity: 0.35,
    shadowOpacity: 0
  },
  composerSendPressed: {
    backgroundColor: colors.primaryPressed
  },
  composerSendText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "800"
  },

  // Domain
  domainBig: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginTop: 4
  },
  domainSearchRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: spacing.sm
  },
  domainInput: {
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 14,
    height: 46,
    paddingHorizontal: 14
  },
  checkBtn: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 46,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  checkBtnPressed: {
    backgroundColor: colors.primaryPressed
  },
  checkBtnText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "800"
  },
  domainResultCard: {
    alignItems: "center",
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    padding: 12
  },
  domainResultName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  domainResultRight: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  availablePill: {
    backgroundColor: "rgba(98, 248, 125, 0.12)",
    borderColor: "rgba(98, 248, 125, 0.3)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  availablePillText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: "700"
  },
  domainPrice: {
    color: colors.textMuted,
    fontSize: 13
  },
  reserveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  reserveBtnPressed: {
    backgroundColor: colors.primaryPressed
  },
  reserveBtnText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: "800"
  },
  domainReservedText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700"
  },
  mockNote: {
    color: colors.primary,
    fontSize: 12,
    marginTop: 8
  },
  secondaryBtn: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingVertical: 12
  },
  secondaryBtnPressed: {
    backgroundColor: colors.surfaceMuted
  },
  secondaryBtnText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600"
  },
  footNote: {
    color: "rgba(143, 157, 145, 0.6)",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center"
  },

  // Contact
  fieldLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 6,
    textTransform: "uppercase"
  },
  fieldInput: {
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    height: 46,
    paddingHorizontal: 14
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md
  },
  toggleLabel: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginRight: spacing.sm
  },
  primaryActionBtn: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 14,
    marginTop: spacing.md,
    minHeight: 50,
    justifyContent: "center"
  },
  primaryActionBtnPressed: {
    backgroundColor: colors.primaryPressed
  },
  primaryActionBtnText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: "800"
  },
  emailPreview: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
    marginTop: spacing.sm,
    padding: 12
  },
  emailSubject: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4
  },
  emailLine: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18
  },

  // Settings
  profileRows: {
    gap: 10,
    marginTop: 8
  },
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  profileRowLabel: {
    color: colors.textMuted,
    fontSize: 13,
    width: 70
  },
  profileRowValue: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right"
  },
  assetRowRight: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "flex-end"
  },
  assetDot: {
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 7,
    width: 7
  },
  assetDotReady: {
    backgroundColor: colors.primary
  },
  checklist: {
    gap: 10,
    marginTop: 8
  },
  checklistRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  checkBox: {
    alignItems: "center",
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    height: 20,
    justifyContent: "center",
    width: 20
  },
  checkBoxDone: {
    backgroundColor: "rgba(200, 255, 61, 0.12)",
    borderColor: "rgba(200, 255, 61, 0.35)"
  },
  checkMark: {
    backgroundColor: colors.primary,
    borderRadius: 2,
    height: 8,
    width: 8
  },
  checklistLabel: {
    color: colors.text,
    flex: 1,
    fontSize: 14
  },
  checklistLabelMuted: {
    color: colors.textMuted
  },
  actionsGroup: {
    gap: spacing.sm
  },
  actionBtn: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14
  },
  actionBtnPressed: {
    backgroundColor: colors.surfaceMuted
  },
  actionBtnText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600"
  }
});
