'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Award, Clock, Users, CheckCircle, Star } from 'lucide-react';
import CertificationEnrollModal from '@/components/CertificationEnrollModal';

// Certification data - same as in navbar
const certificationCompanies = [
  {
    id: 1,
    name: 'Adobe',
    logo: '/logos/adobe.webp',
    certifications: [
      'Adobe Certified Professional - Photoshop',
      'Adobe Certified Professional - Illustrator',
      'Adobe Certified Professional - InDesign',
      'Adobe Certified Professional - After Effects',
      'Adobe Certified Professional - Premiere Pro',
      'Adobe Certified Professional - Animate',
      'Adobe Certified Professional - Dreamweaver'
    ]
  },
  {
    id: 2,
    name: 'Apple',
    logo: '/logos/apple.png',
    certifications: [
      'App Development with Swift - Certified User',
      'App Development with Swift - Associate'
    ]
  },
  {
    id: 3,
    name: 'Autodesk',
    logo: '/logos/Autodesklogo.png',
    certifications: [
      'Autodesk Certified User - AutoCAD',
      'Autodesk Certified User - Fusion 360',
      'Autodesk Certified User - Inventor',
      'Autodesk Certified User - Revit Architecture',
      'Autodesk Certified User - 3ds Max',
      'Autodesk Certified User - Maya',
      'Autodesk Certified User - Tinkercad 3D Design'
    ]
  },
  {
    id: 4,
    name: 'Cisco',
    logo: '/logos/cisco.png',
    certifications: [
      'Cisco Certified Support Technician - Networking',
      'Cisco Certified Support Technician - Cybersecurity'
    ]
  },
  {
    id: 5,
    name: 'Communication Skills for Business',
    logo: '/logos/communicationskillsforbusinesslogo.png',
    certifications: [
      'CSB - Professional Communication',
      'CSB - English for IT'
    ]
  },
  {
    id: 6,
    name: 'ESB',
    logo: '/logos/project-management-institutelol.svg',
    certifications: [
      'ESB v.2'
    ]
  },
  {
    id: 7,
    name: 'IC3 Digital Literacy',
    logo: '/logos/IC3logo.png',
    certifications: [
      'IC3 Digital Literacy - Global Standard 6',
      'IC3 Digital Literacy - Global Standard 5',
      'IC3 - Spark',
      'IC3 - Fast Track',
      'PHP Developer Fundamentals'
    ]
  },
  {
    id: 8,
    name: 'Information Technology Specialist',
    logo: '/logos/informationtechnologyspecialist.png',
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
      'Software Development'
    ]
  },
  {
    id: 9,
    name: 'Intuit',
    logo: '/logos/intuit.png',
    certifications: [
      'Intuit - QuickBooks Certified User Online',
      'Intuit - Design for Delight Innovator',
      'Intuit - Certified Bookkeeping Professional'
    ]
  },
  {
    id: 10,
    name: 'Microsoft Certified Fundamentals',
    logo: '/logos/microsoftcertifiedfundamentalslogo.png',
    certifications: [
      'Microsoft Azure Fundamentals (AZ-900)',
      'Microsoft 365 Fundamentals (MS-900)',
      'Microsoft Azure AI Fundamentals (AI-900)',
      'Microsoft Azure Data Fundamentals (DP-900)',
      'Microsoft Power Platform Fundamentals (PL-900)',
      'Microsoft Dynamics 365 Fundamentals CRM (MB-910)',
      'Microsoft Dynamics 365 Fundamentals ERP (MB-920)',
      'Microsoft Security, Compliance, and Identity Fundamentals (SC-900)'
    ]
  },
  {
    id: 11,
    name: 'Microsoft Office Specialist',
    logo: '/logos/microsoft-office-specialist-microsoft-officelogo.png',
    certifications: [
      'MOS - Word',
      'MOS - Excel',
      'MOS - PowerPoint',
      'MOS - Word Expert',
      'MOS - Excel Expert'
    ]
  },
  {
    id: 12,
    name: 'Microsoft Certified Educator',
    logo: '/logos/MicrosoftCertifiedEducator_Logo.jpg',
    certifications: [
      'Technology Literacy for Educators (62-193)'
    ]
  },
  {
    id: 13,
    name: 'PMI Project Management Institute',
    logo: '/logos/project-management-institutelol.svg',
    certifications: [
      'PMI - Project Management Ready'
    ]
  },
  {
    id: 14,
    name: 'Unity',
    logo: '/logos/unity.png',
    certifications: [
      'Unity Certified User: Programmer',
      'Unity Certified User: VR Developer',
      'Unity Certified User: Artist'
    ]
  },
  {
    id: 15,
    name: 'Meta',
    logo: '/logos/newmetalogo.png',
    certifications: [
      'Meta Certified: Digital Marketing Associate'
    ]
  },
  {
    id: 16,
    name: 'Critical Career Skills',
    logo: '/logos/ccs.png',
    certifications: [
      'CCS Generative AI Foundations'
    ]
  }
];

