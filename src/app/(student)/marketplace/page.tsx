'use client';

import { useState } from 'react';
import { ExternalLink, Github, Linkedin, Mail, Code2, Globe, Smartphone, Database, Server, Layout, Layers, Rocket, Award, Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Adyapan.com',
    subtitle: 'Ed-Tech Learning Platform',
    description: 'A full-stack ed-tech platform with student portal, course management, skill assessments, career GPS, certificates, recruiter portal, and admin dashboard. Built with Next.js 14, Tailwind CSS, Node.js, MongoDB, and deployed on Vercel.',
    techStack: ['Next.js 14', 'React', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay', 'Vercel', 'JWT Auth'],
    features: [
      'Student & Admin Portal with role-based access',
      'Course enrollment & payment integration (Razorpay)',
      'Skill assessment & career roadmap system',
      'Certificate generation & verification',
      'Recruiter job posting & talent hiring',
      'Responsive design with modern UI/UX',
    ],
    link: 'https://adyapan.com',
    type: 'Web Platform',
    status: 'Live',
    icon: Globe,
  },
  {
    id: 2,
    title: 'AdyapanSchool.com',
    subtitle: 'School Management System',
    description: 'A comprehensive school management platform for managing students, teachers, classes, attendance, exams, and academic records. Modern UI with dashboard analytics and parent communication features.',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'REST API', 'Vercel'],
    features: [
      'Student & teacher management system',
      'Attendance tracking & reports',
      'Exam management & result processing',
      'Parent-teacher communication portal',
      'Academic performance analytics dashboard',
      'Fee management & payment tracking',
    ],
    link: 'https://adyapanschool.com',
    type: 'Web Platform',
    status: 'Live',
    icon: GraduationCap,
  },
  {
    id: 3,
    title: 'AdyapanCRM.in',
    subtitle: 'Customer Relationship Management',
    description: 'A CRM solution designed for educational institutions to manage leads, student inquiries, follow-ups, counsellor assignments, and conversion tracking. Features automated workflows and analytics.',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'REST API'],
    features: [
      'Lead management & tracking pipeline',
      'Counsellor assignment & follow-up automation',
      'Student inquiry management system',
      'Conversion analytics & reporting',
      'Automated email & notification system',
      'Role-based admin panel',
    ],
    link: 'https://adyapancrm.in',
    type: 'CRM System',
    status: 'Live',
    icon: Database,
  },
  {
    id: 4,
    title: 'Adyapan Mobile App',
    subtitle: 'Cross-Platform Mobile Application',
    description: 'A mobile application for Adyapan platform enabling students to access courses, track progress, receive notifications, and manage their learning journey on the go. Built with modern mobile technologies.',
    techStack: ['React Native', 'Node.js', 'MongoDB', 'Push Notifications', 'REST API', 'Firebase'],
    features: [
      'Course access & video streaming',
      'Progress tracking & skill assessment',
      'Push notifications for updates',
      'Offline content access',
      'Certificate viewing & sharing',
      'In-app payment integration',
    ],
    link: '#',
    type: 'Mobile App',
    status: 'Live',
    icon: Smartphone,
  },
];

const skills = [
  { category: 'Frontend', items: ['React.js', 'Next.js 14', 'Tailwind CSS', 'TypeScript', 'JavaScript (ES6+)', 'HTML5/CSS3', 'Responsive Design'] },
  { category: 'Backend', items: ['Node.js', 'Express.js', 'REST API', 'JWT Authentication', 'MongoDB', 'Mongoose', 'Server Management'] },
  { category: 'Tools & DevOps', items: ['Git & GitHub', 'Vercel', 'VS Code', 'Postman', 'Linux', 'Firebase', 'Docker'] },
  { category: 'Other', items: ['Razorpay Integration', 'SEO Optimization', 'UI/UX Design', 'Agile Methodology', 'Problem Solving', 'Team Leadership'] },
];

