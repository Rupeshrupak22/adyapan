'use client';

import { useEffect, useRef, useCallback } from 'react';

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Monitors user activity (mouse, keyboard, scroll, touch).
 * After 15 minutes of inactivity, logs the user out.
 * Only activates if the user is authenticated (has authToken cookie).
 */
export default function InactivityTimeout() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggedInRef = useRef(false);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.dispatchEvent(new Event('auth-change'));
      window.location.href = '/login?reason=inactivity';
    } catch {
      // If logout API fails, still redirect
      window.location.href = '/login?reason=inactivity';
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (!isLoggedInRef.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(logout, INACTIVITY_LIMIT_MS);
  }, [logout]);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        isLoggedInRef.current = !!data?.user;
      } else {
        isLoggedInRef.current = false;
      }
    } catch {
      isLoggedInRef.current = false;
    }

    if (isLoggedInRef.current) {
      resetTimer();
    }
  }, [resetTimer]);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();

    // Listen for auth changes (login/logout events)
    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener('auth-change', handleAuthChange);

    // Activity events
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Also reset on visibility change (user comes back to tab)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isLoggedInRef.current) {
        resetTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('auth-change', handleAuthChange);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [checkAuth, resetTimer]);

  // This component renders nothing
  return null;
}
