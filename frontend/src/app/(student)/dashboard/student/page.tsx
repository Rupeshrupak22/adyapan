'use client';

import api from '@/lib/api';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Award, Clock, CheckCircle, ChevronRight,
  Play, Lock, BarChart2, Download, Trophy,
  TrendingUp, Star, Zap, ChevronDown, ChevronUp,
  Calendar, GraduationCap, AlertCircle,
  Copy, ExternalLink, ShieldCheck, UserCheck, MessageCircle,
  LifeBuoy, KeyRound, Check, Timer, Users,
  Search, Filter, LogOut, ArrowRight, Sparkles, Compass,
  Eye, EyeOff, X, PhoneCall, CheckCircle2,
} from 'lucide-react';
import { ALL_PROGRAMS, CourseProgram, getThumbnail } from '@/lib/courseData';

/* ── Types ──────────────────────────────────────────────────────── */
interface Lesson {
  _id: string;
  title: string;
  duration: string;
  isFree: boolean;
}
interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}
interface CourseData {
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  totalLessons: number;
  thumbnail: string;
  category: string;
  level: string;
  modules: Module[];
}
interface ProgressData {
  completedLessons: string[];
  progressPercent: number;
  totalLessons: number;
  lastLessonId: string;
  lastModuleId: string;
  completedAt: string | null;
  isComplete: boolean;
}
interface CertificateData {
  certificateId: string;
  studentName: string;
  courseName: string;
  issuedAt: string;
  status: 'ready' | 'pending';
  downloadUrl: string;
}
interface EnrolledCourse {
  enrollment: {
    id: string;
    courseSlug: string;
    courseName: string;
    planLabel: string;
    amountPaid: number;
    enrolledAt: string;
  };
  course: CourseData | null;
  progress: ProgressData;
  certificate: CertificateData | null;
}
interface DashUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}
interface LMSAccessData {
  id: string;
  lmsProvider: 'moodle' | 'google_classroom' | 'teachable' | 'thinkific' | 'custom';
  lmsEmail: string;
  lmsPassword: string;
  lmsPortalLink: string;
  batchName: string;
  mentorName: string;
  counselorName: string;
  supportContact: string;
  whatsappNumber: string;
  certificationGuidance: string;
  assignedAt: string;
}

/* ── Category Filters ───────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'ALL', label: 'All Programs', count: 65 },
  { id: 'CSE / IT DOMAINS', label: 'CSE / IT Domains', count: 26 },
  { id: 'MANAGEMENT & COMMERCE', label: 'Management & Commerce', count: 15 },
  { id: 'ECE DOMAINS', label: 'ECE Domains', count: 5 },
  { id: 'ECONOMICS', label: 'Economics', count: 4 },
  { id: 'MECHANICAL ENGINEERING', label: 'Mechanical', count: 4 },
  { id: 'BIO & LIFE SCIENCES', label: 'Bio & Life Sciences', count: 10 },
  { id: 'CIVIL ENGINEERING', label: 'Civil', count: 1 },
];

/* ── Helpers ────────────────────────────────────────────────────── */
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const lmsProviderLabel = (provider?: string) => {
  const map: Record<string, string> = {
    moodle: 'Moodle LMS',
    google_classroom: 'Google Classroom',
    teachable: 'Teachable',
    thinkific: 'Thinkific',
    custom: 'Adyapan Learning Hub',
  };
  return map[provider || 'custom'] || 'Adyapan Learning Hub';
};

function ProgressRing({ pct, size = 56 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={5} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={pct === 100 ? '#22c55e' : '#ffa800'} strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </svg>
  );
}

