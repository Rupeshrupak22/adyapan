import SessionIdleManager from '@/components/SessionIdleManager';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionIdleManager loginPath="/superadmin/login" />
      {children}
    </>
  );
}
