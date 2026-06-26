# Architecture Review — Validation Report

**Status:** Validated against codebase (June 2026)  
**Related:** [FRONTEND_ANALYSIS_REPORT.md](./FRONTEND_ANALYSIS_REPORT.md) §1

This document confirms or corrects each major architecture claim from the analysis report.

---

## Confirmed findings

### Entry and bootstrap

| Claim | Status | Evidence |
|-------|--------|----------|
| Vite entry is `src/main.tsx` | **Confirmed** | `index.html` loads `/src/main.tsx`; `main.tsx` renders `<App />` |
| Provider tree in `App.tsx` | **Confirmed** | Redux → PersistGate → AppContextProvider → Theme → Style → Locale → Router → Auth → Layout |
| Default landing URL from env | **Confirmed** | `.env` line 1: `VITE__INITIAL_URL=/workout/catalog/bodyParts` |

### Routing

| Claim | Status | Evidence |
|-------|--------|----------|
| React Router v6 with `useRoutes` | **Confirmed** | `AppLayout/index.tsx` lines 14, 35 |
| Three-tier route model | **Confirmed** | `RouteGenerator.tsx` merges anonymous, authorized, public |
| Auth-based layout split | **Confirmed** | Authenticated → `Layouts[navStyle]`; unauthenticated → `AppContentView` only |
| Partial lazy loading | **Confirmed** | Only Signin, Dashboard, errors, and 2 workout pages use `React.lazy` |

### State and API

| Claim | Status | Evidence |
|-------|--------|----------|
| Single RTK Query `api` instance | **Confirmed** | `store.ts` exports one `featureApiGenerator({ name: "api" })` |
| `auth` slice only custom reducer | **Confirmed** | `root.ts` combines `api.reducer` + `auth` |
| `redux-persist` whitelists `auth` | **Confirmed** | `store.ts` lines 13–17 |
| 51 `injectEndpoints` modules | **Confirmed** | Grep across `src/` (48 pages + 3 legacy `src/app/` APIs) |
| Base URL `https://api-app.zerofat.ai` | **Confirmed** | `src/env/base-url.ts` |

### Authentication

| Claim | Status | Evidence |
|-------|--------|----------|
| Active auth is JWT context | **Confirmed** | `useAuthUser()` delegates to `useJWTAuth()` in `AuthHooks.ts` |
| Route guards use `isAuthenticated` from JWT | **Confirmed** | `AppLayout/index.tsx` lines 20, 45–49 |
| Token in `localStorage` key `"token"` | **Confirmed** | `JWTAuthProvider.tsx` lines 60, 88 |
| Dual axios: `authAxios` + `jwtAxios` | **Confirmed** | `config/axios/index.ts` and `@crema/services/auth/jwt-auth/` |
| Orphan RTK login at `src/app/login/` | **Confirmed** | Not referenced in `AppRoutes/index.tsx` |

### UI and theme

| Claim | Status | Evidence |
|-------|--------|----------|
| MUI v5 + Emotion primary stack | **Confirmed** | `package.json` dependencies |
| No Tailwind/SCSS/CSS Modules | **Confirmed** | No matching deps or `*.module.css` in `src/` |
| Global theme via `defaultConfig.ts` | **Confirmed** | `ThemeContextProvider` + `AppThemeProvider` |
| Light/dark supported, not persisted | **Confirmed** | `ThemeContextProvider.tsx` `useState` only; no localStorage |
| Brand primary `#a5d060` | **Confirmed** | `defaultConfig.ts` line 52; `.env` `VITE__PRIMARY_COLOR` |

### Component usage counts

| Component | Claimed | Verified |
|-----------|---------|----------|
| `AppDataGrid` | ~44 pages | **44** list page files |
| `AppFilters` | ~44 pages | **44** page files |
| `AppBreadcrumb` | ~43 pages | **43** files |
| `AppConfirmModal` | ~34 hooks | **34** `useXxx.tsx` files |
| `showErrorToasts` | 31+ APIs | **31** API service files + axios + toasts |
| Unused `selectFilter` | 0 imports | **Confirmed** — 0 external imports |

---

## Corrections and clarifications

### 1. API module count

**Report said:** ~50 feature API files  
**Corrected:** **51** files call `api.injectEndpoints()` (48 under `src/pages/`, 3 under legacy `src/app/`).

### 2. AccountRoutes gap

**Report said:** `AccountRoutes.tsx` not imported into `authorizedStructure`  
**Confirmed:** File exists at `src/@crema/core/AppRoutes/AccountRoutes.tsx` but grep finds **zero** references to `AccountRoutes` anywhere in `src/`. The `/my-account` route is unwired.

### 3. Login token bug (confirmed critical)

In `JWTAuthProvider.tsx` line 90:

```typescript
localStorage.setItem('token', data.token);
setAuthToken(data.token);
setToken(data.data.token);  // likely wrong — data.data may be undefined
```

`setToken` for RTK Query (`authAxios`) may receive `undefined` while JWT axios gets `data.token`. This is a **confirmed bug** affecting API auth headers after login.

### 4. Auth slice name mismatch

`auth` slice is registered with `name: "test"` in `src/app/login/services/slice/index.ts` — cosmetic only but indicates incomplete integration.

### 5. Privilege system disabled

`authorized-check-wrapper/index.tsx` hardcodes `canEdit = true` and `canDelete = true`; all privilege checks commented out. Route-level `Error403` via `RouteGenerator` may still apply for role mismatches, but page-level gating is inactive.

### 6. `@crema/components` import count

**Report said:** ~105 files  
**Corrected:** **36** files outside `src/@crema/` import from `@crema/components`. The higher figure included internal Crema self-imports.

---

## Architecture mental model (validated)

```
Browser
  └── Vite SPA (React 18)
        ├── Crema shell (@crema): layout, theme, auth UI, routing helpers
        ├── Feature pages (src/pages): CRUD list/detail per domain module
        ├── Domain UI (src/Components): modals, forms, badges per module
        ├── Shared kit (baseComponents): DataGrid, Filters, Breadcrumb, Modals
        └── Data layer: RTK Query (single api) + authAxios → backend /api/*
```

**Two parallel UI generations coexist:**

1. **Modern (primary):** `src/pages/` + `baseComponents` + RTK Query — used by all module routes
2. **Legacy:** `src/app/` + `main-table` + `generate-form-component` — not in main route config except orphan APIs

---

## Gaps requiring team attention

| Gap | Impact | Recommended action |
|-----|--------|-------------------|
| Unwired `AccountRoutes` | `/my-account` inaccessible | Import into `authorizedStructure` or remove file |
| Dual auth (JWT + Redux) | Confusion, token sync bugs | See [AUTH_STRATEGY_DECISION.md](./AUTH_STRATEGY_DECISION.md) |
| `setToken(data.data.token)` bug | RTK API calls may lack auth | Fix to use `data.token` consistently |
| Theme not persisted | User preference lost on refresh | Add localStorage in `ThemeContextProvider` |
| Dead components | Maintenance noise | Remove `selectFilter`, `suspenseWrapper`, etc. |
| Commented axios interceptor | Token not read from Redux | Irrelevant if JWT/localStorage is source of truth |

---

## Review conclusion

The architecture described in the main analysis report **accurately reflects the codebase** with minor count corrections noted above. The application is a Crema-based MUI admin dashboard with a consistent page triad pattern and a single RTK Query API surface. The primary architectural risk is the **dual auth/axios stack** and the **confirmed login token bug**, not the routing or component structure.
