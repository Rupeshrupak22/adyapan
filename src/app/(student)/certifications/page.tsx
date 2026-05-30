'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Award, TrendingUp, Users, Globe, Shield, ChevronRight } from 'lucide-react';
import CertificationEnrollModal from '@/components/CertificationEnrollModal';

/* ─── Partner data ─────────────────────────────────────────────── */
const certificationPartners = [
  { name: 'Adobe',                          abbr: 'Ado', logo: '/logos/adobe.webp',                    neon: '#FF0000' },
  { name: 'Apple',                          abbr: 'App', logo: '/logos/apple.png',                                        neon: '#a0a0a0' },
  { name: 'Autodesk',                       abbr: 'Aut', logo: '/logos/Autodesklogo.png',                                     neon: '#0696D7' },
  { name: 'Cisco',                          abbr: 'Cis', logo: '/logos/cisco.png',                                        neon: '#049FD9' },
  { name: 'Communication Skills\nfor Business', abbr: 'Com', logo: '/logos/communicationskillsforbusinesslogo.png',          neon: '#f97316' },
  { name: 'ESB',                            abbr: 'ESB', logo: '',                                                           neon: '#2563eb' },
  { name: 'IC3',                            abbr: 'IC3', logo: '/logos/IC3logo.png',                                        neon: '#003087' },
  { name: 'ITS',                            abbr: 'ITS', logo: '/logos/informationtechnologyspecialist.png',                 neon: '#f97316' },
  { name: 'Intuit',                         abbr: 'Int', logo: '/logos/intuit.png',   neon: '#2CA01C' },
  { name: 'Microsoft',                      abbr: 'MS',  logo: '/logos/microsoftcertifiedfundamentalslogo.png',              neon: '#00A4EF' },
  { name: 'Microsoft Office\nSpecialist',   abbr: 'MOS', logo: '/logos/microsoft-office-specialist-microsoft-officelogo.png', neon: '#D83B01' },
  { name: 'Microsoft Certified\nEducator',  abbr: 'MCE', logo: '/logos/MicrosoftCertifiedEducator_Logo.jpg',                 neon: '#0078D4' },
  { name: 'PMI',                            abbr: 'PMI', logo: '/logos/project-management-institutelol.svg',                 neon: '#FF6B00' },
  { name: 'Unity',                          abbr: 'Uni', logo: '/logos/unity.png',                                       neon: '#ffffff' },
  { name: 'Meta',                           abbr: 'Met', logo: '/logos/meta.png',                                       neon: '#0668E1' },
  { name: 'CCS Generative AI',              abbr: 'CCS', logo: '/logos/ccs.png',                       neon: '#f97316' },
];

