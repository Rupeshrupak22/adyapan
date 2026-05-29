import crypto from 'crypto';

function sha256Hex(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function safeHexEqual(leftHex: string, rightHex: string) {
  if (!/^[a-f0-9]{64}$/i.test(leftHex) || !/^[a-f0-9]{64}$/i.test(rightHex)) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(leftHex, 'hex'),
    Buffer.from(rightHex, 'hex')
  );
}

export function hasConfiguredAdminAccessKeyHash() {
  const configured = process.env.ADMIN_ACCESS_KEY_HASH || process.env.ADMIN_ACCESS_KEY || '';
  return /^[a-f0-9]{64}$/i.test(configured);
}

export function verifyAdminAccessKey(accessKey: string) {
  const configuredHash = process.env.ADMIN_ACCESS_KEY_HASH || process.env.ADMIN_ACCESS_KEY || '';
  const submittedHash = sha256Hex(accessKey.trim());
  return safeHexEqual(submittedHash, configuredHash.trim());
}
