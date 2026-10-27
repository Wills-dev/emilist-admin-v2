# Emilist Admin Dashboard

Administration frontend for the Emilist services marketplace, built with Next.js App Router and TypeScript.

The application currently provides a responsive dashboard shell, desktop and mobile navigation, loading skeletons, empty states, error recovery, and access-state pages. Shared API, query, and authorization utilities are available, but live marketplace integrations and production authentication are not connected. Local dashboard UI preview access is restricted to development. The real production project redirects unauthenticated dashboard routes to sign-in until server-validated authentication is integrated. A separately built, Vercel-identity-bound demo can expose only synthetic fixtures.

## Technology stack

| Area                    | Technologies                                                            |
| ----------------------- | ----------------------------------------------------------------------- |
| Application             | Next.js 16, React 19, strict TypeScript                                 |
| UI                      | Tailwind CSS v4, shadcn-style source primitives, Radix UI, Lucide React |
| Data and state          | Axios, TanStack Query, Zustand                                          |
| Validation and feedback | Zod, Sonner                                                             |
| Testing                 | Vitest, React Testing Library, Playwright                               |
| Code quality            | ESLint, Prettier                                                        |

Authentication forms use React Hook Form and Zod. Overview charts use Recharts through the shared shadcn-style chart container. Exact dependency versions are recorded in [package.json](package.json) and `package-lock.json`. The project uses TypeScript 6 and ESLint 9 for compatibility with the configured lint plugins; the documented tooling limitation is that ESLint 9 is out of support.

## Installation

Requirements: Node.js 24 and npm 11 or newer. The Node version is specified in `.nvmrc`.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The root route redirects to `/login`. The shell runs without an API base URL; API requests are rejected until one is configured.

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

`src/lib/auth/session.ts` defines a server-only `SessionAdapter` interface and a `requirePermission` helper. `src/lib/auth/authorization.ts` provides an internal `AdminSession` model and permission checks that deny absent, invalid, or expired sessions. These utilities are not connected to a session backend. The dashboard server layout permits only static UI preview access under the preview policy. This does not establish a session. Real protected data and actions must remain unavailable until a verified session adapter is implemented. Once connected, authenticated visitors to `/` or `/login` should be redirected to `/dashboard` using a verified server session.

The `/unauthorized` and `/forbidden` routes provide presentation states; they do not enforce HTTP authorization. Authentication forms are available, but backend login, logout, invitation verification, enrollment, email delivery, and password changes are not connected. Setting the API base URL alone does not establish authentication.

Protected functionality requires a backend session adapter that verifies server-managed HttpOnly, Secure, SameSite cookies and maps authoritative permissions into the internal session model. Enforce authorization close to server data access and actions, with independent enforcement by backend APIs. UI visibility checks are supplemental. Never store sensitive tokens in localStorage.

Cookie scope, credentialed CORS, CSRF protection, expiry, revocation, and login/logout contracts must be established with the backend. Session-expiration handling must cancel private requests, clear private query data, and use the confirmed login flow; that lifecycle is not yet implemented.

## Authentication UI

| Routes                                      | Interface                                          |
| ------------------------------------------- | -------------------------------------------------- |
| `/login`, `/login/verify`                   | Sign-in and authenticator-code entry               |
| `/accept-invite`                            | Read-only invitation details awaiting backend data |
| `/accept-invite/password`                   | Password creation and confirmation                 |
| `/accept-invite/authenticator`              | Authenticator enrollment layout and code entry     |
| `/forgot-password`, `/forgot-password/sent` | Recovery request and delivery-status view          |
| `/reset-password/verify`, `/reset-password` | Recovery code entry and password reset             |

Forms support local email/password validation, password visibility, live password requirements, confirmation matching, and six-digit code entry with paste and keyboard navigation. Account setup steps link between UI views without saving or verifying data. The shared authentication layout uses the supplied SVG assets and hides the illustration panel on small screens. It occupies the dynamic viewport height: the header and illustration remain stationary while only the form panel scrolls.

Backend-dependent actions remain disabled even when local fields are valid. The static UI preview described below permits only navigation to static UI fixtures. The delivery-status view does not claim an email was sent. Invitation details, QR enrollment, and secret-key values remain unavailable until verified backend data exists. No form completion establishes a session; the preview Sign In button only navigates to static dashboard fixtures. Password requirements are UI validation rules and must be reconciled with the backend policy during integration.

## Local UI preview

