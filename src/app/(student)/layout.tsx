'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

// Dynamically import non-critical components so they don't block initial render
const AnimatedBackground = dynamic(() => import('@/components/AnimatedBackground'), { ssr: false });
const WelcomePopup       = dynamic(() => import('@/components/WelcomePopup'),       { ssr: false });
const CookieConsent      = dynamic(() => import('@/components/CookieConsent'),      { ssr: false });
const Mascot             = dynamic(() => import('@/components/Mascot'),             { ssr: false });
const WhatsAppButton     = dynamic(() => import('@/components/WhatappButton'),      { ssr: false });

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AnimatedBackground />
      <Navbar />
      <main className="flex-grow w-full">{children}</main>
      <Footer />
      <WelcomePopup />
      <CookieConsent />
      <Mascot />
      <WhatsAppButton />
    </AuthProvider>
  );
}
