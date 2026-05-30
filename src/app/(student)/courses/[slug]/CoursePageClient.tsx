'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Download, Star, CheckCircle, ChevronDown, ChevronUp,
  Users, Clock, Award, BookOpen, Briefcase, TrendingUp,
  Phone, Mail, MessageCircle, X,
} from 'lucide-react';
import { getBrochureFile, getBrochureHref, getThumbnail, getYouTubeEmbedUrl } from '@/lib/courseData';
import PricingModal from '@/components/PricingModal';

function seededHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h) / 2147483647;
}

type Instructor = {
  id: number;
  name: string;
  role: string;
  company: string;
  experience: string;
};

type InstructorProfile = Omit<Instructor, 'id'>;

type CurriculumModule = {
  id: number;
  title: string;
  description: string;
  badge: string;
  topics: Record<string, string[]>;
  lab: string;
  outcome: string;
};

type Curriculum = {
  title: string;
  summary: string;
  badges: string[];
  modules: CurriculumModule[];
};

const instructorProfiles: Record<string, InstructorProfile[]> = {
  ai: [
    { name: 'Aarav Mehta', role: 'AI Solutions Architect', company: 'Cognitive Systems Lab', experience: '9+ years exp' },
    { name: 'Nisha Rao', role: 'Machine Learning Engineer', company: 'VisionAI Studio', experience: '7+ years exp' },
    { name: 'Ritvik Sen', role: 'NLP Specialist', company: 'Language Intelligence Hub', experience: '8+ years exp' },
    { name: 'Meera Kulkarni', role: 'Computer Vision Mentor', company: 'Applied AI Works', experience: '6+ years exp' },
    { name: 'Kabir Anand', role: 'MLOps Consultant', company: 'ModelOps Cloud', experience: '10+ years exp' },
    { name: 'Tanya Bhatia', role: 'AI Product Lead', company: 'Automation Research Co.', experience: '8+ years exp' },
    { name: 'Dev Arora', role: 'Deep Learning Engineer', company: 'Neural Systems Studio', experience: '7+ years exp' },
    { name: 'Ishita Kapoor', role: 'GenAI Workflow Trainer', company: 'PromptOps Lab', experience: '6+ years exp' },
  ],
  data: [
    { name: 'Rohan Iyer', role: 'Data Science Lead', company: 'Insight Analytics Co.', experience: '9+ years exp' },
    { name: 'Ananya Bose', role: 'Data Engineer', company: 'Pipeline DataWorks', experience: '7+ years exp' },
    { name: 'Karan Malhotra', role: 'BI Consultant', company: 'Dashboard Labs', experience: '8+ years exp' },
    { name: 'Shruti Menon', role: 'Analytics Manager', company: 'Decision Science Studio', experience: '10+ years exp' },
    { name: 'Nikhil Jain', role: 'SQL & Data Modeling Mentor', company: 'DataOps Collective', experience: '6+ years exp' },
    { name: 'Aditi Nair', role: 'Power BI Specialist', company: 'MetricWorks', experience: '7+ years exp' },
    { name: 'Pranav Shah', role: 'ETL Architect', company: 'Cloud Data Foundry', experience: '11+ years exp' },
    { name: 'Sneha Rathi', role: 'Python Analytics Trainer', company: 'Analytics Bridge', experience: '5+ years exp' },
  ],
  software: [
    { name: 'Vikram Sethi', role: 'Full Stack Architect', company: 'Product Engineering Works', experience: '10+ years exp' },
    { name: 'Pooja Saxena', role: 'Frontend Engineer', company: 'Interface Labs', experience: '7+ years exp' },
    { name: 'Harsh Vardhan', role: 'Backend Developer', company: 'API Systems Co.', experience: '8+ years exp' },
    { name: 'Ritika Chopra', role: 'Mobile App Mentor', company: 'AppCraft Studio', experience: '6+ years exp' },
    { name: 'Aditya Joshi', role: 'Java Full Stack Lead', company: 'Enterprise Stack Lab', experience: '9+ years exp' },
    { name: 'Mansi Verma', role: 'Python Developer', company: 'BackendWorks', experience: '7+ years exp' },
    { name: 'Sahil Grover', role: 'QA Automation Engineer', company: 'TestGrid Systems', experience: '8+ years exp' },
    { name: 'Charu Jain', role: 'DSA Interview Mentor', company: 'Code Practice Lab', experience: '6+ years exp' },
  ],
  cloud: [
    { name: 'Arjun Pillai', role: 'Cloud Solutions Architect', company: 'CloudOps India', experience: '11+ years exp' },
    { name: 'Neha Bansal', role: 'AWS Mentor', company: 'InfraScale Cloud', experience: '8+ years exp' },
    { name: 'Yash Tandon', role: 'DevOps Engineer', company: 'ReleaseWorks', experience: '7+ years exp' },
    { name: 'Kavya Suresh', role: 'Kubernetes Specialist', company: 'ContainerOps Lab', experience: '9+ years exp' },
    { name: 'Raghav Khanna', role: 'Site Reliability Engineer', company: 'Uptime Systems', experience: '10+ years exp' },
    { name: 'Sonal Mehta', role: 'CI/CD Consultant', company: 'PipelineOps Studio', experience: '6+ years exp' },
    { name: 'Tanmay Ghosh', role: 'Cloud Security Trainer', company: 'SecureCloud Works', experience: '8+ years exp' },
    { name: 'Disha Pandey', role: 'Infrastructure Automation Lead', company: 'Terraform Practice Lab', experience: '7+ years exp' },
  ],
  design: [
    { name: 'Maya Krishnan', role: 'UX Research Lead', company: 'Human Interface Studio', experience: '9+ years exp' },
    { name: 'Rhea Arora', role: 'UI Designer', company: 'PixelCraft Design', experience: '6+ years exp' },
    { name: 'Omkar Patil', role: 'Brand Designer', company: 'Creative Identity Lab', experience: '8+ years exp' },
    { name: 'Sanya Dutta', role: 'Product Design Mentor', company: 'Design Systems Co.', experience: '7+ years exp' },
    { name: 'Neil Thomas', role: 'AR/VR Experience Designer', company: 'Immersive Media Works', experience: '8+ years exp' },
    { name: 'Ira Kapoor', role: 'Motion Graphics Specialist', company: 'Visual Effects Studio', experience: '6+ years exp' },
    { name: 'Reyansh Kulkarni', role: 'Figma Workflow Trainer', company: 'Prototype Lab', experience: '5+ years exp' },
    { name: 'Avni Shah', role: 'Portfolio Review Mentor', company: 'Creative Careers Studio', experience: '7+ years exp' },
  ],
  management: [
    { name: 'Rachit Agarwal', role: 'Investment Banking Analyst', company: 'Capital Advisory Desk', experience: '8+ years exp' },
    { name: 'Surbhi Jain', role: 'Finance Mentor', company: 'Valuation Practice Lab', experience: '9+ years exp' },
    { name: 'Aman Bedi', role: 'Marketing Strategy Consultant', company: 'Growth Strategy Co.', experience: '10+ years exp' },
    { name: 'Kritika Sood', role: 'HR Business Partner', company: 'PeopleOps Consulting', experience: '7+ years exp' },
    { name: 'Dhruv Goyal', role: 'Supply Chain Analyst', company: 'Logistics Intelligence Hub', experience: '8+ years exp' },
    { name: 'Pari Mathur', role: 'Salesforce Consultant', company: 'CRM Solutions Desk', experience: '6+ years exp' },
    { name: 'Rishi Kapoor', role: 'SAP FICA Specialist', company: 'ERP Finance Systems', experience: '9+ years exp' },
    { name: 'Meghna Roy', role: 'Business Communication Coach', company: 'Workplace English Studio', experience: '7+ years exp' },
  ],
  electronics: [
    { name: 'Siddharth Menon', role: 'Embedded Systems Engineer', company: 'FirmwareWorks Lab', experience: '9+ years exp' },
    { name: 'Keerthi Ramesh', role: 'VLSI Design Mentor', company: 'Chip Design Studio', experience: '8+ years exp' },
    { name: 'Abhinav Nair', role: 'IoT Solutions Engineer', company: 'Connected Devices Lab', experience: '7+ years exp' },
    { name: 'Tara Kulkarni', role: 'Robotics Trainer', company: 'Automation Systems Hub', experience: '6+ years exp' },
    { name: 'Varun Shetty', role: 'EV Systems Specialist', company: 'E-Mobility Engineering', experience: '10+ years exp' },
    { name: 'Lavanya Iyer', role: 'Power Systems Consultant', company: 'GridTech Solutions', experience: '9+ years exp' },
    { name: 'Naveen Rao', role: 'PCB Design Mentor', company: 'Electronics Prototyping Lab', experience: '7+ years exp' },
    { name: 'Diya Sinha', role: 'Sensor Integration Engineer', company: 'Smart Hardware Works', experience: '6+ years exp' },
  ],
  mechanical: [
    { name: 'Akhil Deshmukh', role: 'CAD Design Engineer', company: 'Precision Design Studio', experience: '9+ years exp' },
    { name: 'Nandini Verma', role: 'CATIA Specialist', company: 'Product Modeling Lab', experience: '7+ years exp' },
    { name: 'Rohit Balan', role: 'Automotive Design Mentor', company: 'Mobility Design Works', experience: '10+ years exp' },
    { name: 'Isha Chawla', role: 'Quality Systems Lead', company: 'Manufacturing Excellence Co.', experience: '8+ years exp' },
    { name: 'Sameer Kulkarni', role: 'Safety Engineering Consultant', company: 'Industrial Safety Desk', experience: '9+ years exp' },
    { name: 'Bhavya Narang', role: 'CNC Process Trainer', company: 'Advanced Manufacturing Lab', experience: '6+ years exp' },
    { name: 'Tejas Nambiar', role: 'Product Development Engineer', company: 'Mechanical Prototyping Works', experience: '8+ years exp' },
    { name: 'Mrunal Shah', role: 'Lean Manufacturing Mentor', company: 'Process Improvement Studio', experience: '7+ years exp' },
  ],
  lifeScience: [
    { name: 'Dr. Ira Banerjee', role: 'Bioinformatics Scientist', company: 'Genomics Research Lab', experience: '10+ years exp' },
    { name: 'Dr. Kunal Basu', role: 'Microbiology Mentor', company: 'Clinical Micro Lab', experience: '9+ years exp' },
    { name: 'Dr. Ayesha Khan', role: 'Molecular Biology Specialist', company: 'Molecular Diagnostics Hub', experience: '8+ years exp' },
    { name: 'Dr. Rohan Dey', role: 'Genetic Engineering Trainer', company: 'Biotech Innovation Studio', experience: '7+ years exp' },
    { name: 'Dr. Nivedita Rao', role: 'Pharmacovigilance Consultant', company: 'Drug Safety Desk', experience: '9+ years exp' },
    { name: 'Dr. Pratik Saha', role: 'Nanotechnology Research Mentor', company: 'NanoBio Materials Lab', experience: '8+ years exp' },
    { name: 'Dr. Kavita Menon', role: 'Food Science Specialist', company: 'Food Quality Lab', experience: '10+ years exp' },
    { name: 'Dr. Tanvi Arora', role: 'Medical Coding Trainer', company: 'Healthcare Documentation Co.', experience: '6+ years exp' },
  ],
  civil: [
    { name: 'Prakash Reddy', role: 'Construction Planning Engineer', company: 'BuildPlan Consultants', experience: '11+ years exp' },
    { name: 'Shalini Gupta', role: 'Project Controls Specialist', company: 'Infra Scheduling Desk', experience: '9+ years exp' },
    { name: 'Mohit Narayan', role: 'Site Planning Mentor', company: 'CivilWorks Studio', experience: '8+ years exp' },
    { name: 'Farah Khan', role: 'Cost Estimation Consultant', company: 'Quantity Survey Lab', experience: '7+ years exp' },
    { name: 'Nitesh Yadav', role: 'Structural Coordination Lead', company: 'Urban Infra Works', experience: '10+ years exp' },
    { name: 'Vaidehi Shah', role: 'Primavera Planning Trainer', company: 'Project Timeline Co.', experience: '8+ years exp' },
    { name: 'Armaan Singh', role: 'Safety & Quality Engineer', company: 'Site Compliance Hub', experience: '6+ years exp' },
    { name: 'Leena Thomas', role: 'BIM Coordination Mentor', company: 'Digital Construction Lab', experience: '7+ years exp' },
  ],
};