// Function to generate dynamic content based on certification
const generateCertificationContent = (certification: string, companyName: string) => {
  const isAdobe = companyName === 'Adobe';
  const isMicrosoft = companyName.includes('Microsoft');
  const isUnity = companyName === 'Unity';
  const isMeta = companyName === 'Meta';
  const isApple = companyName === 'Apple';
  
  let acronym = '';
  let description = '';
  let pathwayText = '';
  
  if (isAdobe) {
    acronym = '(ACP)';
    description = `${certification} is the industry-recognized certification that demonstrates mastery of Adobe Creative Cloud software and must-have knowledge for digital media careers. Each exam is integrated with an Adobe application and designed by experts, allowing for an authentic assessment of job-ready skills.`;
    pathwayText = `Adyapan provides a full pathway solution that students can use to prepare for the ${certification}. From tailored learning materials and practice tests to Adobe endorsed certification exams, Adyapan provides assistance every step of the way.`;
  } else if (isMicrosoft) {
    acronym = companyName.includes('Fundamentals') ? '(MF)' : companyName.includes('Office') ? '(MOS)' : '(MCE)';
    description = `${certification} is the industry-recognized certification that validates your skills and knowledge in Microsoft technologies. This certification demonstrates your expertise and commitment to staying current with Microsoft's latest tools and platforms.`;
    pathwayText = `Adyapan provides comprehensive training and preparation for the ${certification}. Our expert instructors and hands-on approach ensure you're fully prepared for the Microsoft certification exam.`;
  } else if (isUnity) {
    acronym = '(UCU)';
    description = `${certification} is the industry-standard certification for Unity developers and creators. This certification validates your ability to create interactive experiences and demonstrates your proficiency with Unity's powerful development platform.`;
    pathwayText = `Adyapan offers specialized Unity training programs to prepare you for the ${certification}. Learn from industry experts and work on real projects to build your Unity skills.`;
  } else if (isMeta) {
    acronym = '(MDA)';
    description = `${certification} is the official certification from Meta that validates your digital marketing expertise. This certification demonstrates your ability to create effective marketing campaigns across Meta's family of platforms.`;
    pathwayText = `Adyapan provides comprehensive digital marketing training to prepare you for the ${certification}. Master the latest marketing strategies and tools used by industry professionals.`;
  } else if (isApple) {
    acronym = '(Swift)';
    description = `${certification} validates your skills in Swift programming and iOS app development. This certification demonstrates your ability to create innovative mobile applications using Apple's development tools and frameworks.`;
    pathwayText = `Adyapan offers comprehensive iOS development training to prepare you for the ${certification}. Learn Swift programming and iOS development from experienced instructors.`;
  } else {
    acronym = '';
    description = `${certification} is an industry-recognized certification that validates your professional skills and expertise. This certification demonstrates your commitment to excellence and helps advance your career in your chosen field.`;
    pathwayText = `Adyapan provides comprehensive training and preparation for the ${certification}. Our expert instructors and practical approach ensure you're fully prepared for success.`;
  }
  
  return { acronym, description, pathwayText };
};

