# Emilist Admin engineering conventions

## Scope and workflow

This is a long-term production administration application for the Emilist marketplace. Inspect the repository before changes. Explain substantial work, keep changes focused, and implement incrementally. Phase 1 is the foundation only; Phase 2 requires explicit user approval. Never invent backend endpoints, response contracts, authentication, operational data, roles, or final branding. Do not create empty feature directories or placeholder modules. Do not change unrelated files. Do not spawn agents unless explicitly authorized.

Use npm and Node 24. Use stable dependencies only, verify peer compatibility, retain package-lock.json, and never use force or legacy-peer-deps to bypass conflicts. Prefer native Next.js features over additional dependencies. Run the relevant checks and accurately disclose blockers. Provide a concise change summary and conventional commit suggestion. Do not commit or deploy without authorization.

## Architecture and boundaries

- Next.js App Router, TypeScript strict mode, src/ layout, and @/* imports.
- Keep route files thin: compose feature modules and layouts.
- Prefer Server Components. Add client boundaries only for interaction, browser APIs, or client providers.
- Organize business logic under features/<domain>. Feature components, services, schemas, types, and hooks stay with that feature. Do not import implementation details from unrelated features.
- Use the hybrid feature-based and Atomic Design architecture below for shared UI. Shared infrastructure belongs in lib, environment config in config, and providers in providers.
- Avoid circular imports, premature abstractions, and large global collections of domain logic.
- API functions belong in services; remote-data logic belongs in hooks; components handle presentation. Never call Axios from presentation components.

## Shared UI and Atomic Design

Keep business domains feature-based. Features own their components, services, API hooks, schemas, and types regardless of the visual complexity of their screens. Do not move feature-specific components into global Atomic Design directories merely because they resemble a molecule or organism.

- components/ui is the shadcn primitive layer and serves as the foundational atom layer (currently Button and Skeleton). Do not create a parallel atoms directory or duplicate primitives. Keep compound shadcn primitives intact in ui rather than splitting their internals across atomic levels. Preserve components.json aliases and Radix behavior.
- components/molecules contains focused, domain-independent combinations such as PageHeader and EmptyState.
- components/organisms contains substantial shared interface regions such as DashboardHeader and DashboardSidebar.
- components/templates contains reusable layout composition such as DashboardLayout. Templates accept content and compose shared regions; they do not fetch business data.
- Routes compose feature screens and templates. Features may import shared UI. Shared UI must not import feature-specific services, schemas, types, or API hooks. Shared UI may use shared UI hooks such as useSidebarStore.

Treat the levels as composition guidance, not a requirement to wrap every element or pass through every level. Keep ui independent of higher shared levels; molecules may use ui, organisms may compose lower-level UI, and templates may compose shared regions. Avoid circular dependencies. Promote components only when domain-independent reuse is justified. Preserve props, accessibility, responsive behavior, and client/server boundaries during organizational changes. Do not create unused folders, new abstractions, or blanket client boundaries.

## Screenshot-driven screen workflow

Wait for the user's first design screenshot before starting Phase 2 screens. Implement screens progressively within the approved scope, using supplied screenshots and assets as the visual reference. Preserve visual fidelity, spacing, typography, states, and responsive behavior; verify supplied viewport sizes and sensible layouts between them. Clarify material missing design details instead of inventing approved branding. Extract shared UI only when actual reuse warrants it.

Forms may have UI and Zod validation before an API is available. Form validation is not proof of a backend payload contract. Clearly communicate unavailable submission, and do not simulate successful backend submissions, authentication, mutations, success toasts, or saved state. Connect submission only when real endpoints, payloads, response contracts, and authorization requirements are supplied. Keep API calls in feature services and TanStack Query logic in dedicated feature hooks.

## Mandatory naming

Every reusable React component has its own PascalCase directory and matching PascalCase.tsx file. Colocate meaningful component tests as ComponentName.test.tsx. Every custom hook starts with use, uses camelCase, and has its own matching folder and filename, e.g. hooks/useGetUsers/useGetUsers.ts. Store hooks follow the same rule. Utilities, service modules, and store files use descriptive camelCase. Type and interface identifiers use PascalCase; fixed constants use UPPER_SNAKE_CASE where appropriate. Preserve Next.js required filenames such as page.tsx, layout.tsx, error.tsx, loading.tsx, route.ts, and proxy.ts.

shadcn CLI output must be moved to the PascalCase convention and its imports updated before completion; never leave kebab-case component files. Barrel exports are optional and must not obscure server/client boundaries.

## Styling and accessibility

Tailwind CSS v4 is the primary styling system. Use semantic CSS variables and @theme inline tokens in globals.css, shadcn/ui patterns, Radix primitives, Lucide icons, and cn() for conditional classes. Tokens are temporary neutral values, not approved Emilist branding. Light mode only until design approval requires otherwise.

Use utilities for spacing, layout, responsive behavior, typography, and states. Avoid CSS Modules, component stylesheets, inline styles, unnecessary !important, and arbitrary values where tokens suffice. Explain any necessary custom CSS. globals.css is for Tailwind imports, tokens, and global base styles.

Provide accessible names, labels, contrast, semantic structure, visible focus, keyboard navigation, and responsive layouts. Include loading skeletons matching content shape, empty/error/retry states, and specific localized pending action labels. Disable pending actions to prevent duplicate submissions. Use Sonner for appropriate action notifications and inline validation for form fields. Avoid blanket loading overlays.

## State, API, and security

- TanStack Query owns remote data, caching, refetches, mutations, and invalidation. Use centralized query keys, serializable filters, and cancellation signals. Do not copy server data into Zustand.
- Zustand owns appropriate shared UI state. Local React state handles component interactions. URL parameters own shareable search, sorting, filters, pagination, and tabs. React Hook Form and Zod handle complex forms.
- Use centralized Axios configuration with environment base URL, bounded timeout, credentials, and safe error normalization. Use feature services with typed contracts and runtime validation where appropriate. Pass AbortSignal through services. Document provisional contracts explicitly. Do not log secrets or personal information or display raw backend errors.
- Before enabling protected admin data or actions, implement a confirmed server session adapter and enforce authorization close to every server data access/action. The Phase 1 shell is public and contains no protected data.
- Prefer server-managed HttpOnly, Secure, SameSite cookies. Never store sensitive tokens in localStorage or expose secrets via NEXT_PUBLIC_. Backend APIs independently enforce every permission. UI checks and route interception are supplemental only.
- Get actual role/permission definitions from the backend. Deny absent, invalid, or expired sessions. Never infer super-admin privileges or implement fictional authentication.
- On session expiration, integrate server-confirmed session handling, cancel and clear private query data, and route to the confirmed login flow. Do not blindly redirect every 401 or retry unauthorized mutations.
- Verify CORS, CSRF protection for cookie-authenticated mutations, cookie scope, logout, expiry, MFA requirements, and trusted origins with the backend. Never automatically replay sensitive mutations.
- Validate environment settings; document required variables in .env.example. Never commit actual secrets.

## Tables and performance

Use server-managed pagination/sorting/filtering for large datasets, URL state when shareable, accessible overflow, and feature-independent table primitives when needed. Do not build a generic table framework before actual contracts exist. Evaluate TanStack Table when warranted.

Keep bundles small, dynamically load charts and expensive interactions when useful, avoid waterfalls and unnecessary effects, and add memoization only for clear benefits. Do not add unused providers or import heavy chart libraries globally.

## Verification and documentation

Use Vitest and React Testing Library for meaningful behavior: permissions, session integration, validation, errors, hooks, and workflows. Playwright covers critical browser journeys. Avoid redundant implementation-mirroring tests and unnecessary snapshots. Never weaken TypeScript/ESLint merely to silence errors; avoid any and narrow unknown instead.

Before completion run npm run typecheck, npm run lint, npm run format:check, npm test, npm run build, and relevant Playwright tests (build first). Resolve failures or disclose exactly what remains blocked. Update README when setup/architecture changes. Document backend integration boundaries and security limitations. Do not claim checks passed unless they actually ran successfully.
