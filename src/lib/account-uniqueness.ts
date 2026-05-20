import AuthUser from '@/models/AuthUser';
import OrganizationUser from '@/models/OrganizationUser';

export function normalizeAccountEmail(email: string): string {
  return String(email || '').toLowerCase().trim();
}

export async function findExistingAccountByEmail(email: string) {
  const normalizedEmail = normalizeAccountEmail(email);
  if (!normalizedEmail) return null;

  const [authUser, organizationUser] = await Promise.all([
    AuthUser.findOne({ email: normalizedEmail }).select('_id email role').lean(),
    OrganizationUser.findOne({ email: normalizedEmail }).select('_id email role').lean(),
  ]);

  return authUser || organizationUser;
}

export function isDuplicateEmailError(error: unknown): boolean {
  const err = error as { code?: number; keyPattern?: Record<string, unknown>; keyValue?: Record<string, unknown> };
  return err?.code === 11000 && Boolean(err.keyPattern?.email || err.keyValue?.email);
}

