# Emilist Admin Dashboard

Administration frontend for the Emilist services marketplace, built with Next.js App Router and TypeScript.

The application currently provides a responsive dashboard shell, desktop and mobile navigation, loading skeletons, empty states, error recovery, and access-state pages. Shared API, query, and authorization utilities are available, but live marketplace integrations and production authentication are not connected. The dashboard is public and contains no protected administrative data.

## Technology stack

| Area                    | Technologies                                                            |
| ----------------------- | ----------------------------------------------------------------------- |
| Application             | Next.js 16, React 19, strict TypeScript                                 |
| UI                      | Tailwind CSS v4, shadcn-style source primitives, Radix UI, Lucide React |
| Data and state          | Axios, TanStack Query, Zustand                                          |
| Validation and feedback | Zod, Sonner                                                             |
| Testing                 | Vitest, React Testing Library, Playwright                               |
| Code quality            | ESLint, Prettier                                                        |

React Hook Form and Recharts are installed but are not used by the current screens. Exact dependency versions are recorded in [package.json](package.json) and `package-lock.json`. The project uses TypeScript 6 and ESLint 9 for compatibility with the configured lint plugins; the documented tooling limitation is that ESLint 9 is out of support.

## Installation

Requirements: Node.js 24 and npm 11 or newer. The Node version is specified in `.nvmrc`.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The root route redirects to `/dashboard`. The shell runs without an API base URL; API requests are rejected until one is configured.

## Environment configuration

Public configuration is validated with Zod in `src/config/env.ts`.

| Variable                     | Purpose                                                   | Default                      |
| ---------------------------- | --------------------------------------------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`   | HTTP(S) backend base URL                                  | Unset; API requests disabled |
| `NEXT_PUBLIC_API_TIMEOUT_MS` | Integer request timeout, from 1000 to 120000 milliseconds | `15000`                      |

Use [.env.example](.env.example) as the configuration reference. Next.js embeds `NEXT_PUBLIC_` values at build time, so set them before production builds. These values are public and must never contain secrets. Local environment files are excluded from version control.

## Architecture

Business domains use feature-based organization. Shared UI follows Atomic Design composition levels while retaining `components/ui` as the shadcn primitive layer.

```text
src/
  app/                     # Routes, layouts, loading and error boundaries
    (dashboard)/dashboard/
    forbidden/
    unauthorized/
  components/
    ui/                    # shadcn primitives: Button, Skeleton
    molecules/             # PageHeader, EmptyState
    organisms/             # DashboardHeader, DashboardSidebar
    templates/             # DashboardLayout
  features/
    dashboard/components/  # DashboardOverview
  hooks/useSidebarStore/   # Shared navigation state
  config/                  # Environment validation
  lib/
    api/                   # Axios client and error normalization
    auth/                  # Permission checks and session adapter interface
    query/                 # Query client factory and query keys
    utils/                 # cn() class composition
  providers/AppProviders/  # Query provider and notifications
  test/                    # Test setup
