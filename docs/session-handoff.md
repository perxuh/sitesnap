# SiteSnap Session Handoff

## Purpose

This file is the fastest way for a new Codex session to understand the current state of the SiteSnap project without reconstructing context from scratch.

## Project Summary

SiteSnap is a phone-first AI website builder and website manager for local small business owners, especially contractors and blue-collar service businesses.

Core promise:

A local business owner can build, launch, and update a professional website from their phone without technical knowledge.

## Instruction Source

Primary build instructions live in:

- `sitesnap_codex_build_instructions.txt`

That file defines the phased roadmap, MVP boundaries, AI safety rules, and the requirement to stop after each phase for approval.

## Current Status

Current completed phase:

- `Phase 1 - Project Setup and Documentation`

Current active phase:

- `Phase 2 - Onboarding Questionnaire`

Approval status:

- Phase 1 is complete.
- Phase 2 has started.
- Phase 2 now includes the redesigned onboarding experience, local progress persistence, review/edit loop, industry-specific service choices, preview handoff, real image picking for logo/job photos, a conversion-oriented mock preview screen, and a mocked `Go Live` purchase screen.
- Phase 2 is still not complete because the post-purchase dashboard is still fully mocked/local, the website generation brief is not normalized yet, and the preview is still a mock representation rather than a real generated website.
- Device-local storage only is still intentional at this phase. Backend and real AI work are later roadmap phases, not missing Phase 2 requirements.

## What Was Built In Phase 1

- Base Expo + TypeScript project setup
- Starter mobile app shell
- Simple clickable flow between welcome, preview placeholder, and dashboard placeholder
- Shared starter UI components
- Clean folder structure for future phases
- Core planning and documentation files

## Files Created Or Updated In Phase 1

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `babel.config.js`
- `app.json`
- `.gitignore`
- `App.tsx`
- `src/app/theme.ts`
- `src/components/common/Button.tsx`
- `src/components/common/Screen.tsx`
- `src/components/forms/.gitkeep`
- `src/components/website-preview/.gitkeep`
- `src/components/dashboard/.gitkeep`
- `src/screens/onboarding/WelcomeScreen.tsx`
- `src/screens/preview/PreviewPlaceholderScreen.tsx`
- `src/screens/dashboard/DashboardPlaceholderScreen.tsx`
- `src/screens/settings/.gitkeep`
- `src/data/industries/.gitkeep`
- `src/data/templates/.gitkeep`
- `src/lib/ai/.gitkeep`
- `src/lib/site-generator/.gitkeep`
- `src/lib/validation/.gitkeep`
- `src/types/navigation.ts`
- `src/utils/.gitkeep`
- `assets/images/.gitkeep`
- `assets/icons/.gitkeep`
- `docs/product-requirements.md`
- `docs/project-roadmap.md`
- `docs/phase-log.md`

## Important Decisions Already Made

- The project foundation uses `Expo + TypeScript`.
- The project has been upgraded to `Expo SDK 54` so it can be tested more reliably in the current iPhone `Expo Go` app.
- Phase 1 intentionally avoided backend, AI APIs, payments, publishing, and full onboarding logic.
- The app shell currently uses simple local screen state instead of a full navigation library to keep the MVP lightweight.
- We are following the instruction file rule to work one phase at a time and stop for approval after each phase.
- We are keeping mock-first architecture, especially for AI and publishing flows.
- Login should not be required before onboarding. The preferred funnel is anonymous/local onboarding first, preview second, account creation/payment later when the user wants to save, publish, or purchase.
- Domain setup should happen after `Go Live` / purchase, not before preview. The default paid/published path should start with a temporary SiteSnap domain, then guide custom domain setup as a post-purchase launch task.

## Current Folder Structure

- `src/app`
- `src/components/common`
- `src/components/forms`
- `src/components/website-preview`
- `src/components/dashboard`
- `src/screens/onboarding`
- `src/screens/preview`
- `src/screens/purchase`
- `src/screens/dashboard`
- `src/screens/settings`
- `src/data/industries`
- `src/data/templates`
- `src/lib/ai`
- `src/lib/site-generator`
- `src/lib/validation`
- `src/types`
- `src/utils`
- `assets/images`
- `assets/icons`
- `docs`

## Current App Behavior

