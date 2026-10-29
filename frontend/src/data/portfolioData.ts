/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Adyapan Corporate Portfolio & Client Acquisition Platform — Verified Data Store
 * SR's Adyapan Edutech Pvt. Ltd.
 * ─────────────────────────────────────────────────────────────────────────────
 * Strict Rules:
 * - Only confirmed products, links, and leadership are published.
 * - Unverified third-party client stories (e.g. CodVedha) remain in draft state
 *   awaiting client authorization (isPublished: false).
 * - All products are strictly categorized (Public SaaS, Mobile App, Internal Tool).
 */

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  headline: string;
  category: 'SaaS & Automation' | 'Artificial Intelligence' | 'Education Technology' | 'CRM & Business Systems' | 'Talent & Recruitment' | 'Internal Operations';
  shortDescription: string;
  detailedDescription: string;
  features: string[];
  targetAudience: string;
  technologies: string[];
  status: 'public' | 'internal' | 'in_development' | 'private_demo';
  badgeText: string;
  url: string;
  liveUrlLabel: string;
  imagePath: string;
  isPublished: boolean;
  approvalStatus: 'approved' | 'pending_approval' | 'internal_only';
}

export interface MobileAppItem {
  id: string;
  name: string;
  platform: 'Android' | 'iOS' | 'Cross-Platform';
  packageId: string;
  storeUrl: string;
  iconPath: string;
  screenshots: string[];
  shortDescription: string;
  supportedUseCases: string[];
  developer: string;
  isPublished: boolean;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  customerProblem: string;
  proposedSolution: string;
  deliverables: string[];
  potentialBusinessValue: string;
  typicalWorkflow: string[];
  relevantExample: string;
  ctaText: string;
  inquiryQueryParam: string;
  iconName: string;
  isPublished: boolean;
}

export interface IndustrySolutionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  applicableProducts: string[];
  highlightMetric: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Education Technology' | 'Web Applications' | 'Mobile Applications' | 'CRM & Automation' | 'AI & Intelligence' | 'Cloud & DevOps';
  businessOverview: string;
  problemStatement: string;
  solution: string;
  featuresDelivered: string[];
  technologyStack: string[];
  screenshotPath: string;
  liveDemoUrl?: string;
  projectStatus: 'Production' | 'Active Enterprise Tool' | 'Under Development';
  isInternalProduct: boolean;
  clientAttributionStatus: 'Adyapan Product' | 'Private Draft / Pending Approval';
  isPublished: boolean;
}

export interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  industry: string;
  clientOverview: string;
  businessChallenge: string;
  projectObjectives: string[];
  solutionDelivered: string;
  implementationApproach: string[];
  confirmedTechStack: string[];
  screenshots: string[];
  verifiedResults: string[];
  isClientConfirmed: boolean;
  isPublished: boolean;
  ctaText: string;
}

export interface LeadershipMember {
  name: string;
  role: string;
  imagePath: string;
  bio: string;
  quote?: string;
  linkedInUrl?: string;
}

export interface ProcessStepItem {
  step: string;
  name: string;
  tagline: string;
  description: string;
  activities: string[];
  deliverable: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'Engagement' | 'Technical' | 'Delivery' | 'Support';
}

export interface TechCategory {
  category: string;
  items: Array<{
    name: string;
    description: string;
    tag: string;
  }>;
}

/* ═════════════════════════════════════════════════════════════════════════════
   1. PRODUCTS & PLATFORMS
   ═════════════════════════════════════════════════════════════════════════════ */
