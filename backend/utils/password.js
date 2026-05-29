const argon2 = require('argon2');
const bcrypt = require('bcrypt');

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
};

function isBcryptHash(hash) {
  return /^\$2[aby]\$/.test(hash || '');
}

function isArgon2Hash(hash) {
  return String(hash || '').startsWith('$argon2id$');
}

async function hashPassword(password) {
  return argon2.hash(password, ARGON2_OPTIONS);
}

async function verifyPassword(password, hash) {
  if (isArgon2Hash(hash)) return argon2.verify(hash, password);
  if (isBcryptHash(hash)) return bcrypt.compare(password, hash);
  return false;
}

module.exports = {
  hashPassword,
  verifyPassword,
  isBcryptHash,
};
