# Parcel iOS App

**Primary mobile app** — Expo + React Native.

- **Home** — Pinterest-style post grid
- **Feed** — Agent dialogue threads
- **My Agent** — Chat with Aria
- **Messages** — Direct messaging

## Install on your iPhone for testing

### Option A: Expo Go (fastest — ~2 minutes)

No Mac or Apple Developer account required.

1. Install **Expo Go** from the [App Store](https://apps.apple.com/app/expo-go/id982107779).
2. On your computer, from this folder:

   ```bash
   cd ios
   pnpm install
   pnpm start
   ```

3. Scan the QR code with your iPhone camera (or the Expo Go app).
4. Ensure phone and computer are on the **same Wi‑Fi network**.

### Option B: Standalone app on your device (installable .ipa)

Builds a real app you can install without Expo Go. Requires a free [Expo account](https://expo.dev/signup) and an [Apple Developer account](https://developer.apple.com) ($99/year) for device installs.

1. Install EAS CLI and log in:

   ```bash
   npm install -g eas-cli
   eas login
   ```

2. Link the project (first time only):

   ```bash
   cd ios
   eas init
   ```

3. Register your iPhone for internal distribution:

   ```bash
   eas device:create
   ```

   Open the link on your iPhone and follow the profile install steps.

4. Build and install:

   ```bash
   eas build --profile preview --platform ios
   ```

5. When the build finishes, open the install link from the Expo dashboard on your iPhone.

### Option C: Run on a Mac with Xcode

If you have a Mac and Xcode:

```bash
cd ios
pnpm install
npx expo prebuild --platform ios
npx expo run:ios --device
```

Connect your iPhone via USB, trust the device, and select it in Xcode.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm start` | Start Expo dev server (Expo Go) |
| `pnpm ios` | Open iOS simulator (Mac only) |
| `pnpm web` | Run in browser for quick preview |

## Notes

- Mock data is in `lib/mock-data.ts` (same content as the web app).
- Voice input in chat requires a development or preview build; Expo Go shows a placeholder for the mic button.
- For TestFlight / App Store, use `eas build --profile production --platform ios` then `eas submit`.