Set `DASHBOARD_UI_PREVIEW=true` in `.env.local` and run `npm run dev`. This local-only preview does not authenticate users or create a session. It is ignored in normal production artifacts and must not be configured on Vercel. All fixtures use fictional identities, non-deliverable `example.invalid` emails, non-dialable phone labels, and fictional street addresses. Synthetic amounts, dates, and aggregate metrics are presentation values only.

The Overview includes quick search, operational metrics, transaction/job/customer donut charts, a revenue trend, quick actions, and trade totals. `src/features/dashboard/fixtures/overviewFixtures.ts` owns the static presentation values. These are not API responses or live records. The job category sum differs from the supplied center total by 10; the visual reference values are retained. Intermediate revenue trend points are approximate presentation values. Search reports that its service is unavailable; date selection updates only the control, not the fixtures. Unimplemented destinations and administrative actions are disabled. “Sign out” leaves the preview for sign-in without claiming to revoke a session.

Routes are centralized in `src/constants/routes.ts`, including typed route values and an encoded dynamic-path builder. Feature services and query hooks remain reserved for actual backend integration; there are no invented dashboard endpoints.

The responsive shell retains a fixed header and an independently scrolling content region, with a Radix navigation drawer on narrower screens. Charts load dynamically with local skeletons. Initial cards use 280ms opacity/transform entrances staggered by 50ms; charts animate once over 550–600ms. All entrance/drawer/chart motion is disabled for reduced-motion preferences. CSS keyframes in globals.css supply the scoped entrance and Radix mount/unmount animations that transition utilities alone cannot express.

## Jobs and Materials

`/jobs` provides five job metrics and a nine-row listing with applicant counts, expert references, customer links, status filtering, search, and local pagination. `/materials` provides the Product Catalog; `/materials/orders` provides Orders. Both share five materials metrics, persistent route-based section links, and search, filtering, and pagination. Orders support combined delivery and payment filters.

These screens use typed presentation fixtures in `features/jobs` and `features/materials`, with nine reference records and one explicitly labelled additional sample per collection. Metric totals are design values, not counts of downloaded records. Product image assets are not available; labelled image placeholders are shown. Record details and administrative mutations remain disabled pending supplied detail designs and backend contracts. No backend services or endpoints are implemented for these modules.

Shared `DataTable`, `TableToolbar`, `SummaryMetrics`, `Pagination`, `RecordActions`, `RecordStatus`, and `ManagementSkeleton` components provide the common presentation. `hooks/useFixtureTable` owns local URL state; feature hooks select and filter domain fixtures. Confirmed API services and TanStack Query hooks will belong to each feature when integration contracts are available. Protected backend data must never use the static preview access policy.

## Administrative operations

Development previews include `/payments`, `/support`, `/reports`, `/settings`, and `/settings/permissions`. Payments and Support use domain-owned typed fixtures, local URL-backed search, filters, pagination, and disabled backend operations. Ticket elapsed times are fixed samples, not live countdowns or operational SLAs.

Reports composes the dashboard feature's public read-only analytics export, reusing its existing charts and summary components. Its supplied job total is 65,162; the Overview fixture remains unchanged. Its URL-backed date-range selector changes the displayed reporting period only; it does not retrieve or recalculate analytics.

Settings has route-aware Platform Configuration and User Permissions tabs. Platform fields support validated local drafts and cancellation; saving is unavailable. Subscription cards reuse the shared plan carousel. Spotlight candidates permit one local selection per category, with search and category filters; publishing is unavailable. The roles table uses typed presentation permission keys and local search, status filters, and pagination. These role fixtures never grant authorization, and invitations and role mutations remain unavailable.

These modules define no backend services, API responses, or successful mutations. Integrate only supplied backend contracts in feature-owned services and query hooks, with server authentication and backend authorization before exposing protected data or operations.

## Customer Management UI

The static dashboard preview also includes Customer Management. `/customers` displays the list; `/customers/[customerId]` displays a selected customer's details. Profile sections use `/customers/[customerId]/services`, `/jobs`, `/listed-items`, `/orders`, `/sales`, `/transactions`, and `/subscriptions`. Use `CUSTOMER_ROUTES` from `src/constants/routes.ts` to build these paths from the selected ID. Unknown IDs and tabs return not-found states. Customer routes expose sample data only; real customer data and mutations require server-validated authentication.

`src/features/customers` owns typed presentation fixtures, domain-specific table columns, URL-state schemas, fixture-filtering helpers, UI hooks, and customer components. The shared details route layout renders the profile, wallet, actions, and navigation once across all eight sections. Shared `DataTable`, `Pagination`, `DetailField`, and `StatusBadge` components provide reusable interface structure without coupling table rows to a domain.