// Maps certification name to the actual image filename in /public/certificates/
function getCertificateImage(certName: string, companyName: string): string {
  const n = certName.toLowerCase();
  const c = companyName.toLowerCase();

  // Adobe
  if (c.includes('adobe')) {
    if (n.includes('photoshop'))    return 'Adobe Photoshop.png';
    if (n.includes('illustrator'))  return 'Adobe Illustrator.png';
    if (n.includes('indesign'))     return 'Adobe InDesign.png';
    if (n.includes('after effects'))return 'Adobe After Effects.png';
    if (n.includes('premiere'))     return 'Adobe Premiere Pro.png';
    if (n.includes('animate'))      return 'Adobe Animate.png';
    if (n.includes('dreamweaver'))  return 'Adobe Dreamweaver.png';
    if (n.includes('acrobat'))      return 'Adobe Acrobat Pro.png';
    if (n.includes('express'))      return 'Adobe Express.png';
    return 'Adobe Photoshop.png';
  }
  // Apple
  if (c.includes('apple')) {
    if (n.includes('associate'))    return 'App Development with Swift Associate.png';
    return 'App Development with Swift Certified User.png';
  }
  // Autodesk
  if (c.includes('autodesk')) {
    if (n.includes('autocad'))      return 'Autodesk AutoCAD.png';
    if (n.includes('fusion'))       return 'Autodesk Fusion360.png';
    if (n.includes('inventor'))     return 'Autodesk Inventor.png';
    if (n.includes('revit'))        return 'Autodesk Revit.png';
    if (n.includes('3ds'))          return 'Autodesk 3ds Max.png';
    if (n.includes('maya'))         return 'Autodesk Maya.png';
    return 'Autodesk AutoCAD.png';
  }
  // Cisco
  if (c.includes('cisco')) {
    if (n.includes('cyber'))        return 'Cisco Cybersecurity.png';
    return 'Cisco Networking.png';
  }
  // Communication Skills
  if (c.includes('communication')) {
    if (n.includes('english'))      return 'CSB English for IT.png';
    return 'CSB Professional Communication.png';
  }
  // IC3
  if (c.includes('ic3'))            return 'IC3 Digital Literacy.png';
  // Intuit
  if (c.includes('intuit'))         return 'Intuit QuickBooks Certified User.png';
  // ITS
  if (c.includes('information technology specialist') || c.includes('its'))
                                    return 'ITS Certificate.png';
  // Microsoft Certified Educator
  if (c.includes('educator'))       return 'MCE.png';
  // Microsoft Certified Fundamentals
  if (c.includes('fundamentals'))   return 'MCF Certificate.png';
  // Meta
  if (c.includes('meta'))           return 'Meta.png';
  // MOS
  if (c.includes('office specialist') || c.includes('mos')) {
    if (n.includes('word expert'))  return 'MOS Word Expert.png';
    if (n.includes('word'))         return 'MOS Word Associate.png';
    if (n.includes('excel expert')) return 'MOS Excel Expert.png';
    if (n.includes('excel'))        return 'MOS Excel Associate.png';
    if (n.includes('powerpoint'))   return 'MOS PowerPoint Associate.png';
    if (n.includes('outlook'))      return 'MOS Outlook Associate.png';
    if (n.includes('access'))       return 'MOS Access Expert.png';
    return 'MOS Excel Associate.png';
  }
  // PMI
  if (c.includes('pmi'))            return 'PMI.png';
  // Unity
  if (c.includes('unity')) {
    if (n.includes('vr'))           return 'Unity VR.png';
    if (n.includes('artist'))       return 'Unity Artist.png';
    return 'Unity Programmer.png';
  }
  // ESB / CCS / default
  return 'MCF Certificate.png';
}

