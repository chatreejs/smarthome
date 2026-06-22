# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Smarthome is a React SPA for tracking household resources (electricity, water, food inventory, appliance warranties). It is a frontend-only app that talks to a backend API (`smarthome-api`) and authenticates against a Keycloak OIDC server.

## Commands

Package manager is **yarn** (see `yarn.lock`, Dockerfile). Node 18 is pinned via `.tool-versions`.

```bash
yarn                      # install dependencies
yarn start                # dev server on :3000 using .env (local)
yarn start:develop        # dev server using .env.develop
yarn build                # tsc type-check + vite build -> build/
yarn build:develop        # build with .env.develop
yarn build:prod           # build with .env.prod
yarn preview              # preview a production build

yarn lint                 # eslint + check-types (tsc --noemit) — run together
yarn eslint               # eslint only
yarn check-types          # tsc --noemit only
yarn format:check         # prettier check
yarn format:write         # prettier write
```

There is **no test framework** configured in this project.

Environment files (`.env`, `.env.develop`, `.env.prod`) are selected via `env-cmd`. Env vars are prefixed `VITE_APP_*` and injected into `process.env` at build time by `vite-plugin-environment` — access them as `process.env.VITE_APP_*`, NOT `import.meta.env`.

## Git / commits

Husky hooks enforce:
- **pre-commit**: runs `yarn lint` and `yarn format:check` (commits fail on lint/type/format errors).
- **commit-msg**: commitlint with conventional-commit rules. Allowed types: `build, ci, chore, docs, feat, fix, perf, refactor, revert, style, test`.

## Architecture

**Stack:** React 18 + TypeScript + Vite, Ant Design (`antd` 5) for UI, `styled-components` for custom styling, Redux Toolkit for state, RxJS + axios for data fetching, Highcharts for charts. The app is served under base path `/smarthome` (set in both `vite.config.ts` and the router `basename`).

**Path aliases** (defined in `tsconfig.json`, resolved by `vite-tsconfig-paths`): `@components`, `@config`, `@context`, `@interfaces`, `@enums`, `@hooks`, `@services`, `@slices`, `@utils`, `@views`. Each of these directories has an `index.ts` barrel — import from the alias root (e.g. `import { HomeService } from '@services'`), not deep paths.

**Authentication:** `main.tsx` wraps the app in `AuthProvider` from `react-oauth2-code-pkce` (OAuth2 PKCE against Keycloak). Tokens are stored in `localStorage` with the `sh-` prefix (`sh-token`). The axios instance (`src/config/axiosInstance.tsx`) has a request interceptor that reads `sh-token` from localStorage and attaches it as a `Bearer` header automatically.

**App bootstrap flow (`src/App.tsx`):** on load it calls `AccountService.getUserInfo()`. A 404 means the account doesn't exist yet, so it auto-creates one from the OIDC token claims. If the account `hasHome`, it loads homes and dispatches the first home into Redux (`setHomeId`/`setHomeName`). A `SplashSpinner` shows until auth + bootstrap complete.

**Routing (`src/config/routes.tsx`):** all main routes are nested under `<Layout>`. Feature areas (waterworks, food, inventory, electric-appliances/warranty) follow a consistent nested pattern: index = table/summary, `new` = create detail, `:id` = edit detail. Users without a home are redirected to `/initial-setup` (`HomeSetup`).

**State (`src/config/Store.ts`):** Redux store combines `home` and `account` slices. `RootState` and `AppDispatch` types are exported here.

**Services layer (`src/services/<domain>/`):** each service is a class with **static methods** that return RxJS `Observable`s wrapping axios calls (`from(axiosInstance.get(...)).pipe(map(r => r.data))`). Each has a private static `apiEndpoint` constant. Components subscribe to these observables (`.subscribe({ next, error })`). Follow this pattern when adding endpoints.

**Feature gating:** the `Permission` enum (`@enums`) defines feature flags (UTILITY, FOOD, INVENTORY, MEDICAL_SUPPLIES, SMART_FARM). The side menu conditionally renders nav items based on permissions.

**Directory roles:** `views/` = page-level feature screens; `components/` = shared/reusable UI (layout, side-menu, footer, etc.); `interfaces/` = TypeScript domain types (per-domain subfolders mirroring services); `enums/` = shared enums; `slices/` = Redux slices; `hooks/` = custom hooks.

## Build & deploy

`vite build` outputs to `build/` (not `dist/`). The Dockerfile is a two-stage build (node:18-alpine → nginx-unprivileged) taking a `BUILD_CONFIGURATION` arg (`develop`/`prod`) that selects which `build:*` script runs; nginx config lives in `config/nginx/`.