export const VERIFIED_PRODUCTS: ProductItem[] = [
  {
    id: 'adyapan-connect',
    slug: 'adyapan-connect',
    name: 'Adyapan Connect',
    headline: 'AI-Powered WhatsApp Business API, CRM & Automation Platform',
    category: 'SaaS & Automation',
    shortDescription: 'Enterprise conversational messaging engine enabling businesses to automate customer communications, support routing, multi-agent inboxes, and targeted broadcasts via the official WhatsApp Business Cloud API.',
    detailedDescription: 'Adyapan Connect bridges customer relationship management and high-deliverability conversational messaging. Designed for growing commercial businesses and educational institutions, it offers multi-agent team inboxes, automated drip campaigns, webhook-driven event triggers, and conversational chatbots built on secure Cloud API infrastructure.',
    features: [
      'Official WhatsApp Business Cloud API multi-tenant connection',
      'Unified multi-agent shared team inbox with role permissions',
      'Automated drip broadcasts with real-time delivery telemetry',
      'AI-powered conversation routing and keyword auto-responders',
      'Webhook integration with CRMs, payment gateways, and databases',
    ],
    targetAudience: 'Growing businesses, admissions teams, support desks, and marketing departments.',
    technologies: ['Next.js', 'React', 'Node.js', 'TypeScript', 'WhatsApp Cloud API', 'Tailwind CSS'],
    status: 'public',
    badgeText: 'Live SaaS Platform',
    url: 'https://connect.adyapan.com/',
    liveUrlLabel: 'Visit Adyapan Connect',
    imagePath: '/portfolio/adyapan-connect-og.png',
    isPublished: true,
    approvalStatus: 'approved',
  },
  {
    id: 'adyapan-ai',
    slug: 'adyapan-ai',
    name: 'Adyapan AI',
    headline: 'AI-Powered Learning, Aptitude & Career Intelligence Platform',
    category: 'Artificial Intelligence',
    shortDescription: 'Intelligent skill assessment and career guidance platform that evaluates student readiness, identifies skill gaps, and tailors structured learning pathways through conversational machine intelligence.',
    detailedDescription: 'Adyapan AI incorporates intelligent algorithmic assessment models to analyze individual problem-solving skills, quantitative aptitude, and core software concepts. It provides students with objective proficiency benchmarking and guided recommendations toward high-demand tech careers.',
    features: [
      'Interactive aptitude and technical reasoning assessment engines',
      'AI-assisted career pathway and skill roadmap recommendations',
      'Diagnostic skill-gap benchmarking with personalized remediation',
      'Resume concept analysis and interview readiness metrics',
      'Adaptive difficulty sequencing for personalized practice',
    ],
    targetAudience: 'Learners, higher education candidates, engineering graduates, and job seekers.',
    technologies: ['Next.js', 'React', 'TypeScript', 'OpenAI / LLM APIs', 'Tailwind CSS'],
    status: 'public',
    badgeText: 'Active AI Application',
    url: 'https://ai.adyapan.com/',
    liveUrlLabel: 'Explore Adyapan AI',
    imagePath: '/portfolio/ai-robo.png',
    isPublished: true,
    approvalStatus: 'approved',
  },
  {
    id: 'adyapan-lms',
    slug: 'adyapan-lms',
    name: 'Adyapan LMS',
    headline: 'Cloud-Native Learning Management & Virtual Campus Suite',
    category: 'Education Technology',
    shortDescription: 'Comprehensive educational platform designed to administer high-volume interactive cohorts, live video lectures, curated digital courseware, structured assignments, and verifiable course completions.',
    detailedDescription: 'Built to manage tens of thousands of active learner profiles, Adyapan LMS integrates student attendance telemetry, module progression tracking, automated assignment submissions, and cryptographically verifiable digital certification hashes.',
    features: [
      'Live interactive video classroom coordination with schedule calendars',
      'Modular curriculum authoring with video, text, and code assets',
      'Automated grading, test evaluation, and progress dashboards',
      'Verifiable digital certificate issuance with tamper-proof IDs',
      'Integrated student community discussion threads and query resolution',
    ],
    targetAudience: 'Colleges, universities, training academies, and online education providers.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS S3', 'WebRTC'],
    status: 'public',
    badgeText: 'Active Student Portal',
    url: 'https://my.adyapan.com/',
    liveUrlLabel: 'Access LMS Portal',
    imagePath: '/portfolio/adyapan-lms-icon.png',
    isPublished: true,
    approvalStatus: 'approved',
  },
  {
    id: 'adyapan-hub-crm',
    slug: 'adyapan-crm',
    name: 'Adyapan Hub (CRM)',
    headline: 'Institutional Operations, Admissions & Team Management Hub',
    category: 'CRM & Business Systems',
    shortDescription: 'Custom-built enterprise customer relationship management and admissions operations system engineered to orchestrate student leads, counselor targets, batch schedules, and fee records.',
    detailedDescription: 'Adyapan Hub is the internal nerve center of Adyapan Edutech operations. Engineered as an enterprise CRM, it powers lead lifecycle ingestion, stage progression, telephonic dialer sync, counselor KPI benchmarking, and secure batch enrollment workflows.',
    features: [
      'End-to-end student lead lifecycle and pipeline progression tracking',
      'Counselor calling metrics, disposition tracking, and daily target quotas',
      'Batch scheduling, course assignment, and fee receipt management',
      'Multi-tiered role permissions (Admins, Team Leads, Counselors, Auditors)',
      'Real-time conversion funnels and executive operational analytics',
    ],
    targetAudience: 'Internal admissions staff, counseling teams, and academic operations managers.',
    technologies: ['Next.js', 'React', 'Node.js', 'PostgreSQL / MongoDB', 'Tailwind CSS'],
    status: 'internal',
    badgeText: 'Internal Business Platform',
    url: 'https://adyapancrm.in/',
    liveUrlLabel: 'View Platform Overview',
    imagePath: '/portfolio/crm-bg.png',
    isPublished: true,
    approvalStatus: 'internal_only',
  },
  {
    id: 'adyapan-flagship',
    slug: 'adyapan-learning-platform',
    name: 'Adyapan Learning Platform',
    headline: 'Flagship Career Transformation & Industry Skills Ecosystem',
    category: 'Education Technology',
    shortDescription: 'The core digital gateway of Adyapan Edutech offering 65+ multi-disciplinary industry-aligned technical and professional programs, direct recruiter connections, and verified certificates.',
    detailedDescription: 'Serving learners across India with industry-aligned training, hands-on internships, live faculty sessions, and career placement support. It features integrated payment flows, corporate recruiter recruitment boards, and skills passport profiles.',
    features: [
      '65+ accredited programs across Engineering, Management, and Life Sciences',
      'Verified Skills Passport system showcasing real student project portfolios',
      'Corporate recruiter hiring portal connecting companies with trained talent',
      'Secure Razorpay payment integration supporting transparent installment plans',
      'Campus Ambassador network management across universities',
    ],
    targetAudience: 'Undergraduates, career transitioners, corporate recruiters, and college partners.',
    technologies: ['Next.js 16', 'React 18', 'TypeScript', 'Prisma', 'MongoDB', 'AWS S3', 'Razorpay'],
    status: 'public',
    badgeText: 'Flagship Web Platform',
    url: 'https://adyapan.com/',
    liveUrlLabel: 'Visit Adyapan.com',
    imagePath: '/newadylogo.png',
    isPublished: true,
    approvalStatus: 'approved',
  },
  {
    id: 'adyapan-careers',
    slug: 'adyapan-careers',
    name: 'Adyapan Careers',
    headline: 'Corporate Talent Acquisition & Career Opportunities Portal',
    category: 'Talent & Recruitment',
    shortDescription: 'Public hiring and job portal presenting open software, product, academic, and business development positions at Adyapan Edutech for high-caliber professionals.',
    detailedDescription: 'A modern job board streamlining talent acquisition. Candidates can browse active openings, evaluate role requirements, submit applications, and track progress, while hiring teams manage candidate pipelines.',
    features: [
      'Role categorization across Engineering, Product, Marketing, and Operations',
      'Mobile-optimized candidate profile and CV upload flow',
      'Direct pipeline connection to internal recruitment reviewers',
      'Clear role requirements, responsibilities, and team culture outlines',
    ],
    targetAudience: 'Engineering applicants, instructors, operations professionals, and interns.',
    technologies: ['Next.js', 'React', 'Node.js', 'Tailwind CSS'],
    status: 'public',
    badgeText: 'Public Careers Portal',
    url: 'https://career.adyapan.com/',
    liveUrlLabel: 'Explore Open Positions',
    imagePath: '/adyapan-logo.png',
    isPublished: true,
    approvalStatus: 'approved',
  },
  {
    id: 'adyapan-daily-reports',
    slug: 'adyapan-reports',
    name: 'Adyapan Daily Reports',
    headline: 'Internal Cross-Team Performance & Accountability Console',
    category: 'Internal Operations',
    shortDescription: 'Proprietary internal reporting portal facilitating daily milestone tracking, activity logging, and accountability metrics across all Adyapan Edutech operational divisions.',
    detailedDescription: 'Engineered to support organizational transparency, the daily report system enables team members and department heads to submit end-of-day progress logs, flag bottlenecks, and synchronize milestone completions across engineering, admissions, and content teams.',
    features: [
      'Structured end-of-day submission forms by department and role',
      'Executive dashboard summarizing organizational outputs and velocity',
      'Milestone tracking with blocker escalations and resolution logging',
      'Historical archives for performance evaluations and team retrospectives',
    ],
    targetAudience: 'Adyapan leadership, managers, and cross-functional team members.',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    status: 'internal',
    badgeText: 'Internal Business Platform',
    url: 'https://report.adyapan.com/',
    liveUrlLabel: 'Internal Console Overview',
    imagePath: '/icon-192x192.png',
    isPublished: true,
    approvalStatus: 'internal_only',
  },
];

/* ═════════════════════════════════════════════════════════════════════════════
   2. MOBILE APPLICATIONS (Google Play & Apple App Store)
   ═════════════════════════════════════════════════════════════════════════════ */
export const VERIFIED_MOBILE_APPS: MobileAppItem[] = [
  {
    id: 'app-adyapan-lms',
    name: 'ADYAPANLMS',
    platform: 'Android',
    packageId: 'com.adyapan.adyapan_lms',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.adyapan.adyapan_lms',
    iconPath: '/portfolio/adyapan-lms-icon.png',
    screenshots: [
      '/portfolio/lms-screen-1.jpg',
      '/portfolio/lms-screen-2.jpg',
      '/portfolio/lms-screen-3.jpg',
    ],
    shortDescription: 'Next-Gen Learning Management System for Students, Teachers & Administrators on Android devices.',
    supportedUseCases: [
      'Stream live and recorded lecture videos with adaptive bandwidth playback',
      'Access enrolled course modules, syllabus handouts, and reference notes offline',
      'Receive instant push notifications for class timings, mock tests, and announcements',
      'Submit assignments and take timed online quizzes with immediate feedback',
    ],
    developer: 'Adyapan Edutech',
    isPublished: true,
  },
  {
    id: 'app-adyapan-leaddialer',
    name: 'ADYAPAN - LeadDialer & CRM',
    platform: 'Android',
    packageId: 'com.adyapan.leaddialer',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.adyapan.leaddialer',
    iconPath: '/portfolio/adyapan-leaddialer-icon.png',
    screenshots: [
      '/portfolio/leaddialer-screen-1.jpg',
      '/portfolio/leaddialer-screen-2.jpg',
      '/portfolio/leaddialer-screen-3.jpg',
    ],
    shortDescription: 'Enterprise CRM & smart lead management dialer for sales and counseling teams to streamline communications and close enrollments faster.',
    supportedUseCases: [
      'One-tap cellular and VoIP dialing directly from customer lead cards',
      'Automatic call duration logging and disposition tagging (Follow-up, Enrolled, Inactive)',
      'Scheduled follow-up reminder alerts integrated with Android system notifications',
      'Continuous bidirectional sync with the centralized Adyapan Hub database',
    ],
    developer: 'Adyapan Edutech',
    isPublished: true,
  },
  {
    id: 'app-adyapan-ios',
    name: 'ADYAPAN on App Store',
    platform: 'iOS',
    packageId: 'id6803365304',
    storeUrl: 'https://apps.apple.com/se/app/adyapan/id6803365304',
    iconPath: '/portfolio/adyapan-ios-icon.png',
    screenshots: [
      '/portfolio/lms-screen-1.jpg',
      '/portfolio/lms-screen-2.jpg',
    ],
    shortDescription: 'Official iOS application providing native iPhone and iPad access to the Adyapan education and student portal ecosystem.',
    supportedUseCases: [
      'Tailored native iOS interface with smooth gestures and Retina asset rendering',
      'Unified course curriculum tracking, class timetables, and resource access',
      'Secure biometric authentication support for fast and safe access',
    ],
    developer: 'Morsu Niranjan (Co-Founder, Adyapan)',
    isPublished: true,
  },
  {
    id: 'app-adyapan-admin',
    name: 'ADYAPANADMIN',
    platform: 'Android',
    packageId: 'com.adyapan.adyapan_admin',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.adyapan.adyapan_admin',
    iconPath: '/portfolio/adyapan-admin-icon.png',
    screenshots: [
      '/portfolio/admin-screen-1.jpg',
      '/portfolio/admin-screen-2.jpg',
      '/portfolio/admin-screen-3.jpg',
    ],
    shortDescription: 'The secure mobile admin dashboard for managing institutional workflows, student records, batch schedules, and approvals.',
    supportedUseCases: [
      'Monitor real-time cohort attendance, batch milestones, and daily registration numbers',
      'Review and authorize pending student verifications and certificate releases',
      'Inspect faculty allocation, lecture schedules, and classroom resources on mobile',
      'Role-based multi-factor authentication protecting institutional data',
    ],
    developer: 'Adyapan Edutech',
    isPublished: true,
  },
];