function getInstructorDomain(courseTitle: string): keyof typeof instructorProfiles {
  const lower = courseTitle.toLowerCase();
  if (/(\bai\b|artificial|machine learning|generative|genai)/.test(lower)) return 'ai';
  if (/(web|app|python|java|selenium|structures|algorithms)/.test(lower)) return 'software';
  if (/(autocad|catia|car design|quality|safety)/.test(lower)) return 'mechanical';
  if (/(data|analytics|database|dbms|business analytics)/.test(lower)) return 'data';
  if (/(devops|cloud|aws|cyber|security|blockchain|bitcoin)/.test(lower)) return 'cloud';
  if (/(ui|ux|graphic|vfx|ar\/vr|ar vr|design)/.test(lower)) return 'design';
  if (/(finance|investment|marketing|hrm|management|supply|sap|salesforce|stock|acca|cfa|spoken)/.test(lower)) return 'management';
  if (/(embedded|hybrid|electric|vlsi|iot|robotics|power systems)/.test(lower)) return 'electronics';
  if (/(bio|microbiology|molecular|genetic|pharmacovigilance|nano|food|nutrition|sensory|medical coding)/.test(lower)) return 'lifeScience';
  if (/(construction|civil)/.test(lower)) return 'civil';
  return 'software';
}

