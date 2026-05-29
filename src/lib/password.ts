import argon2 from 'argon2';
import bcrypt from 'bcrypt';

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
};

export function isBcryptHash(hash: string) {
  return /^\$2[aby]\$/.test(hash);
}

export function isArgon2Hash(hash: string) {
  return hash.startsWith('$argon2id$');
}

export async function hashPassword(password: string) {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  if (isArgon2Hash(passwordHash)) {
    return argon2.verify(passwordHash, password);
  }

  if (isBcryptHash(passwordHash)) {
    return bcrypt.compare(password, passwordHash);
  }

  return false;
}

export async function verifyPasswordAndUpgrade(
  password: string,
  passwordHash: string,
  saveHash: (newHash: string) => Promise<void>
) {
  const valid = await verifyPassword(password, passwordHash);
  if (valid && isBcryptHash(passwordHash)) {
    await saveHash(await hashPassword(password));
  }
  return valid;
}
