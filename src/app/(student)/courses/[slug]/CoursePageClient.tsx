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
  if (/(ai|artificial|machine learning|generative|genai)/.test(lower)) return 'ai';
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
  curriculum: {
    title: `Advanced ${title} Curriculum To Help You Master Industry Skills`,
    modules: [
      {
        id: 1,
        title: `${title} Fundamentals`,
        description: `Introduction to ${title} concepts and core principles`,
        topics: {
          'Basics': [`What is ${title}`, 'Key Concepts', 'Applications', 'Industry Use Cases'],
          'Foundations': ['Core Principles', 'Best Practices', 'Tools & Technologies', 'Getting Started']
        }
      },
      {
        id: 2,
        title: `${title} Advanced Topics`,
        description: `Advanced concepts and real-world applications of ${title}.`,
        topics: {
          'Advanced Concepts': ['Complex Scenarios & Problem Solving', 'Optimization Techniques', 'Scalability & Architecture', 'Security & Best Practices'],
          'Practical Applications': ['Real-world Project Implementation', 'Case Studies', 'Enterprise Solutions', 'Performance Optimization']
        }
      },
      {
        id: 3,
        title: `${title} Projects & Deployment`,
        description: `Hands-on project development and deployment of ${title} solutions.`,
        topics: {
          'Project Development': ['Project Planning', 'System Design', 'Implementation', 'Testing & QA'],
          'Deployment': ['CI/CD Pipelines', 'Production Setup', 'Monitoring', 'Scaling']
        }
      }
    ]
  }
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
                    src={addYouTubeParams(getYouTubeEmbedUrl(course.title))}
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{course.curriculum.title}</h2>
          <div className="space-y-4">
            {course.curriculum.modules.map((module: any, index: number) => (
              <motion.div key={module.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <button
                  onClick={() => setActiveModule(activeModule === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={activeModule === index}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 font-bold text-sm">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{module.description}</p>
                    </div>
                  </div>
                  {activeModule === index ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {activeModule === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="border-t border-gray-100">
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(module.topics).map(([topicTitle, items]) => (
                          <div key={topicTitle}>
                            <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">{topicTitle}</h4>
                            <ul className="space-y-2">
                              {(items as string[]).map((item, i) => (
                                <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
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