const generateInstructors = (courseTitle: string): Instructor[] => {
  const profiles = instructorProfiles[getInstructorDomain(courseTitle)];
  const offset = Math.floor(seededHash(`${courseTitle}-instructors`) * profiles.length);
  return profiles.map((_, index) => ({
    id: index + 1,
    ...profiles[(index + offset) % profiles.length],
  }));
};

function getCurriculumDomain(title: string): keyof typeof curriculumTemplates {
  const lower = title.toLowerCase();
  if (/(\bai\b|artificial|machine learning|generative|genai)/.test(lower)) return 'ai';
  if (/(web|app|python|java|selenium|structures|algorithms)/.test(lower)) return 'software';
  if (/(autocad|catia|car design|quality|safety)/.test(lower)) return 'mechanical';
  if (/(data|analytics|database|dbms|business analytics)/.test(lower)) return 'data';
  if (/(devops|cloud|aws|cyber|security|blockchain|bitcoin)/.test(lower)) return 'cloud';
  if (/(ui|ux|graphic|vfx|ar\/vr|ar vr|design)/.test(lower)) return 'design';
  if (/(embedded|hybrid|electric|vlsi|iot|robotics|power systems)/.test(lower)) return 'electronics';
  if (/(bio|microbiology|molecular|genetic|pharmacovigilance|nano|food|nutrition|sensory|medical coding)/.test(lower)) return 'lifeScience';
  if (/(construction|civil)/.test(lower)) return 'civil';
  if (/(finance|investment|economics|marketing|hrm|management|supply|sap|salesforce|stock|acca|cfa|spoken)/.test(lower)) return 'management';
  return 'software';
}

const domainIntro: Record<string, string> = {
  ai: 'model building, intelligent automation, evaluation, and responsible AI practice',
  data: 'data collection, analytics, dashboards, business interpretation, and portfolio-ready reporting',
  software: 'practical coding, system design, testing, and production-grade application building',
  cloud: 'infrastructure, automation, reliability, security, and cloud operations',
  design: 'research, visual systems, prototyping, critique, and portfolio presentation',
  management: 'business frameworks, market context, tools, case analysis, and decision-making practice',
  electronics: 'hardware fundamentals, systems thinking, simulation, testing, and applied engineering practice',
  mechanical: 'design fundamentals, CAD workflows, manufacturing thinking, safety, and professional documentation',
  lifeScience: 'scientific foundations, lab workflows, regulatory awareness, analysis, and documented case practice',
  civil: 'site planning, estimation, scheduling, safety, and project-control documentation',
};

