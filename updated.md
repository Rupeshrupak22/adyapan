# Security Update Summary

This file lists the security updates applied to the Adyapan project.

## Changes Done From First

### Session Hijacking Hardening

- Added DB-backed sessions.
- Added `authSession` cookie binding.
- `authToken` alone no longer works.
- Session checks now validate:
  - token
  - fingerprint
  - DB session
  - user agent
  - IP
  - idle expiry
  - revocation

### Auto Logout

- Added 15-minute inactivity logout.
- Student sessions stay alive on learning/video pages while visible.
- Admin, organization, and superadmin sessions expire after inactivity.

### `/api/auth/me` Protection

- `/api/auth/me` now requires a full valid bound session.
- Unauthenticated requests get `401`.
- Added `no-store` cache headers.
- Direct browser/address-bar navigation to identity APIs is blocked.
- The app frontend can still call identity APIs through JavaScript fetch requests.

### Payment Auth Hardening

- Payment routes no longer decode `authToken` directly.
- Payment routes now use full session validation.

### Argon2id Password Hashing

- Added `argon2`.
- New passwords now use Argon2id:

```ts
memoryCost: 65536
timeCost: 3
parallelism: 1
```

- Existing bcrypt hashes still work.
- On successful login, bcrypt hashes are automatically upgraded to Argon2id.

### Admin Access Key Hashing

- Added SHA-256 access-key verification.
- Uses timing-safe comparison.
- Supports `ADMIN_ACCESS_KEY_HASH`.
- Also supports the current `.env.local` if the SHA-256 hash is placed in `ADMIN_ACCESS_KEY`.

### Scripts And Docs

- Updated seed scripts to create Argon2id hashes.
- Updated `.env.example` and `backend/.env.example`.
- Updated README reference to `ADMIN_ACCESS_KEY_HASH`.
- Stopped admin helper scripts from printing raw access key values.

### New Key Files

- `src/lib/password.ts`
- `src/lib/adminAccessKey.ts`
- `backend/utils/password.js`

### Verified

- `npx tsc --noEmit` passed.
- `npm run build` passed.
- Backend JS syntax checks passed.
- Final grep shows bcrypt is now only used for legacy bcrypt verification/migration, not for creating new app passwords.

## 1. Footer Admin Portal Link Removed

Removed public footer access to the admin portal.

Updated file:

- `src/components/Footer.tsx`

Removed item:

```tsx
{ href: '/admin/login', label: 'Admin Login' },
```

## 2. Password Hashing Changed To Argon2id

All new app password hashes now use Argon2id with:

```ts
memoryCost: 65536
timeCost: 3
parallelism: 1
```

Updated helper:

```ts
// src/lib/password.ts
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
};
```

New hashes are created with:

```ts
export async function hashPassword(password: string) {
  return argon2.hash(password, ARGON2_OPTIONS);
}
```

Existing bcrypt hashes are still accepted and automatically migrated to Argon2id after a successful login:

```ts
export async function verifyPasswordAndUpgrade(
  password: string,
  passwordHash: string,
  saveHash: (newHash: string) => Promise<void>
) {
  const valid = await verifyPassword(password, passwordHash);
  if (valid && isBcryptHash(passwordHash)) {
    await saveHash(await hashPassword(password));
  }
  return valid;
}
```

Updated areas:

- Student login
- Admin login
- Organization login
- Student signup
- Organization signup
- Admin invite signup
- Superadmin admin creation
- Password reset
- Google OAuth fallback password
- Seed scripts
- Legacy backend password handling

## 3. Admin Access Key Changed To SHA-256 Hash Verification

The admin access key should be a 256-bit hex value generated with:

```js
crypto.randomBytes(32).toString('hex')
```

Only the SHA-256 hash of the raw access key should be stored:

```js
const hashedKey = crypto.createHash('sha256').update(accessKey).digest('hex');
```

Updated helper:

```ts
// src/lib/adminAccessKey.ts
export function verifyAdminAccessKey(accessKey: string) {
  const configuredHash = process.env.ADMIN_ACCESS_KEY_HASH || process.env.ADMIN_ACCESS_KEY || '';
  const submittedHash = sha256Hex(accessKey.trim());
  return safeHexEqual(submittedHash, configuredHash.trim());
}
```

Timing-safe comparison is used:

```ts
crypto.timingSafeEqual(
  Buffer.from(leftHex, 'hex'),
  Buffer.from(rightHex, 'hex')
)
```

Environment template now uses:

```env
ADMIN_ACCESS_KEY_HASH=replace_with_sha256_hash_of_256_bit_hex_access_key
```

Compatibility note:

- `ADMIN_ACCESS_KEY_HASH` is preferred.
- `ADMIN_ACCESS_KEY` is still accepted only as a fallback if it contains the SHA-256 hash.
- Do not store the raw admin access key in environment variables.

## 4. Progressive Login Delays

Implemented progressive response delays for valid-email incorrect-password attempts.

Delay schedule:

```ts
1st failed password attempt: 1 second
2nd failed password attempt: 4 seconds
3rd and later failed attempts: 10 seconds
```

Updated helper:

```ts
// src/lib/progressiveDelay.ts
const FAILURE_DELAYS_MS = [1000, 4000, 10000];

export async function applyProgressiveDelay(failedAttempts: number) {
  const delay = getProgressiveDelayMs(failedAttempts);
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
```

Applied to:

- `src/app/api/auth/login/route.ts`
- `src/app/api/admin/login/route.ts`
- `src/app/api/organization/login/route.ts`
- `backend/routes/authRoutes.js`

