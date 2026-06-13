'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';
import { getThumbnail } from '@/lib/courseData';
import { useAuthContext } from '@/context/AuthContext';

interface NavUser {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
}

const Navbar = () => {
  const pathname = usePathname();
  const [showPrograms, setShowPrograms] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [programSearch, setProgramSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use shared auth context " avoids a duplicate /api/auth/me call
  const { user: authUser, logout: authLogout } = useAuthContext();
  const user: NavUser | null = authUser
    ? { name: authUser.name, email: authUser.email, role: authUser.role }
    : null;

  const links = [
    { label: 'Home',              href: '/' },
    { label: 'Get Certification', href: '/certifications', shortLabel: 'Certification' },
    { label: 'Offline Services',  href: '/offline-services', shortLabel: 'Offline' },
    { label: 'About Us',          href: '/about', desktopClass: 'hidden xl:block' },
    { label: 'Our Gallery',       href: '/gallery', desktopClass: 'hidden xl:block', shortLabel: 'Gallery' },
    { label: 'Campus Ambassador', href: '/campus-ambassador', desktopClass: 'hidden 2xl:block', shortLabel: 'Campus' },
    { label: 'Contact',           href: '/contact', desktopClass: 'hidden xl:block' },
  ];

  const categories = [
    { name: 'CSE / IT DOMAINS',        count: '26 COURSES' },
    { name: 'MANAGEMENT & COMMERCE',   count: '15 COURSES' },
    { name: 'ECE DOMAINS',             count: '5 COURSES' },
    { name: 'ECONOMICS',               count: '4 COURSES' },
    { name: 'MECHANICAL ENGINEERING',  count: '4 COURSES' },
    { name: 'BIO & LIFE SCIENCES',     count: '10 COURSES' },
    { name: 'CIVIL ENGINEERING',       count: '1 COURSE' },
  ];

  const coursesByCategory: Record<string, Array<{ name: string; img: string; duration: string }>> = {
    'CSE / IT DOMAINS': [
      { name: 'Artificial Intelligence',       img: getThumbnail('Artificial Intelligence'), duration: '2-3 Months' },
      { name: 'AI Engineering',                img: getThumbnail('AI Engineering'), duration: '2-3 Months' },
      { name: 'Generative AI',                 img: getThumbnail('Generative AI'), duration: '2-3 Months' },
      { name: 'Machine Learning',              img: getThumbnail('Machine Learning'), duration: '2-3 Months' },
      { name: 'Data Science',                  img: getThumbnail('Data Science'), duration: '2-3 Months' },
      { name: 'Data Engineering',              img: getThumbnail('Data Engineering'), duration: '2-3 Months' },
      { name: 'Data Analytics',                img: getThumbnail('Data Analytics'), duration: '2-3 Months' },
      { name: 'Database Management (DBMS)',     img: getThumbnail('Database Management'), duration: '2-3 Months' },
      { name: 'Data Structures & Algorithms',  img: getThumbnail('Data Structures'), duration: '2-3 Months' },
      { name: 'Web Development',               img: getThumbnail('Web Development'), duration: '2-3 Months' },
      { name: 'Web 3.0',                       img: getThumbnail('Web 3.0'), duration: '2-3 Months' },
      { name: 'App Development',               img: getThumbnail('App Development'), duration: '2-3 Months' },
      { name: 'Python Full Stack',             img: getThumbnail('Python Full Stack'), duration: '2-3 Months' },
      { name: 'Python programming curriculum', img: getThumbnail('Python Programming'), duration: '2-3 Months' },
      { name: 'Java Programming',              img: getThumbnail('Java Programming'), duration: '2-3 Months' },
      { name: 'Java Full Stack',               img: getThumbnail('Java Full Stack'), duration: '2-3 Months' },
      { name: 'Selenium Testing with Java',    img: getThumbnail('Selenium Testing'), duration: '2-3 Months' },
      { name: 'DevOps Engineering',            img: getThumbnail('DevOps'), duration: '2-3 Months' },
      { name: 'Cloud Computing',               img: getThumbnail('Cloud Computing'), duration: '2-3 Months' },
      { name: 'AWS',                           img: getThumbnail('AWS'), duration: '2-3 Months' },
      { name: 'Cyber Security',                img: getThumbnail('Cyber Security'), duration: '2-3 Months' },
      { name: 'Blockchain & Bitcoin',          img: getThumbnail('Blockchain'), duration: '2-3 Months' },
      { name: 'AR/VR Development',            img: getThumbnail('AR/VR'), duration: '2-3 Months' },
      { name: 'UI/UX Design',                 img: getThumbnail('UI/UX'), duration: '2-3 Months' },
      { name: 'Graphic Design',               img: getThumbnail('Graphic Design'), duration: '2-3 Months' },
      { name: 'VFX',                          img: getThumbnail('VFX'), duration: '2-3 Months' },
    ],
    'MANAGEMENT & COMMERCE': [
      { name: 'Finance',                               img: getThumbnail('Finance'), duration: '2-3 Months' },
      { name: 'Investment Banking',                    img: getThumbnail('Investment Banking'), duration: '2-3 Months' },
      { name: 'Business Analytics',                    img: getThumbnail('Business Analytics'), duration: '2-3 Months' },
      { name: 'Marketing Management',                  img: getThumbnail('Marketing Management'), duration: '2-3 Months' },
      { name: 'Digital Marketing & Growth Strategy',   img: getThumbnail('Digital Marketing'), duration: '2-3 Months' },
      { name: 'Social Media Marketing',                img: getThumbnail('Social Media Marketing'), duration: '2-3 Months' },
      { name: 'HRM',                                   img: getThumbnail('HRM'), duration: '2-3 Months' },
      { name: 'Management Consultancy',                img: getThumbnail('Management Consultancy'), duration: '2-3 Months' },
      { name: 'Supply Chain Management',               img: getThumbnail('Supply Chain'), duration: '2-3 Months' },
      { name: 'SAP FICA',                              img: getThumbnail('SAP FICA'), duration: '2-3 Months' },
      { name: 'Salesforce',                            img: getThumbnail('Salesforce'), duration: '2-3 Months' },
      { name: 'Stock Marketing',                       img: getThumbnail('Stock Marketing'), duration: '2-3 Months' },
      { name: 'ACCA F4 (Business & Corporate Law)',    img: getThumbnail('ACCA'), duration: '2-3 Months' },
      { name: 'Chartered Accountancy / CFA',           img: getThumbnail('Chartered Accountancy'), duration: '2-3 Months' },
      { name: 'Spoken English & Communication',        img: getThumbnail('Spoken English'), duration: '2-3 Months' },
    ],
    'ECE DOMAINS': [
      { name: 'Embedded Systems',         img: getThumbnail('Embedded Systems'), duration: '2-3 Months' },
      { name: 'Hybrid & Electric Vehicle',img: getThumbnail('Hybrid'), duration: '2-3 Months' },
      { name: 'VLSI',                     img: getThumbnail('VLSI'), duration: '2-3 Months' },
      { name: 'IoT & Robotics',           img: getThumbnail('IoT'), duration: '2-3 Months' },
      { name: 'Power Systems',            img: getThumbnail('Power Systems'), duration: '2-3 Months' },
    ],
    'ECONOMICS': [
      { name: 'Business & Financial Economics', img: getThumbnail('Business & Financial Economics'), duration: '2-3 Months' },
      { name: 'Investment Analysis',            img: getThumbnail('Investment Analysis'), duration: '2-3 Months' },
      { name: 'Data Analysis for Economics',    img: getThumbnail('Data Analysis for Economics'), duration: '2-3 Months' },
      { name: 'Financial Economics',            img: getThumbnail('Financial Economics'), duration: '2-3 Months' },
    ],
    'MECHANICAL ENGINEERING': [
      { name: 'AutoCAD',                        img: getThumbnail('AutoCAD'), duration: '2-3 Months' },
      { name: 'CATIA',                          img: getThumbnail('CATIA'), duration: '2-3 Months' },
      { name: 'Car Design',                     img: getThumbnail('Car Design'), duration: '2-3 Months' },
      { name: 'Quality & Safety Professionals', img: getThumbnail('Quality'), duration: '2-3 Months' },
    ],
    'BIO & LIFE SCIENCES': [
      { name: 'Bioinformatics',               img: getThumbnail('Bioinformatics'), duration: '2-3 Months' },
      { name: 'Microbiology',                 img: getThumbnail('Microbiology'), duration: '2-3 Months' },
      { name: 'Molecular Biology',            img: getThumbnail('Molecular Biology'), duration: '2-3 Months' },
      { name: 'Genetic Engineering',          img: getThumbnail('Genetic Engineering'), duration: '2-3 Months' },
      { name: 'Pharmacovigilance',            img: getThumbnail('Pharmacovigilance'), duration: '2-3 Months' },
      { name: 'Nano Technology',              img: getThumbnail('Nano Technology'), duration: '2-3 Months' },
      { name: 'Food Science & Technology',    img: getThumbnail('Food Science'), duration: '2-3 Months' },
      { name: 'Nutrition & Health Management',img: getThumbnail('Nutrition'), duration: '2-3 Months' },
      { name: 'Sensory Science',              img: getThumbnail('Sensory Science'), duration: '2-3 Months' },
      { name: 'Medical Coding',               img: getThumbnail('Medical Coding'), duration: '2-3 Months' },
    ],
    'CIVIL ENGINEERING': [
      { name: 'Construction Planning', img: getThumbnail('Construction'), duration: '2-3 Months' },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState('CSE / IT DOMAINS');

  /* â"€â"€ Close programs dropdown on outside click â"€â"€ */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowPrograms(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{
        background: 'rgba(20, 22, 38, 0.82)',
        backdropFilter: 'blur(18px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
      }}
    >
      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 2xl:px-8 h-16 grid grid-cols-[auto_1fr] items-center gap-3 xl:gap-4">

        {/* Left group: Logo + All Programs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/newadylogo.png"
                alt="Adyapan Logo"
                width={120}
                height={40}
                priority
                className="h-8 sm:h-9 2xl:h-10 w-auto"
              />
            </Link>
          </motion.div>

          <div className="relative shrink-0" ref={dropdownRef}>
            <motion.button
              onClick={() => setShowPrograms(!showPrograms)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center space-x-1.5 sm:space-x-2 px-2 min-[380px]:px-3 xl:px-4 py-1.5 bg-[#ffa800] text-white rounded-full text-xs 2xl:text-sm font-semibold hover:bg-[#e69500] transition-colors whitespace-nowrap shrink-0"
            >
              <span></span>
              <span className="hidden min-[380px]:inline">All Programs</span>
              <span className="min-[380px]:hidden">Programs</span>
            </motion.button>

            <AnimatePresence>
              {showPrograms && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="fixed left-3 right-3 top-16 mt-2 bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-auto z-50 max-h-[calc(100vh-5rem)] overflow-hidden xl:absolute xl:left-0 xl:right-auto xl:top-full xl:w-[min(1000px,calc(100vw-2rem))] xl:max-w-[1000px]"
                >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {/* Search Bar */}
                  <div className="col-span-1 md:col-span-3 mb-2">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={programSearch}
                        onChange={(e) => setProgramSearch(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffa800] focus:border-transparent"
                      />
                      {programSearch && (
                        <button
                          onClick={() => setProgramSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label="Clear search"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="col-span-1 md:border-r border-gray-200 md:pr-4 max-h-[300px] md:max-h-[500px] overflow-y-auto">
                    <div className="space-y-2">
                      {categories.map((cat, i) => (
                        <motion.button
                          key={i}
                          onClick={() => setSelectedCategory(cat.name)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-all ${
                            selectedCategory === cat.name ? 'bg-[#ffa800] text-white' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-sm">{cat.name}</div>
                            <div className={`text-xs ${selectedCategory === cat.name ? 'text-white/80' : 'text-gray-500'}`}>{cat.count}</div>
                          </div>
                          <span className={selectedCategory === cat.name ? 'text-white' : 'text-gray-400'}>&#8250;</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Courses grid */}
                  <div className="col-span-1 md:col-span-2 max-h-[400px] md:max-h-[500px] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {(() => {
                        const searchTerm = programSearch.trim().toLowerCase();
                        const coursesToShow = searchTerm
                          ? Object.values(coursesByCategory)
                              .flat()
                              .filter((course) => course.name.toLowerCase().includes(searchTerm))
                          : coursesByCategory[selectedCategory] || [];
                        
                        if (coursesToShow.length === 0) {
                          return (
                            <div className="col-span-2 text-center py-8 text-gray-400">
                              No courses found for &ldquo;{programSearch}&rdquo;
                            </div>
                          );
                        }

                        return coursesToShow.map((course, i) => {
                        const slug = course.name.toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="rounded-xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                          >
                            <Link href={`/courses/${slug}`} className="block" onClick={() => setShowPrograms(false)}>
                              <div className="relative h-32 overflow-hidden bg-gray-200">
                                <Image src={course.img} alt={course.name} fill sizes="200px" className="object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              </div>
                              <div className="p-3">
                                <h4 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2">{course.name}</h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">{course.duration}</span>
                                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-50 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                    <span className="text-xs text-red-600 font-semibold">Live</span>
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      });
                      })()}
                    </div>
                  </div>
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden xl:flex items-center justify-start gap-5 2xl:gap-6 min-w-0 overflow-visible">
          {links.map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
              className={l.desktopClass || 'block'}
            >
              <Link
                href={l.href}
                className={`text-[13px] 2xl:text-sm font-medium transition-colors duration-200 relative group whitespace-nowrap ${
                  (l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)) ? 'text-[#ffa800]' : 'text-white hover:text-[#ffa800]'
                }`}
              >
                {l.shortLabel ? (
                  <>
                    <span className="2xl:hidden">{l.shortLabel}</span>
                    <span className="hidden 2xl:inline">{l.label}</span>
                  </>
                ) : (
                  l.label
                )}
                <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-[#ffa800] transition-all duration-300 ${
                  (l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            </motion.div>
          ))}

          {/* Recruiter button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + links.length * 0.07, duration: 0.4 }}
          >
            <Link
              href="/company"
              className={`text-[13px] 2xl:text-sm font-semibold px-3 2xl:px-4 py-1.5 rounded-full border transition-all duration-200 whitespace-nowrap shrink-0 ${
                pathname.startsWith('/company')
                  ? 'bg-[#ffa800] text-white border-[#ffa800]'
                  : 'border-[#ffa800] text-[#ffa800] hover:bg-[#ffa800] hover:text-white'
              }`}
            >
              Recruiter
            </Link>
          </motion.div>

          {user ? (
            <ProfileDropdown
              user={user}
              onUserUpdate={() => {}}
            />
          ) : (
            <>
              <Link href="/auth?mode=login" className="text-[13px] 2xl:text-sm font-medium text-white hover:text-[#ffa800] transition-colors whitespace-nowrap">
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth?mode=signup"
                  className="block px-4 2xl:px-5 py-2 bg-[#ffa800] text-white rounded-full text-[13px] 2xl:text-sm font-semibold hover:bg-[#e69500] transition-colors whitespace-nowrap shrink-0"
                >
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile action */}
        <motion.div
          className="flex xl:hidden items-center justify-end gap-2 shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {user && (
            <ProfileDropdown
              user={user}
              onUserUpdate={() => {}}
            />
          )}

          {/* Mobile hamburger */}
          <button
            className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setShowMobile(v => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${showMobile ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-opacity duration-300 ${showMobile ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${showMobile ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </motion.div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden overflow-hidden border-t border-white/10"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {links.map(l => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setShowMobile(false)}
                  className={`text-sm font-medium py-2 transition-colors duration-200 ${
                    (l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)) ? 'text-[#ffa800]' : 'text-white hover:text-[#ffa800]'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/company"
                onClick={() => setShowMobile(false)}
                className={`text-sm font-semibold py-2 transition-colors duration-200 ${
                  pathname.startsWith('/company') ? 'text-[#ffa800]' : 'text-[#ffa800] hover:text-white'
                }`}
              >
                Recruiter
              </Link>
              <div className="border-t border-white/10 pt-3 flex gap-3">
                {user ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await authLogout();
                      setShowMobile(false);
                      window.dispatchEvent(new Event('auth-change'));
                    }}
                    className="flex-1 text-center py-2 text-sm font-semibold bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link href="/auth?mode=login" onClick={() => setShowMobile(false)} className="flex-1 text-center py-2 text-sm font-medium text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors">
                      Login
                    </Link>
                    <Link href="/auth?mode=signup" onClick={() => setShowMobile(false)} className="flex-1 text-center py-2 text-sm font-semibold bg-[#ffa800] text-white rounded-full hover:bg-[#e69500] transition-colors">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    <div className="h-16" aria-hidden="true" />
    </>
  );
};

export default Navbar;