/* ── Quick Enroll Modal ─────────────────────────────────────────── */
function EnrollModal({
  course,
  user,
  onClose,
}: {
  course: CourseProgram;
  user: DashUser | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'plan-1' | 'plan-4-premium'>('plan-1');

  const plans = [
    {
      id: 'plan-1' as const,
      name: 'Standard Live Mentorship',
      price: '₹3,000',
      tagline: 'Best for students seeking structured live classes & certification',
      features: [
        '100% Live Instructor-Led Classes',
        'Direct Doubt Clearing with Mentors',
        'Complete LMS Recording & Notes Access',
        'Industry Capstone Project Assignment',
        'ISO & University Approved Certificate',
      ],
      popular: true,
    },
    {
      id: 'plan-4-premium' as const,
      name: 'Career Pro & Placement Track',
      price: '₹5,000',
      tagline: 'Includes 1-on-1 career mentorship & guaranteed interview prep',
      features: [
        'Everything in Standard Live Plan',
        'Dedicated 1-on-1 Mentor Guidance',
        'ATS-Optimized Resume Rebuild',
        'Mock Technical & HR Interviews',
        'Direct Placement Portal Shortlisting',
      ],
      popular: false,
    },
  ];

  const handleProceed = () => {
    onClose();
    router.push(`/checkout?plan=${selectedPlan}&course=${encodeURIComponent(course.slug)}`);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#ff8c00] p-6 text-white flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20 flex-shrink-0 bg-gray-800">
                <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffa800]">
                  Instant Enrollment
                </span>
                <h3 className="text-xl font-extrabold text-white leading-tight mt-0.5">{course.title}</h3>
                <p className="text-xs text-white/70 mt-1">{course.category} • {course.duration}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Select Your Learning Track
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {plans.map(p => {
                const active = selectedPlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`relative rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                      active
                        ? 'border-[#ffa800] bg-orange-50/50 shadow-md ring-2 ring-[#ffa800]/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#ffa800] text-white text-[10px] font-extrabold tracking-wide uppercase shadow-sm">
                        Recommended
                      </span>
                    )}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-sm">{p.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{p.tagline}</p>
                      </div>
                      <span className="text-lg font-black text-[#ffa800] flex-shrink-0">{p.price}</span>
                    </div>
                    <ul className="space-y-1.5 mt-3 pt-3 border-t border-gray-100">
                      {p.features.map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ffa800] flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Info preview */}
          {user && (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-400 font-semibold block">Enrolling As</span>
                <span className="text-gray-800 font-bold">{user.name || 'Student'} ({user.email})</span>
              </div>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold rounded-full text-[11px]">
                Verified Account
              </span>
            </div>
          )}

          {/* Guarantee */}
          <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Official ISO 9001:2015 Certified Portal • Instant LMS Credentials on Approval</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center gap-3 flex-shrink-0">
          <Link
            href={`/courses/${course.slug}`}
            target="_blank"
            className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-colors whitespace-nowrap"
          >
            Full Syllabus Details
          </Link>
          <button
            onClick={handleProceed}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#ffa800] to-[#ff6b00] hover:from-[#e69500] hover:to-[#e05e00] text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
          >
            <span>Proceed to Secure Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Certificate Card ───────────────────────────────────────────── */
function CertificateCard({
  item,
  onDownload,
  downloading,
}: {
  item: EnrolledCourse;
  onDownload: (courseSlug: string) => void;
  downloading: string;
}) {
  const { course, progress, certificate } = item;
  if (!course) return null;

  const isComplete = progress.isComplete || progress.progressPercent === 100;
  const isDownloading = downloading === course.slug;

  return (
    <div
      className={`rounded-3xl border p-6 flex flex-col justify-between transition-all shadow-sm ${
        isComplete
          ? 'bg-gradient-to-br from-green-50/70 via-white to-emerald-50/50 border-green-200'
          : 'bg-white border-gray-200'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isComplete ? 'bg-green-100 text-green-600' : 'bg-orange-50 text-[#ffa800]'
            }`}
          >
            {isComplete ? <Trophy className="w-6 h-6" /> : <Lock className="w-6 h-6 text-gray-400" />}
          </div>
          <span
            className={`text-xs font-extrabold px-3 py-1 rounded-full ${
              isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {isComplete ? 'Issued' : 'Course In Progress'}
          </span>
        </div>

        <h3 className="font-extrabold text-gray-900 text-base leading-snug mb-1">{course.title}</h3>
        <p className="text-xs text-gray-500 mb-3">{course.category}</p>

        {certificate?.certificateId && (
          <div className="p-2.5 rounded-xl bg-white border border-gray-100 text-xs text-gray-600 mb-3">
            <span className="font-semibold text-gray-400 block text-[10px] uppercase">Certificate ID</span>
            <span className="font-mono font-bold text-gray-800">{certificate.certificateId}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        {isComplete ? (
          <button
            onClick={() => onDownload(course.slug)}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold transition-colors shadow-sm disabled:opacity-60"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Downloading PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Verified Certificate</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Progress: {progress.progressPercent}%</span>
            <span className="text-[#ffa800] font-bold">Complete modules to unlock</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Enrollment Card ────────────────────────────────────────────── */
function EnrollmentOnboardingCard({
  item,
  lmsAccess,
  onContinue,
}: {
  item: EnrolledCourse;
  lmsAccess: LMSAccessData | null;
  onContinue: () => void;
}) {
  const { course, enrollment, progress } = item;
  const title = course?.title || enrollment.courseName;
  const pct = progress.progressPercent || 0;
  const isComplete = pct === 100;

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Cover */}
        <div className="relative h-44 overflow-hidden bg-gray-900">
          <Image
            src={course?.thumbnail || getThumbnail(title)}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#ffa800] border border-white/10">
              {course?.category || 'Active Program'}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
              isComplete ? 'bg-green-500 text-white' : 'bg-[#ffa800] text-white shadow-sm'
            }`}>
              {isComplete ? 'Completed' : 'Enrolled'}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p className="text-[11px] text-white/70">Enrollment ID: {enrollment.id.slice(-8).toUpperCase()}</p>
              <h3 className="font-extrabold text-white text-base leading-tight mt-0.5 line-clamp-1">{title}</h3>
            </div>
            <div className="relative flex-shrink-0">
              <ProgressRing pct={pct} size={44} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white rotate-90">
                {pct}%
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Duration</span>
              <span className="font-extrabold text-gray-800">{course?.duration || '2-3 Months'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">LMS Status</span>
              <span className={`font-extrabold ${lmsAccess ? 'text-green-600' : 'text-[#ffa800]'}`}>
                {lmsAccess ? 'Credentials Ready' : 'Pending Allocation'}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 font-semibold">Course Progress</span>
              <span className="font-extrabold text-[#ffa800]">{pct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-[#ffa800] to-[#ff6b00]'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0">
        <button
          onClick={onContinue}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ffa800] to-[#ff6b00] hover:from-[#e69500] hover:to-[#e05e00] text-white text-xs font-black tracking-wide flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Launch Learning Platform</span>
        </button>
      </div>
    </div>
  );
}

/* ── LMS Access Panel ───────────────────────────────────────────── */
function LMSAccessPanel({
  lmsAccess,
  onCopy,
}: {
  lmsAccess: LMSAccessData | null;
  onCopy: (value: string, label: string) => void;
}) {
  const [showPw, setShowPw] = useState(false);

  if (!lmsAccess) {
    return (
      <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-6 h-6 text-[#ffa800]" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ffa800]">
                Onboarding Desk
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">
                Your LMS Platform Access is Being Provisioned
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xl leading-relaxed">
                Our academic coordination team is assigning your live batch schedule, dedicated mentor, and portal credentials.
                Expect your WhatsApp & email notification within 24 hours of enrollment.
              </p>
            </div>
          </div>
          <a
            href="mailto:support@adyapan.com"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-extrabold transition-colors flex-shrink-0"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Academic Support Desk</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Banner */}
      <div className="p-7 bg-gradient-to-r from-[#111827] via-[#1e293b] to-[#ff8c00] text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-400/30 text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LMS Credentials Active
            </span>
            <h2 className="text-2xl font-black mt-2">Connect to {lmsProviderLabel(lmsAccess.lmsProvider)}</h2>
            <p className="text-xs text-white/70 mt-1">
              Use the authorized credentials below to enter your live lectures, recordings, and assignments.
            </p>
          </div>
          {lmsAccess.lmsPortalLink && (
            <a
              href={lmsAccess.lmsPortalLink}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-white text-gray-900 hover:bg-orange-50 font-black text-xs inline-flex items-center gap-2 shadow-xl transition-all flex-shrink-0"
            >
              <span>Open Portal</span>
              <ExternalLink className="w-4 h-4 text-[#ffa800]" />
            </a>
          )}
        </div>
      </div>

      {/* Credentials */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50">
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
            Student User ID / Email
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-extrabold text-sm text-gray-800 break-all">
              {lmsAccess.lmsEmail}
            </span>
            <button
              onClick={() => onCopy(lmsAccess.lmsEmail, 'LMS email')}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#ffa800] transition-colors"
              title="Copy Email"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
            Student Password
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-extrabold text-sm text-gray-800">
              {showPw ? lmsAccess.lmsPassword : '••••••••••••'}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowPw(v => !v)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                title={showPw ? 'Hide' : 'Show'}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onCopy(lmsAccess.lmsPassword, 'LMS password')}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#ffa800] transition-colors"
                title="Copy Password"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor & Counselor Info */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-100 text-xs">
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
          <span className="text-gray-400 block font-semibold text-[10px] uppercase">Batch</span>
          <span className="font-extrabold text-gray-800">{lmsAccess.batchName || 'Adyapan Live 2026'}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
          <span className="text-gray-400 block font-semibold text-[10px] uppercase">Assigned Mentor</span>
          <span className="font-extrabold text-gray-800">{lmsAccess.mentorName || 'Technical Lead'}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-gray-400 block font-semibold text-[10px] uppercase">Academic Counselor</span>
            <span className="font-extrabold text-gray-800">{lmsAccess.counselorName || 'Support Team'}</span>
          </div>
          {lmsAccess.whatsappNumber && (
            <a
              href={`https://wa.me/91${lmsAccess.whatsappNumber.replace(/\D/g, '').slice(-10)}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Student Dashboard Component ───────────────────────────── */
function StudentDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<DashUser | null>(null);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [lmsAccess, setLmsAccess] = useState<LMSAccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState('');

  /* Navigation tab: 'explore' | 'courses' | 'lms' | 'certificates' | 'support' */
  const [activeTab, setActiveTab] = useState<'explore' | 'courses' | 'lms' | 'certificates' | 'support'>('explore');

  /* Course catalog filters */
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<CourseProgram | null>(null);

  /* Sync query param tab */
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'courses') setActiveTab('courses');
    else if (tab === 'certificates') setActiveTab('certificates');
    else if (tab === 'lms') setActiveTab('lms');
    else if (tab === 'support') setActiveTab('support');
    else if (tab === 'explore') setActiveTab('explore');
  }, [searchParams]);

  /* Fetch user dashboard */
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/user/dashboard');
      setUser(res.data.user);
      const enrCourses = res.data.courses ?? [];
      setCourses(enrCourses);
      setLmsAccess(res.data.lmsAccess ?? null);

      // If user has enrollments and no specific tab was requested, default to their courses
      const urlTab = searchParams.get('tab');
      if (!urlTab) {
        if (enrCourses.length > 0) {
          setActiveTab('courses');
        } else {
          setActiveTab('explore');
        }
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load dashboard. Please refresh.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
    router.refresh();
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      alert(`${label} copied to clipboard.`);
    } catch {
      alert(`Could not copy ${label}.`);
    }
  };

  const handleDownload = async (courseSlug: string) => {
    setDownloading(courseSlug);
    try {
      const res = await fetch(`/api/certificates/${courseSlug}/download`, { credentials: 'include' });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      const cert = courses.find(c => c.course?.slug === courseSlug)?.certificate;
      link.download = cert
        ? `Adyapan-Certificate-${cert.certificateId}.pdf`
        : `Adyapan-Certificate-${courseSlug}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download certificate. Please contact academic support.');
    } finally {
      setDownloading('');
    }
  };

  /* Filter catalog courses */
  const filteredPrograms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_PROGRAMS.filter(prog => {
      const matchesCat = selectedCategory === 'ALL' || prog.category === selectedCategory;
      const matchesSearch = !q ||
        prog.title.toLowerCase().includes(q) ||
        prog.category.toLowerCase().includes(q) ||
        prog.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const totalCourses = courses.length;
  const completedCourses = courses.filter(c => c.progress.progressPercent === 100).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ffa800] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-300">Loading Student Learning Portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full border border-gray-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-800 font-bold mb-4">{error}</p>
          <button
            onClick={fetchDashboard}
            className="w-full py-3 bg-[#ffa800] text-white rounded-xl font-bold hover:bg-[#e69500] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-20">
      {/* ── Expressive Top Portal Bar ───────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#ffa800]/20 text-[#ffa800] border border-[#ffa800]/30 text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Adyapan Student Hub
                </span>
                <span className="text-xs text-white/40">•</span>
                <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" /> Active Session
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Welcome to Adyapan, {user?.name?.split(' ')[0] || 'Student'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
                {totalCourses === 0
                  ? 'Your learning portal is ready! Explore our in-demand career programs below and enroll to get instant LMS access and live batch mentorship.'
                  : `You are enrolled in ${totalCourses} active program${totalCourses > 1 ? 's' : ''}. Access your live LMS platform, mentorship, and certificates below.`}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ffa800] to-[#ff6b00] hover:from-[#e69500] hover:to-[#e05e00] text-white text-xs font-black shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explore 60+ Programs</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/10"
                title="Logout and return to public website"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 border-t border-white/10 pt-5 no-scrollbar">
            {[
              { id: 'explore' as const, label: 'Explore & Enroll Programs', icon: Compass, count: '60+' },
              { id: 'courses' as const, label: 'My Enrollments', icon: BookOpen, count: totalCourses },
              { id: 'lms' as const, label: 'LMS Access & Batch', icon: KeyRound, count: lmsAccess ? 'Ready' : 'Pending' },
              { id: 'certificates' as const, label: 'Certificates', icon: GraduationCap, count: completedCourses },
              { id: 'support' as const, label: 'Counselor Support', icon: PhoneCall },
            ].map(tab => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap flex items-center gap-2 transition-all ${
                    active
                      ? 'bg-[#ffa800] text-white shadow-lg shadow-orange-500/25'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      active ? 'bg-black/25 text-white' : 'bg-white/10 text-gray-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Tab Content ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

        {/* ── TAB: EXPLORE & ENROLL COURSES ─────────────────────────── */}
        {activeTab === 'explore' && (
          <div className="space-y-8">
            {/* Catalog Hero Banner */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#111827] text-white p-7 sm:p-9 overflow-hidden shadow-xl border border-gray-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffa800]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl">
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-[#ffa800] border border-orange-500/30 text-[10px] font-black uppercase tracking-wider inline-block mb-3">
                  Live Placement Batches 2026
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  Choose Your Program & Enroll Now
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                  Every program includes live instructor sessions, 1-on-1 industry mentor allocation,
                  hands-on projects, LMS vault credentials, and university-recognized ISO certificate.
                </p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search AI, Full Stack, Data Science, AWS, Finance..."
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#ffa800] focus:ring-2 focus:ring-[#ffa800]/20 shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Programs Count */}
              <span className="text-xs font-bold text-gray-500 self-center">
                Showing <strong className="text-gray-900">{filteredPrograms.length}</strong> available programs
              </span>
            </div>

            {/* Domain category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {CATEGORIES.map(cat => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                      active
                        ? 'bg-[#111827] text-white shadow-md'
                        : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="ml-1.5 opacity-60">({cat.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((prog) => (
                <div
                  key={prog.slug}
                  className="bg-white rounded-3xl border border-gray-200 hover:border-orange-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-44 overflow-hidden bg-gray-900">
                      <Image
                        src={prog.thumbnail}
                        alt={prog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#ffa800] border border-white/10">
                          {prog.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-600 text-white shadow-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live Mentorship
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="flex items-center gap-1 font-bold"><Clock className="w-3.5 h-3.5 text-[#ffa800]" /> {prog.duration}</span>
                        <span className="font-extrabold text-[#ffa800] text-sm bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/10">
                          {prog.price}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-black text-gray-900 text-base leading-snug group-hover:text-[#ffa800] transition-colors line-clamp-1">
                        {prog.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {prog.description}
                      </p>

                      {/* Highlights */}
                      <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2 text-[11px] text-gray-600 font-semibold">
                        <span className="px-2 py-1 rounded-md bg-orange-50 text-orange-700">💼 Placement Prep</span>
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700">📜 ISO Certificate</span>
                        <span className="px-2 py-1 rounded-md bg-green-50 text-green-700">🤝 1-on-1 Mentor</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    <Link
                      href={`/courses/${prog.slug}`}
                      className="py-2.5 px-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors text-center flex items-center justify-center"
                    >
                      Syllabus
                    </Link>
                    <button
                      onClick={() => setSelectedCourseForEnroll(prog)}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ffa800] to-[#ff6b00] hover:from-[#e69500] hover:to-[#e05e00] text-white text-xs font-black shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1"
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: MY ENROLLMENTS ────────────────────────────────────── */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">My Enrolled Programs</h2>
                <p className="text-xs text-gray-500 mt-0.5">Your confirmed courses, learning tracks, and progress</p>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-extrabold flex items-center gap-1.5 transition-colors"
              >
                <span>+ Enroll in More Programs</span>
              </button>
            </div>

            {totalCourses === 0 ? (
              <div className="rounded-3xl bg-white border border-gray-200 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                  <Compass className="w-8 h-8 text-[#ffa800]" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900">No active enrollments yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Browse our catalog of 60+ industry programs and enroll to get instant LMS credentials and live mentor access.
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ffa800] to-[#ff6b00] text-white text-xs font-black shadow-lg shadow-orange-500/20 hover:scale-105 transition-all inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Programs & Enroll Now</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((item) => (
                  <EnrollmentOnboardingCard
                    key={item.enrollment.id}
                    item={item}
                    lmsAccess={lmsAccess}
                    onContinue={() => setActiveTab('lms')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: LMS ACCESS & ONBOARDING ──────────────────────────── */}
        {activeTab === 'lms' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Learning Management System (LMS) Access</h2>
              <p className="text-xs text-gray-500 mt-0.5">Secure platform credentials, batch allocation, and counselor support</p>
            </div>

            <LMSAccessPanel lmsAccess={lmsAccess} onCopy={handleCopy} />

            {/* 4-Step Onboarding Tracker */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-extrabold text-gray-900 text-sm mb-4">Your Onboarding Milestones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: '01', title: 'Enrollment Confirmed', desc: 'Seat locked & verified', done: totalCourses > 0 },
                  { step: '02', title: 'Counselor Assigned', desc: 'Academic guidance & batch selection', done: totalCourses > 0 },
                  { step: '03', title: 'LMS Credentials Generated', desc: 'Platform login & video vault', done: Boolean(lmsAccess) },
                  { step: '04', title: 'Live Orientation Class', desc: '1-on-1 mentorship commences', done: Boolean(lmsAccess) },
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`p-4 rounded-2xl border transition-all ${
                      s.done
                        ? 'bg-green-50/60 border-green-200'
                        : 'bg-gray-50 border-gray-100 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[11px] font-black uppercase ${s.done ? 'text-green-600' : 'text-gray-400'}`}>
                        Step {s.step}
                      </span>
                      {s.done ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Timer className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-sm leading-tight">{s.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: CERTIFICATES ─────────────────────────────────────── */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Student Certificates</h2>
              <p className="text-xs text-gray-500 mt-0.5">Government & ISO 9001:2015 accredited course completion credentials</p>
            </div>

            {totalCourses === 0 ? (
              <div className="rounded-3xl bg-white border border-gray-200 p-12 text-center">
                <GraduationCap className="w-12 h-12 text-[#ffa800] mx-auto mb-3" />
                <h3 className="font-extrabold text-gray-900 text-base">No certificates issued yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Enroll in a program and complete the live capstone assignment to receive your verified credential.
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#ffa800] text-white text-xs font-bold"
                >
                  Explore Programs
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((item) => (
                  <CertificateCard
                    key={item.enrollment.id}
                    item={item}
                    onDownload={handleDownload}
                    downloading={downloading}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: SUPPORT DESK ──────────────────────────────────────── */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Academic Support & Counselor Desk</h2>
              <p className="text-xs text-gray-500 mt-0.5">Direct helpline for batch timing, mentor changes, LMS login, and project queries</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ffa800] flex items-center justify-center mb-4">
                    <LifeBuoy className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base">Email Support Desk</h3>
                  <p className="text-xs text-gray-500 mt-1">Official ticket resolution within 4 working hours</p>
                </div>
                <a
                  href="mailto:support@adyapan.com"
                  className="mt-5 w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold text-center block transition-colors"
                >
                  support@adyapan.com
                </a>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base">WhatsApp Counselor</h3>
                  <p className="text-xs text-gray-500 mt-1">Instant chat for live lecture links & class schedules</p>
                </div>
                <a
                  href="https://wa.me/918292244709?text=Hi%20Adyapan%20Team%2C%20I%20am%20an%20enrolled%20student%20needing%20support."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold text-center block transition-colors"
                >
                  Chat with Counselor
                </a>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base">Student Helpline</h3>
                  <p className="text-xs text-gray-500 mt-1">Mon - Sat (10:00 AM - 7:00 PM IST)</p>
                </div>
                <a
                  href="tel:+918292244709"
                  className="mt-5 w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold text-center block transition-colors"
                >
                  +91 82922 44709
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Quick Enroll Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCourseForEnroll && (
          <EnrollModal
            course={selectedCourseForEnroll}
            user={user}
            onClose={() => setSelectedCourseForEnroll(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
          <div className="w-10 h-10 border-4 border-[#ffa800] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StudentDashboardInner />
    </Suspense>
  );
}
