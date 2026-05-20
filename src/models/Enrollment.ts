import mongoose, { Schema, model, models } from 'mongoose';

export interface EnrollmentDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  courseSlug: string;
  courseName: string;
  planId: string;           // 'plan-1', 'plan-2', etc.
  planLabel: string;        // 'Starter Plan', 'Career Pro Plan'
  amountPaid: number;
  paymentId: string;        // Razorpay payment ID
  enrollmentStatus: 'active' | 'expired' | 'cancelled' | 'completed';
  enrolledAt: Date;
  expiresAt?: Date;
  completedAt?: Date;
  // Dynamic plan dates and times
  paymentDate?: Date;       // Date when payment was made
  paymentTime?: string;     // Time when payment was made (IST)
  courseStartDate?: Date;   // Course start date
  courseEndDate?: Date;     // Course end date
  validTill?: Date;         // Valid till date
  durationDays?: number;    // Duration in days
  durationMonths?: number;  // Duration in months
  selectedPlan?: string;    // Selected plan ID
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<EnrollmentDocument>(
  {
    userId:           { type: String, required: true, index: true },
    courseSlug:       { type: String, required: true, index: true },
    courseName:       { type: String, required: true },
    planId:           { type: String, default: '' },
    planLabel:        { type: String, default: '' },
    amountPaid:       { type: Number, default: 0 },
    paymentId:        { type: String, required: true, unique: true, index: true },
    enrollmentStatus: { type: String, enum: ['active', 'expired', 'cancelled', 'completed'], default: 'active', index: true },
    enrolledAt:       { type: Date, default: Date.now },
    expiresAt:        { type: Date },
    completedAt:      { type: Date },
    // Dynamic plan dates and times
    paymentDate:      { type: Date },
    paymentTime:      { type: String, default: '' },
    courseStartDate:  { type: Date },
    courseEndDate:    { type: Date },
    validTill:        { type: Date },
    durationDays:     { type: Number, default: 0 },
    durationMonths:   { type: Number, default: 0 },
    selectedPlan:     { type: String, default: '' },
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseSlug: 1 });
enrollmentSchema.index({ userId: 1, enrollmentStatus: 1 });
enrollmentSchema.index({ courseSlug: 1, enrollmentStatus: 1 });
enrollmentSchema.index({ enrolledAt: -1 });

const Enrollment = models.Enrollment || model<EnrollmentDocument>('Enrollment', enrollmentSchema);
export default Enrollment;