Search, status filters, and pagination operate on local sample records and persist in URL parameters. Twelve customer fixtures support two pages; the displayed 165,162 total is a design fixture, not a loaded dataset. Additional customer/job records are explicitly synthetic pagination samples. This client pagination is for fixtures only; real datasets require feature services and dedicated TanStack Query hooks with server-managed pagination. No customer backend endpoints, API contracts, or services are implemented.

The selected customer's ID is retained in all profile routes. Only the primary sample profile has supplied activity records; other profiles show their own information and honest empty states. Service categories, keyboard-operated galleries, copy controls, and subscription plan browsing are local interactions. Portraits, product thumbnails, service images, and supporting documents use labelled placeholders because the corresponding image assets are not included. Certificate, membership, insurance, and plan information is static presentation data, not verification evidence.

Create/edit, messaging, password resets, suspension, wallet changes, and unavailable activity destinations remain disabled. Receipt and print controls do not generate or download documents. Tables scroll horizontally inside labelled focusable regions; the profile navigation and plan cards also support local horizontal scrolling without widening the document. Skeletons and empty states are scoped to customer content.

## Available scripts

| Command                | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| `npm run dev`          | Start the development server                                          |
| `npm run typecheck`    | Generate Next.js route types and check TypeScript                     |
| `npm run lint`         | Run ESLint with zero warnings allowed                                 |
| `npm run format`       | Format the repository with Prettier                                   |
| `npm run format:check` | Check formatting                                                      |
| `npm test`             | Run unit and component tests                                          |
| `npm run test:watch`   | Run Vitest interactively                                              |
| `npm run test:e2e`     | Run Playwright against a production server                            |
| `npm run build`        | Create the production build                                           |
| `npm run build:demo`   | Build the dedicated demo; requires verified Vercel demo configuration |
| `npm run start:demo`   | Serve a demo artifact with its signed runtime identity checks         |
| `npm start`            | Serve the production build                                            |
| `npm run check`        | Run types, lint, formatting, unit tests, and build                    |

## Testing

Vitest uses jsdom and React Testing Library. Tests are colocated under `src/` and cover permission checks, environment validation, API configuration and error handling, query policy and cache isolation, button behavior, authentication form validation, password controls, illustration variants, and OTP interactions.

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

Playwright starts its own production server on `127.0.0.1:4317`; keep that port available. Its desktop and mobile Chromium projects cover login routing, denied dashboard access, responsive overflow, authentication panel scrolling, keyboard focus, and not-found recovery. Authentication tests also cover all nine UI routes at 320, 375, 425, 768, 1024, and 1440px, short viewports at 768×600 and 1440×700, local form interactions, and unavailable backend actions. `npm run check` builds the application but does not run Playwright. Customer browser tests cover all nine views at the same six widths and short heights, URL-state controls, profile routes, galleries, plan browsing, keyboard disclosures, and production access denial. Browser tests build a separate production-mode demo artifact with temporary signing keys and a test-process-only mock of Vercel's fixed JWKS transport. The application has no test-key or custom-JWKS configuration. Tests run the normal production server on port 4317, the verified demo on 4318, and a copied demo artifact with the wrong project identity on 4319. All three ports must be available. A Vercel-signed token, demo configuration, and matching artifact binding are all required for deployed demo access. The temporary test keys and demo build output are ignored by Git. The test wrapper uses Webpack for deterministic local compilation.

## Build and deployment

```sh
npm ci
npm run build
npm start
```

Set public environment values before building. `npm start` serves the generated build using the standard Next.js server. No hosting-provider configuration or deployment pipeline is included in this repository.

`next.config.ts` disables the framework identification header and configures MIME-sniffing protection, frame denial, referrer policy, and restrictions on camera, microphone, and geolocation. These headers supplement application and backend authorization. Connect and enforce production authentication before exposing protected administrative data or actions.

## Isolated Vercel deployments

Use two separate Vercel projects connected to this repository, with these exact project names. No shared deployment artifacts, administrative API credentials, account databases, or team-level API variables may be inherited by the demo project.

