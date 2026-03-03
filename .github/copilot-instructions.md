# DIVINA — Copilot Instructions

DIVINA is an AI-powered dive tourism platform built with **Expo / React Native**. It helps distribute dive tourism demand, improve traveler confidence, and create sustainable income for local dive operators in the Philippines.

## Development Commands

```bash
# Install dependencies (use bun, not npm)
bun install

# Start dev server
bun run start          # or: expo start
bun run android        # Android emulator/device
bun run ios            # iOS simulator/device
```

No test suite or linter is configured in this project.

## Architecture Overview

### Entry Point → Navigation → Screens

```
index.js → App.js → AuthProvider → NavigationContainer → RootStack
```

**`RootStack`** (`src/navigation/RootStack.js`) conditionally renders:
- `AuthStack` — if `isLoggedIn` is false (Login → Register → RegisterAsOperator → RegisterCred)
- `MainTabs` — if `isLoggedIn` is true (bottom tab navigator)

**`MainTabs`** (`src/navigation/MainTabs.js`) contains: Home, Dive Sites, Dive Plan, Identifier, Profile (ProfileStack), Standards.

**`ProfileStack`** (`src/navigation/ProfileStack.js`) is a nested stack inside the Profile tab: Profile → Operator.

### Auth State

`AuthContext` (`src/context/AuthContext.js`) is the single source of truth for auth. It:
- Restores sessions on mount by checking AsyncStorage for a token and calling `Auth.me()`
- Shows a loading spinner in `RootStack` during restoration (`isLoading` state)
- Exposes `{ user, isLoggedIn, isLoading, loginUser, logout }` — **use `loginUser(userData)` after sign-up/login, never set `isLoggedIn` directly**

### API Layer

All backend calls go through `API.js` (root level). It exports named modules:

| Export | Covers |
|--------|--------|
| `Auth` | signup, login, refresh, me, logout |
| `Profile` | get, update, changePassword |
| `Dashboard` | general, operator |
| `Admin` | operator management |
| `Stores` | CRUD + map endpoint |
| `Schedules` | CRUD per store |
| `Bookings` | list, my, get, create, cancel |
| `Weather` | current, marine |
| `Identify` | species identification (multipart) |
| `DiveSites` | list, get |
| `Preferences` | get, put (upsert) |
| `Recommendations` | sites, shops (requires user prefs set) |
| `Coupons` | validate |
| `TokenStorage` | AsyncStorage wrapper (getAccessToken, setTokens, clearTokens) |

The `request()` helper in `API.js` auto-retries once on 401 by refreshing the token. All authenticated calls use `await authHeaders()` which attaches the JWT.

**Base URL** is set via `EXPO_PUBLIC_API_URL` in `.env`. The `/api` prefix is baked into each endpoint path in `API.js`, so the env var should be just the origin (e.g. `http://10.21.189.30:5000`).

## Key Conventions

### Importing API modules

Screens are 3 levels deep (`src/screens/*/Screen.js`), so imports must use `'../../../API'`. The context is 2 levels deep so uses `'../../API'`.

```js
// ✅ Correct — from src/screens/main/ or src/screens/auth/
import { Weather, Stores } from '../../../API';

// ✅ Correct — from src/context/
import { Auth, TokenStorage } from '../../API';
```

### Screen structure pattern

Every screen follows this layout — **keep this consistent**:

```js
// 1. Imports
// 2. Sub-components (pure, defined outside the screen component)
// 3. MOCK DATA constants (ALL CAPS)  ← real data loaded in useEffect, mocks as fallback
// 4. Main screen component (e.g. `const HomeScreen = () => { ... }`)
// 5. StyleSheet (colors as named constants at top: BLUE_PRIMARY, BG, etc.)
// 6. export default
```

Section separators use: `// ─── Section Name ────` (em-dash box style).

### SVGs as React components

SVG files are imported directly as React components via `react-native-svg-transformer`:

```js
import Logo from '../../assets/DIVINA logo.svg';
// Usage:
<Logo width={190} height={50} />
```

### Color palette

| Variable | Value | Used for |
|----------|-------|----------|
| `#2563EB` / `BLUE_PRIMARY` | Blue | Primary actions, active states |
| `#3B82F6` / `BLUE_CARD` | Blue | Cards, buttons |
| `#EFF6FF` / `BLUE_LIGHT` | Light blue | Info backgrounds |
| `#F0F4FF` / `BG` | Off-white blue | Screen backgrounds |
| `#1E293B` | Dark slate | Primary text |
| `#64748B` | Medium slate | Secondary text |
| `#94A3B8` | Light slate | Placeholder / inactive |

### Components with mock data exports

Reusable components in `src/components/` export their mock data for easy development:

```js
import DiveSiteWeatherModal, { WEATHER_MOCK } from '../../components/DiveSiteWeatherModal';
import DiveSiteModal, { DIVE_SITE_MODAL_MOCK } from '../../components/DiveSiteModal';
import BookingDialog, { BOOKING_DIALOG_MOCK } from '../../components/BookingConfirmationDialog';
```

### Env variables

Expo 54 exposes env vars prefixed with `EXPO_PUBLIC_` to the app at build time. Accessed via `process.env.EXPO_PUBLIC_*`. `.env` is gitignored — see `.env.example` for required variables.

### Registration flow

Multi-step navigation passes params forward through the stack:

```
Register (firstName, lastName)
  → RegisterAsOperator (firstName, lastName) [operators only — picks cert + BIR PDF]
    → RegisterCred (firstName, lastName, isOperator, certDoc?, birDoc?)
        → calls Auth.signUpRegular() or Auth.signUpOperator()
        → calls loginUser(data.user) on success → navigates to Main
```
