'use client';

import PortalLayout from '@/components/portal/PortalLayout';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login' || pathname.startsWith('/admin/invite/')) {
    return <>{children}</>;
  }

  return <PortalLayout portalType="admin">{children}</PortalLayout>;
}