/* ═════════════════════════════════════════════════════════════════════════════
   3. ENTERPRISE SERVICES & CAPABILITIES
   ═════════════════════════════════════════════════════════════════════════════ */
export const VERIFIED_SERVICES: ServiceItem[] = [
  {
    id: 'web-app-dev',
    slug: 'web-application-development',
    title: 'Web Application Development',
    tagline: 'High-performance, scalable web apps built for modern enterprise demands.',
    category: 'Engineering',
    customerProblem: 'Growing businesses often struggle with slow legacy web applications, fragmented user sessions, and monolithic systems that break under surging traffic.',
    proposedSolution: 'We architect and build full-stack web applications using Next.js, React, Node.js, and TypeScript, engineered with modular micro-components, server-side caching, and clean API contracts.',
    deliverables: [
      'Production-ready Next.js / React responsive web application',
      'Robust RESTful or GraphQL API backend architecture',
      'Secure authentication, session handling, and role permissions',
      'Unit and integration test suites with CI/CD deployment pipelines',
    ],
    potentialBusinessValue: 'Accelerated page transitions, higher user engagement, reduced server infrastructure costs, and effortless horizontal scalability.',
    typicalWorkflow: [
      '1. Architecture & schema design',
      '2. Component prototyping',
      '3. Full-stack implementation',
      '4. QA & performance tuning',
      '5. Cloud deployment',
    ],
    relevantExample: 'Adyapan Learning Platform & Adyapan Connect SaaS portal',
    ctaText: 'Discuss Web App Requirements',
    inquiryQueryParam: 'web-app-development',
    iconName: 'Layout',
    isPublished: true,
  },
  {
    id: 'mobile-app-dev',
    slug: 'mobile-application-development',
    title: 'Mobile Application Development',
    tagline: 'Native and hybrid mobile applications for iOS and Android that users love.',
    category: 'Engineering',
    customerProblem: 'Reaching mobile-first users requires high-speed offline capabilities, smooth touch performance, and store compliance that standard responsive websites cannot deliver.',
    proposedSolution: 'We design and engineer native (Kotlin / Swift) and cross-platform (React Native) mobile applications with background sync, hardware telephony integration, push notifications, and verified Play Store / App Store compliance.',
    deliverables: [
      'Signed production Android (APK/AAB) and iOS (IPA) release bundles',
      'Native device feature integrations (Telephony, Push Notifications, Storage)',
      'Store listing assets, metadata optimization, and publication guidance',
      'Crash analytics and live operational telemetry integration',
    ],
    potentialBusinessValue: 'Higher user retention, real-time push alert engagement, direct offline access, and increased sales agent call productivity.',
    typicalWorkflow: [
      '1. Device UX & wireframing',
      '2. Native module bridge setup',
      '3. State & storage architecture',
      '4. Multi-device testing',
      '5. Store submission & release',
    ],
    relevantExample: 'ADYAPANLMS and ADYAPAN LeadDialer published on Google Play and Apple App Store',
    ctaText: 'Discuss Mobile App Development',
    inquiryQueryParam: 'mobile-app-development',
    iconName: 'Smartphone',
    isPublished: true,
  },
  {
    id: 'lms-development',
    slug: 'lms-development',
    title: 'Learning Management Systems (LMS)',
    tagline: 'Tailored digital campus platforms built for universities, academies, and corporate training.',
    category: 'Education Technology',
    customerProblem: 'Educational institutions and training providers frequently battle rigid off-the-shelf LMS platforms that lack custom branding, live cohort scheduling, and localized payment gateways.',
    proposedSolution: 'We deliver purpose-built, high-capacity LMS platforms equipped with live lecture streaming coordination, modular curriculum authoring, automated grading, attendance telemetry, and verifiable digital certificates.',
    deliverables: [
      'Custom-branded LMS web portal and native companion mobile apps',
      'Live virtual classroom coordination with calendar notifications',
      'Automated quiz, assignment, and cohort progress evaluation engine',
      'Cryptographically verifiable certificate generation system',
    ],
    potentialBusinessValue: 'Seamless student management at scale, automated administrative workflows, elevated student completion rates, and verified institutional credentials.',
    typicalWorkflow: [
      '1. Academic workflow mapping',
      '2. Role & content model architecture',
      '3. Portal & video pipeline build',
      '4. Cohort load testing',
      '5. Instructor onboarding & launch',
    ],
    relevantExample: 'Adyapan LMS serving tens of thousands of registered students across India',
    ctaText: 'Discuss LMS Solution',
    inquiryQueryParam: 'lms-development',
    iconName: 'GraduationCap',
    isPublished: true,
  },
  {
    id: 'crm-automation',
    slug: 'crm-business-automation',
    title: 'CRM Systems & Workflow Automation',
    tagline: 'Lead management and telephonic sales acceleration tailored to your exact business funnels.',
    category: 'Business Systems',
    customerProblem: 'Sales and counseling teams lose valuable leads through manual spreadsheets, delayed follow-ups, and disconnected communication channels.',
    proposedSolution: 'We construct unified CRM solutions tightly integrated with telephony dialers, WhatsApp Cloud APIs, and real-time sales dashboards that turn raw leads into structured follow-ups.',
    deliverables: [
      'Custom CRM dashboard tailored to your industry sales lifecycle',
      'Automated lead ingestion from web forms, landing pages, and ad networks',
      'Mobile dialer integration with automatic call disposition logging',
      'Executive analytics tracking conversion bottlenecks and agent KPIs',
    ],
    potentialBusinessValue: 'Zero lead slippage, over 40% reduction in response time, auditable team performance, and higher conversion velocity.',
    typicalWorkflow: [
      '1. Sales funnel & pipeline mapping',
      '2. Schema & disposition design',
      '3. Telephony & API integration',
      '4. Agent workflow validation',
      '5. Training & rollout',
    ],
    relevantExample: 'Adyapan Hub & ADYAPAN LeadDialer mobile sales workflow',
    ctaText: 'Discuss CRM & Automation',
    inquiryQueryParam: 'crm-automation',
    iconName: 'GitMerge',
    isPublished: true,
  },
  {
    id: 'ai-integration',
    slug: 'ai-integration-automation',
    title: 'AI Integration & Intelligent Automation',
    tagline: 'Practical AI implementations that automate routine operations and enhance user experiences.',
    category: 'Artificial Intelligence',
    customerProblem: 'Companies want to leverage modern AI capabilities but face hallucination risks, steep API costs, and difficulty integrating AI into existing software stacks.',
    proposedSolution: 'We design reliable AI workflows using state-of-the-art LLM APIs, semantic search, diagnostic evaluation models, and guardrailed prompt engineering to solve concrete business bottlenecks.',
    deliverables: [
      'Custom AI feature integrations (Semantic Search, Assessment Engines, Document Summaries)',
      'Intelligent conversational assistants with verified fallback behaviors',
      'Cost-optimized API caching and token management layers',
      'Admin monitoring console for evaluation accuracy and safety',
    ],
    potentialBusinessValue: 'Immediate 24/7 responsiveness, automated preliminary student/candidate screening, and significant reduction in manual grading and support burdens.',
    typicalWorkflow: [
      '1. Use case feasibility & data audit',
      '2. Prompt & pipeline prototyping',
      '3. Backend API integration',
      '4. Safety & accuracy validation',
      '5. Production monitoring',
    ],
    relevantExample: 'Adyapan AI diagnostic career & aptitude intelligence platform',
    ctaText: 'Discuss AI Integration',
    inquiryQueryParam: 'ai-integration',
    iconName: 'Cpu',
    isPublished: true,
  },
  {
    id: 'custom-software-dev',
    slug: 'custom-software-development',
    title: 'Custom Software & Enterprise Solutions',
    tagline: 'Tailored software architectures designed around your unique operational bottlenecks.',
    category: 'Engineering',
    customerProblem: 'Generic SaaS tools often force organizations to adapt their established processes to software limitations, causing operational friction and recurring licensing expenses.',
    proposedSolution: 'We build proprietary software solutions designed around your exact business logic, data compliance standards, and integration requirements with zero vendor lock-in.',
    deliverables: [
      'Full intellectual property ownership with clean, documented source code',
      'Modern modular backend architecture (Node.js, Express, TypeScript)',
      'High-performance relational or document database schema design',
      'Scalable cloud infrastructure blueprints and automated backups',
    ],
    potentialBusinessValue: 'Total operational independence, customized business automation, complete data sovereignty, and reduced long-term licensing overhead.',
    typicalWorkflow: [
      '1. Business discovery & process mapping',
      '2. Architecture & data modeling',
      '3. Milestone-based sprint delivery',
      '4. Security audit & user acceptance',
      '5. Production launch & handover',
    ],
    relevantExample: 'Adyapan Reports and internal cross-team management systems',
    ctaText: 'Discuss Custom Software',
    inquiryQueryParam: 'custom-software',
    iconName: 'Code2',
    isPublished: true,
  },
  {
    id: 'ui-ux-design',
    slug: 'ui-ux-product-design',
    title: 'UI/UX Design & Product Strategy',
    tagline: 'Intuitive, conversion-optimized interfaces engineered for seamless user adoption.',
    category: 'Design',
    customerProblem: 'Cluttered, outdated interfaces confuse prospective customers, drive high bounce rates, and lead to poor mobile conversion.',
    proposedSolution: 'We create clean, user-centric interface systems following modern design principles, accessible contrast hierarchies, generous spacing, and interactive component libraries.',
    deliverables: [
      'Figma design systems and interactive prototypes',
      'Mobile-first responsive interface layouts for all breakpoints',
      'User journey flowcharts, wireframes, and design token specifications',
      'Accessible typography, WCAG contrast verification, and UI assets',
    ],
    potentialBusinessValue: 'Higher visitor-to-lead conversion, decreased support ticket volume, faster user onboarding, and polished corporate credibility.',
    typicalWorkflow: [
      '1. User research & competitor analysis',
      '2. Wireframing & journey mapping',
      '3. Visual design system creation',
      '4. Interactive prototyping',
      '5. Developer asset handover',
    ],
    relevantExample: 'Adyapan 2026 unified enterprise design system',
    ctaText: 'Discuss UI/UX Design',
    inquiryQueryParam: 'ui-ux-design',
    iconName: 'Palette',
    isPublished: true,
  },
  {
    id: 'cloud-devops',
    slug: 'cloud-infrastructure-devops',
    title: 'Cloud Infrastructure & DevOps Automation',
    tagline: 'Resilient cloud deployments, CI/CD automation, and secure hosting environments.',
    category: 'Infrastructure',
    customerProblem: 'Unmonitored server setups suffer from unexpected downtime, fragile manual deployment procedures, and soaring cloud hosting invoices.',
    proposedSolution: 'We establish resilient cloud architectures using AWS, Vercel, Docker, and GitHub Actions CI/CD pipelines, complete with automatic failover, SSL enforcement, and cost optimization.',
    deliverables: [
      'Automated CI/CD build and release deployment pipelines',
      'Secure object storage (AWS S3) and CDN delivery configurations',
      'Automated database backup schedules and disaster recovery protocols',
      'Server health monitoring, error alerts, and SSL certificate renewals',
    ],
    potentialBusinessValue: '99.9% uptime reliability, zero-downtime deployments, rapid rollback capability, and minimized infrastructure spend.',
    typicalWorkflow: [
      '1. Infrastructure audit & sizing',
      '2. Containerization & CI/CD setup',
      '3. Cloud environment provisioning',
      '4. Security hardening & backup testing',
      '5. Telemetry & alert configuration',
    ],
    relevantExample: 'Adyapan multi-platform AWS S3, Vercel, and Cloud infrastructure',
    ctaText: 'Discuss Cloud & DevOps',
    inquiryQueryParam: 'cloud-devops',
    iconName: 'Cloud',
    isPublished: true,
  },
  {
    id: 'api-integration',
    slug: 'api-development-integration',
    title: 'API Development & System Integration',
    tagline: 'Seamless bidirectional connections connecting your software to third-party tools.',
    category: 'Engineering',
    customerProblem: 'Isolating data across payment gateways, communication APIs, and ERPs creates data silos, manual double-entry, and error-prone records.',
    proposedSolution: 'We design and build secure RESTful API integrations and webhooks connecting internal databases with WhatsApp Cloud APIs, Razorpay payments, SMS gateways, and cloud storage.',
    deliverables: [
      'Secure, documented REST API endpoints with authentication tokens',
      'Webhook receivers with idempotency and replay attack prevention',
      'Comprehensive Postman or OpenAPI documentation',
      'Payload sanitation, rate-limiting, and error fallback handlers',
    ],
    potentialBusinessValue: 'Automated data flow between disparate systems, instant transaction verification, and complete removal of manual data entry.',
    typicalWorkflow: [
      '1. Third-party API contract review',
      '2. Webhook & schema mapping',
      '3. Secure integration endpoint build',
      '4. Mock & sandbox load testing',
      '5. Production cutover',
    ],
    relevantExample: 'WhatsApp Cloud API & Razorpay webhook integration across Adyapan platforms',
    ctaText: 'Discuss API Integration',
    inquiryQueryParam: 'api-integration',
    iconName: 'Layers',
    isPublished: true,
  },
  {
    id: 'maintenance-security',
    slug: 'maintenance-security-support',
    title: 'Software Maintenance & Security Hardening',
    tagline: 'Proactive monitoring, bug resolution, security patching, and ongoing performance tuning.',
    category: 'Support',
    customerProblem: 'Unmaintained web platforms quickly become vulnerable to software exploits, outdated dependencies, and creeping performance degradation.',
    proposedSolution: 'We provide structured technical maintenance agreements covering regular dependency patching, security audits, database indexing, uptime monitoring, and SLA-backed bug fixes.',
    deliverables: [
      'Monthly software health and dependency update reports',
      'Proactive security vulnerability scanning and patch deployment',
      'Core Web Vitals and database query performance optimizations',
      'Emergency response channel for high-priority incidents',
    ],
    potentialBusinessValue: 'Peace of mind knowing your digital assets remain secure, performant, and compliant with current web standards.',
    typicalWorkflow: [
      '1. Baseline codebase & security audit',
      '2. Monitoring & logging instrumentation',
      '3. Scheduled maintenance sprints',
      '4. Ongoing performance benchmarking',
    ],
    relevantExample: 'Continuous maintenance of Adyapan production ecosystem',
    ctaText: 'Discuss Maintenance Options',
    inquiryQueryParam: 'maintenance-support',
    iconName: 'ShieldCheck',
    isPublished: true,
  },
];

