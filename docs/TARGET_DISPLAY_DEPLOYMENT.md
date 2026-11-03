# Target Display Deployment

## What the repository actually supports

The current implementation does not declare a TV-specific target. Instead, the app is a portrait-oriented React Native application with a package ID and Android configuration designed for a device running the app directly.

Relevant project facts:

- `app.json` sets `"orientation": "portrait"`
- Android package name is `com.daniuf.tripMonitor`
- The UI is heavily touch-interactive, with buttons, a prize wheel, and fullscreen controls
- No Android TV, TV remote, or D-pad navigation model is implemented
- No kiosk-mode or auto-start configuration is present

This means the repository is most compatible with a dedicated Android tablet, Android device, or a display-hosting Android box that can run a touch-capable app, not with a standard HDMI monitor used as a standalone runtime.

## Supported platforms and device assumptions

### Android device / tablet

This is the best fit for the current implementation.

Why it fits:

- the app is a native Android app package
- the layout is portrait-oriented
- touch interactions exist in the UI
- content is optimized for a fixed single-screen experience

### Android TV / Android Box / Android-based display

Not a verified target platform.

Why it is not a documented fit:

- the app expects portrait layout
- no remote control navigation or focus system is present
- no TV-specific launcher or kiosk startup configuration exists
- no `leanback` or Android TV compatibility settings exist in the project

This app should not be described as Android-TV-compatible unless the UI and input model are redesigned for it.

### Regular HDMI monitor

A standard monitor is not itself an Android runtime environment.

To display this app on a monitor, it must be hosted by an Android device or an Android-based box connected to the monitor. The app does not support independent external-display rendering by itself, and it does not include any direct monitor-output logic.

## Device capabilities and runtime requirements

The app expects:

- stable network connectivity to the backend manifest API
- internet access for market and media endpoints
- a device with enough memory to render video and image content
- a display capable of showing the portrait dashboard without scaling issues
- touch interaction for the campaign wheel and fullscreen controls

The app does not appear to include:

- wake-lock management
- auto-start on boot
- kiosk mode lockdown
- remote-control compatibility
- fullscreen external display API handling

## Display orientation and layout considerations

Because `app.json` is configured as portrait, the app is not optimized for landscape TV screens or wide 16:9 signage setups.

This is important when planning deployment on hardware:

- portrait tablet: generally acceptable
- portrait Android device: acceptable
- landscape TV display: not aligned with the current app design
- standard HDMI monitor without an Android host: not a valid runtime target

## Network and backend connectivity

The app depends on remote services at runtime:

- device manifest API at `http://46.34.163.41:8000/api/v1/device/manifest`
- market API at `https://tindex.app/api/public/boards`
- public IPTV metadata endpoints for fallback or optional stream discovery

A failure in network connectivity can cause the app to stop rendering its content, since the project does not implement a meaningful offline cached state or resilient local fallback cache.

## Scenario A — Android device / tablet

This is the supported deployment scenario.

### Install and run

1. Install dependencies:

```bash
npm install
```

2. Start the app on a connected device or emulator:

```bash
npx expo run:android
```

3. If you need a packaged release build, generate an APK/AAB from the Android project or use a cloud build pipeline after proper environment configuration.

4. Launch the app on the device and confirm the manifest loads successfully.

### Recommended setup

- set the device screen to the correct brightness and keep it charging if used as a digital display
- verify the manifest endpoint is reachable from the device
- verify the app remains active and the display is not blocked by sleep mode or background restrictions

## Scenario B — Android TV / Android Box / Android-based display

This is not a verified implementation target.

### Compatibility status

Not recommended for production deployment without redesign.

The app may technically run on a capable Android box if sideloaded and if the hardware supports touch input, but the project does not provide:

- remote control navigation
- a TV-optimized layout
- app startup in kiosk mode
- Android TV manifest support

### Installation path, if used anyway

If an Android-based box is used as a host device, the deployment flow would be:

```bash
npx expo run:android
```

and then install or sideload the generated APK if the environment supports it.

ADB example (only when a native Android build is available):

```bash
adb install path/to/app-release.apk
adb shell am start -n com.daniuf.tripMonitor/.MainActivity
```

This should be treated as a manual contingency path, not as a supported end-user deployment model.

## Scenario C — Regular HDMI monitor

A standard HDMI monitor is not a direct Android application runtime. It only displays what the host device sends.

To use the app on a monitor, you need:

- an Android phone/tablet or Android box connected to the monitor, or
- screen mirroring/casting through a compatible host

The app itself does not include external-display rendering or monitor-specific output support. Do not assume a regular React Native app will output to a monitor without a host device and a suitable connection path.

## Expo Web evaluation

The project supports a web launch path via:

```bash
npm run web
```

or

```bash
npx expo start --web
```

This can be useful as a quick preview or browser-based validation, but it is not a substitute for real device deployment. The app is designed for a single-screen UI and not for general web kiosk usage.

## Missing implementation requirements for reliable deployment

The app currently lacks a few things that would be required for a robust public display deployment:

- environment-driven backend configuration
- kiosk-mode startup and lock behavior
- boot auto-launch handling
- screen-timeout controls or wake-lock policy
- remote-control navigation for TV use
- production build pipeline and release signage workflow
- offline cache or graceful degraded mode

## Summary

The repository is best understood as a portrait-oriented Android signage dashboard for a dedicated device or tablet. It is not a generic Android TV app and it is not deployable to a standard HDMI monitor without a compatible Android host.

Use the Android device/tablet path for valid deployment. Treat Android TV and HDMI monitor scenarios as separate integration projects rather than native support cases.
