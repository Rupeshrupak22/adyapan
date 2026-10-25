'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  Send,
  CheckCircle,
  Clock,
  Instagram,
  Linkedin,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Check,
  Smartphone,
  Download,
  Building2,
  Code2,
  Layout,
  GraduationCap,
  GitMerge,
  Cpu,
  Palette,
  Cloud,
  Layers,
  ShieldCheck,
  X,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Shield,
  Layers2,
  Radio,
  Compass,
} from 'lucide-react';

import EmailField from '@/components/forms/EmailField';
import PhoneField from '@/components/forms/PhoneField';
import NameField from '@/components/forms/NameField';
import { isIndianMobile, INDIAN_MOBILE_MESSAGE } from '@/lib/phone';
import { isValidEmail, EMAIL_FORMAT_MESSAGE } from '@/lib/email-format';
import { isValidName, NAME_FORMAT_MESSAGE } from '@/lib/name-format';
import { trackEnquirySubmit } from '@/lib/tracker';

import {
  VERIFIED_PRODUCTS,
  VERIFIED_MOBILE_APPS,
  VERIFIED_SERVICES,
  VERIFIED_LEADERSHIP,
  PORTFOLIO_FAQS,
  ProductItem,
  ServiceItem,
} from '@/data/portfolioData';

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Layout,
  Smartphone,
  GraduationCap,
  GitMerge,
  Cpu,
  Code2,
  Palette,
  Cloud,
  Layers,
  ShieldCheck,
};

const CONTACT_INFO = [
  { icon: Phone, label: 'Direct Line', value: '+91 81791 24566', href: 'tel:+918179124566' },
  { icon: Mail, label: 'Email Desk', value: 'support@adyapan.com', href: 'mailto:support@adyapan.com' },
  { icon: Clock, label: 'Working Hours', value: 'Mon - Sat, 11 AM - 8 PM', href: null },
  { icon: MapPin, label: 'HQ Hub', value: 'Toli Chowki, Hyderabad', href: '#offices' },
];

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/adyapan_?igsh=MWw1NGwwNTIwZXU2eQ==',
  linkedin: 'https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all',
};

const TOPIC_PRESETS: Record<string, string> = {
  'web-app-development': 'Web Application Development',
  'mobile-app-development': 'Mobile Application Development',
  'lms-development': 'Learning Management Systems (LMS)',
  'crm-automation': 'CRM Systems & Workflow Automation',
  'ai-integration': 'AI Integration & Intelligent Automation',
  'custom-software': 'Custom Software & Enterprise Solutions',
  'ui-ux-design': 'UI/UX Design & Product Strategy',
  'cloud-devops': 'Cloud Infrastructure & DevOps Automation',
  'api-integration': 'API Development & System Integration',
  'maintenance-support': 'Software Maintenance & Security Hardening',
  'product-inquiry': 'Product Inquiry / Demonstration',
  'project-inquiry': 'Custom Project Inquiry',
};