const curriculumTemplates = {
  ai: (title: string): CurriculumModule[] => [
    { id: 1, badge: 'Foundation', title: 'AI & Python Foundations', description: 'Build the coding and math base needed for intelligent systems.', lab: 'Set up a Python AI notebook and analyze a starter dataset.', outcome: 'You can explain where AI fits and prepare data for model training.', topics: { 'Core Skills': ['Python for AI workflows', 'NumPy, Pandas, and visualization', 'Linear algebra intuition', 'Probability and model thinking'], 'Industry Context': ['AI use cases by sector', 'Data ethics and bias', 'Model lifecycle overview', 'AI project scoping'] } },
    { id: 2, badge: 'Modeling', title: 'Machine Learning Models', description: 'Train, compare, and tune models for real prediction problems.', lab: 'Build classification and regression models with clear evaluation metrics.', outcome: 'You can choose the right model and justify performance using metrics.', topics: { 'Algorithms': ['Regression and classification', 'Decision trees and ensembles', 'Clustering and segmentation', 'Feature engineering'], 'Evaluation': ['Train/test split', 'Accuracy, precision, recall', 'Cross-validation', 'Error analysis'] } },
    { id: 3, badge: 'Deep AI', title: 'Deep Learning, NLP & Vision', description: 'Explore neural networks and modern AI tasks through guided labs.', lab: 'Create a text or image intelligence prototype based on the course focus.', outcome: 'You can connect neural network concepts to practical AI applications.', topics: { 'Neural Networks': ['Perceptrons and activations', 'CNN and RNN concepts', 'Transfer learning', 'Prompting and embeddings'], 'Applications': ['NLP workflows', 'Computer vision basics', 'Generative AI use cases', 'Responsible output review'] } },
    { id: 4, badge: 'Portfolio', title: `${title} Capstone`, description: 'Convert learning into a credible project with documentation and review.', lab: 'Complete an end-to-end AI case study with notebook, findings, and demo.', outcome: 'You leave with a portfolio project that explains problem, method, result, and limits.', topics: { 'Project Work': ['Problem definition', 'Data preparation', 'Model experiment log', 'Result storytelling'], 'Readiness': ['Interview discussion points', 'Model limitations', 'Documentation checklist', 'Presentation review'] } },
  ],
  data: (title: string): CurriculumModule[] => [
    { id: 1, badge: 'Data Base', title: 'Data Foundations & SQL', description: 'Learn how data is structured, cleaned, queried, and trusted.', lab: 'Clean a messy dataset and answer business questions using SQL.', outcome: 'You can prepare reliable data and write queries for analysis.', topics: { 'Data Handling': ['Data types and quality checks', 'Excel/Sheets cleanup', 'SQL select, joins, groups', 'Window functions basics'], 'Thinking': ['Business question framing', 'Data dictionary reading', 'Missing-value strategy', 'Analysis hygiene'] } },
    { id: 2, badge: 'Analysis', title: 'Analytics, Statistics & Visualization', description: 'Turn raw numbers into patterns, decisions, and readable visuals.', lab: 'Build an insight report with charts and recommendations.', outcome: 'You can explain trends and support decisions with evidence.', topics: { 'Analytics': ['Descriptive statistics', 'Segmentation', 'Cohort and trend analysis', 'Hypothesis testing basics'], 'Visualization': ['Chart selection', 'Dashboard layout', 'Power BI/Tableau concepts', 'Executive summaries'] } },
    { id: 3, badge: 'Systems', title: `${title} Tools & Workflow`, description: 'Practice the tools and pipelines used in data teams.', lab: 'Create a repeatable analysis workflow with documented steps.', outcome: 'You understand how data moves from source to report.', topics: { 'Workflow': ['ETL concepts', 'Data modeling basics', 'Python for analysis', 'Quality checks'], 'Collaboration': ['Versioned notebooks', 'Stakeholder notes', 'Metric definitions', 'Review cycles'] } },
    { id: 4, badge: 'Portfolio', title: 'Business Case Project', description: 'Solve a realistic domain problem and present it professionally.', lab: 'Deliver a dashboard or analysis pack for a real business scenario.', outcome: 'You have a portfolio case with data, insight, and recommendation.', topics: { 'Case Work': ['Problem brief', 'Exploratory analysis', 'Dashboard/report creation', 'Recommendation writing'], 'Career Prep': ['Portfolio polish', 'Analytics interview questions', 'Storytelling practice', 'Data ethics'] } },
  ],
  software: (title: string): CurriculumModule[] => [
    { id: 1, badge: 'Code Base', title: `${title} Programming Foundations`, description: 'Build clean coding habits and understand the stack behind the course.', lab: 'Create small programs/components using the core language or framework.', outcome: 'You can write, debug, and explain working code confidently.', topics: { 'Core Coding': ['Syntax and control flow', 'Functions and modules', 'OOP or component thinking', 'Debugging techniques'], 'Developer Habits': ['Git basics', 'Readable code', 'Problem decomposition', 'Local setup'] } },
    { id: 2, badge: 'Build', title: 'Application Architecture', description: 'Learn how real applications are structured beyond isolated examples.', lab: 'Build a feature with data flow, validation, and reusable structure.', outcome: 'You can connect frontend, backend, data, or automation pieces correctly.', topics: { 'Architecture': ['Project structure', 'APIs and routing', 'State/data management', 'Database or file storage'], 'Quality': ['Error handling', 'Input validation', 'Security basics', 'Performance basics'] } },
    { id: 3, badge: 'Practice', title: 'Testing, Review & Collaboration', description: 'Make your work reliable and ready for team environments.', lab: 'Test and improve a feature using realistic review feedback.', outcome: 'You can ship work that is maintainable and review-ready.', topics: { 'Testing': ['Unit and integration thinking', 'Manual QA checklist', 'Automation where relevant', 'Bug fixing workflow'], 'Team Workflow': ['Pull requests', 'Code review', 'Task breakdown', 'Documentation'] } },
    { id: 4, badge: 'Portfolio', title: `${title} Capstone Build`, description: 'Create a complete project that demonstrates job-ready skill.', lab: 'Build a polished app, automation flow, or coding portfolio project.', outcome: 'You finish with a project you can explain in interviews.', topics: { 'Capstone': ['Requirement planning', 'Feature implementation', 'Testing and polish', 'Demo walkthrough'], 'Career Prep': ['Resume project bullets', 'GitHub presentation', 'Interview questions', 'Next learning path'] } },
  ],
  cloud: (title: string): CurriculumModule[] => [
    { id: 1, badge: 'Infra', title: 'Infrastructure Foundations', description: 'Understand servers, networks, cloud services, and operating environments.', lab: 'Map a simple cloud architecture with compute, storage, and network layers.', outcome: 'You can explain how infrastructure supports modern products.', topics: { 'Basics': ['Linux and shell basics', 'Networking essentials', 'Cloud service models', 'Identity and access'], 'Planning': ['Architecture diagrams', 'Cost awareness', 'Region and availability', 'Security boundaries'] } },
    { id: 2, badge: 'Automation', title: `${title} Tools & Automation`, description: 'Practice the core tools used to provision, secure, and operate systems.', lab: 'Automate a deployment or infrastructure task with a repeatable workflow.', outcome: 'You can reduce manual work and create reliable setup steps.', topics: { 'Tooling': ['Git and CI/CD', 'Containers or cloud services', 'Infrastructure as code concepts', 'Monitoring basics'], 'Security': ['Secrets management', 'Least privilege', 'Vulnerability basics', 'Audit-friendly configuration'] } },
    { id: 3, badge: 'Reliability', title: 'Operations & Troubleshooting', description: 'Learn how production systems are monitored, debugged, and improved.', lab: 'Investigate a failing service using logs, metrics, and runbook steps.', outcome: 'You can diagnose common operational issues with confidence.', topics: { 'Observability': ['Logs and metrics', 'Alert thinking', 'Incident response', 'Performance bottlenecks'], 'Reliability': ['Backups and recovery', 'Scaling basics', 'Change management', 'Post-incident learning'] } },
    { id: 4, badge: 'Project', title: 'Cloud Operations Case Study', description: 'Create a realistic infrastructure plan or operational workflow.', lab: 'Deliver an architecture/runbook portfolio case with clear decisions.', outcome: 'You leave with proof of cloud, DevOps, security, or platform thinking.', topics: { 'Case Work': ['Requirement analysis', 'Architecture choice', 'Risk review', 'Runbook writing'], 'Career Prep': ['Scenario interviews', 'Tool vocabulary', 'Troubleshooting drills', 'Portfolio documentation'] } },
  ],
  design: (title: string): CurriculumModule[] => [
    { id: 1, badge: 'Research', title: 'User, Brand & Visual Foundations', description: 'Understand users, composition, hierarchy, and design goals.', lab: 'Create a moodboard, user notes, and visual direction for a design brief.', outcome: 'You can justify design decisions instead of only decorating screens.', topics: { 'Foundations': ['User research basics', 'Typography and spacing', 'Color systems', 'Visual hierarchy'], 'Briefing': ['Problem framing', 'Audience definition', 'Competitor scan', 'Creative direction'] } },
    { id: 2, badge: 'Craft', title: `${title} Tools & Production`, description: 'Practice the tools and workflows used by working designers.', lab: 'Create screens, graphics, or immersive assets aligned to the course domain.', outcome: 'You can produce professional, organized design work.', topics: { 'Tools': ['Figma/Adobe workflow', 'Components and assets', 'Responsive thinking', 'Export and handoff'], 'Execution': ['Layout systems', 'Interaction states', 'Brand consistency', 'Accessibility basics'] } },
    { id: 3, badge: 'Review', title: 'Critique, Iteration & Case Study', description: 'Improve work through feedback, usability thinking, and portfolio logic.', lab: 'Run a structured critique and revise your design using evidence.', outcome: 'You can show process, not just final visuals.', topics: { 'Iteration': ['Feedback capture', 'Usability checks', 'Before/after reasoning', 'Design QA'], 'Case Study': ['Problem, process, outcome', 'Screens and annotations', 'Decision notes', 'Presentation flow'] } },
    { id: 4, badge: 'Portfolio', title: 'Portfolio-Ready Design Project', description: 'Build a polished project that looks credible to recruiters and clients.', lab: 'Prepare a final design case study with assets, story, and presentation.', outcome: 'You finish with a domain-specific design portfolio piece.', topics: { 'Final Build': ['Project polish', 'Prototype or final asset', 'Handoff file cleanup', 'Portfolio layout'], 'Career Prep': ['Design interview prep', 'Freelance/client language', 'Review checklist', 'Next steps'] } },
  ],
  management: (title: string): CurriculumModule[] => [
    { id: 1, badge: 'Context', title: `${title} Business Foundations`, description: 'Understand the industry context, vocabulary, and decision frameworks.', lab: 'Analyze a realistic business situation using structured notes.', outcome: 'You can speak the domain language and identify key business levers.', topics: { 'Business Basics': ['Industry overview', 'Key terms and metrics', 'Stakeholder mapping', 'Problem framing'], 'Tools': ['Excel/Sheets workflow', 'Research methods', 'Documentation format', 'Presentation basics'] } },
    { id: 2, badge: 'Analysis', title: 'Frameworks, Data & Decision Making', description: 'Practice analysis techniques used by business teams.', lab: 'Create a model, plan, campaign, or process map based on the course focus.', outcome: 'You can convert messy business information into a practical recommendation.', topics: { 'Analysis': ['Market and competitor study', 'Financial or operational metrics', 'Risk and assumption mapping', 'Scenario comparison'], 'Execution': ['Planning templates', 'KPI dashboards', 'Communication rhythm', 'Review checkpoints'] } },
    { id: 3, badge: 'Practice', title: `${title} Applied Workflows`, description: 'Work through domain-specific tasks that mirror real job responsibilities.', lab: 'Complete a role-based workflow such as valuation, campaign planning, HR process, CRM flow, or supply-chain case.', outcome: 'You understand day-to-day work, not just theory.', topics: { 'Domain Practice': ['Case exercises', 'Tool-based assignments', 'Policy/process awareness', 'Decision notes'], 'Professional Skills': ['Email and reporting', 'Meeting notes', 'Stakeholder updates', 'Ethical judgment'] } },
    { id: 4, badge: 'Case', title: 'Business Case Presentation', description: 'Build a polished case project with data, logic, and presentation quality.', lab: 'Present a final recommendation deck or business report.', outcome: 'You finish with a credible case study for interviews.', topics: { 'Final Case': ['Executive summary', 'Evidence and assumptions', 'Action plan', 'Impact measurement'], 'Career Prep': ['Role-specific interview prep', 'Resume bullets', 'LinkedIn project story', 'Communication review'] } },
  ],
  electronics: (title: string): CurriculumModule[] => [
    { id: 1, badge: 'Core', title: 'Electronics & Systems Foundations', description: 'Build the foundation needed to understand hardware behavior.', lab: 'Analyze a circuit/system block diagram and identify key signals.', outcome: 'You can read technical diagrams and explain system-level function.', topics: { 'Foundations': ['Circuit basics', 'Signals and sensors', 'Microcontroller concepts', 'Power and safety basics'], 'Tools': ['Simulation overview', 'Datasheet reading', 'Measurement methods', 'Debugging mindset'] } },
    { id: 2, badge: 'Build', title: `${title} Design Workflow`, description: 'Practice design, simulation, integration, or verification for the domain.', lab: 'Create a small design/simulation/test workflow aligned to the course.', outcome: 'You can move from concept to tested engineering output.', topics: { 'Engineering Workflow': ['Requirement capture', 'Component selection', 'Simulation or firmware flow', 'Interface planning'], 'Validation': ['Test cases', 'Measurement logs', 'Fault isolation', 'Documentation'] } },
    { id: 3, badge: 'Industry', title: 'Standards, Reliability & Use Cases', description: 'Learn what makes electronic systems industry-ready.', lab: 'Review a real use case for reliability, safety, and maintainability.', outcome: 'You can think beyond prototypes and discuss engineering trade-offs.', topics: { 'Industry Practice': ['Reliability basics', 'EMI/thermal awareness', 'Manufacturing constraints', 'Compliance vocabulary'], 'Applications': ['Automotive/IoT/power examples', 'System integration', 'Failure modes', 'Maintenance thinking'] } },
    { id: 4, badge: 'Project', title: 'Engineering Mini Project', description: 'Document a realistic solution with calculations, diagrams, and test notes.', lab: 'Prepare a mini project report with architecture, workflow, and validation.', outcome: 'You leave with a technical project story for interviews.', topics: { 'Project': ['Architecture diagram', 'Build or simulation', 'Test results', 'Improvement plan'], 'Career Prep': ['Technical interview topics', 'Project explanation', 'Tool vocabulary', 'Report formatting'] } },
  ],
  mechanical: (title: string): CurriculumModule[] => [
    { id: 1, badge: 'Design', title: 'Engineering Drawing & Design Basics', description: 'Learn the design language used in mechanical teams.', lab: 'Create or interpret a part drawing with dimensions and constraints.', outcome: 'You can read and communicate mechanical design intent.', topics: { 'Fundamentals': ['Engineering drawing', 'Dimensions and tolerances', 'Material basics', 'Assembly thinking'], 'Tools': ['CAD workspace setup', 'Sketch constraints', 'Reference geometry', 'File organization'] } },
    { id: 2, badge: 'CAD', title: `${title} Modeling Workflow`, description: 'Practice domain-specific modeling, drafting, or design workflows.', lab: 'Build a modeled part, assembly, or process document based on the course.', outcome: 'You can produce clean mechanical work with professional structure.', topics: { 'Modeling': ['Parametric modeling', 'Assemblies and constraints', 'Surface or sheet workflows', 'Drawing generation'], 'Review': ['Design checks', 'Manufacturing feasibility', 'Revision control', 'Peer review'] } },
    { id: 3, badge: 'Quality', title: 'Manufacturing, Quality & Safety', description: 'Connect design decisions to shop-floor and quality realities.', lab: 'Inspect a design/process for quality risks and safety considerations.', outcome: 'You understand how design translates into reliable production.', topics: { 'Manufacturing': ['Process selection', 'CNC/manufacturing basics', 'Inspection methods', 'Cost awareness'], 'Quality & Safety': ['ISO/quality concepts', 'FMEA thinking', 'Safety checklists', 'Root-cause analysis'] } },
    { id: 4, badge: 'Portfolio', title: 'Mechanical Design Portfolio Project', description: 'Prepare a final technical package for a realistic engineering problem.', lab: 'Submit drawings, model screenshots, checks, and a design explanation.', outcome: 'You finish with a portfolio-ready engineering document.', topics: { 'Final Package': ['Problem statement', 'CAD model or workflow', 'Drawing pack', 'Design review notes'], 'Career Prep': ['Interview explanation', 'Tool proficiency proof', 'Resume project bullets', 'Portfolio polish'] } },
  ],
  lifeScience: (title: string): CurriculumModule[] => [
    { id: 1, badge: 'Science', title: `${title} Scientific Foundations`, description: 'Build the biological and healthcare context needed for the field.', lab: 'Create a concept map of the core biological process or healthcare workflow.', outcome: 'You can explain the science behind the domain clearly.', topics: { 'Core Concepts': ['Cell and molecular basics', 'Terminology and pathways', 'Disease or product context', 'Research question framing'], 'Professional Practice': ['Lab safety awareness', 'Scientific documentation', 'Ethics and data integrity', 'Reading research papers'] } },
    { id: 2, badge: 'Methods', title: 'Lab Methods, Tools & Documentation', description: 'Learn workflows used in labs, quality teams, and healthcare operations.', lab: 'Document a protocol, sample workflow, coding case, or safety report.', outcome: 'You can follow and document professional scientific processes.', topics: { 'Methods': ['Sample handling concepts', 'Assay or analysis workflow', 'Instrument/data output basics', 'Quality control checks'], 'Documentation': ['SOP structure', 'Observation records', 'Regulatory vocabulary', 'Error prevention'] } },
    { id: 3, badge: 'Analysis', title: `${title} Case Analysis`, description: 'Apply concepts to realistic scientific, clinical, or industry cases.', lab: 'Analyze a case study and prepare structured findings.', outcome: 'You can connect theory to decisions in research, healthcare, or biotech settings.', topics: { 'Case Work': ['Problem background', 'Evidence review', 'Risk and limitation notes', 'Interpretation of results'], 'Industry Readiness': ['GLP/GMP awareness', 'Pharma/biotech workflows', 'Reporting formats', 'Team communication'] } },
    { id: 4, badge: 'Capstone', title: 'Scientific Portfolio Report', description: 'Build a credible final report rooted in scientific evidence and documentation.', lab: 'Prepare a final case report with workflow, observations, analysis, and conclusion.', outcome: 'You leave with a science-domain portfolio artifact that feels relevant.', topics: { 'Final Report': ['Aim and scope', 'Workflow diagram', 'Findings and interpretation', 'References and limitations'], 'Career Prep': ['Lab/clinical interview prep', 'Documentation review', 'Domain terminology', 'Portfolio presentation'] } },
  ],
  civil: (title: string): CurriculumModule[] => [
    { id: 1, badge: 'Site', title: 'Construction Planning Foundations', description: 'Understand how construction work is scoped, sequenced, and controlled.', lab: 'Break down a sample project into activities and dependencies.', outcome: 'You can read a project brief and convert it into planning logic.', topics: { 'Planning Basics': ['Work breakdown structure', 'Activity sequencing', 'Resource planning', 'Site constraints'], 'Documentation': ['Drawings and BOQ basics', 'Daily reports', 'RFI awareness', 'Safety documentation'] } },
    { id: 2, badge: 'Schedule', title: 'Scheduling, Cost & Project Controls', description: 'Practice schedule and cost-control tools used on real projects.', lab: 'Prepare a basic schedule with milestones, dependencies, and risk notes.', outcome: 'You can track project movement and communicate delays or risks.', topics: { 'Project Controls': ['CPM basics', 'Milestones and baselines', 'Cost estimation', 'Progress tracking'], 'Tools': ['Excel planning templates', 'Primavera/MS Project concepts', 'Dashboards', 'Variance reporting'] } },
    { id: 3, badge: 'Execution', title: 'Site Coordination & Quality', description: 'Learn how plans translate into site execution and quality checks.', lab: 'Review a site scenario and prepare coordination notes.', outcome: 'You can discuss site execution with practical awareness.', topics: { 'Execution': ['Material coordination', 'Contractor communication', 'Inspection checklists', 'Safety risk review'], 'Quality': ['Method statements', 'Snag tracking', 'Measurement records', 'Handover readiness'] } },
    { id: 4, badge: 'Report', title: 'Planning Case Portfolio', description: 'Create a final project-control report for a realistic construction scenario.', lab: 'Deliver a planning pack with WBS, schedule, risk notes, and progress report.', outcome: 'You finish with a civil planning document suitable for interviews.', topics: { 'Final Pack': ['WBS and schedule', 'Cost and resource notes', 'Risk register', 'Progress summary'], 'Career Prep': ['Site interview prep', 'Planning vocabulary', 'Report presentation', 'Portfolio review'] } },
  ],
};

