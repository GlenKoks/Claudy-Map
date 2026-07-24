# Claudy Map — mobile app

Expo (Dev Client) app using `expo-router` + `zustand`. TypeScript.

> **Dev Client, not Expo Go.** Native modules will be added in later stages, so
> the app is built and run through a custom Dev Client.

## Run (JS side)

```bash
pnpm --filter @claudy-map/mobile start
# then open the project in a Dev Client build installed on your device
```

## Screens (Stage 0 stubs)

- `app/(onboarding)/index.tsx` — onboarding placeholder (entry point via anchor)
- `app/(main)/index.tsx` — main app placeholder

No real navigation/business logic yet.

## App icons / splash

Branding assets were intentionally left out of Stage 0 (Expo falls back to
built-in defaults). To add them later, drop the PNGs into `assets/` and
reference them in `app.json` (`icon`, `android.adaptiveIcon`, `web.favicon`).

## Building the Dev Client (requires your Expo account)

See the repo root notes / `eas.json`. In short, after `eas init`:

```bash
# iOS (needs an Apple Developer account; run on the device flow)
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```
