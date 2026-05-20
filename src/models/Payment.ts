import mongoose, { Schema, model, models } from 'mongoose';

export interface PaymentDocument {
  _id: mongoose.Types.ObjectId;
  // User info
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  // Razorpay IDs
  paymentId: string;        // Razorpay payment ID (pay_XXXXX)
  orderId: string;          // Razorpay order ID (order_XXXXX)
  // Course / plan info
  courseSlug: string;
  courseName: string;
  planLabel: string;
  // Amounts
  baseAmount: number;       // payable amount before any separately tracked tax
  gstAmount: number;        // 0 when GST is included in plan price
  totalAmount: number;      // grand total paid
  currency: string;
  // Status
  status: 'success' | 'failed' | 'pending' | 'refunded';
  paymentMethod: string;    // upi / card / netbanking / emi / wallet
  failureReason?: string;   // populated on failed payments
  refundId?: string;        // populated on refunds
  refundAmount?: number;
  refundedAt?: Date;
  // Security
  signatureVerified: boolean;
  isTestMode: boolean;
  // Dynamic plan dates and times
  paymentDate?: Date;       // Date when payment was made
  paymentTime?: string;     // Time when payment was made (IST)
  courseStartDate?: Date;   // Course start date
  courseEndDate?: Date;     // Course end date
  validTill?: Date;         // Valid till date
  durationDays?: number;    // Duration in days
  durationMonths?: number;  // Duration in months
  selectedPlan?: string;    // Selected plan ID
  // Timestamps
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    // User
    userId:      { type: String, default: '', index: true },
    userName:    { type: String, default: '', trim: true },
    userEmail:   { type: String, required: true, lowercase: true, trim: true, index: true },
    userPhone:   { type: String, default: '', trim: true },
    // Razorpay IDs
    paymentId:   { type: String, required: true, unique: true, trim: true, index: true },
    orderId:     { type: String, required: true, trim: true, index: true },
    // Course
    courseSlug:  { type: String, required: true, index: true },
    courseName:  { type: String, required: true },
    planLabel:   { type: String, default: '' },
    // Amounts
    baseAmount:  { type: Number, default: 0 },
    gstAmount:   { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency:    { type: String, default: 'INR' },
    // Status
    status:           { type: String, enum: ['success', 'failed', 'pending', 'refunded'], default: 'pending', index: true },
    paymentMethod:    { type: String, default: 'upi' },
    failureReason:    { type: String, default: '' },
    refundId:         { type: String, default: '' },
    refundAmount:     { type: Number, default: 0 },
    refundedAt:       { type: Date },
    // Security
    signatureVerified: { type: Boolean, default: false },
    isTestMode:        { type: Boolean, default: false },
    // Dynamic plan dates and times
    paymentDate:      { type: Date },
    paymentTime:      { type: String, default: '' },
    courseStartDate:  { type: Date },
    courseEndDate:    { type: Date },
    validTill:        { type: Date },
    durationDays:     { type: Number, default: 0 },
    durationMonths:   { type: Number, default: 0 },
    selectedPlan:     { type: String, default: '' },
    // Time
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound indexes for admin queries
paymentSchema.index({ status: 1, paidAt: -1 });
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ courseSlug: 1, status: 1 });
paymentSchema.index({ planLabel: 1, status: 1 });
paymentSchema.index({ paidAt: -1 });

const Payment = models.Payment || model<PaymentDocument>('Payment', paymentSchema);
export default Payment;