/* ═════════════════════════════════════════════════════════════════════════════
   4. INDUSTRY SOLUTIONS
   ═════════════════════════════════════════════════════════════════════════════ */
export const INDUSTRY_SOLUTIONS: IndustrySolutionItem[] = [
  {
    id: 'biz-startups',
    slug: 'businesses-startups',
    title: 'Businesses & Startups',
    subtitle: 'From MVP to Scalable Commercial Platform',
    description: 'We partner with founders and enterprise leaders to conceptualize, design, and launch customer-facing digital portals, conversational WhatsApp CRMs, and custom software that drive measurable revenue.',
    capabilities: [
      'Conversion-focused corporate websites and customer portals',
      'Custom SaaS MVPs built for rapid validation and scalable growth',
      'WhatsApp Business API integration for sales and customer support',
      'Custom CRM workflows, lead ingestion, and analytics dashboards',
      'Payment gateway setup (Razorpay, Stripe) with automated billing',
    ],
    applicableProducts: ['Adyapan Connect', 'Adyapan Hub CRM', 'ADYAPAN LeadDialer'],
    highlightMetric: 'Proven full-stack architectures engineered for rapid market entry.',
  },
  {
    id: 'schools-colleges',
    slug: 'schools-colleges-universities',
    title: 'Schools, Colleges & Universities',
    subtitle: 'Modern Digital Campuses for Modern Academics',
    description: 'Empowering educational institutions with digital infrastructure for admissions, hybrid classroom delivery, attendance tracking, courseware administration, and verifiable academic credentials.',
    capabilities: [
      'Customized institutional Learning Management Systems (LMS)',
      'Student portal with online fee payments and class timetable schedules',
      'Secure exam administration, auto-graded quizzes, and assessments',
      'Digital certificate issuance with verifiable cryptographic IDs',
      'Administrative mobile apps for executive oversight and faculty coordination',
    ],
    applicableProducts: ['Adyapan LMS', 'ADYAPANLMS Android App', 'ADYAPANADMIN Console'],
    highlightMetric: 'Trained and managed academic cohorts exceeding 5,000+ students.',
  },
  {
    id: 'training-edutech',
    slug: 'training-education-providers',
    title: 'Training & Education Providers',
    subtitle: 'High-Volume Online Cohorts & Upskilling Engines',
    description: 'Designed specifically for coaching academies, professional upskilling institutes, and digital training programs needing seamless cohort onboarding, video distribution, and career tracking.',
    capabilities: [
      'Multi-disciplinary course curriculum authoring and video hosting',
      'Integrated enrollment, registration forms, and installment tracking',
      'Student skills passport and portfolio showcases for recruiter discovery',
      'Automated batch communication via WhatsApp and SMS triggers',
      'Job boards and placement partner interview scheduling',
    ],
    applicableProducts: ['Adyapan Learning Platform', 'Adyapan AI', 'Adyapan Careers'],
    highlightMetric: 'Over 65+ multidisciplinary career tracks successfully administered.',
  },
  {
    id: 'growing-orgs',
    slug: 'growing-organizations',
    title: 'Growing Organizations & Enterprises',
    subtitle: 'Modernizing Legacy Workflows with Clean Software',
    description: 'Helping established businesses replace manual spreadsheets, paper forms, and slow legacy applications with fast, secure cloud software that scales as teams expand.',
    capabilities: [
      'Legacy software audit, refactoring, and cloud migration planning',
      'Automated operational daily reporting and cross-team accountability tools',
      'Secure role-based internal intranets and employee management systems',
      'Cloud database optimization (PostgreSQL, MongoDB) and automated backups',
      'API-based integration connecting ERPs with modern cloud services',
    ],
    applicableProducts: ['Adyapan Daily Reports', 'Adyapan Connect', 'Custom Cloud Architecture'],
    highlightMetric: 'Zero vendor lock-in with 100% intellectual property ownership.',
  },
];

