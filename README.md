# NiaTma

NiaTma is a Next.js 16 Telegram Mini App playground that now goes well beyond the
starter template baseline. It includes Telegram platform integration, TON Connect,
server-backed auth, wallet-first TON authentication via `ton_proof`, and a minimal
wallet-gated premium route.

## Stack

- Next.js 16 + React 19 + TypeScript
- Bun for package management and command execution
- Telegram Mini Apps SDK + Telegram UI
- TON Connect UI React
- TanStack Query
- Zustand
- next-intl
- `@ton/ton` + `@ton/crypto` for backend `ton_proof` verification

## Current feature set

- Telegram Mini App runtime integration with local browser mock support
- i18n-enabled app shell and route structure
- Platform demo screen for Main Button, haptics, swipe behavior, and app config
- Browser application diagnostics screen
- Server-backed auth foundation:
  - Telegram `initData` auth
  - local dev login fallback
  - signed session cookies
  - protected profile route/API
- TON Connect wallet integration:
  - wallet connect/disconnect
  - wallet link/unlink to existing auth session
  - backend `ton_proof` verification
  - wallet-first authenticated session issuance
- Monetization foundation:
  - wallet premium entitlement model
  - `/premium` wallet-gated route

## Main routes

- `/` — home
- `/auth` — auth foundation screen
- `/profile` — protected authenticated profile
- `/ton-connect` — wallet connect, wallet link, and wallet-first TON auth
- `/premium` — wallet-gated premium preview
- `/platform` — Telegram platform baseline demo
- `/application` — browser diagnostics
- `/init-data`, `/launch-params`, `/theme-params` — runtime inspection pages

## Install

Use Bun for this repository.

```bash
bun install
```

## Scripts

- `bun run dev` — start development server
- `bun run dev:https` — start development server with self-signed HTTPS
- `bun run build` — production build
- `bun run start` — run production server
- `bun run lint` — run ESLint
- `bun test` — run tests directly with Bun

## Local development

Run the app locally:

```bash
bun run dev
```

Open `http://localhost:3000`.

The app supports local browser development outside Telegram by mocking the Telegram
environment for localhost/LAN preview hosts. That keeps normal developer flows fast
while still allowing real Telegram sessions when launched inside Telegram.

For HTTPS during Mini App setup/testing:

```bash
bun run dev:https
```

## Production-like local preview

To verify the real production build locally:

```bash
bun run build
bun run start -- --port 3000
```

## Environment variables

### Auth / server

- `AUTH_SESSION_SECRET` — secret used to sign auth session cookies
- `TELEGRAM_BOT_TOKEN` — required for real Telegram `initData` verification
- `AUTH_ALLOW_DEV_LOGIN` — enable/disable local preview login fallback
- `AUTH_SESSION_TTL_SECONDS` — session cookie lifetime
- `AUTH_TELEGRAM_MAX_AGE_SECONDS` — allowed age for Telegram auth payloads
- `AUTH_TON_PROOF_MAX_AGE_SECONDS` — allowed age for TON proof timestamps
- `AUTH_TON_PROOF_PAYLOAD_TTL_SECONDS` — TTL for one-time TON proof payloads

### Client / feature flags

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_ENABLE_APPLICATION_DIAGNOSTICS`
- `NEXT_PUBLIC_ENABLE_MONETIZATION`
- `NEXT_PUBLIC_ENABLE_PLATFORM_DEMO`
- `NEXT_PUBLIC_ENABLE_TELEGRAM_HAPTICS`
- `NEXT_PUBLIC_ENABLE_TELEGRAM_MAIN_BUTTON`
- `NEXT_PUBLIC_ENABLE_SWIPE_BACK_NAVIGATION`
- `NEXT_PUBLIC_ENABLE_VERTICAL_SWIPE_BEHAVIOR`
- `NEXT_PUBLIC_ENABLE_TON_CONNECT`

## Auth modes

This project currently supports three auth entry paths:

1. **Telegram auth** via server-side `initData` verification
2. **Dev login** for local preview/testing
3. **Wallet-first TON auth** via backend `ton_proof` verification

Wallet-first TON auth creates a signed session with provider `ton` and grants the
demo premium entitlement used by the `/premium` route.

## TON proof notes

The backend verifies `ton_proof` using local parsing of standard wallet contracts
from `walletStateInit` and checks:

- one-time payload consumption
- domain binding
- timestamp freshness
- derived address match
- extracted public key match
- ed25519 signature validity

The current implementation is intentionally local-first and does not yet include an
external on-chain fallback provider.

## Validation

Useful local verification commands:

```bash
bun run lint
bun run build
bun test
```

There is also focused end-to-end auth coverage for:

- anonymous access behavior
- dev login
- wallet link/unlink
- backend `ton_proof` verification
- wallet-gated premium access

## Telegram setup

Before using the Mini App inside Telegram, create a bot with
[@BotFather](https://t.me/botfather) and configure your Mini App URL.

For local HTTPS testing, use `https://127.0.0.1:3000` rather than `localhost` when
registering the Mini App URL with BotFather.

## Deployment

Any Next.js-compatible deployment target can be used. Make sure production has at
least:

- `AUTH_SESSION_SECRET`
- `TELEGRAM_BOT_TOKEN` if Telegram auth is enabled
- HTTPS enabled in front of the app

## Useful links

- [Telegram Mini Apps docs](https://docs.telegram-mini-apps.com/)
- [TON Connect docs](https://docs.ton.org/develop/dapps/ton-connect/overview)
- [Next.js docs](https://nextjs.org/docs)