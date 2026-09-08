import argon2 from 'argon2';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const ARGON2ID_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2ID_OPTIONS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  if (!passwordHash) return { valid: false, needsRehash: false };

  if (passwordHash.startsWith('$argon2')) {
    const valid = await argon2.verify(passwordHash, password);
    return {
      valid,
      needsRehash: valid && argon2.needsRehash(passwordHash, ARGON2ID_OPTIONS),
    };
  }

  const valid = await bcrypt.compare(password, passwordHash);
  return { valid, needsRehash: valid };
}

export function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function timingSafeHexEqual(a: string, b: string): boolean {
  if (!/^[a-f0-9]{64}$/i.test(a) || !/^[a-f0-9]{64}$/i.test(b)) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
}

export function verifyAccessKey(accessKey: string, expectedHash: string): boolean {
  return timingSafeHexEqual(sha256Hex(accessKey), expectedHash);
}
