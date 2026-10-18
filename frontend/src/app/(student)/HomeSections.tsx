'use client';

import dynamic from 'next/dynamic';

// Above-the-fold: server-rendered so the hero is present in the initial HTML.
// (All localStorage access lives inside useEffect/useCallback, so SSR is safe.)
// Rendering these on the server removes the single biggest layout shift that
// happened when the hero popped in after client hydration.
import HeroSection from '@/components/HeroSection';
import MarqueeBanner from '@/components/MarqueeBanner';

// Mascot is decorative and position:fixed (never affects page layout),
// so it stays client-only to keep it out of the critical render path.
const Mascot = dynamic(() => import('@/components/Mascot'), { ssr: false });

// Reusable placeholder that reserves vertical space while a lazy section loads,
// preventing cumulative layout shift (CLS) as each chunk hydrates in.
const sectionFallback = (minHeight: number) =>
  function SectionFallback() {
    return <div aria-hidden="true" style={{ minHeight }} />;
  };

// Below-the-fold: lazy-loaded, but each reserves an approximate height so the
// page does not jump as sections stream in.
const CommunityShowcaseSection    = dynamic(() => import('@/components/CommunityShowcaseSection'),    { loading: sectionFallback(520) });
const HowItWorksSection           = dynamic(() => import('@/components/HowItWorksSection'),           { loading: sectionFallback(640) });
const AddOnsSection               = dynamic(() => import('@/components/AddOnsSection'),               { loading: sectionFallback(560) });
const TestimonialsSection         = dynamic(() => import('@/components/TestimonialsSection'),         { loading: sectionFallback(760) });
const CertificationsSection       = dynamic(() => import('@/components/CertificationsSection'),       { loading: sectionFallback(640) });
const CertificateShowcaseSection  = dynamic(() => import('@/components/CertificateShowcaseSection'),  { loading: sectionFallback(680) });
const GlobalCertificationPartners = dynamic(() => import('@/components/GlobalCertificationPartners'), { loading: sectionFallback(480) });

export default function HomeSections() {
  return (
    <>
      <div className="flex flex-col">
        <HeroSection />
        <MarqueeBanner variant="dark" speed={28} />
        <CommunityShowcaseSection />
        <HowItWorksSection />
        <AddOnsSection />
        <MarqueeBanner variant="orange" speed={32} />
        <TestimonialsSection />
        <CertificationsSection />
        <MarqueeBanner variant="glass" speed={26} />
        <CertificateShowcaseSection />
        <GlobalCertificationPartners />
      </div>
      <Mascot />
    </>
  );
}