/* ═════════════════════════════════════════════════════════════════════════════
   5. SELECTED PROJECTS & PORTFOLIO GALLERY (Verified Items Only)
   ═════════════════════════════════════════════════════════════════════════════ */
export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-adyapan-connect',
    title: 'Adyapan Connect — Omnichannel WhatsApp CRM',
    category: 'CRM & Automation',
    businessOverview: 'Enterprise conversational messaging SaaS utilizing the official WhatsApp Business Cloud API to manage high-volume customer communications, team inboxes, and automated broadcasts.',
    problemStatement: 'Businesses faced communication drop-offs and poor response rates using disconnected email and unverified personal WhatsApp numbers without central oversight.',
    solution: 'Engineered a cloud-native platform featuring a multi-agent shared inbox, automated keyword triggers, team routing, and broadcast analytics directly over Meta Cloud API infrastructure.',
    featuresDelivered: [
      'Cloud API webhook receiver with real-time delivery notifications',
      'Shared multi-agent team inbox with agent assignment and tags',
      'Drip broadcast scheduling with template approval sync',
      'Detailed analytics on open rates, read rates, and replies',
    ],
    technologyStack: ['Next.js', 'React', 'Node.js', 'TypeScript', 'WhatsApp Cloud API', 'Tailwind CSS'],
    screenshotPath: '/portfolio/adyapan-connect-og.png',
    liveDemoUrl: 'https://connect.adyapan.com/',
    projectStatus: 'Production',
    isInternalProduct: true,
    clientAttributionStatus: 'Adyapan Product',
    isPublished: true,
  },
  {
    id: 'proj-adyapan-lms-platform',
    title: 'Adyapan LMS — Multi-Tenant Virtual Campus',
    category: 'Education Technology',
    businessOverview: 'A comprehensive web and mobile learning platform delivering live lectures, course modules, assignments, and verified certificates to tens of thousands of active learners.',
    problemStatement: 'Managing thousands of concurrent learners across 65+ technical domains required an educational system with zero video latency, reliable attendance, and instant certificate verification.',
    solution: 'Constructed an integrated learning system with AWS S3 asset delivery, attendance telemetry, automated test grading, and tamper-proof certificate hashes.',
    featuresDelivered: [
      'Scalable video delivery with adaptive quality playback',
      'Interactive quiz modules with timer countdowns and scoreboards',
      'Cryptographic certificate verification lookup page',
      'Synchronized progress between web and native Android apps',
    ],
    technologyStack: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS S3', 'Tailwind CSS'],
    screenshotPath: '/portfolio/lms-screen-1.jpg',
    liveDemoUrl: 'https://my.adyapan.com/',
    projectStatus: 'Production',
    isInternalProduct: true,
    clientAttributionStatus: 'Adyapan Product',
    isPublished: true,
  },
  {
    id: 'proj-leaddialer-mobile',
    title: 'ADYAPAN LeadDialer & Mobile CRM',
    category: 'Mobile Applications',
    businessOverview: 'Native Android telephonic dialer application engineered for corporate admissions and sales teams to accelerate outbound calling and record accurate lead dispositions.',
    problemStatement: 'Sales counselors spent hours manually dialing phone numbers from web dashboards, causing clerical errors, untracked talk-time, and lost leads.',
    solution: 'Created a specialized Android app with one-tap dialing, automatic call duration logging, disposition tagging, and bidirectional synchronization with central databases.',
    featuresDelivered: [
      'Instant cellular call trigger from cloud pipeline queue',
      'Automatic post-call disposition prompt (Enrolled, Callback, Not Interested)',
      'System calendar follow-up notifications and reminders',
      'End-to-end sync with Adyapan Hub management console',
    ],
    technologyStack: ['Android (Kotlin/Java)', 'REST APIs', 'Node.js', 'PostgreSQL / MongoDB'],
    screenshotPath: '/portfolio/leaddialer-screen-1.jpg',
    liveDemoUrl: 'https://play.google.com/store/apps/details?id=com.adyapan.leaddialer',
    projectStatus: 'Production',
    isInternalProduct: true,
    clientAttributionStatus: 'Adyapan Product',
    isPublished: true,
  },
  {
    id: 'proj-adyapan-ai-engine',
    title: 'Adyapan AI — Interactive Career & Aptitude Engine',
    category: 'AI & Intelligence',
    businessOverview: 'An intelligent diagnostic platform evaluating technical comprehension, problem-solving speed, and career readiness using adaptive algorithmic scoring.',
    problemStatement: 'Graduates often lack objective feedback on their interview readiness, quantitative aptitude, and specific technical weak spots.',
    solution: 'Designed an interactive assessment suite with dynamic question sequencing, automated skill breakdown charts, and targeted curriculum recommendations.',
    featuresDelivered: [
      'Adaptive problem sequencing based on candidate performance',
      'Detailed skill quadrant analysis (Coding, Aptitude, Core CS)',
      'Actionable learning roadmaps mapped to in-demand industry roles',
      'Clean, distraction-free modern responsive interface',
    ],
    technologyStack: ['Next.js', 'React', 'TypeScript', 'OpenAI APIs', 'Tailwind CSS'],
    screenshotPath: '/portfolio/ai-robo.png',
    liveDemoUrl: 'https://ai.adyapan.com/',
    projectStatus: 'Production',
    isInternalProduct: true,
    clientAttributionStatus: 'Adyapan Product',
    isPublished: true,
  },
  {
    id: 'proj-adyapan-admin-console',
    title: 'ADYAPANADMIN — Mobile Institutional Console',
    category: 'Mobile Applications',
    businessOverview: 'A secure mobile administrative management application allowing institutional executives to inspect operations, attendance, and approvals on the go.',
    problemStatement: 'Department leaders and academic heads lacked secure mobile access to daily batch metrics, requiring desktop computers for routine administrative sign-offs.',
    solution: 'Engineered a specialized Android administrative console with real-time telemetry, attendance summaries, and instant certificate approval workflows.',
    featuresDelivered: [
      'Executive dashboard summarizing active cohorts and daily attendance',
      'One-tap approval queues for certificate and verification requests',
      'Secure administrative authentication with role-based scopes',
      'Lightweight and battery-optimized for continuous executive use',
    ],
    technologyStack: ['Android (Kotlin/Java)', 'Node.js', 'Express', 'MongoDB'],
    screenshotPath: '/portfolio/admin-screen-1.jpg',
    liveDemoUrl: 'https://play.google.com/store/apps/details?id=com.adyapan.adyapan_admin',
    projectStatus: 'Production',
    isInternalProduct: true,
    clientAttributionStatus: 'Adyapan Product',
    isPublished: true,
  },
  {
    id: 'proj-flagship-ecosystem',
    title: 'Adyapan Career Platform & Skills Passport',
    category: 'Web Applications',
    businessOverview: 'The flagship public-facing web platform of Adyapan Edutech featuring 65+ course tracks, recruiter discovery portals, and student verification registries.',
    problemStatement: 'Bridging the gap between educational training and enterprise recruitment required a unified portal featuring verified student credentials and direct hiring pipelines.',
    solution: 'Built a full-stack Next.js application featuring an interactive curriculum catalog, recruiter candidate search, automated fee processing, and verifiable QR credentials.',
    featuresDelivered: [
      'Fast responsive course explorer across 7 major academic domains',
      'Integrated Skills Passport with verified projects and skills tags',
      'Direct Recruiter portal for candidate discovery and shortlisting',
      'Razorpay payment checkout supporting full and installment structures',
    ],
    technologyStack: ['Next.js 16', 'React 18', 'TypeScript', 'Prisma', 'MongoDB', 'AWS S3', 'Razorpay'],
    screenshotPath: '/newadylogo.png',
    liveDemoUrl: 'https://adyapan.com/',
    projectStatus: 'Production',
    isInternalProduct: true,
    clientAttributionStatus: 'Adyapan Product',
    isPublished: true,
  },
  /* 
   * CODVEDHA CASE STUDY / DRAFT:
   * Rule compliance: Per Master Prompt section 4.H, CodVedha is maintained strictly
   * as a private draft awaiting written client authorization and proof of business relationship.
   * isPublished is explicitly false so it will NEVER render on the public website.
   */
  {
    id: 'draft-codvedha-case-study',
    title: 'CodVedha — Industry 4.0 Transformation Platform (Internal Draft)',
    category: 'Web Applications',
    businessOverview: 'Digital platform focused on career transformation and Industry 4.0 technical skills training.',
    problemStatement: 'Learners need specialized curriculum in next-generation emerging technologies.',
    solution: 'Modern web presence showcasing advanced tech modules and training tracks.',
    featuresDelivered: [
      'Course catalog for Industry 4.0 technologies',
      'Lead capture and career counseling inquiry forms',
    ],
    technologyStack: ['React', 'Next.js', 'Tailwind CSS'],
    screenshotPath: '/portfolio/crm-bg.png',
    liveDemoUrl: 'https://codvedha.com/',
    projectStatus: 'Under Development',
    isInternalProduct: false,
    clientAttributionStatus: 'Private Draft / Pending Approval',
    isPublished: false, // EXPLICITLY UNPUBLISHED PER PROMPT SECTION 4.H
  },
];

