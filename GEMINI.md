# DIVINA - Project Context and Guidelines

## Project Overview

DIVINA is an AI-powered dive tourism platform built as a mobile application using **React Native and Expo**. The platform aims to distribute dive tourism demand, improve traveler confidence, and create sustainable income and job opportunities for local dive operators in the Philippines using verified marine data and smart recommendations.

**Key Technologies:**
- React Native & Expo
- React Navigation (Native Stack, Bottom Tabs)
- React Native Maps
- AsyncStorage (via `@react-native-async-storage/async-storage`)
- React Native SVG (for icons and logos)

## Building and Running

The project relies on `bun` as its primary package manager.

```bash
# Install dependencies
bun install

# Start the Expo development server
bun run start

# Run on specific platforms
bun run android  # Start Android emulator/device
bun run ios      # Start iOS simulator/device
bun run web      # Start web version
```

*Note: No test suite or linter is currently configured in this project.*

## Directory Structure & Architecture

The application is structured around a nested navigation hierarchy and centralized API service.

- `/src/navigation/`: Contains the main routers (`RootStack.js`, `AuthStack.js`, `MainTabs.js`, `ProfileStack.js`). `RootStack` handles the primary switch between authenticated (`MainTabs`) and unauthenticated (`AuthStack`) states based on `AuthContext`.
- `/src/screens/`: Separated into `auth/` (Login, Register flows) and `main/` (Home, Dive Sites, Profile, Identifier, etc.).
- `/src/components/`: Reusable UI components. They frequently export MOCK data alongside the component for easier UI development (e.g., `DiveSiteWeatherModal`, `DiveSiteModal`).
- `/src/context/`: Contains `AuthContext.js`, the single source of truth for user authentication and session restoration via AsyncStorage.
- `/API.js`: The central API layer at the root. All backend calls route through modules defined here (e.g., `Auth`, `Profile`, `Dashboard`, `Stores`, `Bookings`). It automatically handles attaching JWTs to headers and retrying 401s. The base URL is configured via `EXPO_PUBLIC_API_URL` in `.env`.

## Development Conventions

1.  **Component Structure:** Every screen must strictly follow this internal layout pattern:
    *   Imports (ensure correct paths to `API.js` based on depth)
    *   Sub-components (pure, defined outside the main screen component)
    *   MOCK DATA constants (ALL CAPS) - fallback data while real data loads
    *   Main screen component
    *   StyleSheet
    *   Default export
    *   Use `// ─── Section Name ────` dividers to organize sections.

2.  **API Imports:** Ensure correct relative paths when importing API modules.
    *   From `src/screens/.../`: `import { ... } from '../../../API';`
    *   From `src/context/`: `import { ... } from '../../API';`

3.  **Authentication:** Never mutate the `isLoggedIn` state manually. Only interact with `AuthContext` functions: `loginUser(userData)` after a successful sign-up or login, and `logout()`.

4.  **Styling & Assets:**
    *   Use named color constants defined at the top of the StyleSheet (e.g., `BLUE_PRIMARY: '#2563EB'`, `BG: '#F0F4FF'`). Avoid TailwindCSS.
    *   Import SVGs directly as React components (e.g., `import Logo from '../../assets/DIVINA logo.svg';`).

5.  **Registration Flow:** Uses multi-step navigation passing parameters through the stack: `Register` -> `RegisterAsOperator` -> `RegisterCred`.

6.  **Environment Variables:** Expo uses the `EXPO_PUBLIC_` prefix for build-time env variables. Set them in a `.env` file (e.g., `EXPO_PUBLIC_API_URL`).
