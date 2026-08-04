'use client';

import { s3Url } from '@/lib/s3Url';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, Linkedin, Mail, Code2, Globe, Smartphone, Database, Server, Layout, Layers, Rocket, Award, Briefcase, GraduationCap, MapPin, Calendar, Download, ChevronRight, Sparkles, Zap, Terminal } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Adyapan.com',
    subtitle: 'Ed-Tech Learning Platform',
    description: 'Full-stack ed-tech platform with student portal, course management, skill assessments, career GPS, certificates, recruiter portal, and admin dashboard.',
    techStack: ['Next.js 14', 'React', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay', 'Vercel', 'JWT Auth'],
    features: [
      'Student & Admin Portal with role-based access',
      'Course enrollment & Razorpay payment integration',
      'Skill assessment & career roadmap system',
      'Certificate generation & verification',
      'Recruiter job posting & talent hiring',
      'Fully responsive modern UI/UX',
    ],
    link: 'https://adyapan.com',
    type: 'Web Platform',
    status: 'Live',
    icon: Globe,
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    id: 2,
    title: 'AdyapanSchool.com',
    subtitle: 'School Management System',
    description: 'Comprehensive school management platform for managing students, teachers, classes, attendance, exams, and academic records with analytics.',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'REST API', 'Vercel'],
    features: [
      'Student & teacher management system',
      'Attendance tracking & automated reports',
      'Exam management & result processing',
      'Parent-teacher communication portal',
      'Performance analytics dashboard',
      'Fee management & payment tracking',
    ],
    link: 'https://adyapanschool.com',
    type: 'Web Platform',
    status: 'Live',
    icon: GraduationCap,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 3,
    title: 'AdyapanCRM.in',
    subtitle: 'Customer Relationship Management',
    description: 'CRM solution for educational institutions — manage leads, student inquiries, follow-ups, counsellor assignments, and conversion tracking with automated workflows.',
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
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 4,
    title: 'Adyapan Mobile App',
    subtitle: 'Cross-Platform Mobile Application',
    description: 'Mobile application for Adyapan platform — students access courses, track progress, receive notifications, and manage learning on the go.',
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
    gradient: 'from-green-500 to-emerald-500',
  },
];

