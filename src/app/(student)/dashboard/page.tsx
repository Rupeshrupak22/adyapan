'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * /dashboard - Auth gate + role-based redirect.
 *
 * - Not logged in  â†’ /login
 * - STUDENT        â†’ /dashboard/student
 * - COMPANY        â†’ /dashboard/company
 * - ADMIN/SUPERADMIN â†’ /admin
 * - Unknown role   â†’ /login (safe fallback)
 */
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data?.user) {
          router.replace('/login');
          return;
        }
        const role: string = data.user.role ?? '';
        if (role === 'STUDENT') {
          router.replace('/dashboard/student');
        } else if (role === 'COMPANY') {
          router.replace('/dashboard/company');
        } else if (role === 'ADMIN' || role === 'SUPERADMIN') {
          router.replace('/admin');
        } else {
          router.replace('/login');
        }
      })
      .catch(() => router.replace('/login'));
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="w-10 h-10 border-4 border-[#ffa800] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
