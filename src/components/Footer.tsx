'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
/* â"€â"€â"€ Data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */

const platformLinks = [
  { href: '/programs',            label: 'Programs' },
  { href: '/about',               label: 'About Us' },
  { href: '/gallery',             label: 'Gallery' },
  { href: '/campus-ambassador',   label: 'Campus Ambassador' },
  { href: '/company/hire-talent', label: 'Hire Talent' },
  { href: '/marketplace',         label: 'Marketplace' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms',   label: 'Terms of Service' },
  { href: '/contact', label: 'Support' },
  { href: '/contact', label: 'Contact Us' },
];

const socialLinks = [
  {
    href: 'https://www.instagram.com/adyapan_?igsh=MWw1NGwwNTIwZXU2eQ==',
    label: 'Instagram',
    buttonClass: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-[#ffa800] hover:to-[#ff6b00]',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all',
    label: 'LinkedIn',
    buttonClass: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-[#ffa800] hover:to-[#ff6b00]',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: 'https://www.youtube.com/@adyapan21',
    label: 'YouTube',
    buttonClass: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-[#ffa800] hover:to-[#ff6b00]',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

/* â"€â"€â"€ Sub-components â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-orange-400 font-semibold text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
      <span className="w-4 h-px bg-orange-500 inline-block flex-shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-400 text-sm hover:text-orange-400 transition-colors duration-200 flex items-center gap-1.5 group min-h-[44px] sm:min-h-0 py-1"
      >
        <span
          className="w-0 group-hover:w-3 h-px bg-orange-400 transition-all duration-300 inline-block flex-shrink-0"
          aria-hidden="true"
        />
        {label}
      </Link>
    </li>
  );
}

/* â"€â"€â"€ Footer â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */

const Footer = () => {
  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #976b13ff 0%, #06064cff 50%, #180e02ff 100%)' }}
    >
      {/* Decorative top border */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, #f5802c, #f97316, #ce7508, transparent)' }}
        aria-hidden="true"
      />

      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, #f97316, transparent)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* â"€â"€ Main content â"€â"€ */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-14 pb-8">

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10 sm:mb-12">

          {/* â"€â"€ Col 1: Brand â"€â"€ */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4 group" aria-label="Adyapan home">
              <div
              >
                <Image
                  src="/newadylogo.png"
                  alt="Adyapan"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  loading="lazy"
                />
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Transforming India's talent landscape through industry-relevant education, real-world experience, and career-focused programs.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 flex-wrap">
              {socialLinks.map(({ href, label, icon, buttonClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  className={`flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${buttonClass}`}
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* â"€â"€ Col 2: Platform â"€â"€ */}
          <div>
            <SectionHeading>Platform</SectionHeading>
            <ul className="space-y-1">
              {platformLinks.map((link) => (
                <NavLink key={link.label} {...link} />
              ))}
            </ul>
          </div>

          {/* â"€â"€ Col 3: Legal â"€â"€ */}
          <div>
            <SectionHeading>Legal</SectionHeading>
            <ul className="space-y-1">
              {legalLinks.map((link) => (
                <NavLink key={link.label} {...link} />
              ))}
            </ul>
          </div>

          {/* â"€â"€ Col 4: Contact â"€â"€ */}
          <div>
            <SectionHeading>Contact</SectionHeading>
            <ul className="space-y-4">

              {/* Phone */}
              <li>
                <a
                  href="tel:8179124566"
                  aria-label="Call us at 8179124566"
                  className="flex items-center gap-3 group min-h-[44px]"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(249,115,22,0.12))',
                      border: '1px solid rgba(249,115,22,0.3)',
                    }}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm group-hover:text-orange-400 transition-colors duration-200 font-medium">
                    +91 81791 24566
                  </span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:support@adyapan.com"
                  aria-label="Email us at support@adyapan.com"
                  className="flex items-center gap-3 group min-h-[44px]"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(249,115,22,0.12))',
                      border: '1px solid rgba(249,115,22,0.3)',
                    }}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm group-hover:text-orange-400 transition-colors duration-200 font-medium break-all">
                    support@adyapan.com
                  </span>
                </a>
              </li>

              {/* Head Office */}
              <li>
                <p className="text-orange-400 font-semibold text-[11px] uppercase tracking-widest mb-2">Head Office</p>
                <a
                  href="https://maps.google.com/?q=Adyapan+Edutech+Pvt+Ltd+Hyderabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(249,115,22,0.12))',
                      border: '1px solid rgba(249,115,22,0.3)',
                    }}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-300 text-sm font-medium group-hover:text-orange-400 transition-colors duration-200">
                      Adyapan Edutech Pvt Ltd
                    </span>
                    <span className="block text-gray-500 text-[11px] leading-tight mt-0.5">
                      Sattva Magnus, Sabza Colony, Toli Chowki, Hyderabad, Telangana 500008
                    </span>
                  </div>
                </a>
              </li>

              {/* Second Branch */}
              <li>
                <p className="text-orange-400 font-semibold text-[11px] uppercase tracking-widest mb-2">Second Branch</p>
                <a
                  href="https://maps.app.goo.gl/SNRtEqsfZAxBG221A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(249,115,22,0.12))',
                      border: '1px solid rgba(249,115,22,0.3)',
                    }}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-300 text-sm font-medium group-hover:text-orange-400 transition-colors duration-200">
                      Adyapan Edutech Pvt Ltd
                    </span>
                    <span className="block text-gray-500 text-[11px] leading-tight mt-0.5">
                      Cluster_malkajgiri 82, X Road, Khajaguda - Nanakramguda Rd, Radhe Nagar, Rai Durg, Telangana 500104
                    </span>
                  </div>
                </a>
              </li>

              {/* Third Branch */}
              <li>
                <p className="text-orange-400 font-semibold text-[11px] uppercase tracking-widest mb-2">Third Branch</p>
                <a
                  href="https://maps.google.com/?q=IndiQube+Pearl+Mindspace+Rd+P+Janardhan+Reddy+Nagar+Gachibowli+Hyderabad+Telangana+500032"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(249,115,22,0.12))',
                      border: '1px solid rgba(249,115,22,0.3)',
                    }}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-300 text-sm font-medium group-hover:text-orange-400 transition-colors duration-200">
                      Adyapan Edutech Pvt Ltd
                    </span>
                    <span className="block text-gray-500 text-[11px] leading-tight mt-0.5">
                      IndiQube Pearl, Mindspace Rd, Gachibowli, Hyderabad, Telangana 500032
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* â"€â"€ Big brand text banner â"€â"€ */}
        <div
          className="relative w-full overflow-hidden mb-6 flex items-center justify-center py-8 sm:py-10"
          aria-hidden="true"
        >
          <div className="flex items-center justify-center flex-wrap px-4">
            {'adyapan'.split('').map((letter, i) => (
              <span
                key={i}
                className="inline-block cursor-default select-none font-black"
                style={{
                  fontSize: 'clamp(2.8rem, 10vw, 7rem)',
                  color: '#f97316',
                  textShadow: '0 6px 0 rgba(180,60,0,0.5), 0 12px 24px rgba(249,115,22,0.25)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* â"€â"€ Bottom bar â"€â"€ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-gray-500 text-xs text-center sm:text-left">
            © {new Date().getFullYear()}{' '}
            <span className="text-gray-400 font-medium">SR's Adyapan Edutech Pvt. Ltd.</span>
            {' '}All rights reserved.
          </p>

          <nav aria-label="Legal links" className="flex items-center gap-1 text-xs text-gray-500">
            {[
              { href: '/privacy', label: 'Privacy' },
              { href: '/terms',   label: 'Terms' },
              { href: '/contact', label: 'Support' },
            ].map(({ href, label }, i, arr) => (
              <span key={label} className="flex items-center gap-1">
                <Link
                  href={href}
                  className="hover:text-orange-400 transition-colors duration-200 px-1 py-1 min-h-[44px] sm:min-h-0 flex items-center"
                >
                  {label}
                </Link>
                {i < arr.length - 1 && (
                  <span className="text-gray-700 select-none" aria-hidden="true">-</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
