# Engineering conventions

## Working standards

Inspect the repository and relevant configuration before making changes. Keep changes focused, incremental, and consistent with existing behavior. Preserve unrelated work. Do not create empty directories, speculative modules, duplicate components, or premature abstractions. Document material architecture and setup changes.

Use Node.js 24 and npm. Keep exact dependency versions and `package-lock.json`; verify stable releases and peer compatibility before dependency changes. Do not use prerelease dependencies, `--force`, or `--legacy-peer-deps` to bypass incompatibilities. Prefer native Next.js capabilities when they meet the requirement without another library.

## Application architecture

- Use Next.js App Router, the `src/` structure, `@/*` imports, and strict TypeScript.
- Keep route files thin: compose feature screens, templates, and layouts.
- Prefer Server Components. Add client boundaries only for interaction, browser APIs, or client providers; preserve existing server/client boundaries.
- Keep business domains in `features/<domain>`. Feature components, services, hooks, schemas, and types belong to their domain. Do not import unrelated features' implementation details. Reports may compose the dashboard feature's public read-only analytics export; chart implementation details and fixtures remain owned by dashboard.
- Keep shared infrastructure in `lib/`, environment configuration in `config/`, and application providers in `providers/`.
- API functions belong in feature services, TanStack Query logic in dedicated feature hooks, and presentation logic in components. Never call Axios from presentation components.
- Avoid circular dependencies, large global collections of domain logic, and unnecessary abstraction. Favor composition and clear TypeScript contracts.

## Shared UI and Atomic Design

Use Atomic Design for genuinely reusable UI while preserving feature ownership of domain-specific components.

| Directory                   | Responsibility                                                               |
| --------------------------- | ---------------------------------------------------------------------------- |
| `src/components/ui/`        | shadcn primitives and foundational atoms, including Button and Skeleton      |
| `src/components/molecules/` | Focused domain-independent combinations, including PageHeader and EmptyState |
| `src/components/organisms/` | Shared interface regions, including DashboardHeader and DashboardSidebar     |
| `src/components/templates/` | Layout composition, including DashboardLayout                                |

Do not create a parallel `atoms/` directory or duplicate shadcn primitives. Keep compound shadcn components intact in `ui/`, preserving `components.json` aliases and Radix accessibility behavior.

Keep `ui/` independent of higher shared levels. Molecules may compose primitives, organisms may compose lower-level UI, and templates may compose shared regions and accept screen content. Templates must not fetch business data. Atomic levels are guidance for composition, not a requirement to wrap every element or use every level.

Features may import shared UI. Shared UI must not import feature-specific services, schemas, types, or API hooks. Shared UI may consume shared UI hooks such as `useSidebarStore`. Promote a component to shared UI only when domain-independent reuse is justified; visual complexity alone is insufficient.

## Mandatory naming

- Every reusable React component must have its own PascalCase folder and matching `.tsx` filename: `Button/Button.tsx`.
- Every custom hook must begin with `use`, use camelCase, and have a dedicated matching folder and filename: `useGetUsers/useGetUsers.ts`. Store hooks follow the same rule.
- Colocate meaningful tests: `Button.test.tsx` or `useGetUsers.test.ts`.
- Utilities, services, and store modules use descriptive camelCase filenames. Type and interface identifiers use PascalCase; fixed constants use UPPER_SNAKE_CASE where appropriate.
- Preserve required Next.js filenames, including `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`, and `proxy.ts`.
- Move generated shadcn component files into the PascalCase convention and update their imports. Do not leave kebab-case component files. Optional barrel exports must preserve clear server/client boundaries.

## Styling and accessibility

Tailwind CSS v4 is the primary styling system. Use utility classes, semantic CSS variables and `@theme inline` tokens from `src/app/globals.css`, shadcn patterns, Radix primitives, Lucide icons, and `cn()` for conditional classes. Preserve the current light theme and neutral tokens unless design requirements change. Do not invent brand specifications.

Use utilities for layout, spacing, typography, responsiveness, and interaction states. Avoid ordinary component CSS Modules, separate component stylesheets, inline styles where utilities suffice, unnecessary `!important`, and arbitrary values when design tokens are suitable. Limit global CSS to imports, tokens, resets, fonts, and genuinely global styles. Explain custom CSS when utilities are insufficient.

Provide semantic markup, accessible names and labels, sufficient contrast, visible keyboard focus, logical navigation, and responsive layouts. Preserve modal focus management and Escape behavior. Implement loading skeletons shaped like the expected content, refetching indicators, empty states, recoverable errors, and disabled/pending states. Use localized action labels such as “Saving” and prevent duplicate submissions. Use inline form errors and appropriate Sonner feedback; avoid blanket loading overlays.

