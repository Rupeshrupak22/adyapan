'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, CreditCard, BookOpen, Package,
  Award, Settings, LogOut, Menu, X, ChevronRight,
  Bell, Shield, Building2, TrendingUp, ExternalLink, UserPlus, FolderKanban, Briefcase, GraduationCap,
  MessageSquare,
} from 'lucide-react';
import SessionIdleManager from '@/components/SessionIdleManager';

export type PortalType = 'admin' | 'organization';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
}

function getNavItems(base: string, isAdmin: boolean = false): NavItem[] {
  if (isAdmin) {
    return [
      { href: '/admin/dashboard',            label: 'Dashboard',          icon: LayoutDashboard, exact: true },
      { href: '/admin/students',             label: 'Students',           icon: Users },
      { href: '/admin/payments',             label: 'Payments',           icon: CreditCard },
      { href: '/admin/courses',              label: 'Courses',            icon: BookOpen },
      { href: '/admin/plans',                label: 'Plans',              icon: Package },
      { href: '/admin/certificates',         label: 'Certificates',       icon: Award },
      { href: '/admin/online-enrollments',   label: 'Online Enrollments', icon: GraduationCap },
      { href: '/admin/offline-enrollments',  label: 'Offline Enrollments', icon: Users },
      { href: '/admin/project-requests',     label: 'Project Requests',   icon: FolderKanban },
      { href: '/admin/purchased-courses',    label: 'Purchased Courses',  icon: BookOpen },
      { href: '/admin/certification-leads',  label: 'Certification Leads', icon: Award },
      { href: '/admin/contact-messages',     label: 'Contact Messages',   icon: MessageSquare },
      { href: '/admin/admin-invites',        label: 'Admin Invites',      icon: UserPlus },
      { href: '/admin/offline-leads',        label: 'Offline Leads',      icon: TrendingUp },
      { href: '/admin/manual-leads',         label: 'Manual Leads',       icon: UserPlus },
      { href: '/admin/settings',             label: 'Settings',           icon: Settings },
    ];
  }

  const items: NavItem[] = [
    { href: base,                    label: 'Dashboard',     icon: LayoutDashboard, exact: true },
    { href: `${base}/students`,      label: 'Students',     icon: Users },
    { href: `${base}/payments`,      label: 'Payments',     icon: CreditCard },
    { href: `${base}/courses`,       label: 'Courses',      icon: BookOpen },
    { href: `${base}/plans`,         label: 'Plans',        icon: Package },
    { href: `${base}/certificates`,  label: 'Certificates', icon: Award },
  ];

  // Organization-only: Jobs & Company Profile
  if (!isAdmin) {
    items.push({ href: `${base}/jobs`,    label: 'Job Postings',    icon: Briefcase });
    items.push({ href: `${base}/profile`, label: 'Company Profile', icon: Building2 });
  }

  items.push({ href: `${base}/settings`, label: 'Settings', icon: Settings });

  return items;
}

interface PortalLayoutProps {
  children: React.ReactNode;
  portalType: PortalType;
}

interface PortalNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  href: string;
  createdAt: string;
  isNew: boolean;
}

