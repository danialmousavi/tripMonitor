# tripMonitor

tripMonitor is a React Native/Expo digital signage dashboard for a travel and commerce experience. It loads a device manifest from a backend, renders promotional media and video slots, surfaces live market information, and presents a loyalty/campaign interaction layer designed for a dedicated display device.

## Features

- Manifest-driven content layout from a backend API
- Video focus area with fullscreen toggle
- Side and bottom promotional image carousels
- Main banner content block
- Interactive campaign wheel with prize selection
- Live market/news ticker with static fallback content
- RTL Persian-language UI with custom Vazirmatn font

## Tech Stack

- Expo SDK 57
- React Native 0.86.3
- React 19.2.3
- TanStack Query for backend data fetching
- Expo Video for streaming video playback
- SVG + Animated for the campaign wheel and motion effects
- React Native Safe Area Context and Expo Font

## Requirements

- Node.js LTS version compatible with Expo SDK 57
- npm
- Android Studio + Android SDK for native Android testing (recommended)
- A physical Android device or emulator for runtime validation

## Installation

```bash
npm install
```

## Environment Configuration

This repository does not currently use a `.env` file or an Expo config env system. Runtime values are embedded directly in source files:

- `services/player.ts` contains the device manifest API base URL and the hardcoded `DEVICE_TOKEN`
- `components/news/MarketTicker.tsx` contains the market API URL and a placeholder Tindex authorization token

Before production use, replace these placeholders with real values from the backend and market provider.

## Run Locally

```bash
npm start
```

Or:

```bash
npx expo start
```

## Run on Android

For emulator or connected device:

```bash
npx expo run:android
```

For a local development build or emulator preview, keep the device connected and make sure the Android SDK is configured.

## Run on Target Display

This project is best suited to an Android device or Android-based display running in portrait mode. It is not implemented as a remote-control-first Android TV app. See the detailed deployment guidance in [docs/TARGET_DISPLAY_DEPLOYMENT.md](./docs/TARGET_DISPLAY_DEPLOYMENT.md).

## Build

The repository does not include a configured `eas.json`, so EAS builds are not prewired. For local Android builds, use the Expo Android workflow and generate a native project as needed:

```bash
npx expo run:android
```

For a release APK/AAB workflow, use the Android tooling available from the generated native project or a cloud EAS pipeline after configuration.

## Documentation

- [docs/PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md)
- [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)
- [docs/TARGET_DISPLAY_DEPLOYMENT.md](./docs/TARGET_DISPLAY_DEPLOYMENT.md)

## Troubleshooting

- Run `npx tsc --noEmit` to validate TypeScript.
- Run `npx expo-doctor` to check Expo dependency drift.
- The project currently reports one Expo package version mismatch: the installed package is `~57.0.26` while the expected version is `~57.0.31`.
- If the backend manifest is unavailable, the app will show loading or error states but does not include a graceful offline fallback screen.