const experience = [
  {
    role: 'Full Stack Developer & Tech Lead',
    company: "SR's Adyapan Edutech Pvt. Ltd.",
    period: '2024 - Present',
    description: 'Leading the development of multiple web platforms and mobile applications. Built adyapan.com, adyapanschool.com, adyapancrm.in from scratch. Managing end-to-end product development lifecycle.',
  },
  {
    role: 'Linux & DevOps Training',
    company: 'LinuxWorld Informatics (Vimal Daga Sir)',
    period: '2024',
    description: 'Completed advanced training in Linux system administration, server management, and DevOps practices under the mentorship of Vimal Daga Sir.',
  },
];

export default function DeveloperPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.type === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-6">
                <Code2 className="w-4 h-4" />
                Full Stack Developer
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Rupesh Kumar{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                  Rupak
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl">
                Building scalable web platforms & mobile applications. Passionate about creating 
                impactful digital products that solve real-world problems in the education sector.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  India
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Briefcase className="w-4 h-4 text-orange-400" />
                  SR&apos;s Adyapan Edutech Pvt. Ltd.
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  Available for Projects
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href="https://www.linkedin.com/in/rupesh-kumar-rupak-bb4b44265"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-orange-500/25"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn Profile
                </a>
                <a
                  href="mailto:rupeshkumarrupak@gmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 font-semibold rounded-xl hover:border-orange-500/50 hover:text-orange-400 transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  Contact Me
                </a>
              </div>
            </div>

            {/* Profile Visual */}
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center">
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                      RK
                    </div>
                    <div className="text-sm text-gray-500 mt-2 font-medium">Rupak</div>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-2 -right-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                ● Available
              </div>
              <div className="absolute bottom-4 -left-4 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium">
                4+ Projects Live
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400">4+</div>
              <div className="text-sm text-gray-400 mt-1">Live Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400">3+</div>
              <div className="text-sm text-gray-400 mt-1">Web Platforms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400">1</div>
              <div className="text-sm text-gray-400 mt-1">Mobile App</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400">10K+</div>
              <div className="text-sm text-gray-400 mt-1">Users Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Projects & <span className="text-orange-400">Work</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Live production applications built from scratch — handling real users, real payments, and real impact.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['All', 'Web Platform', 'CRM System', 'Mobile App'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const IconComponent = project.icon;
            return (
              <div
                key={project.id}
                className="group bg-gray-900/80 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500">{project.subtitle}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium">
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Features</div>
                  <ul className="grid grid-cols-1 gap-1.5">
                    {project.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                        <Rocket className="w-3.5 h-3.5 text-orange-400 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="mb-5">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tech Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded-md text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Link */}
                {project.link !== '#' && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-300 transition-colors"
                  >
                    Visit Live Site
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Skills Section */}
      <section className="border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Skills & <span className="text-orange-400">Technologies</span>
            </h2>
            <p className="text-gray-400">Tools and technologies I use to bring ideas to life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup) => (
              <div key={skillGroup.category} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  {skillGroup.category === 'Frontend' && <Layout className="w-5 h-5 text-orange-400" />}
                  {skillGroup.category === 'Backend' && <Server className="w-5 h-5 text-orange-400" />}
                  {skillGroup.category === 'Tools & DevOps' && <Layers className="w-5 h-5 text-orange-400" />}
                  {skillGroup.category === 'Other' && <Award className="w-5 h-5 text-orange-400" />}
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience & <span className="text-orange-400">Training</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {experience.map((exp, idx) => (
            <div key={idx} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                <span className="text-sm text-orange-400 font-medium">{exp.period}</span>
              </div>
              <p className="text-orange-400/80 text-sm font-medium mb-2">{exp.company}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Let&apos;s Build Something Together</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              I&apos;m always open to discussing new projects, collaborations, or opportunities to create impactful digital products.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://www.linkedin.com/in/rupesh-kumar-rupak-bb4b44265"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-orange-500/25"
              >
                <Linkedin className="w-5 h-5" />
                Connect on LinkedIn
              </a>
              <a
                href="mailto:rupeshkumarrupak@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 font-semibold rounded-xl hover:border-orange-500/50 hover:text-orange-400 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Email Me
              </a>
              <a
                href="https://adyapan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 font-semibold rounded-xl hover:border-orange-500/50 hover:text-orange-400 transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
                adyapan.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
