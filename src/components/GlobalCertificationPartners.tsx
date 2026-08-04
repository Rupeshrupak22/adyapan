'use client';

import React, { useState } from 'react';
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

const PartnerCard = React.memo(function PartnerCard({ partner }: { partner: typeof partners[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-200"
          style={{
            boxShadow: `0 0 20px 5px ${partner.neon}44`,
            border: `1.5px solid ${partner.neon}77`,
            borderRadius: 16,
          }}
        />
      )}

      <div
        className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center overflow-hidden hover:-translate-y-1 transition-transform duration-200"
        style={{ minHeight: 120 }}
      >
        <div className="mb-2 flex h-12 w-24 items-center justify-center">
          {partner.logo ? (
            <Image
              src={partner.logo}
              alt={`${partner.name} logo`}
              width={96}
              height={48}
              className="max-h-12 max-w-24 object-contain"
              loading="lazy"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-xs font-black text-white">
              {partner.abbr}
            </span>
          )}
        </div>

        <p className="font-semibold text-gray-800 text-xs leading-tight">{partner.name}</p>

        <div
          className="absolute bottom-0 left-0 h-[3px] rounded-b-2xl transition-all duration-200"
          style={{ width: hovered ? '100%' : '0%', background: partner.neon }}
        />
      </div>
    </div>
  );
});

function GlobalCertificationPartners() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Globally Recognized</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
            Global <span style={{ color: '#f97316' }}>Certification Partners</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Earn certificates from the world's most recognized technology companies. Validate your skills and stand out to employers.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/certifications">
            <button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 0 16px rgba(249,115,22,0.3)' }}
            >
              View All Certifications <span>&rarr;</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default React.memo(GlobalCertificationPartners);
