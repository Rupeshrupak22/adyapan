import mongoose, { Schema, model, models } from 'mongoose';

export type AuthUserRole = 'STUDENT' | 'COMPANY' | 'ADMIN' | 'SUPERADMIN';
export type AccountStatus = 'pending' | 'approved' | 'active' | 'blocked';

export interface AuthUserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: AuthUserRole;
  accountStatus: AccountStatus;
  phone?: string;
  avatar?: string;
  companyName?: string;
  authProvider: string;
  googleId?: string;
  selectedProgram?: string;
  selectedAmount?: number;
  purchasedCourses: string[];
  enrolledCourses: string[];
  wishlist: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  // Invite / approval tracking
  inviteCodeUsed?: string;
  invitedBy?: string;
  approvedAt?: Date;
  approvedBy?: string;
  // Login tracking
  lastLoginAt?: Date;
  loginCount: number;
  lastLoginIp?: string;
  lastUserAgent?: string;
  // Account lockout (brute-force protection)
  failedLoginAttempts: number;
  lockedUntil?: Date;
  // Password reset
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  // Email verification
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  // Signup metadata
  signupIp?: string;
  userAgent?: string;
  signupAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const authUserSchema = new Schema<AuthUserDocument>(
  {
    name:             { type: String, required: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash:     { type: String, required: true },
    role:             { type: String, enum: ['STUDENT', 'COMPANY', 'ADMIN', 'SUPERADMIN'], required: true, index: true },
    accountStatus:    { type: String, enum: ['pending', 'approved', 'active', 'blocked'], default: 'approved', index: true },
    phone:            { type: String, trim: true },
    avatar:           { type: String, trim: true, default: '' },
    companyName:      { type: String, trim: true, default: '' },
    authProvider:     { type: String, default: 'local' },
    googleId:         { type: String, trim: true },
    selectedProgram:  { type: String, trim: true },
    selectedAmount:   { type: Number, min: 0 },
    purchasedCourses: { type: [String], default: [] },
    enrolledCourses:  { type: [String], default: [] },
    wishlist:         { type: [String], default: [] },
    isActive:         { type: Boolean, default: true, index: true },
    isEmailVerified:  { type: Boolean, default: false },
    // Invite / approval
    inviteCodeUsed:   { type: String, default: '' },
    invitedBy:        { type: String, default: '' },
    approvedAt:       { type: Date },
    approvedBy:       { type: String, default: '' },
    // Login tracking
    lastLoginAt:      { type: Date },
    loginCount:       { type: Number, default: 0 },
    lastLoginIp:      { type: String, default: '' },
    lastUserAgent:    { type: String, default: '' },
    // Account lockout
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil:         { type: Date },
    // Password reset
    resetPasswordToken:   { type: String, default: '', index: true },
    resetPasswordExpires: { type: Date },
    // Email verification
    emailVerificationToken:   { type: String, default: '', index: true },
    emailVerificationExpires: { type: Date },
    // Signup metadata
    signupIp:         { type: String, default: '' },
    userAgent:        { type: String, default: '' },
    signupAt:         { type: Date },
  },
  { timestamps: true }
);

authUserSchema.index({ role: 1, accountStatus: 1 });
authUserSchema.index({ role: 1, createdAt: -1 });
authUserSchema.index({ resetPasswordToken: 1, resetPasswordExpires: 1 });
authUserSchema.index({ emailVerificationToken: 1, emailVerificationExpires: 1 });
authUserSchema.index(
  { googleId: 1 },
  {
    unique: true,
    partialFilterExpression: { googleId: { $type: 'string', $gt: '' } },
  }
);
authUserSchema.index(
  { phone: 1 },
  { partialFilterExpression: { phone: { $type: 'string', $gt: '' } } }
);
authUserSchema.index({ createdAt: -1 });

const AuthUser = models.AuthUser || model<AuthUserDocument>('AuthUser', authUserSchema);

let authUserIndexRepairPromise: Promise<void> | null = null;

function isGoogleIdIndex(index: { key?: Record<string, unknown> }) {
  return index.key?.googleId === 1 && Object.keys(index.key).length === 1;
}

function isUsableGoogleIdIndex(index: {
  key?: Record<string, unknown>;
  unique?: boolean;
  sparse?: boolean;
  partialFilterExpression?: unknown;
}) {
  return isGoogleIdIndex(index) && index.unique && Boolean(index.sparse || index.partialFilterExpression);
}

export async function ensureAuthUserIndexes() {
  if (authUserIndexRepairPromise) return authUserIndexRepairPromise;

  authUserIndexRepairPromise = (async () => {
    const indexes = await AuthUser.collection.indexes();
    const googleIdIndex = indexes.find(isGoogleIdIndex);

    if (googleIdIndex?.unique && googleIdIndex.name && !isUsableGoogleIdIndex(googleIdIndex)) {
      await AuthUser.collection.dropIndex(googleIdIndex.name);
    }

    const refreshedIndexes = await AuthUser.collection.indexes();
    const hasUsableGoogleIdIndex = refreshedIndexes.some(isUsableGoogleIdIndex);

    if (!hasUsableGoogleIdIndex) {
      await AuthUser.collection.createIndex(
        { googleId: 1 },
        {
          name: 'googleId_1',
          unique: true,
          partialFilterExpression: { googleId: { $type: 'string', $gt: '' } },
        }
      );
    }
  })().catch((error) => {
    authUserIndexRepairPromise = null;
    throw error;
  });

  return authUserIndexRepairPromise;
}

export default AuthUser;
