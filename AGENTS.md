# Parcel

Monorepo with three app folders. **Primary focus: `ios/`** (Expo React Native).

## Cursor Cloud specific instructions

### Structure

| Folder | Stack | Purpose |
|--------|-------|---------|
| `webapp/` | Next.js 15 | Web application |
| `ios/` | Expo + React Native | **Primary** — iPhone app (Expo Go + EAS Build) |
| `android/` | Delegates to `ios/` | Android APK/AAB via EAS from shared Expo project |

### Commands

| Task | Command |
|------|---------|
| Install all deps | `pnpm install:all` (from repo root) |
| Web dev | `pnpm dev:web` or `cd webapp && pnpm dev` |
| iOS dev | `pnpm dev:ios` or `cd ios && pnpm start` |
| Web lint/build | `cd webapp && pnpm lint` / `pnpm build` |
| iOS typecheck | `cd ios && npx tsc --noEmit` |
| Android build | `cd ios && eas build --platform android` |

### Notes

- Mock data: `webapp/src/lib/mock-data.ts` and `ios/lib/mock-data.ts` (keep in sync manually for now).
- No backend or database yet.
- iOS voice input needs preview/production EAS build, not Expo Go.
- Long-running dev servers: use tmux (`pnpm dev:web`, `pnpm dev:ios`).