/* ═════════════════════════════════════════════════════════════════════════════
   6. WHY CHOOSE ADYAPAN? (Credible Differentiators)
   ═════════════════════════════════════════════════════════════════════════════ */
export const CREDIBLE_DIFFERENTIATORS = [
  {
    title: 'Business-Focused Discovery',
    description: 'We prioritize understanding your revenue model, core operational friction, and user workflows before writing a single line of code.',
    iconName: 'Compass',
  },
  {
    title: 'User-Centered Architecture',
    description: 'Interfaces are designed with clear visual hierarchy, accessible contrast, and zero clutter to maximize completion and conversion rates.',
    iconName: 'Users',
  },
  {
    title: 'Practical Engineering',
    description: 'We choose proven, maintainable technologies over transient hype. Clean code, typed contracts, and structured patterns you can easily maintain.',
    iconName: 'Wrench',
  },
  {
    title: 'Maintainable Codebases',
    description: 'Your project is delivered with comprehensive documentation, typed TypeScript interfaces, and zero proprietary lock-in. You own 100% of the code.',
    iconName: 'FileCode2',
  },
  {
    title: 'Security-Conscious Development',
    description: 'From environment secret isolation to input sanitization, rate-limiting, and least-privilege cloud access, security is embedded from day one.',
    iconName: 'Lock',
  },
  {
    title: 'Transparent Project Scope',
    description: 'Milestone-based delivery schedules with clear deliverables. You always know exactly what is built, tested, and ready for deployment.',
    iconName: 'CheckCircle2',
  },
  {
    title: 'Rigorous Release Validation',
    description: 'Multi-device responsive testing, network failure simulation, cross-browser validation, and Core Web Vitals profiling before any production release.',
    iconName: 'ShieldAlert',
  },
  {
    title: 'Ongoing Maintenance SLAs',
    description: 'Continuous technical support, scheduled dependency patching, database backups, and emergency incident resolution to keep your platforms fast and secure.',
    iconName: 'LifeBuoy',
  },
];

/* ═════════════════════════════════════════════════════════════════════════════
   7. DEVELOPMENT PROCESS (7-Step Lifecycle)
   ═════════════════════════════════════════════════════════════════════════════ */
