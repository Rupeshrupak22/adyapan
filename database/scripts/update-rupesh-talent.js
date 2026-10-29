/**
 * Update Rupesh Kumar Rupak's talent profile with authentic resume data
 * Run: node database/scripts/update-rupesh-talent.js
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../backend/.env') });

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('MONGODB_URI not found in env');
  process.exit(1);
}

const updatedData = {
  name: 'Rupesh Kumar Rupak',
  company: "Adyapan Edutech Pvt. Ltd.",
  role: 'Tech & IT Lead',
  status: 'placed',
  placed: true,
  availability: 'Currently Employed',
  packageExpectation: 'Not disclosed',
  skills: [
    'React.js', 'Next.js 14/15', 'Node.js', 'Express.js', 'JavaScript', 'TypeScript',
    'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'REST APIs',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Supabase', 'DynamoDB',
    'AWS (EC2, S3, Lambda, CloudFront)', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD',
    'Linux', 'Git', 'GitHub', 'Razorpay Payment Gateway', 'Python (Basic)', 'C'
  ],
  education: 'B.Tech in Computer Science and Engineering, Vivekananda Global University, 2022 – 2026, CGPA: 8.00/10.00',
  course: 'Full Stack Development & DevOps',
  experienceLevel: 'Technical Team Lead & Full Stack Developer',
  projectsCount: 7,
  certificatesCount: 2,
  rating: 4.9,
  portfolio: 'https://rupeshrupak.vercel.app',
  github: 'https://github.com/Rupeshrupak222',
  linkedin: 'https://www.linkedin.com/in/rupesh-kumar-rupak-bb4b44265/',
  photoUrl: '/images/rup.jpeg',
  email: 'rupeshrupak609@gmail.com',
  phone: '8292244709',
  location: 'Hyderabad, Telangana',
  resumeUrl: '/resume/RupeshAD.pdf',
  objective:
    'Full Stack Developer and Technical Team Lead experienced in developing web applications, integrating APIs, managing deployments, and coordinating development teams. Contributing to Adyapan Edutech’s educational platforms, CRM solutions, application maintenance, performance improvements, and technical planning.',
  profileSummary:
    'Technical Team Lead and Full Stack Developer at Adyapan Edutech Pvt. Ltd. experienced in React.js, Node.js, Express.js, MongoDB, AWS, Docker, Jenkins, CI/CD, and payment gateway workflows. Coordinating development across educational platforms, CRM solutions, and cloud infrastructure.',
  experience: [
    {
      company: 'Adyapan Edutech Pvt. Ltd.',
      role: 'Full Stack Developer / Technical Team Lead',
      duration: 'Mar 2026 – Present',
      location: 'Hyderabad, Telangana',
      points: [
        'Coordinate development and maintenance across educational websites, web applications, dashboards, and internal systems.',
        'Work on frontend interfaces, REST APIs, Node.js, Express.js, MongoDB, authentication, and administrative functionality.',
        'Contribute to course workflows, student dashboards, enrollment processes, and Razorpay payment integration.',
        'Support deployment, environment configuration, debugging, responsive design, SEO, and production maintenance.',
        'Allocate tasks, monitor progress, review implementation, resolve blockers, and coordinate feature delivery across teams.'
      ]
    },
    {
      company: 'LinuxWorld Informatics Pvt. Ltd.',
      role: 'Tech Intern',
      duration: 'Jun 2025 – Aug 2025',
      location: 'Jaipur, Rajasthan',
      points: [
        'Built and managed CI/CD pipelines using Jenkins and Docker to support automated application build and deployment workflows.',
        'Practised containerization and assisted with deploying scalable applications using Kubernetes.',
        'Contributed to frontend and backend development, reusable UI components, application troubleshooting, and testing.',
        'Gained practical exposure to Linux, cloud automation, DevOps tools, and deployment processes.'
      ]
    }
  ],
  projects: [
    {
      name: 'Adyapan.com – Educational Technology Platform',
      type: 'Flagship EdTech Platform',
      tools: ['React.js', 'Next.js 14', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay', 'REST APIs', 'Cloud Deployment'],
      description:
        'Contributed to responsive website pages, reusable UI components, navigation, student workflows, and dashboard interfaces. Implemented REST API integration, database-backed functionality, authentication workflows, course features, admin operations, and Razorpay payment verification.'
    },
    {
      name: 'AdyapanCRM.in – EdTech CRM Platform',
      type: 'EdTech CRM Platform',
      tools: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Supabase', 'REST APIs'],
      description:
        'Contributed to lead management, student records, course information, sales activities, and payment-tracking workflows. Built role-based dashboards, team performance visibility, API integration, data validation, and business reporting.'
    },
    {
      name: 'Adyapan School',
      type: 'School Management & Curriculum Platform',
      tools: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Vercel'],
      description:
        'School-focused EdTech platform delivering 21st-century skills curriculum (Coding, AI, Financial Literacy) for Class 1–12 with interactive workshops, hackathon modules, and analytics.'
    },
    {
      name: 'My.Adyapan — LMS',
      type: 'Enterprise Learning Management System',
      tools: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma ORM', 'AWS'],
      description:
        'Enterprise Learning Management System with virtual classrooms, live assessments, automated grading, and scalable AWS infrastructure for 12,000+ concurrent learners.'
    },
    {
      name: 'AI.Adyapan — AI Platform',
      type: 'AI-Powered Learning Companion',
      tools: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'LLM APIs', 'MongoDB', 'Vercel'],
      description:
        'Smart AI-powered learning platform delivering real-time doubt resolution, personalized learning paths, and dynamic AI-generated practice quizzes.'
    },
    {
      name: 'Portfolio – Personal Website',
      type: 'Personal Website',
      tools: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Next.js', 'Three.js'],
      description:
        'Developed a responsive portfolio showcasing projects, technical skills, education, and professional achievements with structured content, interactive components, and layouts for desktop and mobile devices.'
    }
  ],
  certifications: [
    'NPTEL – Management Information Systems (Dec 2024)',
    'LinuxWorld Pvt. Ltd. – JAZBAA 4.0 Workshop Participation Certificate (Aug 2025)'
  ],
  updatedAt: new Date()
};

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;

  const result = await db.collection('studenttalents').updateMany(
    {
      $or: [
        { email: 'rupeshrupak609@gmail.com' },
        { phone: '8292244709' },
        { phone: '8179124566' },
        { name: /Rupesh Kumar Rupak/i },
      ],
    },
    { $set: updatedData }
  );

  console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

  const updatedDoc = await db.collection('studenttalents').findOne({ name: /Rupesh Kumar Rupak/i });
  console.log('Updated Profile in Database:');
  console.log(JSON.stringify({
    name: updatedDoc.name,
    role: updatedDoc.role,
    company: updatedDoc.company,
    phone: updatedDoc.phone,
    location: updatedDoc.location,
    resumeUrl: updatedDoc.resumeUrl,
    portfolio: updatedDoc.portfolio,
    experience: updatedDoc.experience,
    projectsCount: updatedDoc.projects.length
  }, null, 2));

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
