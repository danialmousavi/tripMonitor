# Development Guide

## Prerequisites

Before starting development, install the following:

- Node.js LTS version compatible with Expo SDK 57
- npm
- Android Studio with the Android SDK and emulator support for Android testing
- A connected Android device or emulator for runtime validation

## Dependency installation

From the project root:

```bash
npm install
```

This repository already contains a lockfile, so the workspace is intended to use the standard npm flow unless the team later switches package managers.

## Available scripts

The current `package.json` defines:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  }
}
```

Use these commands directly:

```bash
npm start
npm run android
npm run ios
npm run web
```

## Local development workflow

### Start the Expo dev server

```bash
npx expo start
```

This starts the Metro bundler and gives you the QR code or local development URLs for testing.

### Run on Expo Go

Expo Go is the simplest preview path for rapid iteration:

```bash
npx expo start
```

Then scan the QR code with the Expo Go app.

This is a quick preview path but is not the same as a deployment-grade custom Android build.

### Run on emulator or a connected Android device

```bash
npx expo run:android
```

This is the correct command for running the app on an Android emulator or a physical Android device. It creates a native build as required by the project runtime.

### Run on iOS simulator

```bash
npx expo run:ios
```

This path requires a macOS environment with Xcode installed. The current project is primarily Android-oriented and is configured with an Android package name.

## Environment configuration

There is no existing `.env` or `.env.example` file in the repository. The runtime values are currently embedded directly in code:

- `services/player.ts`: device manifest endpoint and device token
- `components/news/MarketTicker.tsx`: market API endpoint and placeholder authorization token

This means deployment and local runtime configuration is not yet separated from implementation. For production use, move those configuration values to a proper environment model and inject them via Expo config or a secure secret management mechanism.

## Type checking and linting

Type checking is available through the local TypeScript setup:

```bash
npx tsc --noEmit
```

This project does not currently define a lint script, and there is no ESLint or Prettier config visible in the repository root.

Expo health check:

```bash
npx expo-doctor
```

Important project note: the repo currently reports one dependency mismatch from Expo doctor:

- installed: `expo ~57.0.26`
- expected: `~57.0.31`

This should be addressed before production deployment if the team wants dependency parity with the current Expo SDK requirements.

## Debugging and troubleshooting

### Application fails to load content

Check the manifest endpoint and the device token in `services/player.ts`.

If the backend returns a non-OK response, the app does not gracefully degrade beyond a loading/error state, so the network path must be valid before deployment.

### Market ticker does not render market rows

Verify the API endpoint and access token in `components/news/MarketTicker.tsx`.

The current market component is designed to handle empty or failed responses by falling back to static promotional content, but it still depends on the provider returning a valid payload.

### TypeScript or dependency errors

Run:

```bash
npx tsc --noEmit
npx expo-doctor
```

## Android native build notes

This project uses Expo-managed Android native support. There is no `eas.json` or cloud build configuration in the repo, so the native build flow is not preconfigured for EAS deployment.

For local native builds:

```bash
npx expo run:android
```

If you need an APK or AAB for installation or distribution outside the dev environment, use the native Android build tooling after generating the Android project or integrate an EAS build workflow.

## Production build guidance

The repo does not currently contain an EAS build configuration. For true production builds, the typical flow would be:

1. configure production environment values
2. test the app on a device/emulator
3. create native Android output via Expo Android tooling or EAS
4. install or distribute the generated APK/AAB

## What this project is not

- It is not a web-first app designed for a browser kiosk
- It is not an Android TV app with remote control navigation
- It is not using Expo Router or a route-based screen system
- It is not set up as a multi-environment deployment pipeline by default

That context is important because the app is a signage/dashboard app rather than a standard consumer application.