export const DEVELOPMENT_PROCESS: ProcessStepItem[] = [
  {
    step: '01',
    name: 'Discover',
    tagline: 'Understand the core problem',
    description: 'Deep dive into your business goals, target user personas, technical constraints, and data flows to map out exact project requirements.',
    activities: ['Stakeholder interview', 'Workflow & schema mapping', 'Technical feasibility audit', 'Scope definition'],
    deliverable: 'Project Discovery Document & Architecture Blueprint',
  },
  {
    step: '02',
    name: 'Plan',
    tagline: 'Define scope and milestones',
    description: 'Structure sprint milestones, choose verified technology stacks, plan database schemas, and establish clear release deliverables.',
    activities: ['Milestone timeline', 'Technology selection', 'Database entity design', 'Security baseline setup'],
    deliverable: 'Milestone Roadmap & Delivery Schedule',
  },
  {
    step: '03',
    name: 'Design',
    tagline: 'User journeys and visual concepts',
    description: 'Craft modern, responsive user experiences with intuitive flows, design systems, WCAG accessible contrast, and interactive prototypes.',
    activities: ['User journey wireframing', 'UI design system in Figma', 'Component token definition', 'Interactive prototype review'],
    deliverable: 'Interactive Prototypes & UI Component Specs',
  },
  {
    step: '04',
    name: 'Build',
    tagline: 'Engineering the approved solution',
    description: 'Implement typed, modular frontend and backend code with secure API contracts, database indexes, and responsive component libraries.',
    activities: ['Frontend component build', 'Backend REST/API endpoints', 'Database migrations & indexes', 'Third-party integrations'],
    deliverable: 'Working Staging Deployment & Sprint Demos',
  },
  {
    step: '05',
    name: 'Test',
    tagline: 'Rigorous validation & QA',
    description: 'Validate functionality across mobile, tablet, and desktop breakpoints. Execute security checks, error handling tests, and performance audits.',
    activities: ['Cross-browser & mobile testing', 'Input sanitization & security audit', 'Core Web Vitals profiling', 'User acceptance testing'],
    deliverable: 'QA Test Sign-Off & Performance Report',
  },
  {
    step: '06',
    name: 'Deploy',
    tagline: 'Smooth, coordinated launch',
    description: 'Orchestrate production deployments on AWS / Vercel with automated CI/CD pipelines, SSL certificate validation, and zero-downtime cutover.',
    activities: ['Production environment provisioning', 'DNS & SSL configuration', 'Automated backup verification', 'Live release cutover'],
    deliverable: 'Live Production System & System Documentation',
  },
  {
    step: '07',
    name: 'Maintain',
    tagline: 'Ongoing support & continuous optimization',
    description: 'Provide agreed technical maintenance, uptime telemetry, dependency updates, database indexing, and continuous performance improvements.',
    activities: ['Proactive security patching', 'Uptime & error monitoring', 'Database maintenance', 'Feature enhancements'],
    deliverable: 'Monthly Health Metrics & Maintenance SLA',
  },
];

/* ═════════════════════════════════════════════════════════════════════════════
   8. VERIFIED TECHNOLOGY STACK
   ═════════════════════════════════════════════════════════════════════════════ */
export const VERIFIED_TECHNOLOGIES: TechCategory[] = [
  {
    category: 'Frontend Engineering',
    items: [
      { name: 'React', description: 'Component-driven interactive user interfaces', tag: 'UI Library' },
      { name: 'Next.js', description: 'Server-side rendering, App Router, and static optimization', tag: 'Full-Stack Framework' },
      { name: 'TypeScript', description: 'End-to-end type safety preventing runtime defects', tag: 'Language' },
      { name: 'Tailwind CSS', description: 'Modern, performant utility design system', tag: 'Styling' },
      { name: 'Framer Motion', description: 'Restrained, fluid micro-interactions and transitions', tag: 'Animation' },
    ],
  },
  {
    category: 'Backend & APIs',
    items: [
      { name: 'Node.js', description: 'High-concurrency asynchronous runtime', tag: 'Runtime' },
      { name: 'Express', description: 'Lightweight, robust REST API server architecture', tag: 'Backend Framework' },
      { name: 'Prisma', description: 'Type-safe database ORM and migrations', tag: 'Data Access' },
      { name: 'REST & Webhooks', description: 'Standardized API contracts and real-time event hooks', tag: 'Architecture' },
      { name: 'Zod', description: 'Strict runtime schema validation and input sanitization', tag: 'Validation' },
    ],
  },
  {
    category: 'Databases & Storage',
    items: [
      { name: 'MongoDB', description: 'Flexible document data store for dynamic catalogs', tag: 'NoSQL Database' },
      { name: 'PostgreSQL', description: 'Relational ACID database for transactional records', tag: 'SQL Database' },
      { name: 'Supabase', description: 'Postgres cloud infrastructure with real-time sync', tag: 'Cloud DB' },
      { name: 'AWS S3', description: 'Scalable object storage for videos and certificates', tag: 'Cloud Storage' },
    ],
  },
  {
    category: 'Mobile & Device Native',
    items: [
      { name: 'Android SDK (Kotlin/Java)', description: 'Native performance, background services, telephony dialers', tag: 'Native Android' },
      { name: 'iOS App Store', description: 'Apple-compliant iOS distribution and device optimization', tag: 'Native iOS' },
      { name: 'React Native', description: 'Cross-platform code reuse for rapid multi-platform release', tag: 'Hybrid Mobile' },
    ],
  },
  {
    category: 'Cloud, DevOps & Security',
    items: [
      { name: 'AWS (Amazon Web Services)', description: 'Cloud compute, S3 storage, and secure hosting', tag: 'Cloud Provider' },
      { name: 'Vercel', description: 'Edge-optimized deployment for Next.js applications', tag: 'Edge Hosting' },
      { name: 'Docker', description: 'Consistent containerized environments across stages', tag: 'Containerization' },
      { name: 'CI/CD Pipelines', description: 'Automated testing, linting, and deployment', tag: 'DevOps' },
    ],
  },
  {
    category: 'Integrations & AI',
    items: [
      { name: 'WhatsApp Business Cloud API', description: 'Official Meta conversational messaging and CRM automation', tag: 'Communication' },
      { name: 'Razorpay API', description: 'Secure digital payments and installment management', tag: 'FinTech' },
      { name: 'OpenAI / LLM APIs', description: 'Intelligent natural language processing and assessments', tag: 'Machine Intelligence' },
    ],
  },
];

/* ═════════════════════════════════════════════════════════════════════════════
   9. VERIFIED LEADERSHIP & COMPANY PROFILE
   ═════════════════════════════════════════════════════════════════════════════ */
export const VERIFIED_LEADERSHIP: LeadershipMember[] = [
  {
    name: 'Sai Charan',
    role: 'Founder',
    imagePath: '/images/sai-charan.jpeg',
    bio: 'Pioneered Adyapan with a vision to merge practical industry skill development with robust, real-world digital solutions. Focuses on technology architecture, student career launching, and strategic growth.',
    quote: "Upskilling isn't optional anymore. Adyapan ensures every student learns with purpose, practices with mentors, and grows with confidence.",
    linkedInUrl: 'https://www.linkedin.com/in/saii-m-871712171/',
  },
  {
    name: 'Niranjan Reddy',
    role: 'Co-Founder',
    imagePath: '/images/niranjan-reddy.jpeg',
    bio: 'Co-leads operations, product delivery, and corporate technology initiatives. Steers the company’s enterprise mobile applications and institutional partnership ecosystems.',
    quote: 'The world is full of opportunities, but students need the right direction. Adyapan helps them access global careers without feeling lost.',
    linkedInUrl: 'https://www.linkedin.com/in/niranjan-reddy-abb1861b6/',
  },
  {
    name: 'Monika Y',
    role: 'Core Team',
    imagePath: '/images/monika-y.jpeg',
    bio: 'Drives cross-functional operations, execution of academic cohorts, and student experience across all major learning domains.',
  },
  {
    name: 'Dr. Dhiraj Singh',
    role: 'Head, Training & Placement Cell',
    imagePath: '/images/Dr. Dhiraj Singh.jpeg',
    bio: 'Leads corporate hiring partnerships, industry mentor alliances, and candidate interview readiness programs across India.',
  },
];

/* ═════════════════════════════════════════════════════════════════════════════
   10. STRATEGIC FAQ
   ═════════════════════════════════════════════════════════════════════════════ */
