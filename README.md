# Emilist Admin

Phase 1 foundation for Emilist's marketplace administration dashboard. The responsive shell contains no live marketplace data, backend endpoints, production authentication, or approved brand identity. Business modules require a separate approved phase.

## Setup

Use Node 24 and npm 11 or newer (see .nvmrc).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The root redirects to /dashboard. No API variable is needed to run the shell. The API client rejects requests until a backend origin is configured.

## Stack

Next.js App Router, React, strict TypeScript, Tailwind CSS v4, shadcn/ui-compatible source primitives using Radix Slot, and Lucide icons. TanStack Query manages remote state; Zustand manages shared UI state; Axios centralizes browser API access. React Hook Form and Zod are available for future confirmed forms. Sonner is configured for notifications. Recharts is installed for future analytics but is not imported into the shell. Vitest, React Testing Library, and Playwright provide testing; ESLint and Prettier enforce quality.

Exact versions are pinned in package.json and package-lock.json. Strict peer checking is enabled in .npmrc; no force/legacy-peer-deps. TypeScript 6.0.3 and ESLint 9.39.5 are the newest stable releases compatible with the lint plugins shipped by eslint-config-next 16.4.3; TypeScript 7 and ESLint 10 are excluded until those plugins support them. npm marks ESLint 9 as out of support; this is a tooling compatibility limitation to revisit when the Next.js lint plugins support ESLint 10. next-themes is intentionally omitted because dark mode has not been requested. TanStack Table and MSW are deferred until real data workflows justify them. @hookform/resolvers 6.0.0 was excluded after npm detected conflicting optional Effect peers; no forms require an adapter in this phase.

## Architecture

```text
src/
  app/                     # Thin routes, boundaries, globals, metadata
    (dashboard)/           # Public foundation shell; not yet an auth boundary
      dashboard/
    forbidden/
    unauthorized/
  components/
    ui/                    # shadcn primitives; foundational atom layer
      Button/
      Skeleton/
    molecules/             # Focused, domain-independent combinations
      PageHeader/
      EmptyState/
    organisms/             # Shared interface regions
      DashboardHeader/
      DashboardSidebar/
    templates/             # Layout composition, no business-data fetching
      DashboardLayout/
  features/
    dashboard/components/  # Overview presentation only
  hooks/useSidebarStore/   # Shared UI state
  config/                  # Validated public environment settings
  lib/
    api/                   # Axios and safe errors
    auth/                  # Permission helpers and server-only adapter port
    query/                 # Query client and key conventions
    utils/                 # cn()
  providers/AppProviders/  # Query provider and Sonner
  test/                    # Test setup
 e2e/                      # Browser journeys
```

Features own services, data hooks, schemas, and contracts as they are implemented. No empty business modules have been generated. Routes compose features; shared infrastructure has no feature dependencies. Reusable components use PascalCase folders with matching .tsx files; hooks use dedicated camelCase use-prefixed folders and filenames. Meaningful tests are colocated. See AGENTS.md for mandatory conventions.

## Hybrid feature-based and Atomic Design architecture

Business domains remain feature-based: components, services, data hooks, schemas, and types stay in features/<domain>. DashboardOverview therefore remains in features/dashboard/components. Visual complexity alone does not make a feature component globally reusable.

Shared UI uses these composition levels:

| Location             | Responsibility                                       | Existing components               |
| -------------------- | ---------------------------------------------------- | --------------------------------- |
| components/ui        | shadcn primitives and foundational atoms             | Button, Skeleton                  |
| components/molecules | Focused, domain-independent combinations             | PageHeader, EmptyState            |
| components/organisms | Shared interface regions                             | DashboardHeader, DashboardSidebar |
| components/templates | Reusable layout composition accepting screen content | DashboardLayout                   |

There is no separate atoms directory. Compound shadcn primitives also remain intact in ui to preserve their conventions and accessibility behavior. The shadcn alias in components.json remains unchanged. Atomic levels guide composition; they do not require additional wrappers, dependencies, or components at every level.

Features consume shared UI. Shared UI remains independent of feature-specific services, schemas, types, and API hooks, but can consume shared UI state such as useSidebarStore. Keep ui independent of higher levels, compose lower-level UI into molecules and organisms where useful, and compose shared regions in templates without circular imports. Templates do not fetch business data. Routes stay thin, and existing client/server boundaries are preserved. Providers and infrastructure retain their existing locations outside the atomic hierarchy.

Only introduce new components and folders when an implemented design warrants them. Preserve PascalCase component folders and matching filenames, dedicated camelCase use-prefixed hook folders, and colocated meaningful tests.

## Screenshot-driven implementation

Phase 2 screen development waits for the user's first design screenshot and stays within the approved scope. Implement one screen or agreed portion at a time, matching the supplied visual reference and assets while preserving accessibility and responsive behavior. Compare the implementation at supplied viewport sizes and check intermediate layouts. Confirm material missing design details rather than inventing approved branding or building speculative screens.

Forms may be built with UI and Zod validation before API integration. Validation rules do not establish a backend payload contract. Clearly identify submission as unavailable until the real endpoint, payload, response contract, and authorization requirements are supplied. Never simulate successful submissions, authentication, saved state, or success notifications. Once contracts arrive, feature services own API calls and dedicated feature hooks own TanStack Query integration.

## Environment