| Setting                                                          | `emilist-admin-demo`                       | `emilist-admin`                                 |
| ---------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| Framework                                                        | Next.js                                    | Next.js                                         |
| Install command                                                  | `npm ci`                                   | `npm ci`                                        |
| Build command                                                    | `npm run build:demo`                       | `npm run build`                                 |
| Output directory                                                 | Default Next.js (`.next`)                  | Default Next.js (`.next`)                       |
| Node.js                                                          | 24.x                                       | 24.x                                            |
| `APP_DEPLOYMENT_MODE`                                            | `demo`                                     | `production`                                    |
| `DEMO_VERCEL_PROJECT_ID`                                         | Actual demo project ID                     | Same demo project ID                            |
| `ADMIN_VERCEL_PROJECT_ID`                                        | Actual real production project ID          | Same real production project ID                 |
| `EMILIST_VERCEL_TEAM_ID`                                         | Actual owning team ID                      | Same owning team ID                             |
| `EMILIST_VERCEL_TEAM_SLUG`                                       | Actual owning team slug                    | Same owning team slug                           |
| `DEMO_ALLOWED_HOSTS`                                             | Approved demo hostnames, comma-separated   | Same approved demo hostname list                |
| `ADMIN_ALLOWED_HOSTS`                                            | Real production hostnames, comma-separated | Same real production hostname list              |
| `DASHBOARD_UI_PREVIEW`                                           | Unset or `false`                           | Unset or `false`                                |
| `NEXT_PUBLIC_API_BASE_URL`, `ADMIN_API_BASE_URL`, `API_BASE_URL` | Unset                                      | Leave unset until confirmed backend integration |

Hostnames must be disjoint and contain no schemes, paths, wildcards, or credentials. Include each intended Vercel/custom demo hostname explicitly; unlisted generated/branch URLs remain denied. Do not assign real production domains to the demo project.

Set project-specific variables for every enabled Vercel Production/Preview environment. Enable **Automatically expose System Environment Variables** and **Secure backend access with OIDC federation**, using the **Team** issuer mode on both projects. Vercel supplies `VERCEL`, `VERCEL_ENV`, `VERCEL_PROJECT_ID`, the build-time `VERCEL_OIDC_TOKEN`, and the function request's `x-vercel-oidc-token` header. Never manually create or commit identity tokens, and do not override Vercel system variables. Custom Vercel target environments are not supported by this configuration; only Production and Preview are accepted.

The allowlisted project/team IDs and hostnames are configuration, not authorization proof. Build and request-time checks cryptographically verify the token's signature, issuer, audience, subject, project ID/name, owning team, environment, and validity against Vercel's fixed JWKS endpoint. The expected project names are pinned to `emilist-admin-demo` and `emilist-admin`. No project IDs, deployment URLs, or secrets are hardcoded. The demo build records its verified non-secret identity binding in its compiled artifact; runtime flags cannot convert a normal artifact into a demo. Missing identities, wrong projects, conflicting mode, expired/forged tokens, API origins on demo, and reused artifacts from another project/environment fail closed. A build lacking valid required identity fails; an invalid runtime demo request is denied. Do not promote or copy prebuilt demo artifacts between projects or Vercel environments; rebuild in the destination's own project/environment instead. In particular, never use a local test demo artifact for deployment.

On the dedicated demo only, Sign In opens Overview through the centralized route constant without reading credentials or creating an authenticated administrator. The persistent Demo Mode label identifies synthetic presentation data. Direct routes and refreshes use the same server-side identity check. Real production has no unauthenticated dashboard path, even with demo flags or a demo request token; backend authentication remains an integration requirement.

Demo safety is enforced beyond buttons: the compiled API client rejects every administrative request before dispatch; the demo proxy rejects API/export paths and non-GET/HEAD requests, including server-action POSTs; CSP restricts browser connections to the demo origin and disables form submissions, frames, workers, and objects. Same-origin navigation and Next.js rendering remain available. Server deployment verification may fetch only Vercel's fixed public signing-key endpoint; there are no administrative services or server-side API calls. Future services must preserve the demo network deny policy, and the actual backend must independently require authentication/authorization and reject demo-origin credentials. Vercel configuration administrators remain a trusted operational boundary: this does not protect against someone changing source code or replacing the deployment's trust policy.

See [Vercel system variables](https://vercel.com/docs/environment-variables/system-environment-variables), [OIDC token claims](https://vercel.com/docs/oidc/reference), and [OIDC at build/function runtime](https://vercel.com/docs/oidc). Test keys are generated only by `npm run test:e2e`; no application environment variable can switch the production verifier to those keys. `EMILIST_BUILD_TARGET` and the compiled `EMILIST_BOUND_*` values are internal build outputs, not Vercel settings to copy between projects. `EMILIST_OUTPUT_DIRECTORY=.next-demo` is used only by the local browser harness to keep test artifacts separate; do not set it on Vercel.