export const PORTFOLIO_FAQS: FAQItem[] = [
  {
    question: 'What types of software projects does Adyapan undertake?',
    answer: 'We design, build, and maintain production-ready digital products including responsive corporate websites, high-performance web applications, native Android/iOS mobile applications, custom Learning Management Systems (LMS), tailored CRM and lead dialer platforms, and AI-assisted workflow automation.',
    category: 'Engagement',
  },
  {
    question: 'Can you work with our existing codebase or legacy systems?',
    answer: 'Yes. We begin engagements by conducting an architectural and security audit of your existing codebase. We identify bottlenecks, technical debt, and integration opportunities, and can either refactor and modernize components incrementally or plan a smooth, zero-downtime migration.',
    category: 'Technical',
  },
  {
    question: 'Who owns the intellectual property (IP) and source code?',
    answer: 'You do. Upon project completion and milestone settlement, you retain 100% intellectual property ownership of all custom code, configurations, database schemas, and UI assets created for your engagement. We do not impose proprietary vendor lock-in.',
    category: 'Engagement',
  },
  {
    question: 'How do you handle project scoping, estimates, and milestones?',
    answer: 'We operate on transparent, milestone-based delivery. Following an initial technical discovery session, we provide a detailed project roadmap outlining feature sprints, technical specifications, agreed timelines, and fixed milestone deliverables so you maintain full control of scope and budget.',
    category: 'Delivery',
  },
  {
    question: 'Do you offer mobile applications on Google Play Store and Apple App Store?',
    answer: 'Yes. We build native and cross-platform mobile apps, configure Google Play Console and Apple Developer accounts, resolve store policy requirements, and oversee store submission until full approval, as proven by our active apps currently published on both stores.',
    category: 'Technical',
  },
  {
    question: 'What post-launch maintenance and technical support options are available?',
    answer: 'We offer structured Service Level Agreements (SLAs) tailored to your operational needs. This includes proactive dependency patching, database backups, uptime monitoring, performance tuning, and guaranteed response times for bug resolution and feature iterations.',
    category: 'Support',
  },
  {
    question: 'How does Adyapan ensure software security and data protection?',
    answer: 'Security is integrated into every phase of development: strict environment secret separation, Zod input sanitization, CSRF/XSS protection, rate-limiting on sensitive endpoints, encrypted cloud storage (AWS S3), and least-privilege database user access.',
    category: 'Technical',
  },
  {
    question: 'Can you integrate third-party APIs like payment gateways and WhatsApp Cloud API?',
    answer: 'Yes. We have deep hands-on expertise building production integrations with the official Meta WhatsApp Business Cloud API, Razorpay payment flows, webhook listeners, SMS gateways, and cloud storage providers.',
    category: 'Technical',
  },
  {
    question: 'Can we see live demonstrations of your working platforms?',
    answer: 'Absolutely. You can explore our publicly available products including Adyapan Connect (connect.adyapan.com), Adyapan AI (ai.adyapan.com), Adyapan LMS (my.adyapan.com), and download our active Android and iOS mobile applications directly from the official app stores.',
    category: 'Engagement',
  },
  {
    question: 'How do we begin a project with Adyapan?',
    answer: 'Reach out to our engineering and solutions team via our contact form at adyapan.com/contact with your project vision or specific technical challenge. We will schedule a direct technical discovery call within 24 to 48 hours to explore feasibility and outline the best path forward.',
    category: 'Engagement',
  },
];

/* ═════════════════════════════════════════════════════════════════════════════
   11. ASSET INVENTORY & AUDIT LOG (Verification Records)
   ═════════════════════════════════════════════════════════════════════════════ */
export const ASSET_INVENTORY = [
  {
    assetName: 'Adyapan Logo Official',
    product: 'Corporate Brand',
    originalUrl: 'https://adyapan.com/newadylogo.png',
    localAssetPath: '/newadylogo.png',
    usageApproval: 'Authorized Corporate Asset',
    altText: "SR's Adyapan Edutech Pvt. Ltd. Official Logo",
    verificationStatus: 'Verified (HTTP 200)',
  },
  {
    assetName: 'Adyapan Connect OG Asset',
    product: 'Adyapan Connect SaaS',
    originalUrl: 'https://connect.adyapan.com/opengraph-image?aa9caddbc6c825fe',
    localAssetPath: '/portfolio/adyapan-connect-og.png',
    usageApproval: 'Authorized Product Asset',
    altText: 'Adyapan Connect WhatsApp Business API and CRM Platform Interface',
    verificationStatus: 'Verified (HTTP 200, 82.7 KB)',
  },
  {
    assetName: 'Adyapan AI Mascot & Robot Interface',
    product: 'Adyapan AI Engine',
    originalUrl: 'https://ai.adyapan.com/robo.png',
    localAssetPath: '/portfolio/ai-robo.png',
    usageApproval: 'Authorized Product Asset',
    altText: 'Adyapan AI Artificial Intelligence and Learning Interface',
    verificationStatus: 'Verified (HTTP 200, 2.02 MB)',
  },
  {
    assetName: 'Adyapan Hub CRM Visual Background',
    product: 'Adyapan CRM Hub',
    originalUrl: 'https://adyapancrm.in/login_background.png',
    localAssetPath: '/portfolio/crm-bg.png',
    usageApproval: 'Authorized Internal Product Asset',
    altText: 'Adyapan Hub Enterprise CRM Operations Console',
    verificationStatus: 'Verified (HTTP 200, 895 KB)',
  },
  {
    assetName: 'ADYAPANLMS Android Icon',
    product: 'ADYAPANLMS App',
    originalUrl: 'https://play.google.com/store/apps/details?id=com.adyapan.adyapan_lms',
    localAssetPath: '/portfolio/adyapan-lms-icon.png',
    usageApproval: 'Official Google Play Store Asset',
    altText: 'ADYAPANLMS Android App Icon on Google Play',
    verificationStatus: 'Verified (Google Play Published)',
  },
  {
    assetName: 'ADYAPAN LeadDialer Android Icon',
    product: 'ADYAPAN LeadDialer App',
    originalUrl: 'https://play.google.com/store/apps/details?id=com.adyapan.leaddialer',
    localAssetPath: '/portfolio/adyapan-leaddialer-icon.png',
    usageApproval: 'Official Google Play Store Asset',
    altText: 'ADYAPAN LeadDialer Mobile CRM App Icon',
    verificationStatus: 'Verified (Google Play Published)',
  },
  {
    assetName: 'ADYAPAN iOS App Icon',
    product: 'ADYAPAN Apple App',
    originalUrl: 'https://apps.apple.com/se/app/adyapan/id6803365304',
    localAssetPath: '/portfolio/adyapan-ios-icon.png',
    usageApproval: 'Official Apple App Store Asset',
    altText: 'ADYAPAN iOS App Icon on Apple App Store',
    verificationStatus: 'Verified (Apple App Store Published)',
  },
  {
    assetName: 'ADYAPANADMIN Android Icon',
    product: 'ADYAPANADMIN Console App',
    originalUrl: 'https://play.google.com/store/apps/details?id=com.adyapan.adyapan_admin',
    localAssetPath: '/portfolio/adyapan-admin-icon.png',
    usageApproval: 'Official Google Play Store Asset',
    altText: 'ADYAPANADMIN Console Mobile App Icon',
    verificationStatus: 'Verified (Google Play Published)',
  },
  {
    assetName: 'LMS Mobile Screenshots (1, 2, 3)',
    product: 'ADYAPANLMS App',
    originalUrl: 'https://play.google.com/store/apps/details?id=com.adyapan.adyapan_lms',
    localAssetPath: '/portfolio/lms-screen-[1,2,3].jpg',
    usageApproval: 'Official Store Screenshots',
    altText: 'ADYAPANLMS Mobile App Screen Displays',
    verificationStatus: 'Verified (Google Play Published)',
  },
  {
    assetName: 'LeadDialer Mobile Screenshots (1, 2, 3)',
    product: 'ADYAPAN LeadDialer App',
    originalUrl: 'https://play.google.com/store/apps/details?id=com.adyapan.leaddialer',
    localAssetPath: '/portfolio/leaddialer-screen-[1,2,3].jpg',
    usageApproval: 'Official Store Screenshots',
    altText: 'ADYAPAN LeadDialer Outbound Calling Interface',
    verificationStatus: 'Verified (Google Play Published)',
  },
  {
    assetName: 'Admin Console Mobile Screenshots (1, 2, 3)',
    product: 'ADYAPANADMIN App',
    originalUrl: 'https://play.google.com/store/apps/details?id=com.adyapan.adyapan_admin',
    localAssetPath: '/portfolio/admin-screen-[1,2,3].jpg',
    usageApproval: 'Official Store Screenshots',
    altText: 'ADYAPANADMIN Administrative Mobile Interface',
    verificationStatus: 'Verified (Google Play Published)',
  },
];
