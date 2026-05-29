# 🔐 Authentication Flow Diagrams

## 1. Student/Company Signup Flow

```
┌─────────────────┐
│  User visits    │
│  /signup page   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Fills form:                    │
│  - Name                         │
│  - Email                        │
│  - Password                     │
│  - Phone (optional)             │
│  - Role (student/organization)  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Frontend validation            │
│  - Email format                 │
│  - Password length (8+ chars)   │
│  - Password match               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  POST /api/auth/signup          │
│  - Cloudflare Turnstile check   │
│  - Rate limit check (5/15min)   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Backend validation             │
│  - Zod schema validation        │
│  - Sanitize MongoDB input       │
│  - Check duplicate email/phone  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Create user in MongoDB         │
│  Collection: authusers          │
│  - Hash password (bcrypt)       │
│  - Set role (STUDENT/COMPANY)   │
│  - Set accountStatus: approved  │
│  - Track IP, user agent         │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Generate JWT token             │
│  - Expiry: 7 days               │
│  - Payload: userId, email, role │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Set HttpOnly cookie            │
│  - Name: authToken              │
│  - Secure: true (production)    │
│  - SameSite: Lax                │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Send welcome email             │
│  (non-blocking, async)          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Return success response        │
│  - User data (no password)      │
│  - Redirect to dashboard        │
└─────────────────────────────────┘
```

---

## 2. Student/Company Login Flow

```
┌─────────────────┐
│  User visits    │
│  /login page    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Fills form:                    │
│  - Email                        │
│  - Password                     │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  POST /api/auth/login           │
│  - Rate limit check (5/15min)   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Find user in MongoDB           │
│  Collection: authusers          │
│  - Match email (lowercase)      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Check if admin/superadmin      │
│  - If yes: reject, use /admin   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Check account lockout          │
│  - If locked: return error      │
│  - Show minutes remaining       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Verify password                │
│  - bcrypt.compare()             │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │ Invalid │
    ▼         ▼ Valid
┌───────┐   ┌─────────────────────┐
│ Fail  │   │ Check account status│
│ count │   │ - blocked: reject   │
│ +1    │   │ - pending: reject   │
└───┬───┘   │ - !active: reject   │
    │       └────────┬────────────┘
    │                │
    ▼                ▼
┌───────────┐   ┌─────────────────┐
│ If 5      │   │ Reset lockout   │
│ attempts  │   │ Update stats:   │
│ Lock 30m  │   │ - lastLoginAt   │
└───────────┘   │ - loginCount++  │
                │ - lastLoginIp   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Generate JWT    │
                │ Expiry: 7 days  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Set cookie      │
                │ authToken       │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Return success  │
                │ Redirect to     │
                │ dashboard       │
                └─────────────────┘
```

---

## 3. Admin Login Flow (3-Factor Auth)

```
┌─────────────────┐
│  Admin visits   │
│  /admin/login   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Fills form:                    │
│  - Email                        │
│  - Password                     │
│  - Access Key                   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  POST /api/admin/login          │
│  - Rate limit check (5/15min)   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  ✓ FACTOR 1: Access Key         │
│  - Compare with ADMIN_ACCESS_KEY│
│  - Fast fail if invalid         │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  ✓ FACTOR 2: Email Whitelist    │
│  - Compare with ADMIN_EMAIL     │
│  - Only allowed email can login │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Find user in MongoDB           │
│  Collection: authusers          │
│  - Match email                  │
│  - Check role: ADMIN/SUPERADMIN │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Check account lockout          │
│  - If locked: return error      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  ✓ FACTOR 3: Password           │
│  - bcrypt.compare()             │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │ Invalid │
    ▼         ▼ Valid
┌───────┐   ┌─────────────────────┐
│ Fail  │   │ Check account status│
│ count │   │ - blocked: reject   │
│ +1    │   └────────┬────────────┘
└───┬───┘            │
    │                ▼
    ▼           ┌─────────────────┐
┌───────────┐   │ Reset lockout   │
│ If 5      │   │ Update stats    │
│ attempts  │   └────────┬────────┘
│ Lock 30m  │            │
└───────────┘            ▼
                ┌─────────────────┐
                │ Generate JWT    │
                │ Expiry: 8 hours │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Set cookie      │
                │ authToken       │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Return success  │
                │ Redirect to     │
                │ /admin          │
                └─────────────────┘
```