const skills = [
  { category: 'Frontend', icon: Layout, items: ['React.js', 'Next.js 14', 'Tailwind CSS', 'TypeScript', 'JavaScript (ES6+)', 'HTML5/CSS3', 'Responsive Design'], color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { category: 'Backend', icon: Server, items: ['Node.js', 'Express.js', 'REST API', 'JWT Authentication', 'MongoDB', 'Mongoose', 'Server Management'], color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  { category: 'DevOps & Tools', icon: Terminal, items: ['Git & GitHub', 'Vercel', 'Linux', 'Docker', 'Firebase', 'VS Code', 'Postman'], color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { category: 'Other Skills', icon: Zap, items: ['Razorpay Integration', 'SEO Optimization', 'UI/UX Design', 'Agile Methodology', 'Problem Solving', 'Team Leadership'], color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
];

const experience = [
  {
    role: 'Tech Team Head',
    company: "SR's Adyapan Edutech Pvt. Ltd.",
    period: 'March 2026 - Present',
    description: 'Leading the entire tech team and development of multiple web platforms and mobile applications. Built adyapan.com, adyapanschool.com, adyapancrm.in, and Adyapan App from scratch. Managing end-to-end product development, architecture decisions, and deployment.',
    type: 'current',
  },
  {
    role: 'Full Stack Developer Trainee',
    company: 'LinuxWorld Informatics Pvt. Ltd. (Vimal Daga Sir)',
    period: 'May 2025 - February 2026',
    description: 'Completed intensive training in full-stack web development, Linux system administration, DevOps, Docker, cloud computing, and server management under the mentorship of Vimal Daga Sir.',
    type: 'past',
  },
];

export default function DeveloperPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.type === activeFilter);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/5 via-transparent to-transparent" />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] transition-all duration-1000 ease-out"
          style={{ 
            left: mousePos.x - 250, 
            top: mousePos.y - 250,
            background: 'radial-gradient(circle, rgba(255,165,0,0.15) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,165,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,165,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-0 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/5 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-8 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                <span>Full Stack Developer & Tech Team Head</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
                <span className="text-white">Rupesh</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 animate-pulse">
                  Kumar Rupak
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
                Building scalable web platforms & mobile apps that power 
                <span className="text-orange-400 font-medium"> 10,000+ users</span>. 
                Passionate about creating impactful digital products in the EdTech space.
              </p>

              {/* Info chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  India
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <Briefcase className="w-3.5 h-3.5 text-orange-400" />
                  Adyapan Edutech
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  Available for Projects
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href="/resume-rupesh.pdf"
                  download
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-[0_0_30px_rgba(255,165,0,0.3)] hover:shadow-[0_0_50px_rgba(255,165,0,0.5)] hover:scale-105"
                >
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  Download Resume
                </a>
                <a
                  href="https://www.linkedin.com/in/rupesh-kumar-rupak-bb4b44265"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 border border-orange-500/30 text-orange-400 font-bold rounded-xl hover:bg-orange-500/10 hover:border-orange-500/60 transition-all duration-300 hover:scale-105"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="mailto:rupeshrupak609@gmail.com"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 border border-white/10 text-gray-300 font-bold rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </a>
              </div>
            </div>

            {/* Profile Image */}
            <div className="relative group">
              {/* Neon glow ring */}
              <div className="absolute -inset-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-full opacity-30 blur-xl group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />
              <div className="relative w-72 h-72 md:w-[340px] md:h-[340px] rounded-full p-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#0a0a0f]">
                  <Image
                    src={s3Url('/images/rupesh-developer.jpg')}
                    alt="Rupesh Kumar Rupak"
                    width={340}
                    height={340}
                    className="w-full h-full object-cover object-top"
                    priority
                  />
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-xs font-bold backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                ● Open to Work
              </div>
              <div className="absolute -bottom-2 -left-6 px-4 py-2 bg-[#0a0a0f]/90 border border-orange-500/30 rounded-xl text-orange-400 text-xs font-bold backdrop-blur-sm shadow-[0_0_15px_rgba(255,165,0,0.2)]">
                <Code2 className="w-3.5 h-3.5 inline mr-1" />
                4+ Live Projects
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '4+', label: 'Live Projects', icon: Rocket },
              { value: '3+', label: 'Web Platforms', icon: Globe },
              { value: '1', label: 'Mobile App', icon: Smartphone },
              { value: '10K+', label: 'Users Impacted', icon: Zap },
            ].map((stat, idx) => (
              <div key={idx} className="group text-center p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-default">
                <stat.icon className="w-6 h-6 text-orange-400 mx-auto mb-3 group-hover:scale-125 transition-transform duration-300" />
                <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/5 border border-orange-500/20 rounded-full text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Rocket className="w-3.5 h-3.5" />
            Portfolio
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Projects & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Work</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Live production applications built from scratch — handling real users, real payments, and real impact.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['All', 'Web Platform', 'CRM System', 'Mobile App'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(255,165,0,0.4)] scale-105'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
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
                className="group relative bg-[#111118] border border-white/5 rounded-2xl p-7 hover:border-orange-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,165,0,0.08)] overflow-hidden"
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                
                {/* Header */}
                <div className="relative flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${project.gradient} p-[1px]`}>
                      <div className="w-full h-full rounded-2xl bg-[#111118] flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-orange-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">{project.subtitle}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-[11px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                <p className="relative text-gray-400 text-sm leading-relaxed mb-5">
                  {project.description}
                </p>

                {/* Features */}
                <div className="relative mb-5">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Key Features</div>
                  <ul className="grid grid-cols-1 gap-2">
                    {project.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(255,165,0,0.6)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="relative mb-6">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Tech Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-xs font-medium hover:bg-orange-500/10 hover:border-orange-500/20 hover:text-orange-300 transition-all duration-200 cursor-default"
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
                    className="relative inline-flex items-center gap-2 text-orange-400 text-sm font-bold hover:text-orange-300 transition-colors group/link"
                  >
                    Visit Live Site
                    <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/5 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Layers className="w-3.5 h-3.5" />
              Tech Stack
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Technologies</span>
            </h2>
            <p className="text-gray-500 text-lg">Tools and technologies I use to bring ideas to life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {skills.map((skillGroup) => {
              const SkillIcon = skillGroup.icon;
              return (
                <div key={skillGroup.category} className={`group ${skillGroup.bg} border ${skillGroup.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg backdrop-blur-sm`}>
                  <div className="flex items-center gap-3 mb-5">
                    <SkillIcon className={`w-5 h-5 ${skillGroup.color}`} />
                    <h3 className="text-base font-black text-white">{skillGroup.category}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {skillGroup.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        <div className={`w-1.5 h-1.5 rounded-full ${skillGroup.color.replace('text-', 'bg-')}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/5 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            Career
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Experience & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Training</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {experience.map((exp, idx) => (
            <div key={idx} className={`group relative bg-[#111118] border rounded-2xl p-7 transition-all duration-300 hover:scale-[1.01] ${
              exp.type === 'current' ? 'border-orange-500/30 shadow-[0_0_20px_rgba(255,165,0,0.1)]' : 'border-white/5 hover:border-purple-500/30'
            }`}>
              {exp.type === 'current' && (
                <div className="absolute -top-3 right-6 px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(255,165,0,0.5)]">
                  Current
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h3 className="text-xl font-black text-white">{exp.role}</h3>
                <span className="text-sm text-orange-400 font-bold">{exp.period}</span>
              </div>
              <p className="text-orange-400/70 text-sm font-bold mb-3">{exp.company}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="relative border-t border-white/5">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/5 border border-green-500/20 rounded-full text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
              <GraduationCap className="w-3.5 h-3.5" />
              Education
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Background</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="group relative bg-[#111118] border border-green-500/20 rounded-2xl p-8 hover:border-green-500/40 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.05)] hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 p-[1px] shrink-0">
                  <div className="w-full h-full rounded-2xl bg-[#111118] flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-green-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="text-xl font-black text-white">B.Tech — Computer Science & Engineering</h3>
                    <span className="text-sm text-green-400 font-bold">2022 - 2026</span>
                  </div>
                  <p className="text-green-400/70 text-sm font-bold mb-3">Vivekananda Global University (VGU), Jaipur</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Comprehensive study of computer science fundamentals with hands-on focus on Full Stack Web Development, 
                    System Design, and modern application architecture. Combined academic knowledge with real-world product building.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Data Structures', 'Algorithms', 'DBMS', 'OS', 'Web Development', 'Software Engineering', 'Computer Networks'].map((subject) => (
                      <span key={subject} className="px-3 py-1 bg-green-500/5 border border-green-500/15 text-green-300/70 rounded-lg text-xs font-medium">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="relative bg-gradient-to-br from-orange-500/5 via-[#111118] to-amber-500/5 border border-orange-500/20 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Let&apos;s Build Something{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Amazing</span>{' '}
                Together
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg">
                I&apos;m always open to discussing new projects, collaborations, or opportunities to create impactful digital products.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/resume-rupesh.pdf"
                  download
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-[0_0_30px_rgba(255,165,0,0.3)] hover:shadow-[0_0_50px_rgba(255,165,0,0.5)] hover:scale-105"
                >
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  Download Resume
                </a>
                <a
                  href="https://www.linkedin.com/in/rupesh-kumar-rupak-bb4b44265"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-orange-500/30 text-orange-400 font-bold rounded-xl hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,165,0,0.2)]"
                >
                  <Linkedin className="w-5 h-5" />
                  Connect on LinkedIn
                </a>
                <a
                  href="mailto:rupeshrupak609@gmail.com"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 text-gray-300 font-bold rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <Mail className="w-5 h-5" />
                  rupeshrupak609@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Rupesh Kumar Rupak. Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
