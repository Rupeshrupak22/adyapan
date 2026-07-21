'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { s3Url } from '@/lib/s3Url';

const partners = [
  { name: 'Adobe',             abbr: 'Ado', logo: s3Url('/logos/adobe.webp'),                              neon: '#FF0000' },
  { name: 'Apple',             abbr: 'App', logo: s3Url('/logos/apple.png'),                               neon: '#a0a0a0' },
  { name: 'Autodesk',          abbr: 'Aut', logo: s3Url('/logos/Autodesklogo.png'),                        neon: '#0696D7' },
  { name: 'Cisco',             abbr: 'Cis', logo: s3Url('/logos/cisco.png'),                               neon: '#049FD9' },
  { name: 'Microsoft',         abbr: 'MS',  logo: s3Url('/logos/microsoftlogo.png'),                       neon: '#00A4EF' },
  { name: 'Meta',              abbr: 'Met', logo: s3Url('/logos/meta.png'),                           neon: '#0668E1' },
  { name: 'Intuit',            abbr: 'Int', logo: s3Url('/logos/intuit.png'),                              neon: '#2CA01C' },
  { name: 'Unity',             abbr: 'Uni', logo: s3Url('/logos/unity.png'),                               neon: '#f97316' },
  { name: 'PMI',               abbr: 'PMI', logo: s3Url('/logos/project-management-institutelol.svg'),     neon: '#FF6B00' },
  { name: 'IC3',               abbr: 'IC3', logo: s3Url('/logos/IC3logo.png'),                             neon: '#003087' },
  { name: 'ESB',               abbr: 'ESB', logo: '',                                               neon: '#2563eb' },
  { name: 'CCS Generative AI', abbr: 'CCS', logo: s3Url('/logos/ccs.png'),                                neon: '#f97316' },
];

/* CSS-driven fade-in so it never depends on JS intersection timing */
const cardAnimStyles = `
  @keyframes cert-card-in {
    from { opacity: 0; transform: translateY(16px) scale(0.93); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  .cert-card {
    opacity: 0;
    animation: cert-card-in 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
  }
`;

function PartnerCard({ partner, i }: { partner: typeof partners[0]; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cert-card relative cursor-pointer"
      style={{ animationDelay: `${i * 0.05}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Neon glow */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: `0 0 20px 5px ${partner.neon}44, 0 0 40px 10px ${partner.neon}18`,
              border: `1.5px solid ${partner.neon}77`,
              borderRadius: 16,
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: hovered ? -8 : 0, scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center overflow-hidden"
        style={{ minHeight: 120 }}
      >
        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ x: hovered ? ['-100%', '200%'] : '-100%' }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          style={{ background: `linear-gradient(105deg, transparent 40%, ${partner.neon}15 50%, transparent 60%)` }}
        />

        <motion.div
          animate={{ scale: hovered ? 1.12 : 1, rotate: hovered ? [0, -3, 3, 0] : 0 }}
          transition={{ duration: 0.35 }}
          className="mb-2 flex h-12 w-24 items-center justify-center"
        >
          {partner.logo ? (
            <Image
              src={partner.logo}
              alt={`${partner.name} logo`}
              width={96}
              height={48}
              className="max-h-12 max-w-24 object-contain"
              loading="eager"
              priority={i < 6}
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-xs font-black text-white">
              {partner.abbr}
            </span>
          )}
        </motion.div>

        <p className="font-semibold text-gray-800 text-xs leading-tight">{partner.name}</p>

        {/* Bottom bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[3px] rounded-b-2xl"
          animate={{ width: hovered ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
          style={{ background: `linear-gradient(90deg, ${partner.neon}, ${partner.neon}66)` }}
        />
      </motion.div>
    </div>
  );
}

export default function GlobalCertificationPartners() {
  return (
    <section className="py-20 bg-white">
      <style>{cardAnimStyles}</style>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Globally Recognized</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
            Global <span style={{ color: '#f97316' }}>Certification Partners</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Earn certificates from the world's most recognized technology companies. Validate your skills and stand out to employers.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {partners.map((partner, i) => (
            <PartnerCard key={partner.name} partner={partner} i={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link href="/certifications">
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 0 32px rgba(249,115,22,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 0 16px rgba(249,115,22,0.3)' }}
            >
              View All Certifications <span>&rarr;</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
