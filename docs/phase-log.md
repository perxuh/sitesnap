# SiteSnap Phase Log

## Phase 1

Status: Complete

What was built:

- Base Expo + TypeScript project files
- Clean starter folder structure for app, components, screens, data, lib, types, utils, assets, and docs
- Simple app shell with a three-screen clickable demo flow
- Reusable starter UI components for screen layout and buttons
- Required product requirements, roadmap, and phase log docs

Files created or edited:

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

How to test:

1. Run `npm start`.
2. Open the Expo app in a simulator or on a device.
3. Confirm the welcome screen loads.
4. Tap through to the preview placeholder.
5. Tap through to the dashboard placeholder.
6. Use the back and restart actions to confirm the shell flow works.

Goal check:

Phase 1 met its goal. The project now has a clean foundation, simple navigation shell, and the required documentation.

Weak spots:

- Navigation is intentionally local state only for now.
- No real onboarding forms yet.
- No automated UI tests yet.

Later improvements:

- Replace local screen switching with a more scalable navigation layer once the onboarding flow expands.
- Add design assets and stronger branding after the questionnaire structure is in place.
- Add linting once the codebase is a bit larger, so setup stays lean early on.

Next phase:

Phase 2 - Onboarding questionnaire screens with local state.

## Phase 2

Status: In progress

Completed so far:

- Rebuild the welcome screen as a conversation-style onboarding entry point
- Add a dark minimal theme with bright accent colors
- Add a temporary animated SiteSnap logo intro
- Add a clean pre-chat intro screen with a website mockup, short value proposition, simple value cards, and a `Get Started` button
- Make `Get Started` transition into the AI questionnaire chat instead of auto-advancing
- Convert the onboarding flow into a typed assistant-style transcript with one question at a time
- Add business name, business type, and location prompts in a chat-style flow
- Add a bottom composer and larger answer cards so the experience feels closer to a guided AI conversation
- Refine the screen to use the full phone viewport with a sharper near-black and neon-lime visual direction
- Remove the circular glow background treatment in favor of subtle dark divider lines
- Simplify the intro layout by removing floating callouts and reducing visual clutter
- Replace the initial three-question demo with the full 14-question onboarding questionnaire
- Add local answer storage for text, single-choice, and multi-select chatbot responses
- Add a review screen that summarizes the collected onboarding answers before preview
- Add edit actions from the review screen so the user can jump back into a specific step
- Pass onboarding answers through the app shell into the preview screen
- Replace the old preview placeholder copy with a mock website summary shaped from onboarding answers
- Add conditional follow-up steps for logo upload, photo upload, and review details
- Add real local image picking with `expo-image-picker` for logo and job photo collection
- Show uploaded image thumbnails inside the chatbot transcript and on the preview screen
- Upgrade the project from Expo SDK 53 to Expo SDK 54 for better compatibility with the current iPhone Expo Go app
- Add `babel-preset-expo` as a direct dev dependency after the SDK upgrade so Metro can resolve the Babel preset cleanly
- Add local onboarding progress persistence with `@react-native-async-storage/async-storage`
- Restore force-closed sessions to the exact onboarding question/review state, or to preview once onboarding has been completed
- Add industry-specific service choices based on the selected business type
- Add a compact back control to the questionnaire progress bar so users can return to the previous question
- Add full-screen safe-area handling with `react-native-safe-area-context` and `expo-device` for larger iPhones and camera cutouts
- Remove faint decorative top/bottom background lines so app backgrounds are continuous across safe areas
- Replace the old preview placeholder route with `WebsitePreviewScreen`
- Add a compact website preview card, temporary `*.sitesnap.com` domain display, three dynamic setup confirmation boxes, `Go Live` CTA, and `Edit Answers` action
- Make `Edit Answers` return to the onboarding review/edit screen with existing answers
- Keep `Go Live` mocked as a placeholder for a future purchase/publishing flow

Files created or updated so far:

- `App.tsx`
- `package.json`
- `package-lock.json`
- `src/app/deviceScreen.ts`
- `src/lib/storage/onboardingPersistence.ts`
- `src/components/common/SiteSnapMark.tsx`
- `src/screens/onboarding/WelcomeScreen.tsx`
- `src/screens/preview/PreviewPlaceholderScreen.tsx`
- `src/screens/preview/WebsitePreviewScreen.tsx`
- `src/types/onboarding.ts`
- `docs/phase-log.md`
- `docs/session-handoff.md`

Still to build in Phase 2:

- Add a placeholder `Go Live` / purchase screen after the preview CTA
- Keep purchase mocked for now, but design around future Apple/Google in-app purchase
- Add the post-purchase/dashboard concept later: AI edit box plus domain setup cards
- Define a normalized website generation input object before backend/Anthropic work
- Add any remaining local validation and polish needed before moving into the structured data model in Phase 3
- Keep all onboarding data local only until Phase 3 and later backend phases are approved

Current verification:

- `npm run typecheck` is passing.
