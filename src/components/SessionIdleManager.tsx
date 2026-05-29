'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const HEARTBEAT_MS = 60 * 1000;

type SessionIdleManagerProps = {
  loginPath: string;
  learningExemption?: boolean;
};

function hasLearningSurface(pathname: string) {
  if (!pathname.startsWith('/courses/') && pathname !== '/dashboard/student') return false;
  return Boolean(
    document.querySelector('iframe[src*="youtube"], iframe[src*="vimeo"], video')
  );
}

export default function SessionIdleManager({
  loginPath,
  learningExemption = false,
}: SessionIdleManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const lastActivityRef = useRef(Date.now());
  const loggingOutRef = useRef(false);
  const idleTimerRef = useRef<number | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          lastActivityRef.current = Date.now();
          loggingOutRef.current = false;
          setMonitoring(true);
        } else {
          setMonitoring(false);
        }
      } catch {
        setMonitoring(false);
      }
    };

    checkSession();
    const stopMonitoring = () => {
      loggingOutRef.current = true;
      setMonitoring(false);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
    window.addEventListener('auth-change', checkSession);
    window.addEventListener('auth-manual-logout', stopMonitoring);
    return () => {
      window.removeEventListener('auth-change', checkSession);
      window.removeEventListener('auth-manual-logout', stopMonitoring);
    };
  }, []);

  useEffect(() => {
    if (!monitoring) return;

    const markPossibleTabClose = () => {
      if (loggingOutRef.current) return;

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/auth/tab-close');
        return;
      }

      fetch('/api/auth/tab-close', {
        method: 'POST',
        credentials: 'include',
        keepalive: true,
      }).catch(() => {});
    };

    window.addEventListener('pagehide', markPossibleTabClose);
    return () => window.removeEventListener('pagehide', markPossibleTabClose);
  }, [monitoring]);

  useEffect(() => {
    if (!monitoring) return;

    const logout = async () => {
      if (loggingOutRef.current) return;
      loggingOutRef.current = true;
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      } catch {}
      setMonitoring(false);
      router.replace(`${loginPath}?reason=session_expired`);
    };

    const resetIdleTimer = () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        const learningActive =
          learningExemption &&
          document.visibilityState === 'visible' &&
          hasLearningSurface(window.location.pathname);

        if (learningActive) {
          resetIdleTimer();
          return;
        }

        logout();
      }, IDLE_TIMEOUT_MS);
    };

    const markActive = () => {
      lastActivityRef.current = Date.now();
      resetIdleTimer();
    };

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'focus',
    ];

    resetIdleTimer();
    events.forEach(event => window.addEventListener(event, markActive, { passive: true }));
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      events.forEach(event => window.removeEventListener(event, markActive));
    };
  }, [learningExemption, loginPath, monitoring, router]);

  useEffect(() => {
    if (!monitoring) return;

    const logout = async () => {
      if (loggingOutRef.current) return;
      loggingOutRef.current = true;
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      } catch {}
      setMonitoring(false);
      router.replace(`${loginPath}?reason=session_expired`);
    };

    const heartbeat = async () => {
      const idleFor = Date.now() - lastActivityRef.current;
      const learningActive =
        learningExemption &&
        document.visibilityState === 'visible' &&
        hasLearningSurface(pathname);

      if (!learningActive && idleFor >= IDLE_TIMEOUT_MS) {
        await logout();
        return;
      }

      const recentlyActive = idleFor < HEARTBEAT_MS * 2;
      if (!recentlyActive && !learningActive) {
        return;
      }

      try {
        const response = await fetch('/api/auth/heartbeat', {
          method: 'POST',
          credentials: 'include',
        });
        if (response.status === 401) await logout();
      } catch {
        // Network hiccups should not instantly kick the user out.
      }
    };

    heartbeat();
    const id = window.setInterval(heartbeat, HEARTBEAT_MS);
    return () => window.clearInterval(id);
  }, [learningExemption, loginPath, monitoring, pathname, router]);

  return null;
}
