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
- Phase 2 now includes the review/edit loop, preview handoff, and real image picking for logo and job photos.
- Phase 2 is still not complete because the data is still local-only and the preview is still a mock website summary.

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

## Current Folder Structure

- `src/app`
- `src/components/common`
- `src/components/forms`
- `src/components/website-preview`
- `src/components/dashboard`
- `src/screens/onboarding`
- `src/screens/preview`
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

- The app opens to a dark conversational welcome screen.
- A short temporary SiteSnap logo animation plays before the first prompt appears.
- A clean pre-chat intro screen now appears after the logo with one website mockup, a short headline, three simple value cards, and a `Get Started` button.
- Pressing `Get Started` transitions into the AI questionnaire chat.
- The onboarding flow now behaves like a typed AI conversation instead of a standard form.
- The current visual direction is clean and simple: near-black background, restrained neon-lime accents, subtle divider lines, and no circular glow/orb background decoration.
- The current transcript now runs through the 14-question local service business setup flow plus conditional follow-up steps for logo upload, photo upload, and review details.
- The questionnaire supports text answers, single-choice answer cards, multi-select answer cards, and image-picking steps.
- The logo upload and photo upload steps now use `expo-image-picker` and show selected images back inside the chatbot transcript.
- The review screen shows all visible onboarding answers and lets the user jump back to edit any single step.
- The preview screen now receives onboarding answers from the app shell and renders a mock website summary from them.
- The preview also shows selected logo and job photo thumbnails when available.
- The user can tap into a dashboard placeholder screen.
- The user can go back or restart the shell flow.

## Verification Already Completed

- `npm install --cache .npm-cache`
- `npm install --cache .npm-cache expo@^54.0.0 react@19.1.0 react-native@0.81.4 expo-status-bar@~3.0.9 expo-image-picker@~17.0.10 @types/react@^19.1.0`
- `npm_config_cache=.npm-cache npx expo install --fix`
- `npm_config_cache=.npm-cache npx expo-doctor`
- `npm run typecheck`

Expo Doctor and TypeScript type checking are currently passing.

## Known Weak Spots

- Navigation is temporary and intentionally simple.
- Onboarding answers are still local only and are not persisted.
- No persistent state yet.
- No real website data model yet.
- The preview is still a mock summary rather than a true generated website layout.
- Image upload currently supports local picking only; there is no backend upload or storage.
- No linting or tests yet.

## What To Read First In A New Session

1. `docs/session-handoff.md`
2. `docs/phase-log.md`
3. `docs/project-roadmap.md`
4. `sitesnap_codex_build_instructions.txt`

## Recommended Next Step

Continue `Phase 2 - Onboarding Questionnaire` by improving the mock generated preview and tightening the asset/review experience.

Immediate next onboarding build:

- Refine the review step with better editing affordances and possibly inline validation
- Improve the preview from a summary card into clearer website sections
- Decide whether to finish Phase 2 with richer local mock states or begin Phase 3 data modeling once approved

Phase 2 should focus on:

- Review collected onboarding answers
- Local asset picking and mock connect states for logo, photos, and reviews
- Pass questionnaire data into the preview placeholder
- Local state only

## Notes For Future Sessions

- Keep changes small and phase-based.
- Update this handoff file after each completed phase.
- Update `docs/phase-log.md` after each completed phase.
- Do not jump ahead to AI or backend before the roadmap says to.