// Maps certification name to the matching syllabus PDF in /public/certification-brochures/
function getSyllabusPdf(certName: string, companyName: string): string | null {
  const n = certName.toLowerCase();
  const c = companyName.toLowerCase();

  if (c.includes('adobe')) {
    if (n.includes('photoshop'))     return 'Adobe Photoshop.pdf';
    if (n.includes('illustrator'))   return 'Adobe Illustrator.pdf';
    if (n.includes('indesign'))      return 'Adobe InDesign.pdf';
    if (n.includes('after effects')) return 'Adobe After Effects.pdf';
    if (n.includes('premiere'))      return 'Adobe Premiere Pro.pdf';
    if (n.includes('animate'))       return 'Adobe Animate.pdf';
    if (n.includes('dreamweaver'))   return 'Adobe Dreamweaver.pdf';
    if (n.includes('acrobat'))       return 'Adobe Acrobat Pro.pdf';
    if (n.includes('express'))       return 'Adobe Express.pdf';
    return null;
  }

  if (c.includes('apple')) {
    if (n.includes('associate')) return 'App Development with Swift Associate.pdf';
    return 'App Development with Swift Certified User.pdf';
  }

  if (c.includes('autodesk')) {
    if (n.includes('autocad'))  return 'Autodesk AutoCAD.pdf';
    if (n.includes('fusion'))   return 'Autodesk Fusion360.pdf';
    if (n.includes('inventor')) return 'Autodesk Inventor.pdf';
    if (n.includes('revit'))    return 'Autodesk Revit.pdf';
    if (n.includes('3ds'))      return 'Autodesk 3ds Max.pdf';
    if (n.includes('maya'))     return 'Autodesk Maya.pdf';
    return null;
  }

  if (c.includes('cisco')) {
    if (n.includes('cyber')) return 'Cisco Cybersecurity.pdf';
    return 'Cisco Networking.pdf';
  }

  if (c.includes('communication')) {
    if (n.includes('english')) return 'CSB English for IT.pdf';
    return 'CSB Professional Communication.pdf';
  }

  if (c.includes('ic3')) return 'IC3 Digital Literacy.pdf';

  if (c.includes('intuit') && n.includes('quickbooks')) {
    return 'Intuit Quickbooks Certified User.pdf';
  }

  if (c.includes('information technology specialist') || c.includes('its')) {
    if (n.includes('artificial intelligence')) return 'ITS AI.pdf';
    if (n.includes('cloud computing'))         return 'ITS Cloud Computing.pdf';
    if (n.includes('computational thinking'))  return 'ITS Computational Thinking.pdf';
    if (n.includes('cybersecurity'))           return 'ITS Cybersecurity.pdf';
    if (n.includes('data analytics'))          return 'ITS Data Analytics.pdf';
    if (n.includes('databases'))               return 'ITS Databases.pdf';
    if (n.includes('device'))                  return 'ITS Devices.pdf';
    if (n.includes('html5'))                   return 'ITS HTML App Development.pdf';
    if (n.includes('html and css'))            return 'ITS HTML and CSS.pdf';
    if (n === 'java')                          return 'ITS Java.pdf';
    if (n.includes('javascript'))              return 'ITS Javascript.pdf';
    if (n.includes('network security'))        return 'ITS Network Security.pdf';
    if (n.includes('networking'))              return 'ITS Networking.pdf';
    if (n.includes('python'))                  return 'ITS Python.pdf';
    if (n.includes('software development'))    return 'ITS Software Development.pdf';
    return null;
  }

  if (c.includes('educator')) return 'MCE.pdf';

  if (c.includes('fundamentals')) {
    if (n.includes('365'))            return 'MCF 365 Fundamentals.pdf';
    if (n.includes('azure ai'))       return 'MCF Azure AI.pdf';
    if (n.includes('azure data'))     return 'MCF Azure Data.pdf';
    if (n.includes('azure'))          return 'MCF Azure.pdf';
    if (n.includes('mb-910'))         return 'MCF Dynamic 365 MB-910 Fundamentals.pdf';
    if (n.includes('mb-920'))         return 'MCF Dynamic 365 MB-920 Fundamentals.pdf';
    if (n.includes('power platform')) return 'MCF Power Platform Fundamentals.pdf';
    if (n.includes('security'))       return 'MCF Security Fundamentals.pdf';
    return null;
  }

  if (c.includes('office specialist') || c.includes('mos')) {
    if (n.includes('word expert'))  return 'MOS Word Expert.pdf';
    if (n.includes('word'))         return 'MOS Word Associate.pdf';
    if (n.includes('excel expert')) return 'MOS Excel Expert.pdf';
    if (n.includes('excel'))        return 'MOS Excel Associate.pdf';
    if (n.includes('powerpoint'))   return 'MOS Powerpoint Associate.pdf';
    if (n.includes('outlook'))      return 'MOS Outlook Associate.pdf';
    if (n.includes('access'))       return 'MOS Access Expert.pdf';
    return null;
  }

  if (c.includes('pmi')) return 'PMI.pdf';

  if (c.includes('unity')) {
    if (n.includes('vr'))     return 'Unity VR Developer.pdf';
    if (n.includes('artist')) return 'Unity Artist .pdf';
    return 'Unity Programmer.pdf';
  }

  if (c.includes('meta')) return 'Meta.pdf';

  return null;
}

