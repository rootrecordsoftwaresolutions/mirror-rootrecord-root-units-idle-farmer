# Root Units Idle Farmer

Private product repo for **Root Units Idle Farmer** (`com.rootrecord.rootunits`) — desktop web, mobile web shell, and Android (Capacitor).

Canonical monorepo copy: `RootRecord/MonoRepo` (run `Mobile/scripts/export-root-units-idle-farmer-repo.ps1` there to refresh this tree).

## Layout

| Path | Purpose |
|------|---------|
| `Web/apps/root-farms-web/` | Full game (desktop / Pages) |
| `Web/apps/root-farms-mobile-web/` | Mobile UI; imports core via `@core` → `root-farms-web/src` |
| `Mobile/root-farms-app/` | Android Capacitor wrapper |
| `Web/cloudflare/rootrecord-api-account/` | Farms API **slice** (migrations + handlers); deploy full Worker from monorepo |
| `Web/main/root-farms/` | Product / design notes |

## Build Android release

From repo root (requires JDK, Android SDK, `pnpm`):

```bat
build-root-farms-android.bat
```

Outputs: `Mobile/builds/root-farms/RootRecord-RootFarms-<version>.apk` and `.aab`

Signing: `Mobile/root-farms-app/android/setup-release-signing.ps1` (do not commit `.jks` / `keystore.properties`).

## Deploy web (Cloudflare Pages)

```bat
cloudflare-deploy-root-farms.bat
```

Live site: https://farms.rootrecord.info/

## API

Game clients call `rootrecord-api-account` (`/api/farms/*`). Source of truth for deploy: monorepo `Web/cloudflare/rootrecord-api-account/`. This repo keeps a farms-only snapshot for reference.