---

## 4. Admin Invite Signup Flow

```
┌─────────────────┐
│  Admin creates  │
│  invite in      │
│  admin panel    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  POST /api/admin/invites        │
│  - Email                        │
│  - Mobile number                │
│  - Role (ADMIN/ORGANIZATION)    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Generate invite in MongoDB     │
│  Collection: admininvites       │
│  - Crypto-random token          │
│  - Expiry: 7 days               │
│  - used: false                  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Send invite email              │
│  - Link: /admin/invite/[token]  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Recipient clicks link          │
│  Opens signup form              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Fills form:                    │
│  - Full name                    │
│  - Email (must match invite)    │
│  - Mobile (must match invite)   │
│  - Password                     │
│  - Company name (optional)      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  POST /api/admin/invites/signup │
│  - Rate limit check (5/15min)   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Find invite by token           │
│  Collection: admininvites       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Validate invite:               │
│  ✓ Token exists                 │
│  ✓ Not used                     │
│  ✓ Not expired                  │
│  ✓ Not revoked                  │
│  ✓ Email matches                │
│  ✓ Mobile matches (timing-safe) │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Check email not registered     │
│  Collection: authusers          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Create user in MongoDB         │
│  Collection: authusers          │
│  - Hash password (bcrypt, 12)   │
│  - Set role from invite         │
│  - Set accountStatus: approved  │
│  - Set inviteCodeUsed           │
│  - Set invitedBy                │
│  - Set approvedAt, approvedBy   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Mark invite as used            │
│  - used: true                   │
│  - usedBy: userId               │
│  - usedAt: now                  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Generate JWT token             │
│  - Expiry: 7 days               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Set HttpOnly cookie            │
│  - Name: authToken              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Return success response        │
│  - Redirect to appropriate      │
│    portal (admin/organization)  │
└─────────────────────────────────┘
```

---

## 5. Organization Portal Login Flow

```
┌─────────────────┐
│  Org user visits│
│  /organization/ │
│  login          │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Fills form:                    │
│  - Email                        │
│  - Password                     │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  POST /api/organization/login   │
│  - Rate limit check (5/15min)   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Find user in MongoDB           │
│  Collection: organizationusers  │
│  (separate from authusers)      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Check approval status          │
│  - isApproved must be true      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Check account status           │
│  - Must be 'active'             │
│  - Not 'suspended'              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Check account lockout          │
│  - If locked: return error      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Verify password                │
│  - bcrypt.compare()             │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │ Invalid │
    ▼         ▼ Valid
┌───────┐   ┌─────────────────────┐
│ Fail  │   │ Reset lockout       │
│ count │   │ Update stats:       │
│ +1    │   │ - lastLoginAt       │
└───┬───┘   │ - loginCount++      │
    │       │ - lastLoginIp       │
    ▼       └────────┬────────────┘
┌───────────┐        │
│ If 5      │        ▼
│ attempts  │   ┌─────────────────┐
│ Lock 30m  │   │ Generate JWT    │
└───────────┘   │ - role: COMPANY │
                │ - source: org   │
                │ Expiry: 7 days  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Set cookie      │
                │ authToken       │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Return success  │
                │ Redirect to     │
                │ /organization   │
                └─────────────────┘
```

---

## 6. Data Flow to MongoDB Atlas