## State and forms

- TanStack Query owns remote data, caching, refetching, mutations, and invalidation. Do not duplicate remote data in Zustand.
- Zustand owns shared UI state. Local React state owns transient component interactions.
- URL parameters own shareable search, sorting, filters, pagination, and tabs.
- Use React Hook Form and Zod for complex forms with typed validation, accessible labels, field errors, server-error mapping, and submission feedback.

Form UI and validation may exist before backend integration, but validation does not establish a backend payload contract. Make unavailable submission clear. Never simulate successful submissions, authentication, mutations, notifications, or saved state. Connect submission only to supplied backend endpoints, payloads, response contracts, and authorization requirements.

## API integration

Use the centralized Axios client with validated environment configuration, bounded timeout, credentials, relative endpoint paths, and safe normalized errors. Feature services own typed request/response contracts and runtime validation where appropriate. Pass `AbortSignal` through service functions for cancellation. Never display raw backend errors or log credentials or personal information.

Use only supplied backend endpoints and contracts. Do not invent production APIs, roles, operational data, or authentication. Clearly label internal provisional models and adapters rather than presenting them as confirmed backend contracts. Do not create placeholder services without a real integration requirement.

Use centralized query-key conventions with serializable filters and no credentials. Invalidate the relevant domain after successful mutations. Preserve per-provider query-cache isolation. Retry only appropriate transient query failures; do not retry authorization failures or automatically replay sensitive mutations. Handle cancellations without error toasts.

Validate public settings and document environment variables in `.env.example`. Keep private settings server-only. Never commit secrets or expose them through `NEXT_PUBLIC_` variables.

## Authentication and authorization

The dashboard is a public synthetic UI preview in every environment, including production. Sign In is navigation only and creates no session. Keep the persistent Demo Mode indicator, synthetic fixtures, disabled backend operations, API-client network rejection, and proxy/CSP restrictions. Deployment project IDs, hostnames, OIDC tokens, and preview flags must not gate this public fixture interface. The root entry point remains /login. Do not expose real records or enable administrative transport without integrating server-validated authentication and backend authorization first.

Before adding protected functionality, implement the confirmed session adapter and enforce authentication in the dashboard server layout and authorization close to each server data access/action. Backend APIs must independently enforce permissions; hidden controls and route interception are supplemental only.

Prefer server-managed HttpOnly, Secure, SameSite cookies. Never store sensitive access tokens in localStorage. Map authoritative backend roles and permissions explicitly; deny absent, invalid, or expired sessions and do not infer privileged access.

Establish cookie scope, credentialed CORS origins, CSRF protection, session expiry/revocation, login/logout, profile, and MFA requirements with the backend as applicable. On confirmed session expiration, cancel private requests, clear private query caches, and use the confirmed login flow. Do not blindly redirect every 401 or expose backend error details.

## Tables and performance

Use server-side pagination, sorting, and filtering for large datasets, with URL state where shareable. Include accessible overflow, row actions, loading, empty, error, and pending states as needed. Keep reusable table primitives domain-independent, and implement bulk actions only with authorization. Evaluate TanStack Table when a real workflow justifies it; avoid building a generic table framework before requirements exist.

Keep client bundles small, lazy-load charts and expensive interfaces where useful, avoid request waterfalls and unnecessary effects, and use memoization only for clear benefits. Do not add unused providers or import heavy chart libraries globally.

## Testing and verification

Use Vitest and React Testing Library for meaningful behavior, prioritizing authorization, validation, API errors, query hooks, tables, and administrative workflows. Use Playwright for critical browser journeys and responsive interaction checks. Avoid redundant implementation-mirroring tests and unnecessary snapshots.

Do not weaken TypeScript or ESLint to hide problems. Avoid `any`; use `unknown` and narrowing. Preserve meaningful tests and adjust them when observable behavior changes.

For application changes, run `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, and `npm run build`. Run relevant Playwright tests after building. `npm run check` combines the checks except Playwright. For documentation-only changes, verify commands, paths, implementation claims, and document formatting; application tests need not be repeated unless executable behavior changes.

Resolve regressions or report the exact verification blocker. Never claim a check passed unless it ran successfully. Keep README aligned with implemented capabilities and distinguish integration requirements from working functionality. Summarize changes, validation, and material limitations, and suggest a conventional commit message.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
