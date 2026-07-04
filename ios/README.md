# Parcel iOS App

**Primary mobile app** — Expo + React Native.

- **Home** — Pinterest-style post grid
- **Feed** — Agent dialogue threads
- **My Agent** — Chat with Aria
- **Messages** — Direct messaging

## Install on your iPhone for testing

### Option A: Expo Go (fastest — ~2 minutes)

No Mac or Apple Developer account required.

1. **Update Expo Go** from the [App Store](https://apps.apple.com/app/expo-go/id982107779) — this project uses **Expo SDK 57**, which requires a recent Expo Go version.
2. On your computer:

   ```bash
   git clone https://github.com/parcelstudio-io/parcel.git
   cd parcel/ios
   pnpm install
   pnpm start:go
   ```

   > Use **`cd parcel/ios`**, not the repo root. Do **not** need `pnpm install:all` for mobile-only testing.

3. When the terminal shows a QR code, scan it with your iPhone **Camera** app or **Expo Go**.
4. Phone and computer must be on the **same Wi‑Fi** (or use tunnel — see troubleshooting below).

### Troubleshooting Expo Go

#### `Unexpected server error: No returned query result` (HTTP 500)

This comes from **Expo’s cloud API**, not your app code. Common causes:

| Cause | Fix |
|-------|-----|
| Ran `eas build` / `eas login` without a linked project | For Expo Go, skip EAS — use `pnpm start:go` only |
| Stale Expo login session | Run `npx expo logout`, then `pnpm start:go` again |
| Expo Go SDK mismatch | Update Expo Go from the App Store |
| Cached bad state | `rm -rf .expo node_modules && pnpm install && pnpm start:go` |
| Phone can’t reach your computer | `pnpm start:tunnel` and scan the new QR code |

#### `[ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL] Command "install:all" not found`

You’re in the wrong folder. Either:

```bash
cd parcel/ios && pnpm install    # mobile only
```

or from repo root (requires latest `main`):

```bash
cd parcel && pnpm install:all
```

#### Connection / download failures in Expo Go

```bash
pnpm start:tunnel   # works across different networks (slower)
```

Also try: disable VPN, allow port **8081** in firewall, use `pnpm doctor` to check config.

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
| `pnpm start` | Start Expo dev server |
| `pnpm start:go` | Start with cache cleared (recommended for Expo Go) |
| `pnpm start:tunnel` | Start with tunnel (if same Wi‑Fi fails) |
| `pnpm ios` | Open iOS simulator (Mac only) |
| `pnpm web` | Run in browser for quick preview |
| `pnpm doctor` | Check Expo config and dependency versions |

## Notes

- Mock data is in `lib/mock-data.ts` (same content as the web app).
- Voice input in chat requires a development or preview build; Expo Go shows a placeholder for the mic button.
- For TestFlight / App Store, use `eas build --profile production --platform ios` then `eas submit`.
