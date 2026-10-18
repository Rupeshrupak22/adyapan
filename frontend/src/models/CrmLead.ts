/**
 * CrmLead Model
 * A lead in the Tracker & CRM pipeline. A lead is created ONLY from a real,
 * intentional enquiry (e.g. a submitted "Get In Touch" / contact form record,
 * or an admin-entered manual lead) — never fabricated from anonymous analytics
 * events. Each CRM lead references the originating record via `sourceRefId`
 * (unique) so the same enquiry is never duplicated as two leads.
 *
 * This model stores the CRM workflow state (status + follow-up notes) alongside
 * a snapshot of the contact details that the visitor voluntarily provided. It
 * does not modify the original enquiry collections.
 */
import mongoose, { Schema, model, models } from 'mongoose';

export const CRM_LEAD_STATUSES = [
  'New',
  'Contacted',
  'Counselling',
  'Enrolled',
  'Lost',
] as const;
export type CrmLeadStatus = (typeof CRM_LEAD_STATUSES)[number];

export const CRM_LEAD_SOURCES = [
  'contact-form',
  'manual-admin-entry',
  'offline-lead',
  'certification-enquiry',
] as const;
export type CrmLeadSource = (typeof CRM_LEAD_SOURCES)[number];

export interface CrmFollowUp {
  note: string;
  by: string; // admin email/name who added the note
  at: Date;
}

export interface CrmLeadDocument {
  _id: mongoose.Types.ObjectId;
  /** Collection the lead originated from, for traceability. */
  source: CrmLeadSource;
  /** _id of the originating enquiry document (unique → no duplicate leads). */
  sourceRefId: string;
  // Contact snapshot (voluntarily provided by the visitor on an enquiry form).
  name: string;
  email: string;
  phone: string;
  // Interest / attribution (only when lawfully collected on the enquiry).
  courseInterest: string;
  campaign: string;
  // CRM workflow.
  status: CrmLeadStatus;
  followUps: CrmFollowUp[];
  createdAt: Date;
  updatedAt: Date;
}

const followUpSchema = new Schema<CrmFollowUp>(
  {
    note: { type: String, required: true, trim: true, maxlength: 2000 },
    by:   { type: String, default: '', trim: true, maxlength: 200 },
    at:   { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const schema = new Schema<CrmLeadDocument>(
  {
    source: {
      type: String,
      enum: CRM_LEAD_SOURCES as unknown as string[],
      required: true,
      index: true,
    },
    sourceRefId:    { type: String, required: true, unique: true },
    name:           { type: String, required: true, trim: true, maxlength: 200 },
    email:          { type: String, default: '', lowercase: true, trim: true, maxlength: 254, index: true },
    phone:          { type: String, default: '', trim: true, maxlength: 20, index: true },
    courseInterest: { type: String, default: '', trim: true, maxlength: 200 },
    campaign:       { type: String, default: '', trim: true, maxlength: 200 },
    status: {
      type: String,
      enum: CRM_LEAD_STATUSES as unknown as string[],
      default: 'New',
      index: true,
    },
    followUps: { type: [followUpSchema], default: [] },
  },
  { timestamps: true, collection: 'crmLeads' }
);

schema.index({ createdAt: -1 });
schema.index({ status: 1, createdAt: -1 });

const CrmLead = models.CrmLead || model<CrmLeadDocument>('CrmLead', schema);
export default CrmLead;
