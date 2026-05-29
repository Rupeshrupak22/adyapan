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

## 6. Verification Commands

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