/* ─── Interactive Partner Explorer data ────────────────────────── */
const partnerExplorerData = [
  {
    name: 'Adobe',
    abbr: 'Ado',
    logo: '/logos/adobe.webp',
    count: 7,
    certifications: [
      'Adobe Certified Professional - Photoshop',
      'Adobe Certified Professional - Illustrator',
      'Adobe Certified Professional - InDesign',
      'Adobe Certified Professional - After Effects',
      'Adobe Certified Professional - Premiere Pro',
      'Adobe Certified Professional - Animate',
      'Adobe Certified Professional - Dreamweaver',
    ],
  },
  {
    name: 'Apple',
    abbr: 'App',
    logo: '/logos/apple.png',
    count: 2,
    certifications: [
      'App Development with Swift - Certified User',
      'App Development with Swift - Associate',
    ],
  },
  {
    name: 'Autodesk',
    abbr: 'Aut',
    logo: '/logos/Autodesklogo.png',
    count: 7,
    certifications: [
      'Autodesk Certified User - AutoCAD',
      'Autodesk Certified User - Fusion 360',
      'Autodesk Certified User - Inventor',
      'Autodesk Certified User - Revit Architecture',
      'Autodesk Certified User - 3ds Max',
      'Autodesk Certified User - Maya',
      'Autodesk Certified User - Tinkercad 3D Design',
    ],
  },
  {
    name: 'Cisco',
    abbr: 'Cis',
    logo: '/logos/cisco.png',
    count: 2,
    certifications: [
      'Cisco Certified Support Technician - Networking',
      'Cisco Certified Support Technician - Cybersecurity',
    ],
  },
  {
    name: 'Communication Skills for Business',
    abbr: 'Com',
    logo: '/logos/communicationskillsforbusinesslogo.png',
    count: 2,
    certifications: [
      'CSB - Professional Communication',
      'CSB - English for IT',
    ],
  },
  {
    name: 'ESB',
    abbr: 'ESB',
    logo: '',
    count: 1,
    certifications: ['ESB v.2'],
  },
  {
    name: 'IC3 Digital Literacy',
    abbr: 'IC3',
    logo: '/logos/IC3logo.png',
    count: 5,
    certifications: [
      'IC3 Digital Literacy - Global Standard 6',
      'IC3 Digital Literacy - Global Standard 5',
      'IC3 - Spark',
      'IC3 - Fast Track',
      'PHP Developer Fundamentals',
    ],
  },
  {
    name: 'Information Technology Specialist',
    abbr: 'ITS',
    logo: '/logos/informationtechnologyspecialist.png',
    count: 15,
    certifications: [
      'Artificial Intelligence',
      'Cloud Computing',
      'Computational Thinking',
      'Cybersecurity',
      'Data Analytics',
      'Databases',
      'Device Configuration and Management',
      'HTML and CSS',
      'HTML5 Application Development',
      'Java',
      'JavaScript',
      'Networking',
      'Network Security',
      'Python',
      'Software Development',
    ],
  },
  {
    name: 'Intuit',
    abbr: 'Int',
    logo: '/logos/intuit.png',
    count: 3,
    certifications: [
      'Intuit - QuickBooks Certified User Online',
      'Intuit - Design for Delight Innovator',
      'Intuit - Certified Bookkeeping Professional',
    ],
  },
  {
    name: 'Microsoft Certified Fundamentals',
    abbr: 'MCF',
    logo: '/logos/microsoftcertifiedfundamentalslogo.png',
    count: 8,
    certifications: [
      'Microsoft Azure Fundamentals (AZ-900)',
      'Microsoft 365 Fundamentals (MS-900)',
      'Microsoft Azure AI Fundamentals (AI-900)',
      'Microsoft Azure Data Fundamentals (DP-900)',
      'Microsoft Power Platform Fundamentals (PL-900)',
      'Microsoft Dynamics 365 Fundamentals CRM (MB-910)',
      'Microsoft Dynamics 365 Fundamentals ERP (MB-920)',
      'Microsoft Security, Compliance, and Identity Fundamentals (SC-900)',
    ],
  },
  {
    name: 'Microsoft Office Specialist',
    abbr: 'MOS',
    logo: '/logos/microsoft-office-specialist-microsoft-officelogo.png',
    count: 5,
    certifications: [
      'MOS - Word',
      'MOS - Excel',
      'MOS - PowerPoint',
      'MOS - Word Expert',
      'MOS - Excel Expert',
    ],
  },
  {
    name: 'Microsoft Certified Educator',
    abbr: 'MCE',
    logo: '/logos/MicrosoftCertifiedEducator_Logo.jpg',
    count: 1,
    certifications: ['Technology Literacy for Educators (62-193)'],
  },
  {
    name: 'PMI',
    abbr: 'PMI',
    logo: '/logos/project-management-institutelol.svg',
    count: 1,
    certifications: ['PMI - Project Management Ready™'],
  },
  {
    name: 'Unity',
    abbr: 'Uni',
    logo: '/logos/unity.png',
    count: 3,
    certifications: [
      'Unity Certified User: Programmer',
      'Unity Certified User: VR Developer',
      'Unity Certified User: Artist',
    ],
  },
  {
    name: 'Meta',
    abbr: 'Met',
    logo: '/logos/Meta.png',
    count: 1,
    certifications: ['Meta Certified: Digital Marketing Associate'],
  },
  {
    name: 'Critical Career Skills',
    abbr: 'CCS',
    logo: '/logos/ccs.png',
    count: 1,
    certifications: ['CCS Generative AI Foundations'],
  },
];