export default function ContactPageClient() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service') || '';
  const projectParam = searchParams.get('project') || '';
  const subjectParam = searchParams.get('subject') || '';

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Modals for products and services
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Active mobile app tab
  const [activeAppIndex, setActiveAppIndex] = useState(0);

  useEffect(() => {
    const rawKey = serviceParam || projectParam || subjectParam;
    if (rawKey) {
      const resolved = TOPIC_PRESETS[rawKey] || rawKey;
      setForm((prev) => ({
        ...prev,
        subject: resolved,
        message: prev.message || (projectParam ? `Hello Adyapan team, I would like to discuss our requirements regarding ${projectParam}.` : ''),
      }));
    }
  }, [serviceParam, projectParam, subjectParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectService = (topic: string, name?: string) => {
    setForm((prev) => ({
      ...prev,
      subject: topic,
      message: name
        ? `Hello Adyapan team, I am interested in exploring ${name}. Please contact me to discuss feasibility and next steps.`
        : prev.message,
    }));
    const el = document.getElementById('contact-form-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidName(form.name)) {
      setErrorMsg(NAME_FORMAT_MESSAGE);
      setStatus('error');
      return;
    }
    if (!isValidEmail(form.email)) {
      setErrorMsg(EMAIL_FORMAT_MESSAGE);
      setStatus('error');
      return;
    }
    if (!isIndianMobile(form.phone)) {
      setErrorMsg(INDIAN_MOBILE_MESSAGE);
      setStatus('error');
      return;
    }
    if (!form.subject) {
      setErrorMsg('Please select a subject.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        trackEnquirySubmit('/contact');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-[#ffa800] selection:text-white relative overflow-x-hidden font-sans">
      {/* ─── DYNAMIC AMBIENT BACKGROUND (Clean White with subtle glowing nodes) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 right-10 w-[550px] h-[550px] bg-gradient-to-br from-orange-200/25 to-amber-100/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-[40%] -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/20 to-orange-100/10 rounded-full blur-3xl" />
        <div className="absolute top-[75%] right-0 w-[500px] h-[500px] bg-gradient-to-b from-orange-100/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* ─── SECTION 1: HERO & CONTACT FORM (COMBINED DYNAMIC SPLIT LAYOUT - NO DEAD WHITESPACE) ─── */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Quick jump pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-100 text-xs font-semibold">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50/80 border border-orange-200/60 text-orange-700">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Adyapan Digital Labs · Hyderabad Headquarters</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-gray-600">
            <a href="#showcase" className="px-3 py-1 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-all shrink-0">
              ⚡ Live Software
            </a>
            <a href="#mobile-suite" className="px-3 py-1 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-all shrink-0">
              📱 Mobile Apps
            </a>
            <a href="#services-grid" className="px-3 py-1 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-all shrink-0">
              🛠️ Capabilities
            </a>
            <a href="#leadership-profile" className="px-3 py-1 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-all shrink-0">
              👥 Leadership
            </a>
            <a href="#offices" className="px-3 py-1 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-all shrink-0">
              📍 3 Tech Hubs
            </a>
          </div>
        </div>

        {/* 12-Column Balanced Split: Left Value Prop + Right Contact Form */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Punchy Hero, Live Stats, Quick Contact Info */}
          <div className="lg:col-span-6 space-y-6 lg:pt-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 text-orange-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
                Direct Inquiry &amp; Client Onboarding
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-gray-900 tracking-tight leading-[1.08]">
                Let&apos;s Build Something{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#c2410c] underline decoration-orange-300 decoration-wavy decoration-2">
                  Exceptional
                </span>{' '}
                Together.
              </h1>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Whether you need a custom enterprise web platform, native Android/iOS mobile application, LMS infrastructure, or
                course guidance — our engineering and counseling teams are ready to assist.
              </p>
            </motion.div>

            {/* Dynamic Metric Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-xs hover:border-orange-300 transition-all">
                <div className="text-2xl font-black text-[#f97316]">65+</div>
                <div className="text-[11px] font-semibold text-gray-500">Tech Programs</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-xs hover:border-orange-300 transition-all">
                <div className="text-2xl font-black text-gray-900">4 Live</div>
                <div className="text-[11px] font-semibold text-gray-500">Store Apps</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-xs hover:border-orange-300 transition-all">
                <div className="text-2xl font-black text-[#f97316]">3 Hubs</div>
                <div className="text-[11px] font-semibold text-gray-500">Hyderabad Offices</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-xs hover:border-orange-300 transition-all">
                <div className="text-2xl font-black text-gray-900">&lt;24h</div>
                <div className="text-[11px] font-semibold text-gray-500">Response SLA</div>
              </div>
            </div>

            {/* Direct Communication Channels */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Direct Contact Channels</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {CONTACT_INFO.slice(0, 2).map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={idx}
                      href={item.href || '#'}
                      className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs hover:border-orange-400 hover:shadow-sm transition-all flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-[#f97316] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{item.label}</span>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate block">
                          {item.value}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Social Channels Row */}
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-between gap-3 text-xs">
                <span className="font-bold text-gray-700">Official Social Handles:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-pink-500 text-gray-800 font-semibold flex items-center gap-1.5 transition-all hover:text-pink-600"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    Instagram
                  </a>
                  <a
                    href={SOCIAL_LINKS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-600 text-gray-800 font-semibold flex items-center gap-1.5 transition-all hover:text-[#0A66C2]"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Elevated, Crisp Contact Card with Glowing Subtle Border */}
          <div id="contact-form-card" className="lg:col-span-6">
            <div className="relative rounded-3xl p-6 sm:p-8 bg-white border-2 border-orange-200 shadow-xl shadow-orange-500/5 transition-all">
              {/* Top Accent Ribbon */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 rounded-b-md" />

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Send an Inquiry</h2>
                  <p className="text-gray-500 text-xs mt-0.5">We respond within 24 business hours.</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Send className="w-5 h-5" />
                </div>
              </div>

              {status === 'success' ? (
                <div className="py-10 text-center space-y-3">
                  <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-gray-900 text-xl">Message Dispatched!</h3>
                  <p className="text-gray-600 text-sm max-w-sm mx-auto">
                    Thank you for contacting Adyapan Edutech. Our team has received your submission and will reach out shortly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-3 px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-full hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <NameField
                      label="FULL NAME"
                      value={form.name}
                      onChange={(v) => setForm((prev) => ({ ...prev, name: v }))}
                      placeholder="John Doe"
                      inputClassName="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#ffa800] focus:ring-2 focus:ring-orange-100 transition-all"
                      labelClassName="block text-[11px] font-bold text-gray-700 uppercase mb-1"
                    />
                    <EmailField
                      label="EMAIL ADDRESS"
                      email={form.email}
                      onEmailChange={(v) => setForm((prev) => ({ ...prev, email: v }))}
                      placeholder="john@example.com"
                      inputClassName="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#ffa800] focus:ring-2 focus:ring-orange-100 transition-all"
                      labelClassName="block text-[11px] font-bold text-gray-700 uppercase mb-1"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <PhoneField
                      label="PHONE NUMBER"
                      name="phone"
                      value={form.phone}
                      onChange={(digits) => setForm((prev) => ({ ...prev, phone: digits }))}
                      placeholder="10-digit mobile number"
                      inputClassName="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#ffa800] focus:ring-2 focus:ring-orange-100 transition-all"
                      labelClassName="block text-[11px] font-bold text-gray-700 uppercase mb-1"
                    />
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Subject / Domain *</label>
                      <select
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#ffa800] focus:ring-2 focus:ring-orange-100 transition-all"
                      >
                        <option value="">Select a topic</option>
                        {form.subject &&
                          ![
                            'Web Application Development',
                            'Mobile Application Development',
                            'Learning Management Systems (LMS)',
                            'CRM Systems & Workflow Automation',
                            'AI Integration & Intelligent Automation',
                            'Custom Software & Enterprise Solutions',
                            'UI/UX Design & Product Strategy',
                            'Cloud Infrastructure & DevOps Automation',
                            'API Development & System Integration',
                            'Software Maintenance & Security Hardening',
                            'Course Inquiry',
                            'Placement Support',
                            'Partnership',
                            'Other',
                          ].includes(form.subject) && (
                            <option value={form.subject}>{form.subject}</option>
                          )}
                        <optgroup label="Technology & Enterprise Services">
                          <option value="Web Application Development">Web Application Development</option>
                          <option value="Mobile Application Development">Mobile Application Development</option>
                          <option value="Learning Management Systems (LMS)">Learning Management Systems (LMS)</option>
                          <option value="CRM Systems & Workflow Automation">CRM Systems & Workflow Automation</option>
                          <option value="AI Integration & Intelligent Automation">AI Integration & Intelligent Automation</option>
                          <option value="Custom Software & Enterprise Solutions">Custom Software & Enterprise Solutions</option>
                          <option value="UI/UX Design & Product Strategy">UI/UX Design & Product Strategy</option>
                          <option value="Cloud Infrastructure & DevOps Automation">Cloud Infrastructure & DevOps Automation</option>
                          <option value="API Development & System Integration">API Development & System Integration</option>
                          <option value="Software Maintenance & Security Hardening">Software Maintenance & Security Hardening</option>
                        </optgroup>
                        <optgroup label="Academic & Career Programs">
                          <option value="Course Inquiry">Course Inquiry</option>
                          <option value="Placement Support">Placement Support</option>
                          <option value="Partnership">Partnership / Hire Students</option>
                        </optgroup>
                        <option value="Other">Other Requirement</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Detailed Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={3}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Share your requirements or questions with our team..."
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#ffa800] focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-500 text-xs font-semibold">{errorMsg || 'Something went wrong. Please try again.'}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3.5 bg-gradient-to-r from-[#ffa800] to-[#f97316] hover:from-[#f97316] hover:to-[#ea580c] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: CROSS-ANGLE DYNAMIC SHOWCASE (IDHAR IMAGE, UDHAR TEXT!) ─── */}
      <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 border-t border-gray-100">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <Zap className="w-3.5 h-3.5 text-orange-600" />
            Live Enterprise Platforms
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Real Software Solutions Engineered by Adyapan
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Engineered, deployed, and operated by Adyapan Edutech. Click on any solution to inspect specifications or
            connect with our engineering team.
          </p>
        </div>

        {/* ── ROW 1 (CROSS ANGLE): ADYAPAN CONNECT (LEFT: 3D SLANTED IMAGE, RIGHT: TEXT) ── */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Angled Browser Frame with Real Screenshot */}
          <div className="lg:col-span-7 relative group">
            <div className="relative rounded-3xl p-3 bg-gradient-to-br from-orange-100/60 to-amber-50/80 border-2 border-orange-200/90 shadow-2xl shadow-orange-500/10 transform lg:-rotate-1 group-hover:rotate-0 transition-transform duration-500">
              {/* Browser chrome header */}
              <div className="px-3 py-2 bg-white rounded-t-2xl border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-[11px] font-mono font-medium text-gray-400">connect.adyapan.com</span>
                <span className="w-4" />
              </div>

              {/* Real Screenshot */}
              <div className="relative aspect-[16/9] w-full rounded-b-2xl overflow-hidden bg-gray-50">
                <Image
                  src="/portfolio/adyapan-connect-og.png"
                  alt="Adyapan Connect WhatsApp CRM Platform"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-top"
                />
              </div>

              {/* Floating WhatsApp API Badge */}
              <div className="absolute -bottom-5 -right-3 sm:right-6 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 shadow-xl flex items-center gap-2.5 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                  WA
                </div>
                <div>
                  <div className="text-[11px] font-black text-gray-900">Official Meta Cloud API</div>
                  <div className="text-[9px] text-emerald-600 font-bold">Multi-Agent Shared Inbox</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text & Action */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live SaaS Platform
            </div>

            <h3 className="text-3xl font-black text-gray-900 leading-tight">
              Adyapan Connect — WhatsApp Business API &amp; CRM Engine
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Enterprise conversational messaging engine enabling businesses to automate customer communications, support
              routing, multi-agent inboxes, and targeted broadcasts via the official WhatsApp Business Cloud API.
            </p>

            <div className="space-y-2 border-t border-gray-100 pt-4">
              {[
                'Official WhatsApp Business Cloud API multi-tenant connection',
                'Unified multi-agent shared team inbox with role permissions',
                'Automated drip broadcasts with real-time delivery telemetry',
                'AI-powered conversation routing and keyword auto-responders',
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://connect.adyapan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-[#f97316] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                Launch Connect
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleSelectService('CRM Systems & Workflow Automation', 'Adyapan Connect SaaS')}
                className="px-5 py-2.5 rounded-xl border-2 border-orange-400 hover:bg-orange-50 text-orange-700 text-xs font-bold transition-all"
              >
                Inquire for Your Business
              </button>
            </div>
          </div>
        </div>

        {/* ── ROW 2 (CROSS ANGLE): ADYAPAN AI (LEFT: TEXT, RIGHT: 3D ROBOT VISUAL) ── */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Text & Action */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Artificial Intelligence
            </div>

            <h3 className="text-3xl font-black text-gray-900 leading-tight">
              Adyapan AI — Intelligent Career &amp; Aptitude Engine
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Intelligent skill assessment and career guidance platform that evaluates student readiness, identifies
              skill gaps, and tailors structured learning pathways through conversational machine intelligence.
            </p>

            <div className="space-y-2 border-t border-gray-100 pt-4">
              {[
                'Interactive aptitude and technical reasoning assessment engines',
                'AI-assisted career pathway and skill roadmap recommendations',
                'Diagnostic skill-gap benchmarking with personalized remediation',
                'Adaptive difficulty sequencing for personalized practice',
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://ai.adyapan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-[#f97316] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                Explore Adyapan AI
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleSelectService('AI Integration & Intelligent Automation', 'Adyapan AI Engine')}
                className="px-5 py-2.5 rounded-xl border-2 border-orange-400 hover:bg-orange-50 text-orange-700 text-xs font-bold transition-all"
              >
                Discuss AI Integration
              </button>
            </div>
          </div>

          {/* Right: 3D Robot Mascot & Diagnostic Cards */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative group">
            <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-amber-50 to-orange-100/50 border-2 border-orange-200/90 shadow-2xl shadow-orange-500/10 flex items-center justify-center transform lg:rotate-1 group-hover:rotate-0 transition-transform duration-500">
              {/* Main AI Mascot Visual */}
              <div className="relative w-72 sm:w-96 h-72 sm:h-88">
                <Image
                  src="/portfolio/ai-robo.png"
                  alt="Adyapan AI Robot Mascot"
                  fill
                  sizes="(max-width: 768px) 280px, 400px"
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Test Score Card Widget */}
              <div className="absolute top-6 left-4 sm:left-8 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl space-y-1 -rotate-3 hover:rotate-0 transition-transform">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Aptitude Engine</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-gray-900">98.4%</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Top 2%</span>
                </div>
                <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-gradient-to-r from-orange-400 to-amber-500" />
                </div>
              </div>

              {/* Floating Skill Roadmap Pill */}
              <div className="absolute bottom-6 right-4 sm:right-8 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl flex items-center gap-2.5 rotate-2 hover:rotate-0 transition-transform">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  AI
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Adaptive Roadmap</div>
                  <div className="text-[10px] text-gray-500">Full-Stack &amp; ML Tracks</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 3 (CROSS ANGLE): ADYAPAN LMS (LEFT: ANGLED LMS SCREEN, RIGHT: TEXT) ── */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Dual Angled Screen Mockup (Web + Mobile) */}
          <div className="lg:col-span-7 relative group">
            <div className="relative rounded-3xl p-6 bg-gradient-to-tr from-orange-50 to-amber-100/40 border-2 border-orange-200 shadow-2xl shadow-orange-500/10 transform lg:-rotate-1 group-hover:rotate-0 transition-transform duration-500">
              <div className="grid sm:grid-cols-2 gap-4 items-center">
                {/* Real Screenshot 1 */}
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 border-2 border-white shadow-xl">
                  <Image
                    src="/portfolio/lms-screen-1.jpg"
                    alt="Adyapan LMS lecture interface"
                    fill
                    sizes="250px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-black/70 backdrop-blur-xs text-center text-white text-[10px] font-bold">
                    Live Video Classroom
                  </div>
                </div>

                {/* Real Screenshot 2 */}
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 border-2 border-white shadow-xl hidden sm:block">
                  <Image
                    src="/portfolio/lms-screen-2.jpg"
                    alt="Adyapan LMS curriculum overview"
                    fill
                    sizes="250px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-black/70 backdrop-blur-xs text-center text-white text-[10px] font-bold">
                    Interactive Quizzes
                  </div>
                </div>
              </div>

              {/* Floating Verified Certificate Pill */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-xl flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-gray-900">Cryptographically Verified Certificates</span>
              </div>
            </div>
          </div>

          {/* Right: Text & Action */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              Education Technology
            </div>

            <h3 className="text-3xl font-black text-gray-900 leading-tight">
              Adyapan LMS — Multi-Tenant Virtual Campus Suite
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Comprehensive educational platform designed to administer high-volume interactive cohorts, live video lectures,
              curated digital courseware, structured assignments, and verifiable course completions.
            </p>

            <div className="space-y-2 border-t border-gray-100 pt-4">
              {[
                'Live interactive video classroom coordination with schedule calendars',
                'Modular curriculum authoring with video, text, and code assets',
                'Automated grading, test evaluation, and progress telemetry',
                'Tamper-proof digital certificate generation with hash lookup',
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://my.adyapan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-[#f97316] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                Access LMS Portal
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleSelectService('Learning Management Systems (LMS)', 'Adyapan LMS Suite')}
                className="px-5 py-2.5 rounded-xl border-2 border-orange-400 hover:bg-orange-50 text-orange-700 text-xs font-bold transition-all"
              >
                Deploy LMS for Your Campus
              </button>
            </div>
          </div>
        </div>

        {/* ── ROW 4 (CROSS ANGLE): ADYAPAN LEADDIALER & CRM (LEFT: TEXT, RIGHT: 3 PHONES DISPLAY) ── */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Text & Action */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Smartphone className="w-3.5 h-3.5 text-amber-600" />
              Sales Acceleration Mobile CRM
            </div>

            <h3 className="text-3xl font-black text-gray-900 leading-tight">
              ADYAPAN LeadDialer &amp; Operations Hub
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Native Android telephonic dialer and enterprise CRM application engineered for corporate admissions and sales teams
              to accelerate outbound calling and eliminate untracked lead slippage.
            </p>

            <div className="space-y-2 border-t border-gray-100 pt-4">
              {[
                'One-tap cellular and VoIP dialing directly from customer lead cards',
                'Automatic call duration logging and disposition tagging (Follow-up, Enrolled, Inactive)',
                'Scheduled follow-up reminder alerts integrated with system notifications',
                'Continuous bidirectional sync with the centralized Adyapan Hub database',
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.adyapan.leaddialer"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-[#f97316] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                Google Play Listing
                <Download className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleSelectService('CRM Systems & Workflow Automation', 'Adyapan LeadDialer Mobile')}
                className="px-5 py-2.5 rounded-xl border-2 border-orange-400 hover:bg-orange-50 text-orange-700 text-xs font-bold transition-all"
              >
                Inquire Mobile CRM
              </button>
            </div>
          </div>

          {/* Right: 3 Slanted Overlapping Smartphone Frames */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative group">
            <div className="relative rounded-3xl p-6 bg-gradient-to-br from-orange-100/50 to-amber-50 border-2 border-orange-200/90 shadow-2xl shadow-orange-500/10 flex items-center justify-center gap-3 sm:gap-4 overflow-hidden">
              {/* Phone 1 (Slanted Left) */}
              <div className="w-32 sm:w-40 rounded-2xl p-1 bg-black border border-gray-300 shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src="/portfolio/leaddialer-screen-1.jpg"
                    alt="LeadDialer App Screen 1"
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Phone 2 (Center Straight) */}
              <div className="w-36 sm:w-44 rounded-2xl p-1 bg-black border-2 border-orange-400 shadow-2xl z-10 hover:scale-105 transition-transform duration-300">
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src="/portfolio/leaddialer-screen-2.jpg"
                    alt="LeadDialer App Screen 2"
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Phone 3 (Slanted Right) */}
              <div className="w-32 sm:w-40 rounded-2xl p-1 bg-black border border-gray-300 shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-300 hidden sm:block">
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src="/portfolio/leaddialer-screen-3.jpg"
                    alt="LeadDialer App Screen 3"
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: MOBILE APPS SUITE (INTERACTIVE TABBED SHOWCASE) ─── */}
      <section id="mobile-suite" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <Smartphone className="w-3.5 h-3.5" />
            4 Published Mobile Applications
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Verified on Google Play &amp; Apple App Store
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Switch between active applications below to review genuine store screenshots, use cases, and download links.
          </p>
        </div>

        {/* App Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {VERIFIED_MOBILE_APPS.map((app, i) => (
            <button
              key={app.id}
              onClick={() => setActiveAppIndex(i)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all border ${
                activeAppIndex === i
                  ? 'bg-[#f97316] text-white border-[#f97316] shadow-md shadow-orange-500/20 scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-5 h-5 rounded-md overflow-hidden relative shrink-0">
                <Image src={app.iconPath} alt={app.name} fill sizes="20px" className="object-cover" />
              </div>
              {app.name}
            </button>
          ))}
        </div>

        {/* Selected App Display */}
        {(() => {
          const currentApp = VERIFIED_MOBILE_APPS[activeAppIndex];
          return (
            <div className="grid lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border-2 border-orange-200/80 shadow-lg shadow-orange-500/5">
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden relative shadow-md border border-gray-200 shrink-0">
                    <Image src={currentApp.iconPath} alt={currentApp.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{currentApp.name}</h3>
                    <p className="text-xs text-orange-600 font-mono mt-0.5 font-bold">
                      {currentApp.platform} · {currentApp.packageId}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed text-sm">{currentApp.shortDescription}</p>

                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Supported Use Cases</p>
                  {currentApp.supportedUseCases.map((useCase, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{useCase}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={currentApp.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-[#f97316] text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Open {currentApp.platform === 'iOS' ? 'Apple Store' : 'Google Play'}
                  </a>
                  <button
                    onClick={() => handleSelectService('Mobile Application Development', currentApp.name)}
                    className="px-4 py-2.5 rounded-xl border-2 border-orange-400 hover:bg-orange-50 text-orange-700 font-bold text-xs transition-all"
                  >
                    Build Similar Mobile App
                  </button>
                </div>
              </div>

              {/* Real device frames */}
              <div className="lg:col-span-7 flex items-center justify-center gap-4 overflow-x-auto py-2">
                {currentApp.screenshots.slice(0, 3).map((screen, idx) => (
                  <div
                    key={idx}
                    className="w-36 sm:w-48 rounded-3xl p-1.5 bg-black border-2 border-gray-300 shadow-xl shrink-0 hover:border-orange-500 hover:scale-105 transition-all duration-300"
                  >
                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-100">
                      <Image
                        src={screen}
                        alt={`${currentApp.name} screen ${idx + 1}`}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ─── SECTION 4: ENTERPRISE SERVICES & CAPABILITIES (CREATIVE GRID) ─── */}
      <section id="services-grid" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <Code2 className="w-3.5 h-3.5" />
            Engineering &amp; Solutions
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Comprehensive Technical Capabilities
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Every service is backed by real production code, 100% intellectual property ownership, and direct milestone delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERIFIED_SERVICES.map((srv) => {
            const IconComp = SERVICE_ICONS[srv.iconName] || Code2;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs hover:border-orange-400 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle orange accent stripe on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center group-hover:bg-[#f97316] group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {srv.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{srv.tagline}</p>
                  </div>

                  <div className="space-y-2 text-xs leading-relaxed border-t border-gray-100 pt-3">
                    <div>
                      <span className="font-bold text-gray-900">Problem: </span>
                      <span className="text-gray-600 line-clamp-2">{srv.customerProblem}</span>
                    </div>
                    <div>
                      <span className="font-bold text-orange-700">Solution: </span>
                      <span className="text-gray-700 line-clamp-2">{srv.proposedSolution}</span>
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-gray-100 pt-3">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Deliverables</span>
                    {srv.deliverables.slice(0, 2).map((d, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-700">
                        <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedService(srv)}
                    className="text-xs font-bold text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleSelectService(srv.title, srv.title)}
                    className="px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-[#f97316] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Inquire
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SECTION 5: LEADERSHIP & HYDERABAD HUBS ─── */}
      <section id="leadership-profile" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <Building2 className="w-3.5 h-3.5" />
            Corporate Leadership
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            The Team Steering Adyapan Edutech
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Real corporate founders and academic leaders driving innovation, student mentorship, and enterprise delivery.
          </p>
        </div>

        {/* Founders Spotlight Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {VERIFIED_LEADERSHIP.slice(0, 2).map((leader, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-7 border-2 border-orange-200/80 shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-400 relative shrink-0 shadow-md">
                  <Image src={leader.imagePath} alt={leader.name} fill sizes="80px" className="object-cover" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{leader.name}</h3>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">{leader.role}</p>
                  {leader.linkedInUrl && (
                    <a
                      href={leader.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1 font-semibold"
                    >
                      LinkedIn Profile
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{leader.bio}</p>

              {leader.quote && (
                <blockquote className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 text-xs sm:text-sm italic text-gray-800">
                  &ldquo;{leader.quote}&rdquo;
                </blockquote>
              )}
            </div>
          ))}
        </div>

        {/* Core Team Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto mt-6">
          {VERIFIED_LEADERSHIP.slice(2).map((member, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs text-center space-y-1.5">
              <div className="w-14 h-14 rounded-full overflow-hidden mx-auto relative border-2 border-orange-300">
                <Image src={member.imagePath} alt={member.name} fill sizes="56px" className="object-cover" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">{member.name}</h4>
              <p className="text-xs text-orange-600 font-semibold">{member.role}</p>
              <p className="text-[11px] text-gray-500 leading-snug">{member.bio}</p>
            </div>
          ))}
        </div>

        {/* 3 Physical Offices Section */}
        <div id="offices" className="mt-16 pt-12 border-t border-gray-100 max-w-5xl mx-auto">
          <h3 className="text-xl font-black text-gray-900 mb-6 text-center">Our 3 Registered Physical Hubs in Hyderabad</h3>
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Head Office</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sattva Magnus, Sabza Colony, Toli Chowki, Hyderabad, Telangana 500008
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Engineering Branch</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Cluster_malkajgiri 82, X Road, Khajaguda - Nanakramguda Rd, Rai Durg, Telangana 500104
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Executive Operations</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                IndiQube Pearl, Mindspace Rd, Gachibowli, Hyderabad, Telangana 500032
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: FAQ ACCORDION ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-gray-100">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-sm">Common questions regarding engagement scopes, code ownership, and timelines.</p>
        </div>

        <div className="space-y-3">
          {PORTFOLIO_FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-2xs">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:text-orange-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-orange-600' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── PRODUCT MODAL (PURE WHITE) ─── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-gray-200"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                  {selectedProduct.category}
                </span>

                <h3 className="text-2xl font-black text-gray-900">{selectedProduct.name}</h3>
                <p className="text-xs font-semibold text-orange-600">{selectedProduct.headline}</p>

                <p className="text-sm text-gray-600 leading-relaxed">{selectedProduct.detailedDescription}</p>

                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Verified Features</h4>
                  {selectedProduct.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Target Audience</span>
                  <p className="text-xs text-gray-800 font-medium">{selectedProduct.targetAudience}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Confirmed Technology Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.technologies.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      const name = selectedProduct.name;
                      setSelectedProduct(null);
                      handleSelectService('Custom Software & Enterprise Solutions', name);
                    }}
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
                  >
                    Inquire About This Solution
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── SERVICE MODAL (PURE WHITE) ─── */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-gray-200"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                  {selectedService.category} Service
                </span>

                <h3 className="text-2xl font-black text-gray-900">{selectedService.title}</h3>
                <p className="text-xs font-semibold text-orange-600">{selectedService.tagline}</p>

                <div className="space-y-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block mb-1">Customer Problem:</span>
                    <p className="text-gray-600 leading-relaxed">{selectedService.customerProblem}</p>
                  </div>
                  <div>
                    <span className="font-bold text-orange-700 block mb-1">Proposed Solution:</span>
                    <p className="text-gray-700 leading-relaxed">{selectedService.proposedSolution}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Deliverables</h4>
                  {selectedService.deliverables.map((del, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
                  <span className="font-bold block mb-0.5">Potential Business Value:</span>
                  <p>{selectedService.potentialBusinessValue}</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      const title = selectedService.title;
                      setSelectedService(null);
                      handleSelectService(title, title);
                    }}
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
                  >
                    Inquire About This Service
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
