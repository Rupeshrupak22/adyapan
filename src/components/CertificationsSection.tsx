'use client';

import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';

/* -- Partner logo image paths -- */
const partners = [
  {
    name: 'Google',
    img: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    bg: '#f0fdf4',
    color: '#4285F4',
  },
  {
    name: 'Apple',
    img: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    bg: '#f9fafb',
    color: '#1d1d1f',
  },
  {
    name: 'Microsoft',
    img: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    bg: '#f3f4f6',
    color: '#737373',
  },
  {
    name: 'AWS',
    img: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    bg: '#fffbeb',
    color: '#FF9900',
  },
  {
    name: 'Adobe',
    img: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png',
    bg: '#fff1f0',
    color: '#FF0000',
  },
  {
    name: 'Meta',
    img: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    bg: '#eff6ff',
    color: '#0064E0',
  },
  {
    name: 'Cisco',
    img: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
    bg: '#eff6ff',
    color: '#1BA0D7',
  },
];

/* -- CSS keyframes injected once -- */
const marqueeStyles = `
  @keyframes marquee-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marquee-right {
    0%   { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .marquee-left {
    animation: marquee-left 30s linear infinite;
    will-change: transform;
  }
  .marquee-right {
    animation: marquee-right 36s linear infinite;
    will-change: transform;
  }

`;

const certifications = [
  {
    name: 'ISO 9001:2015',
    desc: 'Quality Management System',
    icon: <img src="/images/iso-Photoroom.png" alt="ISO 9001:2015" className="w-12 h-12 object-contain" />,
  },
  {
    name: 'NSDC',
    desc: 'National Skill Development Corporation',
    icon: <img src="/images/nsdc-Photoroom.png" alt="NSDC" className="w-12 h-12 object-contain" />,
  },
  {
    name: 'Skill India',
    desc: 'Skill India Digital Hub',
    icon: <img src="/images/skill-Photoroom.png" alt="Skill India" className="w-12 h-12 object-contain" />,
  },
  {
    name: 'MSME',
    desc: 'Ministry of MSME, Govt. of India',
    icon: <img src="/images/msme.png" alt="MSME" className="w-12 h-12 object-contain" />,
  },
];

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  /* Duplicate each row so the seam is invisible */
  const row1 = [...partners, ...partners, ...partners, ...partners];
  const row2 = [...partners.slice().reverse(), ...partners.slice().reverse(), ...partners.slice().reverse(), ...partners.slice().reverse()];

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f5f0eb 40%, #f5f0eb 100%)' }}>

      {/* Inject CSS keyframes */}
      <style>{marqueeStyles}</style>

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%)' }}
        />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* -- CERTIFICATIONS -- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Recognised & Certified</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
            Certified by <span className="text-orange-500">Industry Leaders</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Our programs are officially recognised by top government and industry bodies, ensuring your certificate carries real weight.
          </p>
        </motion.div>

        {/* Certification cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-20 sm:mb-24">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(249,115,22,0.15)' }}
              className="group bg-white rounded-2xl p-6 text-center cursor-default transition-all duration-300 border border-orange-100 hover:border-orange-300"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  {cert.icon}
                </motion.div>
              </div>
              <h4 className="font-extrabold text-gray-900 text-base mb-1">{cert.name}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{cert.desc}</p>
              {/* Animated bottom bar */}
              <div className="mt-4 h-0.5 w-0 group-hover:w-full mx-auto rounded-full transition-all duration-500"
                style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)' }} />
            </motion.div>
          ))}
        </div>

        {/* -- PARTNERS -- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Certificate Partners</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
            Our <span className="text-orange-500">Certificate Partners</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Earn certificates co-branded with the world's most recognised technology companies.
          </p>
        </motion.div>
      </div>

      {/* -- Infinite scroll row 1 (left) -- */}
      <div className="relative overflow-hidden mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #f5f0eb, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #f5f0eb, transparent)' }} />
        {/* Track: width must be exactly 2× the unique content so -50% lands on the seam */}
        <div
          className="marquee-left flex gap-4 items-center"
          style={{ width: 'max-content' }}
        >
          {row1.map(({ name, img, bg, color }, i) => (
            <div
              key={`r1-${i}`}
              className="flex-shrink-0 w-36 h-20 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-default border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: bg }}
            >
              <img src={img} alt={name} className="w-16 h-8 object-contain" />
              <span className="text-xs font-bold" style={{ color }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* -- Infinite scroll row 2 (right) -- */}
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #f5f0eb, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #f5f0eb, transparent)' }} />
        <div
          className="marquee-right flex gap-4 items-center"
          style={{ width: 'max-content' }}
        >
          {row2.map(({ name, img, bg, color }, i) => (
            <div
              key={`r2-${i}`}
              className="flex-shrink-0 w-36 h-20 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-default border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: bg }}
            >
              <img src={img} alt={name} className="w-16 h-8 object-contain" />
              <span className="text-xs font-bold" style={{ color }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {[
            { n: '300+', l: 'Hiring Partners' },
            { n: '67+',  l: 'Programs' },
            { n: '10K+', l: 'Certificates Issued' },
            { n: '95%',  l: 'Placement Rate' },
          ].map(({ n, l }, i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 text-center border border-orange-100 hover:border-orange-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="text-3xl font-extrabold text-orange-500 leading-none mb-1">{n}</div>
              <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{l}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