export default function PortalLayout({ children, portalType }: PortalLayoutProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]               = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotificationAt, setLatestNotificationAt] = useState('');

  const base      = portalType === 'admin' ? '/admin' : '/organization';
  const navItems  = getNavItems(base, portalType === 'admin');
  const portalLabel = portalType === 'admin' ? 'Admin Portal' : 'Org Portal';
  const PortalIcon  = portalType === 'admin' ? Shield : Building2;
  const allowedRoles = portalType === 'admin' ? ['ADMIN', 'SUPERADMIN'] : ['ADMIN', 'SUPERADMIN', 'COMPANY'];
  const isLoginPage = pathname === `${base}/login`;

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Use /api/auth/me for organization portal (works for all roles),
    // and /api/admin/me for admin portal (ADMIN/SUPERADMIN only).
    const meEndpoint = portalType === 'admin' ? '/api/admin/me' : '/api/auth/me';
    const loginPath  = portalType === 'admin' ? '/admin/login' : '/organization/login';

    fetch(meEndpoint, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data?.user) {
          router.replace(loginPath);
          return;
        }
        const u = data.user;
        if (!allowedRoles.includes(u.role)) {
          // Wrong role - redirect to the correct portal
          if (u.role === 'STUDENT') router.replace('/dashboard/student');
          else if (u.role === 'COMPANY') router.replace('/organization');
          else if (u.role === 'ADMIN' || u.role === 'SUPERADMIN') router.replace('/admin');
          else router.replace(loginPath);
          return;
        }
        setUser(u);
      })
      .catch(() => router.replace(loginPath))
      .finally(() => setLoading(false));
  }, [isLoginPage, portalType, router]);

  const notificationStorageKey = user?.email
    ? `adyapan:${portalType}:notifications:lastSeen:${user.email}`
    : '';

  const fetchNotifications = useCallback(async () => {
    if (!user || !notificationStorageKey) return;

    const lastSeen = window.localStorage.getItem(notificationStorageKey);
    const params = new URLSearchParams({ portal: portalType });
    if (lastSeen) params.set('since', lastSeen);

    try {
      const res = await fetch(`/api/portal/notifications?${params.toString()}`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok || !data?.success) return;

      setNotifications(data.items || []);
      setUnreadCount(Number(data.unreadCount || 0));
      setLatestNotificationAt(data.latestAt || '');
    } catch {
      // Non-critical: keep the portal usable if notification polling fails.
    }
  }, [notificationStorageKey, portalType, user]);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const id = window.setInterval(fetchNotifications, 30000);
    const onFocus = () => fetchNotifications();
    window.addEventListener('focus', onFocus);
    window.addEventListener('portal-data-updated', onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('portal-data-updated', onFocus);
    };
  }, [fetchNotifications, user]);

  useEffect(() => {
    setNotificationsOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    window.dispatchEvent(new Event('auth-manual-logout'));
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch {}
    window.location.assign('/');
  };

  const markNotificationsRead = () => {
    if (!notificationStorageKey) return;
    const seenAt = latestNotificationAt || new Date().toISOString();
    window.localStorage.setItem(notificationStorageKey, seenAt);
    setUnreadCount(0);
    setNotifications(items => items.map(item => ({ ...item, isNew: false })));
  };

  const toggleNotifications = () => {
    setNotificationsOpen(v => {
      const next = !v;
      if (next) {
        setProfileOpen(false);
        markNotificationsRead();
      }
      return next;
    });
  };

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const activeLabel = navItems.find(n => isActive(n))?.label || 'Dashboard';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ffa800] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Loading portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      {!isLoginPage && (
        <SessionIdleManager loginPath={portalType === 'admin' ? '/admin/login' : '/organization/login'} />
      )}

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ========================================
          SIDEBAR
      ======================================== */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-50 flex flex-col
        bg-white border-r border-gray-100 shadow-xl
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 flex-shrink-0">
          <Link href={base} className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #ffa800, #ff6b00)' }}
            >
              <PortalIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">Adyapan</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#ffa800' }}>
                {portalLabel}
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group relative
                  ${active
                    ? 'text-[#ffa800]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(255,168,0,0.12), rgba(255,107,0,0.06))',
                } : {}}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #ffa800, #ff6b00)' }}
                  />
                )}
                <item.icon
                  style={{ width: 17, height: 17 }}
                  className={`flex-shrink-0 transition-colors ${active ? 'text-[#ffa800]' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 text-[#ffa800]" />}
              </Link>
            );
          })}
        </nav>

        {/* Divider + back to site */}
        <div className="px-3 pb-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Student Site
          </a>
        </div>

        {/* User card */}
        <div className="px-3 py-3 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50/80">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ffa800, #ff6b00)' }}
            >
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 h-16 flex items-center gap-3 sm:gap-4 px-3 sm:px-4 md:px-6 shadow-sm flex-shrink-0">

          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ffa800, #ff6b00)' }}
            >
              <PortalIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-gray-400 text-sm">/</span>
            <span className="text-sm font-semibold text-gray-800 truncate">{activeLabel}</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all relative ${
                  notificationsOpen
                    ? 'text-[#ffa800] bg-orange-50'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-[320px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Notifications</p>
                        <p className="text-[11px] text-gray-400">Latest website updates</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#ffa800] bg-orange-50 border border-orange-100 rounded-full px-2 py-1">
                        Live
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <Bell className="w-7 h-7 mx-auto text-gray-300 mb-2" />
                          <p className="text-sm font-semibold text-gray-700">No notifications yet</p>
                          <p className="text-xs text-gray-400 mt-1">New leads, payments and enrollments will appear here.</p>
                        </div>
                      ) : (
                        notifications.map(item => (
                          <Link
                            key={`${item.type}-${item.id}`}
                            href={item.href}
                            className="flex gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors"
                          >
                            <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.isNew ? 'bg-red-500' : 'bg-gray-200'}`} />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-gray-900 truncate">{item.title}</span>
                              <span className="block text-xs text-gray-500 mt-0.5 line-clamp-2">{item.message}</span>
                              <span className="block text-[10px] text-gray-400 mt-1">
                                {new Date(item.createdAt).toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </span>
                          </Link>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <button
                        onClick={markNotificationsRead}
                        className="w-full px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-[#ffa800] hover:bg-orange-50 border-t border-gray-100 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #ffa800, #ff6b00)' }}
                >
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-900 leading-none">{user?.name?.split(' ')[0]}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{user?.role}</p>
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                      <span
                        className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #ffa800, #ff6b00)' }}
                      >
                        {user?.role}
                      </span>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href={`${base}/settings`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