export default function CertificationPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [modalOpen, setModalOpen] = useState(false);
  const [certificateImageFailed, setCertificateImageFailed] = useState(false);
  
  // Find the certification and company based on slug
  const findCertificationBySlug = (slug: string) => {
    // Normalize the incoming slug the same way we generate slugs from cert names
    const normalizedSlug = slug.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    for (const company of certificationCompanies) {
      for (const cert of company.certifications) {
        const certSlug = cert.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        if (certSlug === normalizedSlug) {
          return { certification: cert, company };
        }
      }
    }
    return null;
  };

  const result = findCertificationBySlug(slug);
  
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Certification Not Found</h1>
          <Link href="/" className="text-orange-600 hover:text-orange-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const { certification, company } = result;
  const { acronym, description, pathwayText } = generateCertificationContent(certification, company.name);
  const syllabusPdf = getSyllabusPdf(certification, company.name);
  const syllabusHref = syllabusPdf ? `/certification-brochures/${encodeURIComponent(syllabusPdf)}` : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Enrollment Modal */}
      <CertificationEnrollModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        certificationName={certification}
        companyName={company.name}
      />
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>&gt; </span>
            <span className="hover:text-orange-600 cursor-pointer transition-colors">Certifications</span>
            <span>&gt; </span>
            <span className="text-gray-800 font-medium">{certification}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                {certification} {acronym}
              </h1>
              
              {/* Rating */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">4.8 (2,450 reviews)</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  Industry Recognized
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {description}
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                {pathwayText}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalOpen(true)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Earn Certificate
              </motion.button>
              {syllabusHref ? (
                <motion.a
                  href={syllabusHref}
                  download={syllabusPdf || undefined}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-white border-2 border-orange-300 text-orange-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-orange-500 hover:text-orange-800 hover:bg-orange-50 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Syllabus â†"</span>
                </motion.a>
              ) : (
                <motion.button
                  type="button"
                  disabled
                  className="flex-1 bg-white border-2 border-gray-200 text-gray-400 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  <span>Syllabus Coming Soon</span>
                </motion.button>
              )}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-8 shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-orange-500" />
                <span>What You'll Get</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  'Industry-recognized certification',
                  'Hands-on practical training',
                  'Expert instructor guidance',
                  'Practice tests and assessments',
                  'Career support and placement assistance',
                  'Student support and certification guidance'
                ].map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-100 mb-8 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-orange-500" />
                <span>Course Information</span>
              </h3>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <Clock className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="font-semibold text-gray-900">Duration</div>
                    <div className="text-sm text-gray-600">2-3 Months</div>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <Users className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="font-semibold text-gray-900">Students Enrolled</div>
                    <div className="text-sm text-gray-600">2,450+ Students</div>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <Award className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="font-semibold text-gray-900">Certification</div>
                    <div className="text-sm text-gray-600">Industry Recognized</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Sample Certificate */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                <span>Sample Certificate</span>
              </h3>

              {/* Real certificate image */}
              <div className="relative rounded-xl overflow-hidden border-2 border-orange-100 shadow-lg mb-5">
                {certificateImageFailed ? (
                  <div className="flex flex-col items-center justify-center bg-white py-16 text-gray-400">
                    <Award className="mb-3 h-12 w-12 opacity-40" />
                    <p className="text-sm font-medium">Certificate preview</p>
                    <p className="mt-1 text-xs">Issued by {company.name}</p>
                  </div>
                ) : (
                  <img
                    src={`/certificates/${getCertificateImage(certification, company.name)}`}
                    alt={`${certification} Sample Certificate`}
                    className="w-full h-auto object-contain bg-white"
                    onError={() => setCertificateImageFailed(true)}
                  />
                )}
                {/* SAMPLE watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-5xl font-black text-gray-400 opacity-[0.08] rotate-[-25deg] select-none tracking-widest">
                    SAMPLE
                  </span>
                </div>
              </div>
              {/* Certificate Info */}
              <div className="space-y-4 text-sm">
                <motion.div
                  className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span>Who provides the certificate?</span>
                  </div>
                  <div className="text-gray-700">Upon successful completion, you'll receive an industry-recognized certificate directly from <span className="font-semibold text-orange-700">{company.name}</span>, validating your expertise and skills.</div>
                </motion.div>


              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