```
┌─────────────────────────────────────────────────────────┐
│                    USER ACTIONS                         │
│  - Student signup                                       │
│  - Company signup                                       │
│  - Admin invite signup                                  │
│  - Login (all types)                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES                         │
│  /api/auth/signup                                       │
│  /api/auth/login                                        │
│  /api/admin/login                                       │
│  /api/organization/login                                │
│  /api/admin/invites/signup                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              MONGOOSE CONNECTION                        │
│  lib/mongodb.ts                                         │
│  - Singleton pattern                                    │
│  - Connection pooling                                   │
│  - Auto-reconnect                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              MONGODB ATLAS                              │
│  Database: adyapan                                      │
│  Host: ac-ctirphf-shard-00-00.beedfey.mongodb.net      │
│                                                         │
│  Collections:                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ authusers                                       │   │
│  │ - Students (role: STUDENT)                      │   │
│  │ - Companies (role: COMPANY)                     │   │
│  │ - Admins (role: ADMIN/SUPERADMIN)               │   │
│  │ Total: 6 users                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ organizationusers                               │   │
│  │ - Separate org accounts                         │   │
│  │ Total: 0 users                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ admininvites                                    │   │
│  │ - Invite tokens                                 │   │
│  │ Total: 0 invites                                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  + 18 other collections (courses, payments, etc.)      │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    USER REQUEST                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: Rate Limiting                                 │
│  - 5 attempts per 15 minutes                            │
│  - Per IP address                                       │
│  - In-memory cache                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 2: Input Validation                              │
│  - Zod schema validation                                │
│  - Email format check                                   │
│  - Password length check                                │
│  - MongoDB injection prevention                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: Bot Protection (Signup only)                  │
│  - Cloudflare Turnstile                                 │
│  - Server-side verification                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 4: Database Checks                               │
│  - Duplicate email check                                │
│  - Duplicate phone check                                │
│  - Account status check                                 │
│  - Account lockout check                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 5: Password Security                             │
│  - bcrypt hashing (10-12 rounds)                        │
│  - Timing-safe comparison                               │
│  - No plaintext storage                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 6: Admin Access Control (Admin only)             │
│  - Email whitelist (ADMIN_EMAIL)                        │
│  - Access key verification (ADMIN_ACCESS_KEY)           │
│  - 3-factor authentication                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 7: JWT Token                                     │
│  - Signed with JWT_SECRET                               │
│  - Expiration time set                                  │
│  - Payload: userId, email, role                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 8: HttpOnly Cookie                               │
│  - Name: authToken                                      │
│  - HttpOnly: true (no JS access)                        │
│  - Secure: true (HTTPS only in prod)                    │
│  - SameSite: Lax (CSRF protection)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 9: Audit Logging                                 │
│  - IP address tracking                                  │
│  - User agent logging                                   │
│  - Login count tracking                                 │
│  - Failed attempt tracking                              │
│  - Timestamp recording                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Database Collections Structure

```
MongoDB Atlas: adyapan
│
├── authusers (Main authentication)
│   ├── _id: ObjectId
│   ├── name: string
│   ├── email: string (unique, indexed)
│   ├── passwordHash: string
│   ├── role: STUDENT | COMPANY | ADMIN | SUPERADMIN
│   ├── accountStatus: pending | approved | blocked
│   ├── phone: string
│   ├── companyName: string
│   ├── purchasedCourses: string[]
│   ├── enrolledCourses: string[]
│   ├── wishlist: string[]
│   ├── loginCount: number
│   ├── lastLoginAt: Date
│   ├── lastLoginIp: string
│   ├── failedLoginAttempts: number
│   ├── lockedUntil: Date
│   ├── signupIp: string
│   ├── signupAt: Date
│   ├── createdAt: Date
│   └── updatedAt: Date
│
├── organizationusers (Separate org accounts)
│   ├── _id: ObjectId
│   ├── name: string
│   ├── email: string (unique, indexed)
│   ├── passwordHash: string
│   ├── role: 'organization'
│   ├── isApproved: boolean
│   ├── accountStatus: active | suspended
│   ├── loginCount: number
│   ├── lastLoginAt: Date
│   ├── lastLoginIp: string
│   ├── failedLoginAttempts: number
│   ├── lockedUntil: Date
│   ├── createdAt: Date
│   └── updatedAt: Date
│
├── admininvites (Invite tokens)
│   ├── _id: ObjectId
│   ├── email: string
│   ├── mobileNumber: string
│   ├── role: ADMIN | ORGANIZATION | SUPERADMIN
│   ├── token: string (unique, indexed)
│   ├── used: boolean
│   ├── usedBy: string
│   ├── usedAt: Date
│   ├── expiresAt: Date
│   ├── revokedAt: Date
│   ├── invitedBy: string
│   ├── failedAttempts: number
│   ├── lastFailedAt: Date
│   ├── createdAt: Date
│   └── updatedAt: Date
│
└── + 18 other collections
    ├── courses
    ├── enrollments
    ├── payments
    ├── certificates
    ├── emaillogs
    └── ...
```

---

*Diagrams generated by Kiro AI - May 18, 2026*