- The app opens into a more cinematic onboarding sequence rather than dropping directly into the questionnaire.
- A short SiteSnap logo splash animates in first, followed by a full-screen bridge / landing screen.
- The bridge screen includes a stylized website mockup, an `AI website builder` badge, a contractor-focused headline, three value pillars, and a `Get Started` CTA.
- Pressing `Get Started` transitions into the questionnaire with haptic feedback and animated screen motion.
- The questionnaire is now a full-screen, per-step conversational flow instead of the earlier simpler chat shell.
- Each step uses a typewriter-style AI prompt, segmented progress bar, animated transitions, and a persistent bottom composer for text-input steps.
- The questionnaire has a compact back control beside the progress bar so users can return to the previous question without restarting the flow.
- The services question now adapts based on the selected business type. For example, Landscaping shows lawn/edging/trimming/mulch-type services, Roofing shows roof repair/replacement/leak/storm options, and Plumbing / HVAC shows drain/leak/water heater/AC/furnace options.
- The current visual direction is more polished and marketing-led: dark cinematic background texture, sharper layout hierarchy, stronger card styling, and brighter accent moments.
- The current transcript still runs through the local service business setup flow plus conditional follow-up steps for logo upload, photo upload, and review details.
- The questionnaire supports text answers, single-choice answer cards, multi-select answer cards, and image-picking steps.
- The logo upload and photo upload steps use `expo-image-picker` and show selected images inline before advancing.
- Haptic feedback is now used throughout key onboarding interactions via `expo-haptics`.
- The review screen is now a dedicated full-screen summary state that shows all visible onboarding answers and lets the user jump back to edit any single step.
- Onboarding progress is persisted locally with `@react-native-async-storage/async-storage`. Force-closing Expo Go and reopening should resume at the exact question/review state, or reopen into preview if the user already completed onboarding.
- The app uses `react-native-safe-area-context` plus `expo-device` through `src/app/deviceScreen.ts` to support full-screen layouts on larger iPhones while keeping content clear of the camera island and home indicator.
- The previous decorative top/bottom background lines were removed from onboarding and preview so the background is continuous across the entire screen.
- The preview route now renders `src/screens/preview/WebsitePreviewScreen.tsx` instead of the older placeholder summary screen.
- The preview screen shows a compact mock browser/website card, a temporary `*.sitesnap.com` domain, three dynamic setup confirmation boxes, a `Go Live` CTA, and an `Edit Answers` action.
- `Edit Answers` on the preview screen returns to the onboarding review/edit screen with the existing answers instead of restarting from the beginning.
- `Go Live` now routes to `src/screens/purchase/GoLivePurchaseScreen.tsx` instead of showing a placeholder alert.
- The purchase screen is still mocked, but is structured around future Apple/Google in-app purchase requirements: plan name, monthly price, included services, renewal/cancel copy, restore purchase, and Terms/Privacy placeholders.
- The purchase screen personalizes the launch headline and temporary SiteSnap domain from onboarding answers, emphasizes instant website access, automatic temporary domain setup, contact-form setup, and AI Editor access, then simulates activation before calling `onPurchaseComplete`.
- Mock purchase completion now routes to a tabbed post-purchase dashboard in `src/screens/dashboard/DashboardPlaceholderScreen.tsx`.
- The dashboard has four swipeable/tappable tabs: `AI EDITOR`, `DOMAIN`, `CONTACT`, and `SETTINGS`.
- `AI EDITOR` shows a compact live-site preview, prompt chips, a local edit composer, a mocked draft response state, and a disabled future `Publish Edit` action.
- `DOMAIN` shows the active temporary SiteSnap domain, a mocked custom-domain availability check/reserve flow, and a connect-existing-domain placeholder.
- `CONTACT` shows contact form routing status, editable primary/CC email fields, local notification toggles, a mocked save confirmation, and an email preview card.
- `SETTINGS` shows live website status, business profile summary, content asset readiness, launch checklist, and quick actions for editing onboarding answers, previewing the public site, and requesting support.
- Dashboard tab tapping and swiping both work after fixing the horizontal pager math. Tab presses now jump directly to the selected page to avoid `pagingEnabled` snapping one tab too far.
- The dashboard remains frontend-only: no real AI edits, domain purchasing, email routing, publishing, analytics, or backend storage yet.

## Latest Redesign Notes

- Latest synced GitHub commit: `b075d47` - `Improve onboarding persistence and preview flow`
- The redesign was concentrated mostly in `src/screens/onboarding/WelcomeScreen.tsx`.
- `App.tsx` was adjusted so the welcome flow can take over the full screen without the previous shell padding.
- Newer Phase 2 work added `@react-native-async-storage/async-storage`, `react-native-safe-area-context`, and `expo-device`.
- `expo-haptics` is now installed with the Expo-compatible SDK 54 version.
- Claude contributed the current compact preview UI in `src/screens/preview/WebsitePreviewScreen.tsx`; Codex wired it into the app shell and adjusted persistence/safe-area behavior around it.
- `App.tsx` now hydrates persisted onboarding state on launch, saves questionnaire/review/preview progress locally, clears that saved session on full reset, and sends preview edits back into the onboarding review state instead of restarting.
- `src/lib/storage/onboardingPersistence.ts` now owns the local persistence contract for the onboarding session.
- `src/types/navigation.ts` now includes the `purchase` route.
- `WebsitePreviewScreen` accepts an `onGoLive` callback, and `App.tsx` routes preview `Go Live` taps into `GoLivePurchaseScreen`.
- `DashboardPlaceholderScreen` has been upgraded into the mocked post-purchase dashboard and now accepts onboarding answers plus an optional edit-answers callback.
- `App.tsx` now passes onboarding answers into the dashboard and uses the full-screen app shell for all current screens so swipe paging can use the device width cleanly.

