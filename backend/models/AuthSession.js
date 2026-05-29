const mongoose = require('mongoose');

const authSessionSchema = new mongoose.Schema(
  {
    userId:          { type: String, required: true, index: true },
    role:            { type: String, required: true, index: true },
    clientType:      { type: String, enum: ['web', 'mobile'], default: 'web', index: true },
    platform:        { type: String, trim: true, default: 'web' },
    deviceId:        { type: String, trim: true, default: '' },
    fingerprintHash: { type: String, required: true },
    accessTokenHash: { type: String },
    previousAccessTokenHash: { type: String },
    tokenRotatedAt:  { type: Date },
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
authSessionSchema.index({ userId: 1, clientType: 1, revokedAt: 1, idleExpiresAt: 1 });

module.exports = mongoose.models.AuthSession || mongoose.model('AuthSession', authSessionSchema);
