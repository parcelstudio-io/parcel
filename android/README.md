# Parcel Android

Android builds for Parcel use the **Expo project in [`../ios/`](../ios/)**. The React Native codebase lives in `ios/`; this folder is the Android entry point for builds and documentation.

> **Primary development happens in `ios/`.** Run and test there first, then build for Android when ready.

## Build Android APK/AAB

From this folder:

```bash
pnpm build
```

Or from `ios/`:

```bash
cd ../ios
pnpm install
eas build --profile preview --platform android
```

Requires [EAS CLI](https://docs.expo.dev/build/setup/) and an [Expo account](https://expo.dev/signup).

## Local Android emulator (optional)

With Android Studio installed:

```bash
cd ../ios
pnpm install
npx expo run:android
```

## Package name

`io.parcelstudio.parcel` (configured in `ios/app.json`).

## Future

A dedicated `android/` Expo app or shared `packages/` library may be added if iOS and Android diverge. For now, one Expo project in `ios/` serves both platforms.
