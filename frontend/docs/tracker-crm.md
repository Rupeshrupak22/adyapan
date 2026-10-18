# Adyapan First-Party Tracker & CRM

Replaces the former external `api.adyapancrm.in/tracker.js` integration with a
first-party, privacy-conscious analytics + lead-management system owned by
Adyapan and stored in the existing MongoDB database.

## 1. Tracked event types & payload schema

Events are sent by the client (`src/lib/tracker.ts`, mounted via
`src/components/WebsiteTracker.tsx`) to `POST /api/tracker/events`.

### Event names (allow-listed)

| eventName        | When it fires                                             |
|------------------|-----------------------------------------------------------|
| `page_view`      | Initial load + every App Router navigation (deduped)      |
| `course_view`    | Visiting a `/courses/<slug>` page                         |
| `cta_click`      | Clicking a tracked CTA (e.g. course "Enroll now")         |
| `enquiry_submit` | Successful contact/enquiry form submission (signal only)  |
| `checkout_start` | Starting checkout / opening the pricing modal             |

### Payload (per event)

```jsonc
{
  "events": [
    {
      "eventName": "page_view",            // enum, required
      "anonymousVisitorId": "uuid",         // random, NOT a fingerprint
      "sessionId": "uuid",                  // 30-min idle window
      "pagePath": "/courses/data-science",  // query string stripped
      "referrerDomain": "google.com",       // domain only, "" if direct/same-site
      "campaign": {                          // allow-listed UTM only
        "source": "", "medium": "", "campaign": "", "term": "", "content": ""
      },
      "courseId": "data-science",            // only for course_view / course CTAs
      "label": "enroll_now",                 // short label for cta_click
      "deviceType": "mobile",                // mobile | tablet | desktop | unknown
      "ts": 1739870000000                    // client ms; clamped server-side
    }
  ]
}
```

Up to **20 events per request**; body capped at **16 KB**; rate limited to
**120 requests/min per IP**. Unknown fields are stripped by the zod schema.

### Privacy guarantees

- No names, emails, phones, form contents, passwords, payment details, or auth
  tokens are ever collected.
- Visitor/session ids are random (`crypto.randomUUID`), not device fingerprints.
- Query strings are stripped from `pagePath`.
- Respects the existing cookie-consent `analytics` preference
  (`localStorage['adyapan_cookie_consent']`); no events sent if the user
  rejected analytics.
- Client-submitted events are **never** treated as proof of payment or
  enrollment. Enrollment metrics must come from trusted Payment/Enrollment
  records, not from these events.

## 2. MongoDB

| Collection        | Model                 | Purpose                                  |
|-------------------|-----------------------|------------------------------------------|
| `analyticsEvents` | `AnalyticsEvent`      | Raw first-party events (TTL retention)   |
| `crmLeads`        | `CrmLead`             | CRM pipeline mirrored from real enquiries |
| `getInTouch`      | `GetInTouchMessage` (existing) | Source enquiries (unchanged)    |

Indexes: `timestamp`, `eventName+timestamp`, `pagePath+timestamp`,
`courseId+timestamp`, `anonymousVisitorId`, `sessionId`, plus a **TTL index**
on `timestamp` (`ANALYTICS_RETENTION_DAYS`, default 365). `CrmLead.sourceRefId`
is unique to prevent duplicate leads from the same enquiry.

## 3. Environment variables

| Variable                   | Required | Notes                                            |
|----------------------------|----------|--------------------------------------------------|
| `MONGODB_URI`              | yes (existing) | Mongo connection string (server-side only) |
| `DB_NAME`                  | no (existing)  | Defaults to `adyapan`                       |
| `JWT_SECRET`               | yes (existing) | Protects admin APIs                         |
| `ANALYTICS_RETENTION_DAYS` | no (new)       | Event retention in days (default 365)       |

No new secrets are exposed to the browser.

## 4. Accessing Tracker & CRM

Admin dashboard → sidebar → **Tracker & CRM** (`/admin/tracker-crm`,
ADMIN/SUPERADMIN only). Two tabs:
- **Analytics** — date-range metrics (page views, unique visitors, sessions,
  top pages/courses, sources, campaigns, devices, daily trend, CTA/enquiry/
  checkout signals).
- **Leads** — pipeline from real enquiries with status workflow
  (New → Contacted → Counselling → Enrolled / Lost) and internal follow-up notes.