| Variable                   | Purpose                                              | Default                   |
| -------------------------- | ---------------------------------------------------- | ------------------------- |
| NEXT_PUBLIC_API_BASE_URL   | Public HTTP(S) backend origin, not a secret          | Unset; API calls disabled |
| NEXT_PUBLIC_API_TIMEOUT_MS | Integer timeout between 1000 and 120000 milliseconds | 15000                     |

Next.js embeds NEXT_PUBLIC_ values at build time. Supply production public settings before building. Keep private session credentials and secrets in server-only configuration once the backend integration is designed. Never commit .env.local. Environment configuration is validated with Zod. The API URL must be an actual approved backend origin, not an invented endpoint.

## Commands

| Command              | Purpose                                    |
| -------------------- | ------------------------------------------ |
| npm run dev          | Development server                         |
| npm run typecheck    | Strict TypeScript check                    |
| npm run lint         | ESLint with zero warnings                  |
| npm run format       | Format source and documentation            |
| npm run format:check | Check formatting                           |
| npm test             | Unit/component tests once                  |
| npm run test:watch   | Interactive Vitest                         |
| npm run build        | Production build                           |
| npm start            | Serve production build                     |
| npm run test:e2e     | Playwright against production server       |
| npm run check        | Types, lint, formatting, unit tests, build |

For browser testing, run `npx playwright install chromium`, then `npm run build` and `npm run test:e2e`. Linux CI may need `npx playwright install --with-deps chromium`. Desktop and mobile Chromium cover the root redirect, shell, mobile navigation, and 404 recovery. Playwright starts its own production server on port 4317, separate from the development server on port 3000. Keep port 4317 available during browser tests.

Unit tests prioritize permission denial/expiry, safe API error handling, environment validation, and disabled action behavior. Extend coverage for real integration workflows rather than snapshotting markup.

## UI and styling

Tailwind utilities are the default. globals.css contains Tailwind imports, neutral semantic CSS variables mapped with @theme inline, and global base styles. There are no component stylesheets or CSS Modules. Font choices use system fonts, avoiding build-time font downloads. Light mode is deliberate; replace temporary tokens with approved brand specifications later.

components.json provides shadcn configuration. Button and Skeleton follow the shadcn source ownership model, adapted to mandatory PascalCase folders. When adding shadcn components, move CLI-generated files into matching PascalCase folders and fix imports. Do not retain generated kebab-case components.

The shell includes semantic navigation, skip link, visible keyboard focus, responsive mobile navigation, a shaped route skeleton, empty states, retry boundary, not-found recovery, and dedicated access-denied/session-required pages. Access pages are safe UI destinations, not HTTP authorization enforcement. Mutations must show localized pending labels and prevent duplicate submissions when introduced.

## API and remote state

The centralized Axios client uses credentials, a configured origin, a timeout, and generic safe errors. Only relative endpoint paths are allowed. Services must pass AbortSignal and validate confirmed response shapes; presentation components never call Axios. No service endpoints or domain response contracts have been fabricated.

Create feature services and colocated use-prefixed query/mutation hooks when contracts arrive. Use queryKeys for domain roots, filtered lists, and details. Invalidate the relevant domain after confirmed successful mutations. Query clients are created per provider instance, not as shared server singletons. Queries retry transient normalized network/timeout/server failures at most twice; mutations and authorization failures are never automatically retried. Components handle errors explicitly; cancellation should not produce error toasts.

Use TanStack Query for remote data, Zustand for shared UI state, URL parameters for shareable filters/search/sort/pagination, and local React state for transient component interactions. Do not duplicate query data in Zustand.

## Authentication integration and deployment boundary

The dashboard shell is public and must not expose protected admin data or actions until real server authentication and authorization are connected. No login form, token persistence, fake session, role list, or mock authentication is included.

lib/auth/session.ts defines a server-only SessionAdapter integration interface. Its AdminSession shape is an internal provisional authorization model, not a confirmed backend response. Implement an adapter that verifies server-managed HttpOnly, Secure, SameSite session cookies against the actual backend and maps safe session metadata. Use requirePermission close to server data access/actions, and enforce the session in the dashboard server layout before protected features ship. Backend APIs independently enforce permissions. UI visibility helpers supplement those checks and fail closed for absent/expired/invalid sessions.

Obtain these backend decisions before enabling authentication:

- Login/logout/session validation contracts, expiry and revocation behavior, MFA and profile requirements.
- Authoritative role/permission definitions and mapping into the internal session model.
- Cookie domain/path/SameSite settings, exact credentialed CORS origins, and CSRF protection for mutations.
- Confirmed unauthorized/forbidden handling and safe post-login return destinations.

After a confirmed session expiration, cancel in-flight private requests, clear private query caches, and use the confirmed login flow. Avoid automatic redirects on every 401; there is no invented redirect destination in Phase 1. Never store sensitive tokens in localStorage, log credentials, expose backend error bodies, or rely on hidden buttons for security.

Basic response headers disable framing and MIME sniffing and restrict sensitive browser capabilities. They supplement backend security. This shell is not a completed security implementation; production admin functionality remains gated on the real backend integration. Configure transport security, CSP, and deployment-specific policies with the hosting and asset requirements when deployment is approved.

## Phase boundary

Phase 1 establishes infrastructure, tests, conventions, and a neutral shell. No users/jobs/transactions/settings modules, analytics datasets, advanced table framework, login workflow, or live backend integrations are implemented. Phase 2 screens start only after review, explicit approval, and receipt of the first design screenshot. The approved Atomic Design refinement reorganizes shared UI and documentation only.
