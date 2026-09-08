import mongoose, { Schema, model, models } from 'mongoose';

export type LMSProvider = 'moodle' | 'google_classroom' | 'teachable' | 'thinkific' | 'custom';

export interface StudentLMSAccessDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  studentEmail: string;
  studentName: string;
  lmsProvider: LMSProvider;
  lmsEmail: string;
  lmsPassword: string;
  lmsPortalLink: string;
  batchName: string;
  mentorName: string;
  counselorName: string;
  supportContact: string;
  whatsappNumber: string;
  certificationGuidance: string;
  assignedBy: string;
  assignedAt: Date;
  emailSent: boolean;
  whatsappSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const studentLMSAccessSchema = new Schema<StudentLMSAccessDocument>(
  {
    userId:                { type: String, required: true, unique: true, index: true },
    studentEmail:          { type: String, required: true, lowercase: true, trim: true },
    studentName:           { type: String, required: true, trim: true },
    lmsProvider:           {
      type: String,
      enum: ['moodle', 'google_classroom', 'teachable', 'thinkific', 'custom'],
      default: 'custom',
    },
    lmsEmail:              { type: String, required: true, trim: true },
    lmsPassword:           { type: String, required: true },
    lmsPortalLink:         { type: String, required: true, trim: true },
    batchName:             { type: String, default: '', trim: true },
    mentorName:            { type: String, default: '', trim: true },
    counselorName:         { type: String, default: '', trim: true },
    supportContact:        { type: String, default: 'support@adyapan.com', trim: true },
    whatsappNumber:        { type: String, default: '', trim: true },
    certificationGuidance: { type: String, default: '', trim: true },
    assignedBy:            { type: String, default: '', index: true },
    assignedAt:            { type: Date, default: Date.now },
    emailSent:             { type: Boolean, default: false },
    whatsappSent:          { type: Boolean, default: false },
  },
  { timestamps: true }
);

studentLMSAccessSchema.index({ studentEmail: 1 });
studentLMSAccessSchema.index({ assignedAt: -1 });

const StudentLMSAccess =
  models.StudentLMSAccess ||
  model<StudentLMSAccessDocument>('StudentLMSAccess', studentLMSAccessSchema);

export default StudentLMSAccess;
