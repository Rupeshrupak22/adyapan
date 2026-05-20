import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { websiteSchema, organizationSchema, faqSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
// Above-the-fold: static imports (render immediately)
import HeroSection from '@/components/HeroSection';
import MarqueeBanner from '@/components/MarqueeBanner';
// Below-the-fold: dynamic imports (lazy-loaded after initial paint)
const CommunityShowcaseSection  = dynamic(() => import('@/components/CommunityShowcaseSection'));
const HowItWorksSection         = dynamic(() => import('@/components/HowItWorksSection'));
const AddOnsSection             = dynamic(() => import('@/components/AddOnsSection'));
const TestimonialsSection       = dynamic(() => import('@/components/TestimonialsSection'));
const CertificationsSection     = dynamic(() => import('@/components/CertificationsSection'));
const CertificateShowcaseSection = dynamic(() => import('@/components/CertificateShowcaseSection'));
const GlobalCertificationPartners = dynamic(() => import('@/components/GlobalCertificationPartners'));

// Homepage metadata is inherited from root layout - override with page-specific values
export const metadata: Metadata = {
  alternates: { canonical: BASE_URL },
  openGraph: {
    url: BASE_URL,
    type: 'website',
  },
};

export default function Home() {
  const homeFaq = faqSchema([
    {
      question: 'What is Adyapan?',
      answer:
        'Adyapan is an Indian EdTech platform offering 65+ industry-relevant courses with live classes, real internship experience, and guaranteed placement support.',
    },
    {
      question: 'How much do Adyapan courses cost?',
      answer: 'Most Adyapan courses are priced at Rs. 3,000 for the full program, making quality education accessible to all students.',
    },
    {
      question: 'Does Adyapan provide placement support?',
      answer:
        'Yes. Every Adyapan program includes dedicated placement support: resume building, mock interviews, and direct recruiter connections.',
    },
    {
      question: 'Are Adyapan classes live or recorded?',
      answer:
        'All sessions are live and interactive, conducted by industry experts. Recordings are available for revision after each class.',
    },
    {
      question: 'What certificate will I receive?',
      answer:
        'You will receive an industry-recognized certificate from Adyapan upon successful completion of your course and projects.',
    },
  ]);

  return (
    <>
      <JsonLd schema={websiteSchema()} />
      <JsonLd schema={organizationSchema()} />
      <JsonLd schema={homeFaq} />
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
    </>
  );
}
