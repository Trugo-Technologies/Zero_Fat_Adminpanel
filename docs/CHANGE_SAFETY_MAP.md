# Change Safety Map — File Risk Tiers

**Purpose:** Guide which files are safe to modify for logic-only changes vs which require full regression testing.  
**Related:** [FRONTEND_ANALYSIS_REPORT.md](./FRONTEND_ANALYSIS_REPORT.md) §5, §7

---

## Risk tier definitions

| Tier | Label | UI impact if logic changes | Regression scope |
|------|-------|---------------------------|------------------|
| **T0** | Critical infrastructure | Often global visual/functional | Entire application |
| **T1** | Shared UI primitives | High — propagates to 40+ screens | All list/CRUD pages |
| **T2** | Layout & theme | High — all authenticated screens | Global appearance/navigation |
| **T3** | Module-scoped | Low–medium — one feature domain | Single module |
| **T4** | Safe / isolated | Minimal — types, URLs, pure utils | Single file or no UI |

---

## T0 — Critical infrastructure (never change without full QA)

Modify only when the change is intentional and app-wide testing is planned.

| File | Why critical | What breaks |
|------|--------------|-------------|
| `src/redux-config/feature-api-generator.ts` | Single RTK Query factory | All 51 API endpoints |
| `src/redux-config/store.ts` | Store, persist, middleware | All state + API cache |
| `src/redux-config/root.ts` | Reducer composition | Store shape |
| `src/config/axios/index.ts` | Global interceptors, 401 reload, error toasts | All HTTP + notifications |
| `src/@crema/helpers/RouteGenerator.tsx` | Route access control | All navigation |
| `src/@crema/services/auth/jwt-auth/JWTAuthProvider.tsx` | Login, logout, session | Auth + API tokens |
| `src/@crema/core/AppLayout/index.tsx` | Route rendering + layout gate | All screens |
| `src/App.tsx` | Root provider tree | Everything |
| `src/hooks/use-paginate-data.ts` | Shared by all list pages | All paginated tables |

---

## T1 — Shared UI primitives (44-page blast radius)

Changing props, default styles, or behavior affects nearly every list page.

| File / folder | Consumers | Safe change examples |
|---------------|-----------|---------------------|
| `src/Components/baseComponents/dataGrid/AppDataGrid.tsx` | 44 list pages | Internal perf fix preserving props |
| `src/Components/baseComponents/filters/AppFilters.tsx` | 44 list pages | Bug fix in bulk-delete logic |
| `src/Components/baseComponents/breadcrumb/AppBreadcrumb.tsx` | 43 files | i18n key fix (test labels) |
| `src/Components/baseComponents/modals/AppConfirmModal.tsx` | 34 delete hooks | Confirm text logic |
| `src/Components/baseComponents/modals/AppAddModal.tsx` | All add flows | — |
| `src/Components/baseComponents/modals/AppEditModal.tsx` | All edit flows | — |
| `src/Components/baseComponents/modals/AppDetailsModal.tsx` | All detail flows | — |
| `src/Components/baseComponents/modals/stepper/` | 8 multi-step wizards | — |
| `src/Components/baseComponents/badge/*.tsx` | Column renderers | Color mapping logic |
| `src/Components/baseComponents/buttons/AppButton.tsx` | 16 files | Loading state logic |
| `src/Components/baseComponents/inputs/*.tsx` | 65+ import lines | Validation handlers |
| `src/Components/toasts.tsx` | 31+ API files + App | Toast duration/queue logic |

**Rule:** Do not change component prop interfaces or default `sx`/styled styles for a single-page fix. Override at the page level instead.

---

## T2 — Layout, theme, navigation (global appearance)

| File / folder | Impact |
|---------------|--------|
| `src/@crema/constants/defaultConfig.ts` | Palette, typography, MuiButton/Card/Input overrides |
| `src/@crema/constants/ColorSets.ts` | Theme customizer presets |
| `src/@crema/context/AppContextProvider/ThemeContextProvider.tsx` | Light/dark mode, RTL |
| `src/@crema/context/AppThemeProvider/index.tsx` | MUI ThemeProvider |
| `src/@crema/context/AppStyleProvider/index.tsx` | RTL Emotion cache |
| `src/@crema/components/AppLayout/**` | 11 layout variants, sidebar, header |
| `src/@crema/core/AppRoutes/routeconfig.tsx` | Sidebar menu structure |
| `src/@crema/core/AppRoutes/index.tsx` | Route registration |
| `src/styles/base.css` | Global reset, typography, CSS variables |
| `src/styles/index.css` | CSS import chain, RTL font override |
| `.env` | `VITE__NAV_STYLE`, `VITE__PRIMARY_COLOR`, `VITE__INITIAL_URL` |

---

## T3 — Module-scoped (change within one feature)

### Per-module file sets (repeat for each entity)

