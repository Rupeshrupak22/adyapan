/**
 * AnalyticsEvent Model
 * First-party, privacy-conscious website analytics events (page views, CTA
 * clicks, course views, enquiry/checkout-start signals). Replaces the former
 * external api.adyapancrm.in tracker.
 *
 * Privacy rules enforced here:
 *  - No PII (names, emails, phones), no passwords, no payment details, no auth
 *    tokens, and no fingerprinting are stored. The visitor id is a random,
 *    client-generated anonymous id (not a device fingerprint).
 *  - Only an allow-listed set of UTM/campaign fields is kept.
 *  - A TTL index applies a configurable retention policy (ANALYTICS_RETENTION_DAYS).
 *
 * Trust rule: client-submitted events are NEVER treated as proof of payment,
 * enrollment, or a verified lead. Enrollment metrics come from trusted
 * server-side records (Payment/Enrollment), not from these events.
 */
import mongoose, { Schema, model, models } from 'mongoose';

// Allow-listed event names accepted from the public tracker.
export const ANALYTICS_EVENT_NAMES = [
  'page_view',
  'course_view',
  'cta_click',
  'enquiry_submit',
  'checkout_start',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export const DEVICE_TYPES = ['mobile', 'tablet', 'desktop', 'unknown'] as const;
export type DeviceType = (typeof DEVICE_TYPES)[number];

export interface AnalyticsCampaign {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface AnalyticsEventDocument {
  _id: mongoose.Types.ObjectId;
  eventName: AnalyticsEventName;
  anonymousVisitorId: string;
  sessionId: string;
  pagePath: string;
  referrerDomain: string;
  campaign: AnalyticsCampaign;
  courseId: string;
  /** Optional short label for cta_click (e.g. "enroll_now"); never free-form PII. */
  label: string;
  deviceType: DeviceType;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<AnalyticsCampaign>(
  {
    source:   { type: String, default: '', trim: true, maxlength: 120 },
    medium:   { type: String, default: '', trim: true, maxlength: 120 },
    campaign: { type: String, default: '', trim: true, maxlength: 160 },
    term:     { type: String, default: '', trim: true, maxlength: 160 },
    content:  { type: String, default: '', trim: true, maxlength: 160 },
  },
  { _id: false }
);

const schema = new Schema<AnalyticsEventDocument>(
  {
    eventName: {
      type: String,
      enum: ANALYTICS_EVENT_NAMES as unknown as string[],
      required: true,
      index: true,
    },
    anonymousVisitorId: { type: String, required: true, trim: true, maxlength: 64, index: true },
    sessionId:          { type: String, required: true, trim: true, maxlength: 64, index: true },
    pagePath:           { type: String, required: true, trim: true, maxlength: 512 },
    referrerDomain:     { type: String, default: '', trim: true, maxlength: 253 },
    campaign:           { type: campaignSchema, default: () => ({}) },
    courseId:           { type: String, default: '', trim: true, maxlength: 160, index: true },
    label:              { type: String, default: '', trim: true, maxlength: 120 },
    deviceType: {
      type: String,
      enum: DEVICE_TYPES as unknown as string[],
      default: 'unknown',
    },
    timestamp: { type: Date, default: () => new Date(), index: true },
  },
  { timestamps: true, collection: 'analyticsEvents' }
);

// Query indexes for dashboard aggregations.
schema.index({ timestamp: -1 });
schema.index({ eventName: 1, timestamp: -1 });
schema.index({ pagePath: 1, timestamp: -1 });
schema.index({ courseId: 1, timestamp: -1 });

// Retention policy: documents expire after ANALYTICS_RETENTION_DAYS (default 365).
// MongoDB TTL monitor removes them automatically. Configurable via env.
const retentionDays = Math.max(1, parseInt(process.env.ANALYTICS_RETENTION_DAYS || '365', 10) || 365);
schema.index({ timestamp: 1 }, { expireAfterSeconds: retentionDays * 24 * 60 * 60 });

const AnalyticsEvent =
  models.AnalyticsEvent || model<AnalyticsEventDocument>('AnalyticsEvent', schema);

export default AnalyticsEvent;
