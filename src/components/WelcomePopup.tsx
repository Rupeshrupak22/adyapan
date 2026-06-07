'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';

const COOKIE_STORAGE_KEY = 'adyapan_cookie_consent';
const COOKIE_HANDLED_EVENT = 'adyapan_cookie_handled';

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    // Wait for auth to resolve before deciding whether to show popup
    if (loading) return;

    // Don't show if user is already authenticated
    if (isAuthenticated) return;

    // Don't show if user permanently dismissed it
    const popupDismissed = localStorage.getItem('welcomePopupDismissed');
    if (popupDismissed === 'true') return;

    // Check if cookies have already been handled
    const cookieConsent = localStorage.getItem(COOKIE_STORAGE_KEY);

    const showPopup = () => {
      if (isMobile) {
        // MOBILE: Show popup only after first user interaction (prevents black screen)
        const handleFirstInteraction = () => {
          setIsOpen(true);
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
        return () => {
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };
      } else {
        // DESKTOP: Show after delay (original behavior)
        const t = setTimeout(() => setIsOpen(true), 1000);
        return () => clearTimeout(t);
      }
    };

    if (cookieConsent) {
      return showPopup();
    }

    // Cookies not yet handled - wait for the cookie consent event
    const handleCookieConsent = () => {
      showPopup();
    };

    window.addEventListener(COOKIE_HANDLED_EVENT, handleCookieConsent);
    return () => {
      window.removeEventListener(COOKIE_HANDLED_EVENT, handleCookieConsent);
    };
  }, [loading, isAuthenticated, isMobile]);

  const closePopup = () => {
    setIsOpen(false);
    // Remember that user dismissed the popup permanently
    localStorage.setItem('welcomePopupDismissed', 'true');
  };

  const handleActionClick = () => {
    // Just close popup without saving to localStorage
    // Popup will show again on every refresh
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur - covers everything including navbar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closePopup}
            className={`fixed inset-0 z-[999] ${
              isMobile
                ? 'bg-black/30'
                : 'bg-black/50 backdrop-blur-md'
            }`}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Student Card */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-3xl p-8 relative overflow-hidden cursor-default"
                  style={{ background: 'linear-gradient(135deg, #ff9900 0%, #e07000 100%)' }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6 relative z-10"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>

                  <h3 className="text-2xl font-extrabold text-white mb-3 relative z-10">I'm a Student</h3>
                  <p className="text-white/90 text-sm mb-6 leading-relaxed relative z-10">
                    Build real skills with mentor-led programs, work on live projects, and gain industry experience that makes you job-ready.
                  </p>

                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="space-y-2 mb-6 relative z-10"
                  >
                    {[
                      'Learn from industry mentors & experts',
                      'Work on real internships & live projects',
                      'Build a job-ready portfolio',
                      'Get placement guidance & career support',
                    ].map((item) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                        className="flex items-center text-white text-sm"
                      >
                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 flex-shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>

                  {/* Trust Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-6 pb-6 border-b border-white/20 relative z-10"
                  >
                    <p className="text-white text-xs font-semibold">
                       Trusted by 20,000+ students | 500+ universities
                    </p>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="relative z-10 w-fit">
                    <Link
                      href="/auth?type=student"
                      onClick={handleActionClick}
                      className="inline-flex items-center px-5 py-2.5 bg-white rounded-xl font-semibold text-sm hover:bg-orange-50 transition-colors"
                      style={{ color: '#c05000' }}
                    >
                      Start Your Career Journey
                      <span className="ml-2">→</span>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Teacher Card */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-[#1a1a2e] rounded-3xl p-8 relative overflow-hidden cursor-default"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6 relative z-10"
                  >
                    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </motion.div>

                  <h3 className="text-2xl font-extrabold text-white mb-3 relative z-10">I'm a Teacher</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed relative z-10">
                    Share your expertise, mentor students, and build your teaching career with Adyapan.
                  </p>

                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="space-y-2 mb-8 relative z-10"
                  >
                    {[
                      'Teach & mentor aspiring students',
                      'Create & deliver live courses',
                      'Earn from your expertise',
                      'Access a growing student community',
                      'Get teaching tools & resources',
                      'Build your professional brand',
                    ].map((item) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                        className="flex items-center text-gray-300 text-sm"
                      >
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2 flex-shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="relative z-10">
                    <Link
                      href="/auth?type=teacher"
                      onClick={handleActionClick}
                      className="inline-flex items-center px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                      style={{ background: '#ff9900', color: '#1a0800' }}
                    >
                      Start Teaching
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closePopup}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1a1a2e] font-bold hover:bg-gray-100 transition-colors z-[1001]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