e2e/                       # Browser tests
```

Features own their components, services, API hooks, schemas, and types as needed. Domain-specific components remain in their features regardless of visual complexity. Shared UI has no dependencies on feature-specific services, schemas, types, or API hooks.

`components/ui` supplies foundational atoms; there is no separate `atoms` directory. Compound shadcn primitives also stay in `ui`. Molecules combine focused UI elements, organisms define shared interface regions, and templates compose layout around screen content without fetching business data. Providers and infrastructure remain outside this hierarchy.

Route files compose feature screens and layouts. Server Components are the default; interactive components establish explicit client boundaries.

## Development conventions

- Give every reusable component its own PascalCase folder and matching file, such as `Button/Button.tsx`. Colocate meaningful tests as `Button.test.tsx`.
- Give each custom hook a dedicated camelCase folder and filename beginning with `use`, such as `useSidebarStore/useSidebarStore.ts`.
- Use Tailwind v4 utilities and semantic tokens from `src/app/globals.css`. Use `cn()` for conditional classes. The current interface uses neutral tokens, system fonts, and light mode.
- Preserve shadcn configuration in `components.json`. Adapt generated component paths to the PascalCase convention and update imports.
- Keep presentation, data access, and business logic separate. Add abstractions only when actual reuse justifies them.
- Preserve semantic markup, keyboard navigation, visible focus, responsive layouts, and clear loading, empty, error, disabled, and pending states.

See [AGENTS.md](AGENTS.md) for the complete engineering conventions.

## API and state management

`src/lib/api/apiClient.ts` centralizes browser requests with a configured base URL, credentialed requests, bounded timeout, relative endpoint validation, and safe error normalization. Raw backend errors are not displayed to users. No feature endpoints or domain response contracts are currently implemented.

Feature service functions own API calls and typed contracts; dedicated feature hooks own TanStack Query integration. Presentation components do not call Axios directly. Services must use confirmed backend endpoints and contracts, support `AbortSignal`, and validate response shapes where appropriate.

The query client is instantiated per provider. Queries have a 60-second stale time, do not refetch on window focus, and retry normalized network, timeout, and server errors at most twice. Mutations are not retried automatically. Shared query-key helpers support domain roots, filtered lists, and details.

Use TanStack Query for remote data, Zustand for shared UI state, URL parameters for shareable navigation state, and local React state for component interactions. Do not duplicate query data in Zustand. Forms can provide UI and validation independently of backend integration, but unavailable submission must be clear and must never simulate a successful save.

## Authentication and authorization

`src/lib/auth/session.ts` defines a server-only `SessionAdapter` interface and a `requirePermission` helper. `src/lib/auth/authorization.ts` provides an internal `AdminSession` model and permission checks that deny absent, invalid, or expired sessions. These utilities are not connected to a session backend or the dashboard layout.

The `/unauthorized` and `/forbidden` routes provide presentation states; they do not enforce HTTP authorization. There is no login or logout workflow. Setting the API base URL alone does not establish authentication.

Protected functionality requires a backend session adapter that verifies server-managed HttpOnly, Secure, SameSite cookies and maps authoritative permissions into the internal session model. Enforce authorization close to server data access and actions, with independent enforcement by backend APIs. UI visibility checks are supplemental. Never store sensitive tokens in localStorage.

Cookie scope, credentialed CORS, CSRF protection, expiry, revocation, and login/logout contracts must be established with the backend. Session-expiration handling must cancel private requests, clear private query data, and use the confirmed login flow; that lifecycle is not yet implemented.

## Available scripts

| Command                | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Start the development server                       |
| `npm run typecheck`    | Generate Next.js route types and check TypeScript  |
| `npm run lint`         | Run ESLint with zero warnings allowed              |
| `npm run format`       | Format the repository with Prettier                |
| `npm run format:check` | Check formatting                                   |
| `npm test`             | Run unit and component tests                       |
| `npm run test:watch`   | Run Vitest interactively                           |
| `npm run test:e2e`     | Run Playwright against a production server         |
| `npm run build`        | Create the production build                        |
| `npm start`            | Serve the production build                         |
| `npm run check`        | Run types, lint, formatting, unit tests, and build |

## Testing

Vitest uses jsdom and React Testing Library. Tests are colocated under `src/` and cover permission checks, environment validation, API configuration and error handling, query policy and cache isolation, and button behavior.

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

Playwright starts its own production server on `127.0.0.1:4317`; keep that port available. Its desktop and mobile Chromium projects cover redirects, dashboard rendering, responsive overflow, mobile navigation and focus restoration, and not-found recovery. The mobile-navigation test is intentionally skipped in the desktop project. `npm run check` builds the application but does not run Playwright.

## Build and deployment

```sh
npm ci
npm run build
npm start
```

Set public environment values before building. `npm start` serves the generated build using the standard Next.js server. No hosting-provider configuration or deployment pipeline is included in this repository.

`next.config.ts` disables the framework identification header and configures MIME-sniffing protection, frame denial, referrer policy, and restrictions on camera, microphone, and geolocation. These headers supplement application and backend authorization. Connect and enforce production authentication before exposing protected administrative data or actions.
