/**
 * Seed talent profiles into MongoDB Atlas
 * Run: node scripts/seed-talents.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const schema = new mongoose.Schema({
  name: String, company: String, role: String,
  status: { type: String, default: 'available' },
  placed: Boolean, availability: String, packageExpectation: String,
  skills: [String], education: String, course: String,
  experienceLevel: String, projectsCount: Number, certificatesCount: Number,
  rating: Number, portfolio: String, github: String, linkedin: String,
  email: { type: String, lowercase: true }, phone: String, location: String,
  photoUrl: String,
  resumeUrl: String, profileSummary: String, objective: String,
  experience: mongoose.Schema.Types.Mixed,
  projects: mongoose.Schema.Types.Mixed,
  certifications: [String],
}, { timestamps: true, collection: 'studenttalents' });

const talents = [
  {
    name: 'Rupesh Kumar Rupak', company: "SR's Adyapan Edutech Pvt. Ltd.", role: 'Tech & IT Lead',
    status: 'placed', placed: true, availability: 'Currently Employed', packageExpectation: 'Not disclosed',
    skills: ['Next.js 14/15', 'React.js', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'Three.js / WebGL', 'GSAP Motion', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Prisma ORM', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD Pipelines', 'AWS (EC2, S3, CloudFront)', 'Linux System Admin', 'REST APIs', 'JWT Auth', 'Razorpay Payment Gateway', 'Git', 'GitHub', 'Python', 'Java'],
    education: 'B.Tech CSE, Vivekananda Global University, 2022-2026, CGPA 8.00/10.00',
    course: 'Full Stack Development & DevOps', experienceLevel: 'Tech Lead & Full Stack Developer',
    projectsCount: 7, certificatesCount: 3, rating: 4.9,
    portfolio: 'https://rupeshrupak.vercel.app',
    github: 'https://github.com/Rupeshrupak222',
    linkedin: 'https://www.linkedin.com/in/rupesh-kumar-rupak-bb4b44265/',
    photoUrl: '/images/rup.jpeg',
    email: 'rupeshrupak609@gmail.com', phone: '8292244709',
    location: 'Hyderabad, Telangana', resumeUrl: '/resume/RupeshAD.pdf',
    objective: 'Tech & IT Lead and Full Stack Software Engineer specializing in building scalable distributed web platforms, high-throughput backends, DevOps pipelines, and cloud architectures. Leading engineering teams to deliver impactful products powering 10,000+ active users.',
    profileSummary: "Tech & IT Lead at SR's Adyapan Edutech leading end-to-end engineering for adyapan.com, adyapanschool.com, adyapancrm.in, and mobile apps. Specializing in Next.js, React, Node.js, Express, MongoDB, PostgreSQL, AWS, Docker, CI/CD, and scalable EdTech architectures powering 10,000+ active learners.",
    experience: [
      {
        company: "SR's Adyapan Edutech Pvt. Ltd.", role: 'Tech & IT Lead', duration: 'March 2026 — Present', location: 'Hyderabad, Telangana / India',
        points: [
          'Leading the entire tech team and end-to-end development of multiple web platforms and the Adyapan mobile app.',
          'Architected and built adyapan.com, adyapanschool.com, adyapancrm.in, and the Adyapan mobile app from scratch as lead engineer.',
          'Architected multi-role systems (student, teacher, admin, lead) with JWT auth, MongoDB, and PostgreSQL backends.',
          'Integrated Razorpay payment gateway for course purchases across the platform with automated receipts and zero downtime.',
          'Built internal CRM Hub (adyapancrm.in) with real-time lead tracking, multi-stage pipelines, and conversion analytics.',
          'Managed CI/CD pipelines, Vercel deployments, and AWS cloud infrastructure for 10,000+ active users.'
        ]
      },
      {
        company: 'LinuxWorld Informatics Pvt. Ltd.', role: 'Full Stack Developer Trainee / Tech Intern', duration: 'May 2025 — February 2026', location: 'Jaipur, Rajasthan',
        points: [
          'Mastered Linux system administration, shell scripting, and server management for production environments under Vimal Daga Sir.',
          'Completed intensive hands-on DevOps training in Docker containerization, CI/CD pipelines, and automated deployments with Jenkins & Kubernetes.',
          'Built and deployed cloud-native applications on AWS with EC2, S3, and CloudFront infrastructure.',
          'Contributed to frontend and backend modules, building responsive UI components and enhancing user experience.'
        ]
      },
      {
        company: 'Freelance & Personal Projects', role: 'Full Stack Developer', duration: 'Jan 2025 — July 2025', location: 'Jaipur, India',
        points: [
          'Built and shipped production web applications independently (ShareGO, E-commerce platforms, service booking systems).',
          'Engineered REST APIs with Node.js, Express.js, JWT authentication, and relational/document databases.',
          'Designed responsive, accessible modern interfaces using React.js and Tailwind CSS.'
        ]
      }
    ],
    projects: [
      { name: 'Adyapan.com', type: 'Flagship EdTech Platform', tools: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay', 'AWS', 'Vercel'], description: 'The flagship EdTech platform of Adyapan powering verified skill learning, real company projects, and direct placement for 10,000+ active learners with Razorpay payments and blockchain-verified credentials.' },
      { name: 'Adyapan School', type: 'School Management & Curriculum Platform', tools: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Vercel'], description: 'School-focused EdTech platform delivering 21st-century skills curriculum (Coding, AI, Financial Literacy) for Class 1–12 with interactive workshops, hackathon modules, and analytics.' },
      { name: 'Adyapan CRM', type: 'Internal CRM Hub Portal', tools: ['React.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Vercel'], description: 'Custom internal CRM platform for Adyapan operations managing student leads, multi-stage sales pipelines, counsellor assignments, and real-time conversion analytics.' },
      { name: 'My.Adyapan — LMS', type: 'Enterprise Learning Management System', tools: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma ORM', 'AWS'], description: 'Enterprise Learning Management System with virtual classrooms, live assessments, automated grading, and scalable AWS infrastructure for 12,000+ concurrent learners.' },
      { name: 'AI.Adyapan — AI Platform', type: 'AI-Powered Learning Companion', tools: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'LLM APIs', 'MongoDB', 'Vercel'], description: 'Smart AI-powered learning platform delivering real-time doubt resolution, personalized learning paths, and dynamic AI-generated practice quizzes.' },
      { name: 'ShareGO', type: 'Full Stack Social & Ride Sharing App', tools: ['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'Firebase', 'Netlify'], description: 'Modern full-stack social sharing and ride-connecting platform enabling users to connect with fellow travelers, share rides, and reduce travel costs.' },
      { name: 'Luxury 3D Portfolio', type: 'WebGL Creative Digital Experience', tools: ['Next.js 15', 'Three.js', 'WebGL', 'GLSL', 'GSAP', 'Tailwind CSS', 'Vercel'], description: 'Production-grade luxury digital portfolio showcasing high-performance 3D graphics, procedural WebGL shaders, smooth motion choreography, and full-stack projects.' }
    ],
    certifications: [
      'LinuxWorld Informatics: Full Stack Web Development & DevOps Training (Vimal Daga Sir)',
      'NPTEL: Management Information System',
      'LinuxWorld Informatics: JAZBAA 4.0 Webinar & Cloud Tech'
    ],
  },
  {
    name: 'Vinay Kumar', company: 'Adyapan', role: 'Full Stack Developer',
    status: 'placed', placed: true, availability: 'Not Available', packageExpectation: 'Not disclosed',
    skills: ['Python', 'Java', 'C++', 'R', 'SQL', 'JavaScript', 'Node.js', 'Express.js', 'REST API', 'PostgreSQL', 'MySQL', 'Supabase', 'ETL', 'Power BI', 'DAX', 'Power Query', 'Tableau', 'Excel', 'Git', 'GitHub', 'Postman', 'Docker', 'AWS', 'OOP', 'DSA'],
    education: 'B.Tech CSE, Lovely Professional University, Since Aug 2022, CGPA 7.00/10',
    course: 'Full Stack Development', experienceLevel: 'Fresher',
    projectsCount: 3, certificatesCount: 3, rating: 4.5,
    portfolio: '',
    github: 'https://github.com/vinayrai561',
    linkedin: 'https://linkedin.com/in/vinayrai561',
    email: 'vinayrailkw@gmail.com', phone: '+91-8558877045',
    location: 'Punjab, India', resumeUrl: '',
    objective: 'Full-stack data analytics developer experienced in building REST APIs, dashboards, ETL workflows, and scalable data-driven applications. Strong foundation in DSA, SQL, backend development, and BI.',
    profileSummary: 'Placed Full Stack Developer at Adyapan. Skilled in Node.js, Express.js, PostgreSQL, Supabase, Power BI, and data analytics. Built REST APIs, ETL pipelines, and BI dashboards.',
    experience: [
      {
        company: 'CipherSchools & LPU', role: 'DSA Intern', duration: 'Aug 2022 â€“ Dec 2022', location: 'Punjab, India',
        points: [
          'Completed advanced DSA curriculum; mastered trees, graphs, and dynamic programming.',
          'Built Java Library Management System using OOP and DSA principles.',
        ]
      }
    ],
    projects: [
      {
        name: 'Web3 Customer Query Management System', type: 'Full Stack Web Application',
        tools: ['Node.js', 'Express.js', 'Supabase', 'PostgreSQL', 'Web3.js'],
        description: 'Built REST APIs for customer query tracking and agent workflow automation. Added immutable transaction IDs using Supabase + Web3 concepts. Optimized PostgreSQL schema for fast query performance.'
      },
      {
        name: 'Employee Analytics Dashboard', type: 'BI / Data Analytics',
        tools: ['Power BI', 'DAX', 'Power Query', 'Excel'],
        description: 'Designed dashboards showing KPIs (revenue, profit, YoY growth). Performed ETL with Power Query and automated data refresh.'
      },
      {
        name: 'Responsive Coding Practice Platform', type: 'Frontend Web Application',
        tools: ['HTML', 'CSS', 'JavaScript'],
        description: 'Built a responsive coding practice platform with real-time code execution.'
      }
    ],
    certifications: [
      'Data Structures using C & C++ â€” Udemy (Nov 2024 â€“ Jan 2025)',
      'R Programming for Data Science â€” Udemy (Sep 2024 â€“ Nov 2024)',
      'Data Structures and Algorithms â€” CipherSchools (Oct 2022 â€“ Dec 2022)',
    ],
  },
  {
    name: 'Rukhsana Azami', company: '', role: 'Nursing Intern',
    status: 'available', placed: false, availability: 'Immediate', packageExpectation: 'Internship',
    skills: ['Patient Care', 'Clinical Support', 'Communication', 'Emergency Assistance', 'Healthcare Basics'],
    education: 'B.Sc. Nursing', course: 'B.Sc. Nursing', experienceLevel: 'Internship',
    projectsCount: 2, certificatesCount: 1, rating: 4.5,
    portfolio: '', github: '', linkedin: '', email: '', phone: '',
    location: 'India', resumeUrl: '',
    objective: 'B.Sc. Nursing student looking for internship opportunities in hospitals and healthcare organizations. Available immediately and eager to gain clinical experience.',
    profileSummary: 'Dedicated B.Sc. Nursing student looking for internship opportunities. Available immediately and eager to gain clinical experience.',
    experience: [], projects: [], certifications: [],
  }
];

async function seed() {
  await mongoose.connect(MONGO_URI, { dbName: 'adyapan', serverSelectionTimeoutMS: 15000 });
  console.log('Connected to Atlas:', mongoose.connection.host);

  const Model = mongoose.models.StudentTalent || mongoose.model('StudentTalent', schema);

  let inserted = 0, skipped = 0;
  for (const t of talents) {
    const orConds = [];
    if (t.email) orConds.push({ email: t.email });
    if (t.phone) orConds.push({ phone: t.phone });
    const exists = orConds.length ? await Model.findOne({ $or: orConds }) : null;
    if (exists) { console.log('Skipped (exists):', t.name); skipped++; continue; }
    await Model.create(t);
    console.log('Inserted:', t.name);
    inserted++;
  }
  console.log('\nDone. Inserted:', inserted, '| Skipped:', skipped);
  await mongoose.disconnect();
}

seed().catch(e => { console.error('Seed failed:', e.message); process.exit(1); });
