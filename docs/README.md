# ZeroFat Frontend Documentation

Evidence-based architecture and UI analysis for the ZeroFat admin frontend (`zero-fat-project` v4.1.1).

## Documents

| Document | Purpose |
|----------|---------|
| [FRONTEND_ANALYSIS_REPORT.md](./FRONTEND_ANALYSIS_REPORT.md) | Full 8-section analysis: architecture, theme, components, styling, risks, refactoring |
| [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md) | Validated architecture findings with corrections and confirmed gaps |
| [CHANGE_SAFETY_MAP.md](./CHANGE_SAFETY_MAP.md) | Tiered file lists for safe vs high-risk modifications |
| [AUTH_STRATEGY_DECISION.md](./AUTH_STRATEGY_DECISION.md) | Decision on JWT vs Redux auth unification |

## Quick reference

- **Stack:** React 18, TypeScript, Vite 5, MUI v5, Crema template, Redux Toolkit + RTK Query
- **Entry:** `index.html` → `src/main.tsx` → `src/App.tsx`
- **List page pattern:** `AppBreadcrumb` → `AppFilters` → `AppDataGrid` + domain modals
- **Highest UI risk:** `src/Components/baseComponents/`, `src/@crema/constants/defaultConfig.ts`
- **Auth source of truth:** `JWTAuthProvider` (not Redux `auth` slice) for route guards