The delay is applied only after a valid account is found and the password is incorrect.

## 5. Session Hijacking Hardening

Previously implemented and retained:

- `authToken` alone is not enough.
- Added bound `authSession` cookie.
- Added DB-backed session records.
- Added idle expiry.
- Added logout revocation.
- Added user-agent and IP checks.
- Added `SameSite=Strict` for auth cookies.
- Added no-store headers to authenticated identity routes.

Key files:

- `src/lib/session.ts`
- `src/models/AuthSession.ts`
- `backend/models/AuthSession.js`
- `src/app/api/auth/heartbeat/route.ts`

## 6. Direct Browser Blocking For Identity APIs

Added a direct-navigation guard for identity endpoints, so opening these URLs from the browser address bar no longer exposes account JSON:

- `/api/auth/me`
- `/api/admin/me`
- `/api/organization/me`

New helper:

```ts
// src/lib/apiGuards.ts
export function blockDirectBrowserNavigation(request: NextRequest) {
  const fetchMode = request.headers.get('sec-fetch-mode');
  const fetchDest = request.headers.get('sec-fetch-dest');
  const accept = request.headers.get('accept') || '';

  if (
    fetchMode === 'navigate' ||
    fetchDest === 'document' ||
    accept.includes('text/html')
  ) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404, headers: NO_STORE_HEADERS }
    );
  }

  return null;
}
```

This blocks direct address-bar access while still allowing the frontend app to call the endpoint normally.

## 7. Session Expiry UX And Idle Logout Fix

Updated the session-expired auth flow:

- `/auth?reason=session_expired` no longer opens the login or signup form immediately.
- It now shows a session-expired choice screen first.
- The login form opens only after clicking `Sign In`.
- The signup form opens only after clicking `Create Account`.

Updated idle logout behavior:

- Session monitoring starts only after a valid logged-in session is detected.
- Public visitors are not redirected just because the global student layout is mounted.
- Added a real 15-minute client logout timer.
- The timer resets only on user activity.
- Automated heartbeats no longer keep inactive sessions alive.
- Heartbeat is sent only when the user was recently active or when a student learning/video surface is visible.
- This applies to student, admin, organization, and superadmin layouts where `SessionIdleManager` is mounted.

Updated files:

- `src/app/(student)/auth/page.tsx`
- `src/components/SessionIdleManager.tsx`

Latest verification:

```bash
npx tsc --noEmit
```

Result:

- Passed.

## 8. HTTPS Session Hijacking Hardening Update

Changed the production cookie strategy:

- Production auth cookies now use `__Host-` names:
  - `__Host-adyapanToken`
  - `__Host-adyapanSession`
- Local development uses:
  - `adyapanToken`
  - `adyapanSession`
- The old `authToken` and `authSession` cookies are no longer accepted.
- Login and logout clear old legacy cookies.
- After deployment, users must log in again to receive the new cookies.

Added current-token hash validation:

- `AuthSession` now stores `accessTokenHash`.
- The server checks that the submitted token hash matches the current DB session token hash.
- Heartbeat rotates the access token and updates the stored hash.
- A previously copied token becomes invalid after the real browser refreshes the session.

Fixed session-expired choice buttons:

- `Sign In` and `Create Account` are now normal links with explicit `mode` query params.
- This avoids router state issues on `/auth?reason=session_expired`.

Files to inspect:

- `src/lib/session.ts`
- `src/models/AuthSession.ts`
- `src/lib/security.ts`
- `src/lib/auth.ts`
- `src/proxy.ts`
- `middleware.ts`
- `src/components/SessionIdleManager.tsx`
- `src/app/(student)/auth/page.tsx`
- `src/app/api/auth/me/route.ts`
- `src/app/api/admin/me/route.ts`
- `src/app/api/organization/me/route.ts`
- `backend/routes/authRoutes.js`
- `backend/middleware/auth.js`
- `backend/models/AuthSession.js`

Latest verification:

```bash
npx tsc --noEmit
node -c backend/routes/authRoutes.js
node -c backend/middleware/auth.js
node -c backend/models/AuthSession.js
```

Result:

- Passed.

## 9. Token Replacement Logout Enforcement

Implemented the requested behavior for manual token replacement:

- If the submitted token does not match the DB session token hash, the backend treats it as a session mismatch.
- The matching DB session is revoked by setting `revokedAt`.
- Auth cookies are cleared in the response.
- The API returns `401`.
- Frontend API handling redirects authenticated users to the correct login page after a protected `401`.

Redirect targets:

- Student/public portal: `/auth?reason=session_expired`
- Admin portal: `/admin/login?reason=session_expired`
- Organization portal: `/organization/login?reason=session_expired`

Updated files:

- `src/lib/session.ts`
- `src/lib/api.ts`
- `src/hooks/useAuth.ts`
- `backend/middleware/auth.js`

Latest verification:

```bash
npx tsc --noEmit
node -c backend/middleware/auth.js
node -c backend/routes/authRoutes.js
node -c backend/models/AuthSession.js
```

Result:

- Passed.

## 10. Verification Commands

The following checks were run after updates:

```bash
npx tsc --noEmit
npm run build
node -c backend/routes/authRoutes.js
node -c backend/middleware/auth.js
node -c backend/models/User.js
node -c backend/utils/password.js
node -c backend/utils/progressiveDelay.js
```

Latest direct-navigation update verification:

```bash
npx tsc --noEmit
```

Result:

- Passed.
- `npm run build` compiled successfully, then stopped because `MONGODB_URI` was not loaded in the current shell during Next.js page-data collection.
