'use client';

import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const markActive = () => {
      lastActivityRef.current = Date.now();
    };

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'focus',
    ];

    events.forEach(event => window.addEventListener(event, markActive, { passive: true }));
    return () => events.forEach(event => window.removeEventListener(event, markActive));
  }, []);

  useEffect(() => {
    const logout = async () => {
      if (loggingOutRef.current) return;
      loggingOutRef.current = true;
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      } catch {}
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
  }, [learningExemption, loginPath, pathname, router]);

  return null;
}