function createCurriculum(title: string, category: string): Curriculum {
  const domain = getCurriculumDomain(title);
  return {
    title: `${title} curriculum built for ${category.toLowerCase()}`,
    summary: `A practical path through ${domainIntro[domain]} with guided labs, review checkpoints, and a final portfolio artifact.`,
    badges: ['Live guided practice', 'Industry case work', 'Portfolio output'],
    modules: curriculumTemplates[domain](title),
  };
}

const generateCourseData = (title: string, category: string) => ({
  title,
  category,
  duration: '2-3 Months',
  rating: parseFloat((4.7 + seededHash(title) * 0.3).toFixed(1)),
  totalRatings: (Math.floor(seededHash(title + 'r') * 10000 + 5000)).toLocaleString(),
  image: getThumbnail(title),
  description: `Master ${title}: Comprehensive curriculum with live projects and industry experts`,
  highlights: [
    'Live online interactive sessions from Adyapan faculty & top industry experts',
    'Guaranteed placement support with our career services for freshers and professionals',
    `Earn prestigious ${title} certification`,
    'Work on real projects and build industry-ready portfolio'
  ],
  curriculum: createCurriculum(title, category),
});

function addYouTubeParams(url: string): string {
  const params = 'rel=0&modestbranding=1';
  return `${url}${url.includes('?') ? '&' : '?'}${params}`;
}

