'use client';

import React, { useEffect, useRef, useCallback } from 'react';

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes
const THROTTLE_INTERVAL_MS = 10 * 1000; // Throttle timer reset to every 10 seconds max

/**
 * Monitors user activity (mouse, keyboard, scroll, touch).
 * After 15 minutes of inactivity, logs the user out.
 * Throttled to prevent calling clearTimeout/setTimeout on every mouse pixel movement.
 */
export default function InactivityTimeout() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggedInRef = useRef(false);
  const lastResetTimeRef = useRef<number>(0);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.dispatchEvent(new Event('auth-change'));
      window.location.href = '/login?reason=inactivity';
    } catch {
      window.location.href = '/login?reason=inactivity';
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (!isLoggedInRef.current) return;

    const now = Date.now();
    if (now - lastResetTimeRef.current < THROTTLE_INTERVAL_MS) {
      return; // Skip rapid consecutive triggers
    }
    lastResetTimeRef.current = now;

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
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener('auth-change', handleAuthChange);

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

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

  return null;
}
