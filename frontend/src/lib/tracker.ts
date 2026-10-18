/**
 * First-party website tracker (client helpers).
 *
 * Privacy-by-design:
 *  - anonymousVisitorId / sessionId are RANDOM ids (crypto.randomUUID), stored
 *    in the browser. They are NOT device fingerprints.
 *  - We never collect names, emails, phones, form contents, passwords, payment
 *    details, or auth tokens. Only an allow-listed, non-PII payload is sent.
 *  - Query strings are stripped from the page path before sending.
 *  - Respects the existing cookie-consent "analytics" preference.
 *  - Fire-and-forget via navigator.sendBeacon (fallback fetch keepalive); a
 *    network failure never throws into the page.
 */

const VISITOR_KEY = 'adyapan_vid';
const SESSION_KEY = 'adyapan_sid';
const SESSION_TS_KEY = 'adyapan_sid_ts';
const CONSENT_KEY = 'adyapan_cookie_consent';
const SESSION_MAX_IDLE_MS = 30 * 60 * 1000; // 30-min inactivity => new session
const ENDPOINT = '/api/tracker/events';

export type TrackerEventName =
  | 'page_view'
  | 'course_view'
  | 'cta_click'
  | 'enquiry_submit'
  | 'checkout_start';

interface Campaign {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

interface TrackPayload {
  courseId?: string;
  label?: string;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/** Analytics is allowed unless the user explicitly rejected it in cookie consent. */
export function analyticsAllowed(): boolean {
  if (!isBrowser()) return false;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return true; // no decision yet; default-on matches CookieConsent default
    const prefs = JSON.parse(raw);
    return prefs?.analytics !== false;
  } catch {
    return true;
  }
}

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

function getSessionId(): string {
  try {
    const now = Date.now();
    const lastTs = Number(sessionStorage.getItem(SESSION_TS_KEY) || 0);
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id || !lastTs || now - lastTs > SESSION_MAX_IDLE_MS) {
      id = randomId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    sessionStorage.setItem(SESSION_TS_KEY, String(now));
    return id;
  } catch {
    return 'session';
  }
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  if (!isBrowser()) return 'unknown';
  const ua = navigator.userAgent || '';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'tablet';
  if (/Mobi|Android|iPhone|iPod|IEMobile|BlackBerry|Opera Mini/i.test(ua)) return 'mobile';
  return 'desktop';
}

/** Only the registrable referrer domain (no full URL, no query), empty if same-site/direct. */
function getReferrerDomain(): string {
  if (!isBrowser() || !document.referrer) return '';
  try {
    const ref = new URL(document.referrer);
    if (ref.hostname === window.location.hostname) return '';
    return ref.hostname.slice(0, 253);
  } catch {
    return '';
  }
}

/** Allow-listed UTM params only; nothing else from the query string is read. */
function getCampaign(): Campaign {
  if (!isBrowser()) return {};
  const p = new URLSearchParams(window.location.search);
  const pick = (k: string, max: number) => (p.get(k) || '').slice(0, max) || undefined;
  const c: Campaign = {
    source:   pick('utm_source', 120),
    medium:   pick('utm_medium', 120),
    campaign: pick('utm_campaign', 160),
    term:     pick('utm_term', 160),
    content:  pick('utm_content', 160),
  };
  // Drop undefined keys.
  return Object.fromEntries(Object.entries(c).filter(([, v]) => v != null));
}

function send(events: Record<string, unknown>[]): void {
  if (!isBrowser() || events.length === 0) return;
  const body = JSON.stringify({ events });
  try {
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
      if (ok) return;
    }
  } catch {
    /* fall through to fetch */
  }
  // Fallback: keepalive fetch, fully swallowed so it never breaks the page.
  try {
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

/** Fire a single tracker event (page_view, course_view, cta_click, ...). */
export function track(eventName: TrackerEventName, pagePath: string, extra: TrackPayload = {}): void {
  if (!analyticsAllowed()) return;
  send([
    {
      eventName,
      anonymousVisitorId: getVisitorId(),
      sessionId: getSessionId(),
      pagePath,
      referrerDomain: getReferrerDomain(),
      campaign: getCampaign(),
      courseId: extra.courseId || '',
      label: extra.label || '',
      deviceType: getDeviceType(),
      ts: Date.now(),
    },
  ]);
}

/** Convenience helpers for intentional events fired from UI code. */
export const trackPageView = (path: string) => track('page_view', path);
export const trackCourseView = (path: string, courseId: string) => track('course_view', path, { courseId });
export const trackCtaClick = (path: string, label: string) => track('cta_click', path, { label });
export const trackEnquirySubmit = (path: string, label = 'enquiry') => track('enquiry_submit', path, { label });
export const trackCheckoutStart = (path: string, courseId = '') => track('checkout_start', path, { courseId });
