# Auth Strategy Decision — JWT Context vs Redux

**Status:** Decision recorded  
**Date:** June 2026  
**Related:** [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md), [FRONTEND_ANALYSIS_REPORT.md](./FRONTEND_ANALYSIS_REPORT.md) §1

---

## Decision

**Do not migrate to Redux-only auth at this time.**  
**Do unify token handling under the existing JWT context as the single source of truth**, with Redux `auth` slice kept in sync (or deprecated) as a secondary store.

### Recommended approach: Option B — JWT-primary with sync

| Concern | Source of truth | Action |
|---------|-----------------|--------|
| Route guards (`isAuthenticated`) | `JWTAuthProvider` | Keep as-is |
| Token in `localStorage` | `JWTAuthProvider` login/logout | Keep as-is |
| `authAxios` headers (RTK Query) | `setToken()` on login | **Fix bug** — use `data.token` consistently |
| `jwtAxios` headers (login) | `setAuthToken()` on login | Keep as-is |
| Redux `auth` slice | Secondary / legacy | Sync on login/logout OR deprecate |
| Orphan `src/app/login/` RTK flow | Unused | Remove or redirect to `/signin` |

---

## Current state (evidence)

### Active path — JWT context

```
/signin → SigninJwtAuth → JWTAuthProvider.signInUser()
  → jwtAxios.post('/api/users-module/Authentication/login')
  → localStorage.setItem('token', data.token)
  → setAuthToken(data.token)   // jwtAxios
  → setToken(data.data.token)  // authAxios — BUG: likely undefined
  → isAuthenticated = true
```

**Files:**
- `src/modules/auth/Signin/SigninJwtAuth.tsx`
- `src/@crema/services/auth/jwt-auth/JWTAuthProvider.tsx`
- `src/@crema/core/AppLayout/index.tsx` (route guard via `useAuthUser()`)

### Inactive path — Redux RTK login

```
src/app/login/index.tsx → useLoginMutation → setLoginData(Redux)
  → NOT wired in AppRoutes
  → Does NOT call setToken() on authAxios
```

**Files:**
- `src/app/login/index.tsx`
- `src/app/login/services/api/index.ts`
- `src/app/login/services/slice/index.ts`

### Token storage locations

| Location | Set by | Read by |
|----------|--------|---------|
| `localStorage['token']` | Login, `setToken`, `setAuthToken` | `JWTAuthProvider` mount, 401 handler |
| `authAxios.defaults.headers.Authorization` | `setToken()` | RTK Query via `feature-api-generator` |
| `jwtAxios.defaults.headers.Authorization` | `setAuthToken()` | Login request, Crema `APIHooks` |
| `store.auth.token` | `setLoginData` (orphan path) | Nothing active (interceptor commented out) |

---

## Options considered

### Option A — Redux as single source of truth

Migrate route guards and token storage to Redux `auth` slice; re-enable axios request interceptor.

| Pros | Cons |
|------|------|
| One store for all app state | Requires rewriting `JWTAuthProvider`, `useAuthUser`, `AppLayout` |
| Token auto-attached from store | Route guards today use React context, not `useSelector` |
| Aligns with `redux-persist` setup | High regression risk across auth + 51 API modules |
| | Crema template expects JWT context pattern |

**Verdict:** Rejected — high effort, fights Crema conventions, no UI benefit.

### Option B — JWT context primary with sync (RECOMMENDED)

Keep `JWTAuthProvider` as auth source of truth. Fix token bug. Optionally sync Redux on login/logout for future privilege use.

| Pros | Cons |
|------|------|
| Minimal change to working login flow | Two stores until Redux slice deprecated |
| Matches current route guard implementation | Must remember dual `setAuthToken` + `setToken` |
| Fixes RTK API auth without architectural rewrite | |
| Enables future privilege checks via Redux sync | |

**Verdict:** Accepted.

### Option C — Status quo (no unification)

Leave dual stacks as-is.

| Pros | Cons |
|------|------|
| Zero immediate work | `setToken(data.data.token)` bug remains |
| | Developer confusion on which auth to use |
| | Orphan `src/app/login/` misleads new contributors |

**Verdict:** Rejected — confirmed bug causes functional issues.

---

## Implementation checklist (when auth work begins)

Execute in this order. Each step is independently testable.

### Phase 1 — Critical fix (no UI change)

1. **Fix token bug** in `JWTAuthProvider.tsx` line 90:
   ```typescript
   // Before
   setToken(data.data.token);
   // After
   setToken(data.token);
   ```

2. **Verify** RTK Query requests include `Authorization` header after login (Network tab).

3. **Logout sync** — ensure `logout()` clears both `setAuthToken()` and `setToken()` and `localStorage` (verify existing implementation).

### Phase 2 — Cleanup (no UI change)

4. **Remove or archive** `src/app/login/` orphan route, or add comment/README pointing to `/signin`.

5. **On login success**, optionally dispatch `setLoginData({ token: data.token })` to keep Redux in sync for future privileges.

6. **On logout**, dispatch `resetAuthData` or `logout` from auth slice (currently commented out in `UserInfo`).

### Phase 3 — Future (when backend privileges ready)

7. **Enable** `authorized-check-wrapper` privilege checks using Redux `auth.privileges`.

8. **Do not** switch route guards to Redux until privileges are populated on login response.

---

## What NOT to do before unification

| Action | Risk |
|--------|------|
| Change `useAuthUser()` to read Redux only | Breaks all route guards |
| Remove `JWTAuthProvider` | Breaks login/logout |
| Enable Redux interceptor without syncing login | RTK calls may use stale token |
| Use `src/app/login/` for new features | Wrong auth path |
| Enable privilege checks without backend data | Blocks all pages |

---

## Testing criteria for auth changes

After any auth modification, verify:

1. Unauthenticated visit to `/workout/catalog/bodyParts` redirects to `/signin`
2. Login succeeds and lands on initial URL
3. RTK Query list page loads data (proves `authAxios` token works)
4. Logout clears session and redirects to `/signin`
5. 401 from API clears token and reloads page
6. Page refresh with valid token stays authenticated

---

## Summary

| Question | Answer |
|----------|--------|
| Unify JWT and Redux auth now? | **Sync, don't replace** — JWT context remains primary |
| Is Redux auth used for routes? | **No** — `JWTAuthProvider.isAuthenticated` only |
| Immediate fix required? | **Yes** — `setToken(data.data.token)` → `setToken(data.token)` |
| Can auth logic change without UI impact? | **Yes** — if token sync is fixed and provider interfaces unchanged |
