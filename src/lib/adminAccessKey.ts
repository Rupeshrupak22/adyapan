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

function cleanConfiguredHash(value: string | undefined) {
  return (value || '').trim().replace(/^['"]|['"]$/g, '');
}

function getConfiguredAdminAccessKeyHash() {
  return cleanConfiguredHash(process.env.ADMIN_ACCESS_KEY_HASH || process.env.ADMIN_ACCESS_KEY);
}

export function hasConfiguredAdminAccessKeyHash() {
  return /^[a-f0-9]{64}$/i.test(getConfiguredAdminAccessKeyHash());
}

export function verifyAdminAccessKey(accessKey: string) {
  const configuredHash = getConfiguredAdminAccessKeyHash();
  return verifyAdminAccessKeyAgainstHash(accessKey, configuredHash);
}

export function isValidAdminAccessKeyHash(value: unknown) {
  return /^[a-f0-9]{64}$/i.test(cleanConfiguredHash(typeof value === 'string' ? value : ''));
}

export function hashAdminAccessKey(accessKey: string) {
  return sha256Hex(accessKey.trim());
}

export function verifyAdminAccessKeyAgainstHash(accessKey: string, configuredHash: string | undefined) {
  const hash = cleanConfiguredHash(configuredHash);
  const submittedHash = sha256Hex(accessKey.trim());
  return safeHexEqual(submittedHash, hash);
}