## Verification Already Completed

- `npm install --cache .npm-cache`
- `npm install --cache .npm-cache expo@^54.0.0 react@19.1.0 react-native@0.81.4 expo-status-bar@~3.0.9 expo-image-picker@~17.0.10 @types/react@^19.1.0`
- `npm_config_cache=.npm-cache npx expo install --fix`
- `npm_config_cache=.npm-cache npx expo-doctor`
- `npm run typecheck`

Historical Phase 2 verification had Expo Doctor and TypeScript passing before the onboarding redesign commit.

Current verification on this machine:

- `npm run typecheck`

Current result:

- TypeScript is passing.
- Expo Go testing confirmed local persistence restores the exact saved onboarding question instead of bouncing back to the `Get Started` screen after force close.
- Expo Go testing confirmed dashboard swiping and tab tapping now land on the correct tabs after the pager fix.

## Known Weak Spots

- Navigation is temporary and intentionally simple.
- Onboarding answers are persisted locally on the device, but they are not synced across devices and are not saved to a backend.
- No real website data model yet.
- The preview is still a mock/static UI rather than a true generated website layout.
- Image upload currently supports local picking only; there is no backend upload or storage.
- The redesigned onboarding screen is now a large, stateful single file and will likely benefit from future extraction into smaller subcomponents once the interaction model stabilizes.
- `WebsitePreviewScreen.tsx`, `GoLivePurchaseScreen.tsx`, and `DashboardPlaceholderScreen.tsx` are now meaningful UI surfaces and may need component extraction once the interaction models stabilize.
- No real purchase flow yet. `Go Live` now opens a mocked purchase screen, but it does not use StoreKit, Google Play Billing, RevenueCat, or any real payment provider.
- The purchase screen is designed to avoid required scrolling for the primary flow, but it uses an internally scrollable plan area on smaller phones. Device testing should confirm the headline, domain, plan price, core benefits, CTA, restore copy, and Terms/Privacy remain visible and readable.
- No real domain setup yet. Domain configuration should come after purchase/publishing, with a temporary SiteSnap domain available by default.
- The full mock funnel is now in place, but it still needs a complete phone walkthrough to collect weak spots across onboarding, preview, purchase, and dashboard.
- No linting or tests yet.

## What To Read First In A New Session

1. `docs/session-handoff.md`
2. `docs/phase-log.md`
3. `docs/project-roadmap.md`
4. `sitesnap_codex_build_instructions.txt`

## Recommended Next Step

Continue `Phase 2 - Onboarding Questionnaire` by polishing the post-purchase dashboard and preparing the structured data handoff for later backend/AI generation.

Immediate next build options:

- Run a full Expo Go walkthrough of the complete mock flow: onboarding, review, preview, purchase, and dashboard.
- Collect weak spots from that walkthrough, especially keyboard behavior, safe-area spacing, shorter-phone vertical scroll behavior, and whether each screen feels clear without backend functionality.
- Refine dashboard copy/layout after walkthrough testing so each tab feels compact and operational.
- Keep IAP mocked for now, but preserve the purchase screen shape for eventual Apple/Google in-app purchase.
- Define and save a normalized `WebsiteGenerationBrief` object later, before Anthropic/backend work.
- Consider extracting onboarding, preview, purchase, and dashboard subcomponents as the files continue to grow.

Phase 2 should focus on:

- Review collected onboarding answers
- Local asset picking and mock connect states for logo, photos, and reviews
- Pass questionnaire data into the mock website preview
- Local state only

## Backend Timing

- The instruction file explicitly says `No backend yet` during the current onboarding phase.
- `Phase 3` is for the structured website data model, not backend implementation.
- `Phase 9` is where the AI provider wrapper and real AI integration planning begin.
- `Phase 10` is where real backend and storage work begin for users, websites, edits, leads, and versioning.
- Until then, the priority is to make the frontend flow, local state model, screen-to-screen UX, and mock product behavior feel complete enough that backend integration has a stable target.

## Notes For Future Sessions

- Keep changes small and phase-based.
- Update this handoff file after each completed phase.
- Update `docs/phase-log.md` after each completed phase.
- Do not jump ahead to AI or backend before the roadmap says to.