const courseData: Record<string, any> = {
  'artificial-intelligence': {
    title: 'Artificial Intelligence',
    category: 'CSE / IT DOMAINS',
    duration: '2-3 Months',
    rating: 4.8,
    totalRatings: '12,450',
    image: getThumbnail('Artificial Intelligence'),
    description: 'Master AI fundamentals: Machine Learning, Deep Learning, Neural Networks & more',
    highlights: [
      'Live online interactive sessions from Adyapan faculty & top industry experts',
      'Guaranteed placement support with our career services for freshers and professionals',
      'Work on real AI projects and build industry-ready portfolio'
    ],
    curriculum: {
      title: 'Advanced AI Curriculum To Help You Master Machine Learning, Deep Learning & Neural Networks',
      modules: [
        { id: 1, title: 'AI Fundamentals', description: 'Introduction to AI, History, Applications', topics: { 'Python for AI': ['Python Basics', 'NumPy and Pandas', 'Data Manipulation', 'Visualization'], 'Mathematics for AI': ['Linear Algebra', 'Statistics', 'Calculus', 'Optimization'] } },
        { id: 2, title: 'Machine Learning', description: 'Supervised and Unsupervised Learning', topics: { 'Supervised Learning': ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forest', 'SVM'], 'Unsupervised Learning': ['K-Means', 'Hierarchical Clustering', 'PCA', 'Association Rules'] } },
        { id: 3, title: 'Deep Learning', description: 'Neural Networks and Deep Learning Frameworks', topics: { 'Neural Networks': ['Perceptron', 'MLP', 'Backpropagation', 'Activation Functions'], 'Deep Learning': ['CNN', 'RNN', 'LSTM', 'Transfer Learning'] } },
        { id: 4, title: 'NLP', description: 'Text Processing and Language Understanding', topics: { 'NLP Basics': ['Text Preprocessing', 'Tokenization', 'Stemming', 'NER'], 'Advanced NLP': ['Sentiment Analysis', 'Text Classification', 'Language Models', 'Transformers'] } },
        { id: 5, title: 'Computer Vision', description: 'Image Processing and CV Applications', topics: { 'Image Processing': ['Image Fundamentals', 'Filtering', 'Feature Detection', 'Object Recognition'], 'Advanced Vision': ['Face Recognition', 'Object Detection', 'Segmentation', 'GANs'] } },
        { id: 6, title: 'AI Project & Deployment', description: 'Real-world AI Projects and Deployment', topics: { 'Project Development': ['Problem Definition', 'Data Collection', 'Model Training', 'Evaluation'], 'Deployment': ['Model Optimization', 'Cloud Deployment', 'API Development', 'Monitoring'] } }
      ]
    }
  },
  'data-science': {
    title: 'Data Science',
    category: 'CSE / IT DOMAINS',
    duration: '2-3 Months',
    rating: 4.7,
    totalRatings: '15,796',
    image: getThumbnail('Data Science'),
    description: 'Master Data Science courses: Python, SQL, ML, Power BI, NLP, Gen AI, & more',
    highlights: [
      'Live online interactive sessions from IIT faculty & top industry experts',
      'Guaranteed placement support with our career services for freshers and professionals',
      'Earn prestigious data science certification',
      'Work on real data science projects with industry datasets'
    ],
    curriculum: {
      title: 'Advanced Data Science Curriculum',
      modules: [
        { id: 1, title: 'Programming', description: 'Python and SQL fundamentals', topics: { 'SQL': ['Intro to SQL', 'Joins', 'Aggregation', 'CTEs', 'Window Functions'], 'Python': ['Python Refresher', 'OOP', 'NumPy', 'Pandas', 'Visualization'] } },
        { id: 2, title: 'Data Engineering Fundamentals', description: 'ETL and data pipelines', topics: { 'ETL': ['Extract Transform Load', 'Pipeline Design', 'Data Quality'], 'Big Data': ['Distributed Computing', 'MapReduce', 'Hadoop', 'Spark'] } },
        { id: 3, title: 'Machine Learning', description: 'ML algorithms and model building', topics: { 'Supervised': ['Regression', 'Classification', 'Ensemble Methods'], 'Unsupervised': ['Clustering', 'Dimensionality Reduction'] } },
        { id: 4, title: 'Cloud Technologies', description: 'Cloud-based data solutions', topics: { 'AWS': ['S3', 'EMR', 'Redshift', 'Lambda'], 'Data Warehousing': ['Dimensional Modeling', 'Star Schema', 'Performance'] } },
        { id: 5, title: 'DSA for Data', description: 'Data structures for data engineering', topics: { 'Data Structures': ['Arrays', 'Hash Tables', 'Trees', 'Graphs'], 'Algorithms': ['Sorting', 'Search', 'Graph Algorithms'] } },
        { id: 6, title: 'ML in Production', description: 'MLOps and model deployment', topics: { 'MLOps': ['Model Deployment', 'Monitoring', 'A/B Testing', 'Versioning'], 'Real-time ML': ['Streaming ML', 'Feature Stores', 'Model Serving'] } }
      ]
    }
  },
  'ui-ux-design': {
    title: 'UI/UX Design',
    category: 'CSE / IT DOMAINS',
    duration: '2-3 Months',
    rating: 4.8,
    totalRatings: '8,320',
    image: getThumbnail('UI/UX'),
    videoUrl: 'https://youtu.be/jCaAYmHnnHw?si=Z9DSYqz9Yhv_Jjse',
    description: 'Design user-centered interfaces with Figma, wireframing, prototyping, and usability testing.',
    highlights: [
      'Live online interactive sessions from industry design experts',
      'Hands-on projects with Figma, Adobe XD, and prototyping tools',
      'Build a professional design portfolio for job readiness',
      'Learn user research, wireframing, and usability testing'
    ],
    curriculum: {
      title: 'Complete UI/UX Design Curriculum',
      modules: [
        { id: 1, title: 'Design Fundamentals', description: 'Core design principles and theory', topics: { 'Design Principles': ['Color Theory', 'Typography', 'Layout', 'Visual Hierarchy'], 'Design Thinking': ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'] } },
        { id: 2, title: 'User Research', description: 'Understanding users and their needs', topics: { 'Research Methods': ['User Interviews', 'Surveys', 'Personas', 'Journey Mapping'], 'Analysis': ['Affinity Diagrams', 'Card Sorting', 'Usability Testing'] } },
        { id: 3, title: 'Wireframing & Prototyping', description: 'From sketches to interactive prototypes', topics: { 'Wireframing': ['Low-fidelity', 'High-fidelity', 'Information Architecture'], 'Prototyping': ['Interactive Prototypes', 'Micro-interactions', 'Animation'] } },
        { id: 4, title: 'UI Design with Figma', description: 'Master Figma for professional design', topics: { 'Figma': ['Components', 'Auto Layout', 'Design Systems', 'Variants'], 'Advanced': ['Responsive Design', 'Design Tokens', 'Collaboration'] } },
        { id: 5, title: 'Portfolio & Career', description: 'Build portfolio and prepare for jobs', topics: { 'Portfolio': ['Case Studies', 'Presentation', 'Personal Branding'], 'Career': ['Interview Prep', 'Design Challenges', 'Freelancing'] } }
      ]
    }
  },
};

export default function CoursePageClient() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [activeModule, setActiveModule] = useState(0);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [brochureLoading, setBrochureLoading] = useState(false);
  const [brochureError, setBrochureError] = useState('');

  let course = courseData[slug];

  if (!course) {
    const courseTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    let category = 'CSE / IT DOMAINS';
    if (['finance', 'investment', 'marketing', 'hrm', 'management', 'sales', 'commerce'].some(k => slug.includes(k))) category = 'MANAGEMENT & COMMERCE';
    else if (['embedded', 'vlsi', 'iot', 'robotics', 'power'].some(k => slug.includes(k))) category = 'ECE DOMAINS';
    else if (['economics', 'financial'].some(k => slug.includes(k))) category = 'ECONOMICS';
    else if (['autocad', 'catia', 'design', 'mechanical'].some(k => slug.includes(k))) category = 'MECHANICAL ENGINEERING';
    else if (['bio', 'bioinformatics', 'microbiology', 'molecular', 'genetic', 'pharma', 'nano', 'food', 'nutrition', 'medical'].some(k => slug.includes(k))) category = 'BIO & LIFE SCIENCES';
    else if (['civil', 'construction'].some(k => slug.includes(k))) category = 'CIVIL ENGINEERING';
    course = generateCourseData(courseTitle, category);
  }
  course = { ...course, curriculum: createCurriculum(course.title, course.category) };

  const instructors = generateInstructors(course.title);
  const brochureHref = getBrochureHref(course.title);
  const brochureFile = getBrochureFile(course.title);

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/programs" className="hover:text-orange-600">{course.category}</Link>
            <span aria-hidden="true">›</span>
            <span className="text-gray-800 font-medium">{course.title} Course</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{course.title} Course</h1>
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                <span className="text-sm text-gray-500">({course.totalRatings} Ratings)</span>
              </div>
              <div className="space-y-3 mb-8">
                {course.highlights.filter(Boolean).map((highlight: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col w-full sm:w-auto">
                  <motion.a
                    href={brochureHref || undefined}
                    download={brochureFile || undefined}
                    whileHover={{ scale: brochureLoading ? 1 : 1.05 }}
                    whileTap={{ scale: brochureLoading ? 1 : 0.95 }}
                    aria-disabled={brochureLoading || !brochureHref}
                    onClick={(event) => {
                      setBrochureError('');
                      if (!brochureHref) {
                        event.preventDefault();
                        setBrochureError('Brochure not available for this course.');
                        return;
                      }
                      setBrochureLoading(true);
                      window.setTimeout(() => setBrochureLoading(false), 800);
                    }}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${brochureLoading || !brochureHref ? 'bg-orange-100 text-orange-400 cursor-not-allowed border border-orange-200' : 'bg-gradient-to-r from-[#ffa800] to-[#ff6b00] text-white shadow-md hover:shadow-orange-300'}`}
                  >
                    {brochureLoading ? (
                      <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg><span>Downloading...</span></>
                    ) : (
                      <><Download className="w-4 h-4" /><span>Download Brochure</span></>
                    )}
                  </motion.a>
                  {brochureError && <p className="text-xs text-red-500 mt-1.5 text-center">{brochureError}</p>}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPricingOpen(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Enroll now</span>
                </motion.button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative w-full h-80 bg-black">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={addYouTubeParams(course.videoUrl || getYouTubeEmbedUrl(course.title))}
                    title={`${course.title} demo video`}
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Students Enrolled', value: '10,000+' },
              { icon: Clock, label: 'Course Duration', value: course.duration },
              { icon: Award, label: 'Placement Rate', value: '95%' },
              { icon: BookOpen, label: 'Live Sessions', value: '40+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-gray-50">
                <Icon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 bg-[#f5f0eb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-orange-600">Curriculum Roadmap</p>
            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">{course.curriculum.title}</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">{course.curriculum.summary}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {course.curriculum.badges.map((badge: string) => (
                <span key={badge} className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {course.curriculum.modules.map((module: any, index: number) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <button
                  onClick={() => setActiveModule(activeModule === index ? -1 : index)}
                  className="w-full p-5 text-left transition-colors hover:bg-orange-50/40 sm:p-6"
                  aria-expanded={activeModule === index}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                        <span className="text-xs font-bold uppercase">Step</span>
                        <span className="text-lg font-black leading-none">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white">{module.badge}</span>
                          <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">Hands-on module</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
                        <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">{module.description}</p>
                      </div>
                    </div>
                    {activeModule === index ? <ChevronUp className="mt-4 h-5 w-5 flex-shrink-0 text-gray-400" /> : <ChevronDown className="mt-4 h-5 w-5 flex-shrink-0 text-gray-400" />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeModule === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="border-t border-gray-100 bg-white"
                    >
                      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_0.75fr]">
                        <div className="grid gap-5 md:grid-cols-2">
                          {Object.entries(module.topics).map(([topicTitle, items]) => (
                            <div key={topicTitle} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                              <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-900">{topicTitle}</h4>
                              <ul className="space-y-2.5">
                                {(items as string[]).map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm leading-6 text-gray-600">
                                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-orange-700">Practical Lab</p>
                            <p className="mt-2 text-sm leading-6 text-gray-700">{module.lab}</p>
                          </div>
                          <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-green-700">What You Can Show</p>
                            <p className="mt-2 text-sm leading-6 text-gray-700">{module.outcome}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Learn from Industry Experts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {instructors.slice(0, 8).map((instructor) => (
              <div key={instructor.id} className="text-center p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-orange-600">{instructor.name.charAt(0)}</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{instructor.name}</p>
                <p className="text-xs text-gray-500 mt-1">{instructor.role}, {instructor.company}</p>
                <p className="text-xs text-orange-500 mt-1">{instructor.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isPricingOpen && <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />}
    </div>
  );
}
