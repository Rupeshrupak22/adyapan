import mongoose, { Schema, model, models } from 'mongoose';

export interface AuthSessionDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  role: string;
  fingerprintHash: string;
  accessTokenHash?: string;
  userAgentHash: string;
  ipAddress: string;
  lastSeenAt: Date;
  idleExpiresAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const authSessionSchema = new Schema<AuthSessionDocument>(
  {
    userId:          { type: String, required: true, index: true },
    role:            { type: String, required: true, index: true },
    fingerprintHash: { type: String, required: true },
    accessTokenHash: { type: String },
    userAgentHash:   { type: String, required: true },
    ipAddress:       { type: String, default: '' },
    lastSeenAt:      { type: Date, required: true, default: Date.now },
    idleExpiresAt:   { type: Date, required: true, index: true },
    expiresAt:       { type: Date, required: true, index: true },
    revokedAt:       { type: Date },
  },
  { timestamps: true }
);

authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
authSessionSchema.index({ userId: 1, revokedAt: 1, idleExpiresAt: 1 });

const AuthSession =
  models.AuthSession || model<AuthSessionDocument>('AuthSession', authSessionSchema);

export default AuthSession;