Each CRUD entity typically has this structure — changes are isolated to that entity's screens:

```
src/pages/{module}/{entity}/
  index.tsx              # Page JSX — T3 (visual if layout changes)
  use{Entity}.tsx        # Hook logic — T3 (safe for logic)
  {Entity}Columns.tsx    # Table columns — T3 (safe for cell logic)
  services/api/index.ts  # RTK endpoints — T3 (safe if hook API unchanged)
  {Entity}Profile.tsx  # Profile page — T3 (if exists)

src/Components/{module-module}/{entity}/
  Add{Entity}.tsx        # T3 — modal for one entity
  Edit{Entity}.tsx
  {Entity}Details.tsx
```

### Module directories (all T3 within module)

| Module path | Entities (examples) |
|-------------|---------------------|
| `src/pages/workout-module/` | bodyParts, workouts, plans, trainers, exercises, equipment |
| `src/pages/nutriplan-module/` | meals, recipes, ingredients, menus, allergens, categories |
| `src/pages/clients-module/` | clients, subscriptions, dailySelections, kitchen |
| `src/pages/core-module/` | faq, banners, ads, subscriptionPlans |
| `src/pages/users-module/` | admins |
| `src/pages/dashboard/` | dashboard widgets only |

### Legacy stack (T3, low traffic)

| Path | Notes |
|------|-------|
| `src/app/login/` | Orphan — not in routes |
| `src/app/plans/` | Legacy API only |
| `src/Components/main-table/` | 2 consumers in `src/app/` |
| `src/Components/generate-form-component/` | 6 consumers |

---

## T4 — Safe to modify (minimal UI risk)

| Path | Change type |
|------|-------------|
| `src/types/**` | TypeScript interfaces only |
| `src/shared/end-points/index.ts` | URL path builders |
| `src/shared/privileges/index.ts` | Privilege key constants |
| `src/validation/**` | Yup schemas (may change error messages) |
| `src/utilities/**` | Pure utility functions |
| `src/env/base-url.ts` | API base URL |
| `src/config/settings.ts` | RTK cache TTL |
| Orphan components (no imports): | |
| `src/Components/selectFilter/` | Safe to delete |
| `src/Components/suspenseWrapper/` | Safe to delete |
| `src/Components/price-format/` | Safe to delete |
| `src/Components/date-formated-cell/` | Safe to delete |
| `src/Components/date-filter/` | Safe to delete |
| `src/Components/excel-file-input/` | Safe to delete |

---

## Decision matrix: "Can I change this file?"

| Your goal | Recommended tier | Example files |
|-----------|------------------|---------------|
| Fix API endpoint URL | T4 or T3 | `services/api/index.ts`, `shared/end-points/` |
| Add column to one table | T3 | `{Entity}Columns.tsx` |
| Change delete confirmation flow for one entity | T3 | `use{Entity}.tsx` |
| Fix pagination bug affecting all tables | T0 | `use-paginate-data.ts` |
| Add new filter to all list pages | T1 | `AppFilters.tsx` |
| Change primary brand color | T2 | `defaultConfig.ts` |
| Fix login token handling | T0 | `JWTAuthProvider.tsx` |
| Add new CRUD module | T3 (new files) | Copy existing module pattern |

---

## Recommended test spots after changes

| Changed tier | Spot-check these pages |
|--------------|------------------------|
| T0 | Login, any list page, any modal save/delete |
| T1 | Workout body parts, Nutriplan recipes, Clients list |
| T2 | Login page, dashboard, sidebar navigation, dark mode toggle |
| T3 | The specific entity page you modified |
| T4 | Smoke test one list page if endpoints changed |

---

## Files to modify by common task

### Task: Add new list page (new feature)

**Create (T3 — new):**
- `src/pages/{module}/{entity}/index.tsx`
- `use{Entity}.tsx`, `{Entity}Columns.tsx`
- `services/api/index.ts`
- `src/Components/{module}/{entity}/Add|Edit|Details*.tsx`
- `src/types/modules/{module}/{entity}/`
- Route entry in `src/@crema/core/AppRoutes/{Module}Routes.tsx` (T2)
- Sidebar entry in `routeconfig.tsx` (T2)

**Do not modify:** T0, T1 unless adding shared capability.

### Task: Fix business logic on existing page

**Modify (T3):** `use{Entity}.tsx`, `services/api/index.ts`  
**Avoid:** `index.tsx` JSX, `baseComponents/`

### Task: Theme rebrand

**Modify (T2):** `defaultConfig.ts`, optionally `.env`  
**Verify:** Buttons, sidebar, forms, dark mode

### Task: Auth fix

**Modify (T0):** `JWTAuthProvider.tsx`, `config/axios/index.ts`  
**See:** [AUTH_STRATEGY_DECISION.md](./AUTH_STRATEGY_DECISION.md) first
