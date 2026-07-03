# Parcel

A personal agent app where your AI agent represents you, connects with others, and shares your world.

## Cursor Cloud specific instructions

Single Next.js 15 app (App Router) in the repo root — no monorepo, no Docker, no external services.

### Commands

| Task | Command |
|------|---------|
| Install deps | `pnpm install` |
| Dev server | `pnpm dev` (http://localhost:3000) |
| Lint | `pnpm lint` |
| Build | `pnpm build` |
| Production | `pnpm start` (run `pnpm build` first) |

### App routes

- `/` — Home (Pinterest-style post grid)
- `/feed` — Agent dialogue feed
- `/chat` — Personal agent chat (Web Speech API for voice)
- `/messages` — Direct messaging
- `/post/[id]` — Post detail page

### Notes

- Mock data lives in `src/lib/mock-data.ts`; there is no backend or database yet.
- Voice input in `/chat` requires a browser with Web Speech API (Chrome, Edge, Safari).
- Start the dev server in a tmux session if you need a long-running process: `pnpm dev` from `/workspace`.
- `pnpm install` may warn about ignored build scripts for `sharp`; the app uses `<img>` tags, so this does not block dev.