/* ─── Interactive Partner Explorer Component ────────────────────── */
function PartnerExplorer({
  onEarnCertificate,
}: {
  onEarnCertificate: (certName: string, companyName: string) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = partnerExplorerData[selectedIndex];

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden bg-[#fff7ed]">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 18% 8%, rgba(249,115,22,0.16), transparent 34%), radial-gradient(ellipse at 84% 22%, rgba(251,146,60,0.18), transparent 30%), linear-gradient(180deg, #fffaf3 0%, #ffedd5 54%, #fff7ed 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(249,115,22,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.14) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
            Explore by Partner
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Certification <span className="text-orange-500">Partners</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Select a partner to explore all available certifications and enroll directly.
          </p>
        </motion.div>

        {/* Explorer Panel */}
        <div className="flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-2xl shadow-orange-200/50 border border-orange-100">
          {/* Left - Partner List */}
          <div className="w-full md:w-72 bg-white border-r border-gray-200 flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
                Certification Partners
              </h3>
            </div>

            <div className="flex-1 max-h-[380px] md:max-h-[520px] overflow-y-auto overscroll-contain">
              <div className="divide-y divide-gray-100">
                {partnerExplorerData.map((partner, realIdx) => {
                  const isActive = realIdx === selectedIndex;
                  return (
                    <button
                      key={partner.name}
                      onClick={() => setSelectedIndex(realIdx)}
                      className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all ${
                        isActive
                          ? 'bg-orange-50 border-l-4 border-orange-500'
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <span
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden border ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {partner.logo ? (
                          <img
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            className="w-full h-full object-contain p-1.5"
                          />
                        ) : (
                          partner.abbr
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className={`font-semibold text-sm ${isActive ? 'text-orange-700' : 'text-gray-800'}`}>
                          {partner.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {partner.count} Certification{partner.count > 1 ? 's' : ''}
                        </div>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-orange-500 ml-auto flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right - Certifications List */}
          <div className="flex-1 bg-gray-50">
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700 overflow-hidden border border-orange-100">
                {selected.logo ? (
                  <img
                    src={selected.logo}
                    alt={`${selected.name} logo`}
                    className="w-full h-full object-contain p-1.5"
                  />
                ) : (
                  selected.abbr
                )}
              </span>
              <h3 className="font-bold text-gray-900">{selected.name}</h3>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="p-4 overflow-y-auto max-h-[420px]"
              >
                <div className="space-y-2">
                  {selected.certifications.map((cert, i) => {
                    const slug = cert
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, '')
                      .replace(/\s+/g, '-')
                      .replace(/-+/g, '-')
                      .trim();
                    return (
                      <motion.div
                        key={cert}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                          <span className="text-sm text-gray-800 font-medium truncate">{cert}</span>
                        </div>
                        {/* Two actions: view detail page OR earn certificate directly */}
                        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                          <Link href={`/certifications/${slug}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold text-orange-600 border border-orange-300 hover:bg-orange-50 transition-colors"
                            >
                              View
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onEarnCertificate(cert, selected.name)}
                            className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                          >
                            Earn Certificate
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Benefits ─────────────────────────────────────────────────── */
const benefits = [
  { icon: <Globe className="w-6 h-6" />,       title: 'Industry Recognized',    desc: 'Globally accepted certifications' },
  { icon: <Shield className="w-6 h-6" />,      title: '100% Trusted & Verified', desc: 'Authentic certificates from top companies' },
  { icon: <TrendingUp className="w-6 h-6" />,  title: 'Career Advancement',     desc: 'Boost your job prospects' },
  { icon: <Award className="w-6 h-6" />,       title: 'Skill Validation',       desc: 'Prove your expertise to employers' },
  { icon: <Users className="w-6 h-6" />,       title: '10K+ Certified',         desc: 'Join thousands of certified professionals' },
  { icon: <CheckCircle className="w-6 h-6" />, title: 'Lifetime Access',        desc: 'Your certificate never expires' },
];

const stats = [
  { icon: '', value: '50+',  label: 'Certifications' },
  { icon: '', value: '16+',  label: 'Global Partners' },
  { icon: '', value: '10K+', label: 'Students Certified' },
  { icon: '', value: '100%', label: 'Trusted & Verified' },
];

/* ─── Partner Card ─────────────────────────────────────────────── */
function PartnerCard({ partner, i }: { partner: typeof certificationPartners[0]; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Neon glow layer */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: `0 0 24px 6px ${partner.neon}55, 0 0 48px 12px ${partner.neon}22`,
              border: `1.5px solid ${partner.neon}88`,
              borderRadius: 16,
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          y: hovered ? -10 : 0,
          scale: hovered ? 1.06 : 1,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center overflow-hidden"
        style={{ minHeight: 140 }}
      >
        {/* Shimmer sweep on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ x: hovered ? ['−100%', '200%'] : '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${partner.neon}18 50%, transparent 60%)`,
          }}
        />

        {/* Logo */}
        <motion.div
          animate={{ rotate: hovered ? [0, -4, 4, 0] : 0, scale: hovered ? 1.12 : 1 }}
          transition={{ duration: 0.4 }}
          className="mb-3 flex h-14 w-28 items-center justify-center"
        >
          {partner.logo ? (
            <img
              src={partner.logo}
              alt={`${partner.name.replace(/\n/g, ' ')} logo`}
              className="max-h-14 max-w-28 object-contain"
            />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-sm font-black text-white">
              {partner.abbr}
            </span>
          )}
        </motion.div>

        {/* Name */}
        <p className="font-bold text-gray-800 text-xs leading-snug whitespace-pre-line">
          {partner.name}
        </p>

        {/* Animated bottom bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[3px] rounded-b-2xl"
          animate={{ width: hovered ? '100%' : '0%' }}
          transition={{ duration: 0.35 }}
          style={{ background: `linear-gradient(90deg, ${partner.neon}, ${partner.neon}88)` }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Certificate Showcase Section ────────────────────────────── */
const ALL_CERTIFICATES = [
  { name: 'Adobe Acrobat Pro',                      file: 'Adobe Acrobat Pro.png',                       company: 'Adobe' },
  { name: 'Adobe After Effects',                    file: 'Adobe After Effects.png',                     company: 'Adobe' },
  { name: 'Adobe Animate',                          file: 'Adobe Animate.png',                           company: 'Adobe' },
  { name: 'Adobe Dreamweaver',                      file: 'Adobe Dreamweaver.png',                       company: 'Adobe' },
  { name: 'Adobe Express',                          file: 'Adobe Express.png',                           company: 'Adobe' },
  { name: 'Adobe Illustrator',                      file: 'Adobe Illustrator.png',                       company: 'Adobe' },
  { name: 'Adobe InDesign',                         file: 'Adobe InDesign.png',                          company: 'Adobe' },
  { name: 'Adobe Photoshop',                        file: 'Adobe Photoshop.png',                         company: 'Adobe' },
  { name: 'Adobe Premiere Pro',                     file: 'Adobe Premiere Pro.png',                      company: 'Adobe' },
  { name: 'App Development with Swift Associate',   file: 'App Development with Swift Associate.png',    company: 'Apple' },
  { name: 'App Development with Swift Certified',   file: 'App Development with Swift Certified User.png', company: 'Apple' },
  { name: 'Autodesk 3ds Max',                       file: 'Autodesk 3ds Max.png',                        company: 'Autodesk' },
  { name: 'Autodesk AutoCAD',                       file: 'Autodesk AutoCAD.png',                        company: 'Autodesk' },
  { name: 'Autodesk Fusion 360',                    file: 'Autodesk Fusion360.png',                      company: 'Autodesk' },
  { name: 'Autodesk Inventor',                      file: 'Autodesk Inventor.png',                       company: 'Autodesk' },
  { name: 'Autodesk Maya',                          file: 'Autodesk Maya.png',                           company: 'Autodesk' },
  { name: 'Autodesk Revit',                         file: 'Autodesk Revit.png',                          company: 'Autodesk' },
  { name: 'Cisco Cybersecurity',                    file: 'Cisco Cybersecurity.png',                     company: 'Cisco' },
  { name: 'Cisco Networking',                       file: 'Cisco Networking.png',                        company: 'Cisco' },
  { name: 'CSB English for IT',                     file: 'CSB English for IT.png',                      company: 'Communication Skills for Business' },
  { name: 'CSB Professional Communication',         file: 'CSB Professional Communication.png',          company: 'Communication Skills for Business' },
  { name: 'IC3 Digital Literacy',                   file: 'IC3 Digital Literacy.png',                    company: 'IC3' },
  { name: 'Intuit QuickBooks Certified User',       file: 'Intuit QuickBooks Certified User.png',        company: 'Intuit' },
  { name: 'ITS Certificate',                        file: 'ITS Certificate.png',                         company: 'Information Technology Specialist' },
  { name: 'Microsoft Certified Educator',           file: 'MCE.png',                                     company: 'Microsoft Certified Educator' },
  { name: 'Microsoft Certified Fundamentals',       file: 'MCF Certificate.png',                         company: 'Microsoft Certified Fundamentals' },
  { name: 'Meta Digital Marketing Associate',       file: 'Meta.png',                                    company: 'Meta' },
  { name: 'MOS Access Expert',                      file: 'MOS Access Expert.png',                       company: 'Microsoft Office Specialist' },
  { name: 'MOS Excel Associate',                    file: 'MOS Excel Associate.png',                     company: 'Microsoft Office Specialist' },
  { name: 'MOS Excel Expert',                       file: 'MOS Excel Expert.png',                        company: 'Microsoft Office Specialist' },
  { name: 'MOS Outlook Associate',                  file: 'MOS Outlook Associate.png',                   company: 'Microsoft Office Specialist' },
  { name: 'MOS PowerPoint Associate',               file: 'MOS PowerPoint Associate.png',                company: 'Microsoft Office Specialist' },
  { name: 'MOS Word Associate',                     file: 'MOS Word Associate.png',                      company: 'Microsoft Office Specialist' },
  { name: 'MOS Word Expert',                        file: 'MOS Word Expert.png',                         company: 'Microsoft Office Specialist' },
  { name: 'PMI Project Management Ready',           file: 'PMI.png',                                     company: 'PMI' },
  { name: 'Unity Artist',                           file: 'Unity Artist.png',                            company: 'Unity' },
  { name: 'Unity Programmer',                       file: 'Unity Programmer.png',                        company: 'Unity' },
  { name: 'Unity VR Developer',                     file: 'Unity VR.png',                                company: 'Unity' },
];

const COMPANY_COLORS: Record<string, string> = {
  'Adobe': '#FF0000',
  'Apple': '#555555',
  'Autodesk': '#0696D7',
  'Cisco': '#049FD9',
  'Communication Skills for Business': '#f97316',
  'IC3': '#003087',
  'Intuit': '#2CA01C',
  'Information Technology Specialist': '#f97316',
  'Microsoft Certified Educator': '#0078D4',
  'Microsoft Certified Fundamentals': '#00A4EF',
  'Meta': '#0668E1',
  'Microsoft Office Specialist': '#D83B01',
  'PMI': '#FF6B00',
  'Unity': '#222222',
};

function CertificateShowcase({ onEnroll }: { onEnroll: (cert: string, company: string) => void }) {
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState('All');

  const companies = ['All', ...Array.from(new Set(ALL_CERTIFICATES.map(c => c.company)))];
  const filtered = filter === 'All' ? ALL_CERTIFICATES : ALL_CERTIFICATES.filter(c => c.company === filter);
  const current = filtered[selected] ?? filtered[0];

  return (
    <section className="py-20 sm:py-28 bg-[#f8f9fb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-orange-100 text-orange-600 border border-orange-200">
             Real Certificates
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
            Sample{' '}
            <span style={{ color: '#f97316' }}>Certificates</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            These are the actual certificates you'll earn - issued directly by global companies.
          </p>
        </motion.div>

        {/* Company filter pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {['All', 'Adobe', 'Apple', 'Autodesk', 'Cisco', 'Intuit', 'Meta', 'Microsoft Office Specialist', 'Microsoft Certified Fundamentals', 'PMI', 'Unity'].map((co) => (
            <button
              key={co}
              onClick={() => { setFilter(co); setSelected(0); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                filter === co
                  ? 'text-white border-transparent shadow-lg'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
              }`}
              style={filter === co ? {
                background: `linear-gradient(135deg, #f97316, #ea580c)`,
              } : {}}
            >
              {co}
            </button>
          ))}
        </div>

        {/* Main layout: big preview + thumbnail grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left - Big certificate preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sticky top-24"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.file}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Glow behind image */}
                <div
                  className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
                  style={{ background: COMPANY_COLORS[current.company] ?? '#f97316' }}
                />

                {/* Certificate image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src={`/certificates/${current.file}`}
                    alt={current.name}
                    className="w-full h-auto object-contain bg-white"
                  />
                  {/* SAMPLE watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span
                      className="text-5xl sm:text-7xl font-black opacity-[0.07] rotate-[-25deg] select-none text-gray-900 tracking-widest"
                    >
                      SAMPLE
                    </span>
                  </div>
                </div>

                {/* Info bar below image */}
                <div className="mt-4 flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-md border border-gray-100">
                  <div>
                    <p className="font-black text-gray-900 text-sm">{current.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Issued by <span className="font-semibold text-gray-600">{current.company}</span></p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEnroll(current.name, current.company)}
                    className="px-5 py-2.5 rounded-xl font-bold text-white text-xs flex items-center gap-2 flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                  >
                     Earn This
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right - Thumbnail grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#f97316 #f1f1f1' }}
          >
            {filtered.map((cert, i) => (
              <motion.div
                key={cert.file}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(i)}
                className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                  filtered[selected]?.file === cert.file
                    ? 'border-orange-500 shadow-lg shadow-orange-200'
                    : 'border-transparent hover:border-orange-300'
                }`}
              >
                <img
                  src={`/certificates/${cert.file}`}
                  alt={cert.name}
                  className="w-full h-28 object-cover bg-white group-hover:scale-105 transition-transform duration-300"
                />
                {/* Active overlay */}
                {filtered[selected]?.file === cert.file && (
                  <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                )}
                {/* Name tooltip on hover */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2">{cert.name}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">
            <span className="font-bold text-gray-800">{ALL_CERTIFICATES.length} certificates</span> available across 16+ global companies
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(249,115,22,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onEnroll('', '')}
            className="px-10 py-4 rounded-2xl font-black text-white text-base"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
             Start Earning Your Certificate Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Gain Your Certificate Section ───────────────────────────── */
function GainCertSection({ onEnroll }: { onEnroll: (cert: string, company: string) => void }) {
  const steps = [
    {
      id: '01',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
          <circle cx="24" cy="24" r="20" fill="rgba(249,115,22,0.15)" />
          <path d="M16 24h16M24 16v16" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="12" y="12" width="24" height="24" rx="4" stroke="#f97316" strokeWidth="2" />
        </svg>
      ),
      title: 'Direct Enroll',
      subtitle: 'Pick your certification',
      desc: 'Choose from 50+ globally recognized certifications across Adobe, Microsoft, Cisco, Meta & more. One click to enroll.',
      color: '#f97316',
      glow: 'rgba(249,115,22,0.3)',
      badge: 'Step 1',
    },
    {
      id: '02',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
          <circle cx="24" cy="24" r="20" fill="rgba(99,102,241,0.15)" />
          <path d="M14 28l6 6 14-16" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 10v4M34 14l-3 3M38 24h-4M34 34l-3-3M24 38v-4M14 34l3-3M10 24h4M14 14l3 3" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      title: 'Give the Exam',
      subtitle: 'Test your knowledge',
      desc: 'Appear for the official proctored exam online at your chosen date & time. Expert-guided prep included.',
      color: '#6366f1',
      glow: 'rgba(99,102,241,0.3)',
      badge: 'Step 2',
    },
    {
      id: '03',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
          <circle cx="24" cy="24" r="20" fill="rgba(16,185,129,0.15)" />
          <path d="M24 14l2.5 7.5H34l-6.5 4.5 2.5 7.5L24 29l-6 4.5 2.5-7.5L14 21.5h7.5L24 14z" fill="#10b981" stroke="#10b981" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Grab Certificate',
      subtitle: 'Earn your credential',
      desc: 'Receive your industry-recognized digital certificate instantly. Add it to LinkedIn, resume & portfolio.',
      color: '#10b981',
      glow: 'rgba(16,185,129,0.3)',
      badge: 'Step 3',
    },
  ];

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #fffaf3 0%, #ffedd5 52%, #fff7ed 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 16% 12%, rgba(249,115,22,0.18), transparent 36%), radial-gradient(ellipse at 86% 18%, rgba(251,146,60,0.16), transparent 34%), radial-gradient(ellipse at 50% 88%, rgba(255,255,255,0.7), transparent 42%)',
        }}
      />

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: 'linear-gradient(rgba(249,115,22,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.12) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }} />

      {/* Cream-orange wash */}
      <motion.div
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(120deg, transparent 8%, rgba(255,255,255,0.55) 24%, transparent 44%, rgba(251,146,60,0.18) 62%, transparent 78%, rgba(255,247,237,0.55) 92%, transparent 100%)',
          backgroundSize: '220% 220%',
        }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.36, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background:
            'linear-gradient(0deg, rgba(255,255,255,0.72), transparent 72%), linear-gradient(90deg, rgba(249,115,22,0.14), rgba(255,255,255,0.24), rgba(251,146,60,0.14))',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.4)', color: '#f97316' }}
          >
             Your Path to Success
          </motion.span>

          <h2 className="text-3xl sm:text-5xl font-black text-gray-950 leading-tight mb-4">
            Gain Your{' '}
            <span
              className="relative inline-block"
              style={{ color: '#f97316', textShadow: '0 12px 30px rgba(249,115,22,0.22)' }}
            >
              Certificate
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] rounded-full w-full"
                style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              />
            </span>
          </h2>
          <p className="text-orange-950/60 text-base sm:text-lg max-w-xl mx-auto">
            Three simple steps. One powerful credential. Unlimited career opportunities.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line - desktop */}
          <div className="hidden lg:block absolute top-[72px] left-[calc(16.66%+40px)] right-[calc(16.66%+40px)] h-px"
            style={{ background: 'linear-gradient(90deg, #f97316, #6366f1, #10b981)' }}>
            <motion.div
              className="absolute inset-0 h-full"
              style={{ background: 'linear-gradient(90deg, #f97316, #6366f1, #10b981)', filter: 'blur(4px)' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative group"
              >
                {/* Card */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-2xl p-6 sm:p-8 overflow-hidden cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.86)',
                    border: `1px solid rgba(251,146,60,0.28)`,
                    boxShadow: '0 22px 55px rgba(154,52,18,0.12)',
                    backdropFilter: 'blur(14px)',
                  }}
                >
                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 40px ${step.glow}`, border: `1px solid ${step.color}40` }}
                  />

                  {/* Step badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full"
                      style={{ background: `${step.color}20`, color: step.color, border: `1px solid ${step.color}40` }}
                    >
                      {step.badge}
                    </span>
                    <span className="text-4xl font-black text-orange-900/10">{step.id}</span>
                  </div>

                  {/* Icon circle */}
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: `${step.color}15`,
                      border: `1.5px solid ${step.color}40`,
                      boxShadow: `0 0 20px ${step.glow}`,
                    }}
                  >
                    {step.icon}
                  </motion.div>

                  {/* Text */}
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: step.color }}>
                    {step.subtitle}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-950 mb-3">{step.title}</h3>
                  <p className="text-orange-950/60 text-sm leading-relaxed">{step.desc}</p>

                  {/* Bottom accent bar */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[3px] rounded-b-2xl"
                    initial={{ width: '0%' }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.8 }}
                    style={{ background: `linear-gradient(90deg, ${step.color}, ${step.color}44)` }}
                  />
                </motion.div>

                {/* Arrow between cards - mobile */}
                {i < steps.length - 1 && (
                  <div className="flex justify-center my-2 sm:hidden">
                    <motion.div
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="text-orange-500/50 text-2xl"
                    >
                      ↓
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { val: '50+', label: 'Certifications', icon: '' },
            { val: '16+', label: 'Global Partners', icon: '' },
            { val: '10K+', label: 'Students Certified', icon: '' },
            { val: '100%', label: 'Trusted & Verified', icon: '' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl px-5 py-4 text-center"
              style={{
                background: 'rgba(255,255,255,0.78)',
                border: '1px solid rgba(251,146,60,0.24)',
                boxShadow: '0 16px 35px rgba(154,52,18,0.1)',
              }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-gray-950">{stat.val}</div>
              <div className="text-xs text-orange-950/55 font-medium mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */
export default function CertificationsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCert, setModalCert] = useState({ certName: '', companyName: '' });

  const openModal = (certName: string, companyName: string) => {
    setModalCert({ certName, companyName });
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Global enrollment modal */}
      <CertificationEnrollModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        certificationName={modalCert.certName}
        companyName={modalCert.companyName}
      />

      {/* ── Partner Explorer ── */}
      <PartnerExplorer onEarnCertificate={openModal} />

      {/* ── Gain Your Certificate Journey ── */}
      <GainCertSection onEnroll={openModal} />

      {/* ── Sample Certificates Showcase ── */}
      <CertificateShowcase onEnroll={openModal} />

      {/* ── Partners ── */}
      <section
        id="partners"
        className="py-16 sm:py-20"
        style={{ background: 'linear-gradient(135deg, #11121f 0%, #211612 58%, #f97316 180%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">16+ Global Partners</span>
            <h2 className="text-2xl sm:text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
              Our Global <span style={{ color: '#f97316' }}>Certification Partners</span>
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">Learn. Get Certified. Get Ahead.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {certificationPartners.map((partner, i) => (
              <PartnerCard key={partner.name} partner={partner} i={i} />
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
