'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
  createdAt: string;
  selectedProgram?: string | null;
  selectedAmount?: number | null;
  studentProfile?: any;
  companyProfile?: any;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface SignupData {
  role: 'student' | 'organization';
  firstName?: string;
  lastName?: string;
  fullName?: string;
  companyName?: string;
  selectedProgram?: string;
  selectedAmount?: number;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hadUserRef = useRef(false);

  const redirectToLogin = useCallback(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      window.location.replace('/admin/login?reason=session_expired');
      return;
    }
    if (path.startsWith('/organization')) {
      window.location.replace('/organization/login?reason=session_expired');
      return;
    }
    window.location.replace('/auth?reason=session_expired');
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
      hadUserRef.current = true;
      setError(null);
    } catch (err: any) {
      setUser(null);
      if (err?.response?.status === 401 && hadUserRef.current) {
        hadUserRef.current = false;
        redirectToLogin();
      }
      // 401 is expected when user is not authenticated - suppress console noise
      if (err?.response?.status !== 401) {
        // Only log unexpected errors
        console.warn('[useAuth] Unexpected error fetching user:', err?.response?.status);
      }
    } finally {
      setLoading(false);
    }
  }, [redirectToLogin]);

  // Fetch current user on mount and whenever login/signup/logout changes the cookie.
  useEffect(() => {
    fetchUser();

    const handleAuthChange = () => {
      setLoading(true);
      fetchUser();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      setUser(response.data.user);
      hadUserRef.current = true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/signup', data);
      setUser(response.data.user);
      hadUserRef.current = true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    hadUserRef.current = false;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-manual-logout'));
    }
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Logout failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    clearError,
  };
}
