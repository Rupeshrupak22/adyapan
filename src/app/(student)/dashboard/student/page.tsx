'use client';

import api from '@/lib/api';
import { useEffect, useState } from 'react';
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
} from 'lucide-react';

/*  Types  */
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

/*  Helpers  */
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const lmsProviderLabel = (provider?: string) => {
  const map: Record<string, string> = {
    moodle: 'Moodle',
    google_classroom: 'Google Classroom',
    teachable: 'Teachable',
    thinkific: 'Thinkific',
    custom: 'Learning Platform',
  };
  return map[provider || 'custom'] || 'Learning Platform';
};

function ProgressRing({ pct, size = 56 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={6} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={pct === 100 ? '#22c55e' : '#ffa800'} strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

/*  Certificate Card  */
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 flex flex-col gap-3 ${
        isComplete
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isComplete ? 'bg-green-100' : 'bg-gray-200'
          }`}
        >
          {isComplete ? (
            <Trophy className="w-6 h-6 text-green-600" />
          ) : (
            <Lock className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-sm truncate">{course.title}</h4>
          {isComplete && certificate ? (
            <p className="text-xs text-green-600 font-semibold mt-0.5">
              Certificate Ready - ID: {certificate.certificateId}
            </p>
          ) : isComplete ? (
            <p className="text-xs text-green-600 font-semibold mt-0.5">Certificate Ready</p>
          ) : (
            <p className="text-xs text-gray-500 mt-0.5">
              {progress.progressPercent}% complete - {progress.totalLessons - progress.completedLessons.length} lessons remaining
            </p>
          )}
        </div>
      </div>

      {isComplete && certificate ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Issued: {fmtDate(certificate.issuedAt)}</span>
          </div>
          <button
            onClick={() => onDownload(course.slug)}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors disabled:opacity-60"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download Certificate
              </>
            )}
          </button>
        </div>
      ) : isComplete ? (
        <button
          onClick={() => onDownload(course.slug)}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors disabled:opacity-60"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Download Certificate
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gray-200 text-gray-500 text-sm font-semibold">
          <Lock className="w-4 h-4" />
          <span>Certification guidance will be shared during onboarding</span>
        </div>
      )}
    </motion.div>
  );
}

/*  Course Card  */
function CourseCard({
  item, onMarkLesson, expandedSlug, onToggleExpand, onDownload, downloading,
}: {
  item: EnrolledCourse;
  onMarkLesson: (courseSlug: string, lessonId: string, moduleId: string) => void;
  expandedSlug: string | null;
  onToggleExpand: (slug: string) => void;
  onDownload: (courseSlug: string) => void;
  downloading: string;
}) {
  const { course, progress, enrollment, certificate } = item;
  if (!course) return null;

  const pct = progress.progressPercent;
  const done = progress.completedLessons;
  const isExpanded = expandedSlug === course.slug;
  const isComplete = progress.isComplete || pct === 100;
  const isDownloading = downloading === course.slug;

  /* Find "continue" lesson - first incomplete */
  let continueLessonId = '';
  let continueModuleId = '';
  outer: for (const mod of course.modules) {
    for (const les of mod.lessons) {
      if (!done.includes(les._id)) {
        continueLessonId = les._id;
        continueModuleId = mod._id;
        break outer;
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        <Image src={course.thumbnail} alt={course.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {isComplete && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" /> Completed
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffa800] text-white">{course.level}</span>
        </div>
        {/* Progress ring overlay */}
        <div className="absolute bottom-2 right-3">
          <div className="relative">
            <ProgressRing pct={pct} size={48} />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white rotate-90">
              {pct}%
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Title + meta */}
        <div className="mb-3">
          <h3 className="font-extrabold text-gray-900 text-base leading-tight mb-1">{course.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">{course.subtitle}</p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{done.length}/{course.totalLessons} lessons</span>
          <span className="flex items-center gap-1"><BarChart2 className="w-3.5 h-3.5" />{course.category}</span>
        </div>

        {/* Enrollment date */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Calendar className="w-3 h-3" />
          <span>Enrolled {fmtDate(enrollment.enrolledAt)}</span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-medium">Progress</span>
            <span className={`font-bold ${isComplete ? 'text-green-600' : 'text-[#ffa800]'}`}>{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-[#ffa800] to-[#ff6b00]'}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {isComplete ? (
            <button
              onClick={() => onDownload(course.slug)}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download Certificate
                </>
              )}
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => continueLessonId && onMarkLesson(course.slug, continueLessonId, continueModuleId)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold transition-all"
              style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}
            >
              <ExternalLink className="w-4 h-4" /> Connect to Learning Platform
            </motion.button>
          )}
          <button
            onClick={() => onToggleExpand(course.slug)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Certificate locked notice */}
        {!isComplete && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Certification guidance will be shared during onboarding</span>
          </div>
        )}

        {/* Expandable modules */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {course.modules.map((mod, mi) => {
                  const modDone = mod.lessons.filter(l => done.includes(l._id)).length;
                  return (
                    <div key={mod._id} className="rounded-xl border border-gray-100 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50">
                        <span className="text-xs font-bold text-gray-700">
                          Module {mi + 1}: {mod.title.replace(/^Module \d+ - /, '')}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">{modDone}/{mod.lessons.length}</span>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {mod.lessons.map((les) => {
                          const isDone = done.includes(les._id);
                          return (
                            <div key={les._id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-green-100' : 'bg-gray-100'}`}>
                                {isDone
                                  ? <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                  : les.isFree
                                    ? <Play className="w-3 h-3 text-gray-400" />
                                    : <Lock className="w-3 h-3 text-gray-300" />
                                }
                              </div>
                              <span className={`flex-1 text-xs ${isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                {les.title}
                              </span>
                              <span className="text-[10px] text-gray-400">{les.duration}</span>
                              {!isDone && (
                                <button
                                  onClick={() => onMarkLesson(course.slug, les._id, mod._id)}
                                  className="text-[10px] font-bold text-[#ffa800] hover:text-orange-600 transition-colors px-2 py-0.5 rounded-full border border-[#ffa800]/30 hover:border-orange-400"
                                >
                                  Mark Done
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function OnboardingStepList({ lmsAccess }: { lmsAccess: LMSAccessData | null }) {
  const steps = [
    { label: 'Enrollment Confirmed', complete: true },
    { label: 'LMS Account Creation', complete: !!lmsAccess },
    { label: 'Batch Assignment', complete: !!lmsAccess?.batchName },
    { label: 'Class Access Shared', complete: !!lmsAccess?.lmsPortalLink },
    { label: 'Certification Guidance', complete: !!lmsAccess?.certificationGuidance || !!lmsAccess?.mentorName },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-[#ffa800]" />
        </div>
        <div>
          <h3 className="font-extrabold text-gray-900">Onboarding Status</h3>
          <p className="text-xs text-gray-500">
            {lmsAccess ? 'Your learning access is ready.' : 'Our team is preparing your learning access.'}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.complete ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
              }`}
            >
              {step.complete ? <Check className="w-4 h-4" /> : <Timer className="w-4 h-4" />}
            </div>
            <span className={`text-sm font-semibold ${step.complete ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.complete ? 'Done' : 'Pending'} - {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LMSAccessPanel({
  lmsAccess,
  onCopy,
}: {
  lmsAccess: LMSAccessData | null;
  onCopy: (value: string, label: string) => void;
}) {
  if (!lmsAccess) {
    return (
      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5 justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-6 h-6 text-[#ffa800]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#ffa800] mb-1">Learning Platform</p>
              <h2 className="text-xl font-extrabold text-gray-900">Our team is preparing your learning access.</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                Your classes are hosted on our secure learning platform. Academic support will share your LMS login,
                batch details, class schedule, mentorship details, and certification guidance within 24 hours.
              </p>
            </div>
          </div>
          <a
            href="mailto:support@adyapan.com"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 text-sm font-bold hover:bg-orange-100 transition-colors"
          >
            <LifeBuoy className="w-4 h-4" /> Contact Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-orange-100 bg-white shadow-sm overflow-hidden">
      <div className="p-6 sm:p-7 bg-gradient-to-br from-[#111827] to-[#1f2937] text-white">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#ffa800] mb-2">Your LMS Access is Ready</p>
            <h2 className="text-2xl font-extrabold">Connect to Learning Platform</h2>
            <p className="text-sm text-white/70 mt-2 max-w-2xl">
              Your classes are hosted on our secure learning platform. Use the credentials below only from your own account.
            </p>
          </div>
          <a
            href={lmsAccess.lmsPortalLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold shadow-lg shadow-orange-900/30"
            style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}
          >
            <ExternalLink className="w-4 h-4" /> Open LMS
          </a>
        </div>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { label: 'Platform', value: lmsProviderLabel(lmsAccess.lmsProvider), icon: ShieldCheck },
          { label: 'Batch', value: lmsAccess.batchName || 'Batch assignment shared soon', icon: Users },
          { label: 'Mentor', value: lmsAccess.mentorName || 'Mentor details shared soon', icon: UserCheck },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl bg-orange-50/60 border border-orange-100 p-4">
            <Icon className="w-5 h-5 text-[#ffa800] mb-2" />
            <p className="text-xs text-orange-900/50 font-semibold">{label}</p>
            <p className="text-sm font-extrabold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="px-5 sm:px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">LMS Email</p>
          <div className="flex items-center gap-2">
            <p className="flex-1 text-sm font-bold text-gray-900 break-all">{lmsAccess.lmsEmail}</p>
            <button
              onClick={() => onCopy(lmsAccess.lmsEmail, 'LMS email')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#ffa800] text-xs font-bold transition-colors"
              title="Copy Email"
            >
              <Copy className="w-4 h-4" /> Copy Email
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">LMS Password</p>
          <div className="flex items-center gap-2">
            <p className="flex-1 text-sm font-bold text-gray-900 break-all">{lmsAccess.lmsPassword}</p>
            <button
              onClick={() => onCopy(lmsAccess.lmsPassword, 'LMS password')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#ffa800] text-xs font-bold transition-colors"
              title="Copy Password"
            >
              <Copy className="w-4 h-4" /> Copy Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnrollmentOnboardingCard({
  item,
  lmsAccess,
}: {
  item: EnrolledCourse;
  lmsAccess: LMSAccessData | null;
}) {
  const { course, enrollment } = item;
  const title = course?.title || enrollment.courseName;
  const enrollmentId = enrollment.id.slice(-8).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-32 bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#ff6b00] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,168,0,0.35),transparent_32%),radial-gradient(circle_at_82%_24%,rgba(255,255,255,0.14),transparent_28%)]" />
        <div className="absolute bottom-4 left-5 right-5">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/15 text-white border border-white/20">
            <ShieldCheck className="w-3 h-3" /> Secure External LMS
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base leading-tight">{title}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Enrollment ID: <span className="font-bold text-gray-700">{enrollmentId}</span>
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold">
            Confirmed
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-orange-50 border border-orange-100 p-3">
            <p className="text-[11px] text-orange-900/50 font-semibold">Plan</p>
            <p className="text-sm font-bold text-gray-900 truncate">{enrollment.planLabel || 'Adyapan Program'}</p>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p className="text-[11px] text-gray-400 font-semibold">Enrolled</p>
            <p className="text-sm font-bold text-gray-900">{fmtDate(enrollment.enrolledAt)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 mb-4">
          <p className="text-sm font-bold text-gray-900 mb-1">Your classes are hosted on our secure learning platform.</p>
          <p className="text-xs text-gray-500">
            Adyapan manages enrollment, onboarding, certification, internship, placement, and student support here.
          </p>
        </div>

        {lmsAccess ? (
          <a
            href={lmsAccess.lmsPortalLink}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}
          >
            <ExternalLink className="w-4 h-4" /> Join LMS Portal
          </a>
        ) : (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 text-gray-500 text-sm font-bold cursor-not-allowed"
          >
            <KeyRound className="w-4 h-4" /> Connect to Learning Platform
          </button>
        )}
      </div>
    </motion.div>
  );
}

/*  Main Dashboard  */
import { Suspense } from 'react';

function StudentDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<DashUser | null>(null);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [lmsAccess, setLmsAccess] = useState<LMSAccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [updatingLesson, setUpdatingLesson] = useState('');
  const [downloading, setDownloading] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates'>('courses');

  /* Read ?tab= param on mount */
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'certificates') setActiveTab('certificates');
    else setActiveTab('courses');
  }, [searchParams]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/user/dashboard');
      setUser(res.data.user);
      setCourses(res.data.courses ?? []);
      setLmsAccess(res.data.lmsAccess ?? null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/auth');
      } else {
        setError('Failed to load dashboard. Please refresh.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      alert(`${label} copied.`);
    } catch {
      alert(`Could not copy ${label}.`);
    }
  };

  const handleMarkLesson = async (courseSlug: string, lessonId: string, moduleId: string) => {
    setUpdatingLesson(lessonId);
    try {
      const res = await api.post('/api/progress/complete-lesson', { courseSlug, lessonId, moduleId });
      /* Update local state */
      setCourses(prev => prev.map(item => {
        if (item.course?.slug !== courseSlug) return item;
        const isNowComplete = res.data.progressPercent === 100;
        return {
          ...item,
          progress: {
            ...item.progress,
            completedLessons: res.data.completedLessons,
            progressPercent:  res.data.progressPercent,
            totalLessons:     res.data.totalLessons,
            completedAt:      res.data.completedAt,
            isComplete:       isNowComplete,
          },
          certificate: res.data.certificate ?? item.certificate,
        };
      }));
    } catch {
      /* silent */
    } finally {
      setUpdatingLesson('');
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
      alert('Failed to download certificate. Please try again.');
    } finally {
      setDownloading('');
    }
  };

  /*  Loading  */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ffa800] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  /*  Error  */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-sm w-full">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchDashboard} className="px-6 py-2 bg-[#ffa800] text-white rounded-xl font-semibold hover:bg-[#e69500] transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  /*  Stats  */
  const totalCourses = courses.length;
  const completedCourses = courses.filter(c => c.progress.progressPercent === 100).length;
  const onboardingStatus = lmsAccess ? 'Ready' : totalCourses > 0 ? 'In Progress' : 'Not Started';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/*  Welcome header  */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
            Welcome to Adyapan, {user?.name?.split(' ')[0] || 'Student'} 🎉
          </h1>
          <p className="text-gray-500 text-sm">
            {totalCourses === 0
              ? 'You have no active enrollment yet. Explore our programs to begin your onboarding.'
              : 'Thank you for enrolling with Adyapan. Your student onboarding is being managed by our academic support team.'}
          </p>
        </motion.div>

        {/*  Stats cards  */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen,    label: 'Enrolled',         value: totalCourses,          color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
            { icon: UserCheck,   label: 'Onboarding',       value: onboardingStatus,      color: 'text-[#ffa800]',  bg: 'bg-amber-50',  border: 'border-amber-100' },
            { icon: KeyRound,    label: 'LMS Access',       value: lmsAccess ? 'Ready' : 'Pending', color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
            { icon: Award,       label: 'Certificates',     value: completedCourses,      color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
          ].map(({ icon: Icon, label, value, color, bg, border }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border ${border} ${bg} p-4 flex items-center gap-3`}
            >
              <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-xl font-extrabold ${color} leading-none`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/*  No courses state  */}
        {totalCourses === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-10 h-10 text-[#ffa800]" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">No courses yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
              Enroll in a course to start your learning journey with Adyapan Skills.
            </p>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#ffa800,#ff6b00)' }}
            >
              <Zap className="w-4 h-4" /> Explore Programs
            </Link>
          </motion.div>
        )}

        {/*  Course grid  */}
        {totalCourses > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-3xl border border-orange-100 bg-white p-6 sm:p-7 shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#ffa800] mb-2">Welcome & Onboarding</p>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                    Welcome to Adyapan, {user?.name || 'Student'} 🎉
                  </h2>
                  <p className="text-sm text-gray-600 leading-7 mb-4">
                    Thank you for enrolling with Adyapan. Our academic support team will contact you within 24 hours with:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['LMS access', 'class schedule', 'student credentials', 'mentorship details', 'certification guidance'].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-100 px-3 py-2">
                        <CheckCircle className="w-4 h-4 text-[#ffa800] flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-[#111827] text-white p-5 flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#ffa800] font-bold mb-2">Support Desk</p>
                    <h3 className="text-lg font-extrabold">Need onboarding help?</h3>
                    <p className="text-sm text-white/65 mt-2">Academic support, counselor support, and WhatsApp connect are available for enrolled students.</p>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-2">
                    <a href={`mailto:${lmsAccess?.supportContact || 'support@adyapan.com'}`} className="inline-flex items-center gap-2 text-sm font-bold text-white/90 hover:text-[#ffa800]">
                      <LifeBuoy className="w-4 h-4" /> {lmsAccess?.supportContact || 'support@adyapan.com'}
                    </a>
                    <a href={lmsAccess?.whatsappNumber ? `https://wa.me/91${lmsAccess.whatsappNumber.replace(/\D/g, '').slice(-10)}` : 'mailto:support@adyapan.com'} target={lmsAccess?.whatsappNumber ? '_blank' : undefined} rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-white/90 hover:text-[#ffa800]">
                      <MessageCircle className="w-4 h-4" /> WhatsApp connect
                    </a>
                    <p className="inline-flex items-center gap-2 text-sm font-bold text-white/90">
                      <UserCheck className="w-4 h-4" /> Counselor: {lmsAccess?.counselorName || 'Assigned soon'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.8fr] gap-6 mb-8">
              <LMSAccessPanel lmsAccess={lmsAccess} onCopy={handleCopy} />
              <OnboardingStepList lmsAccess={lmsAccess} />
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-2xl p-1 w-fit">
              {(['courses', 'certificates'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'courses' ? (
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> My Enrollments</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Certificates</span>
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'courses' && (
                <motion.div
                  key="courses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-extrabold text-gray-900">
                      My Enrollments <span className="text-sm font-normal text-gray-400">({totalCourses})</span>
                    </h2>
                    <Link href="/#all-programs" className="text-xs text-[#ffa800] font-semibold hover:underline flex items-center gap-1">
                      Browse more <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((item) => (
                      <EnrollmentOnboardingCard
                        key={item.enrollment.id}
                        item={item}
                        lmsAccess={lmsAccess}
                      />
                    ))}
                  </div>

                  {/* Enrollment Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                  >
                    <h3 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#ffa800]" /> Enrollment Summary
                    </h3>
                    <div className="space-y-5">
                      {courses.map((item) => {
                        if (!item.course) return null;
                        return (
                          <div key={item.enrollment.id}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span className="font-semibold text-gray-700 truncate max-w-[60%]">{item.course.title}</span>
                              <span className="font-bold text-xs text-green-600">
                                Enrollment confirmed
                              </span>
                            </div>
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-[#ffa800] to-[#ff6b00]"
                                initial={{ width: 0 }}
                                animate={{ width: lmsAccess ? '100%' : '38%' }}
                                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-gray-400">
                                Enrollment ID: {item.enrollment.id.slice(-8).toUpperCase()} - {item.course.duration}
                              </p>
                              <span className="text-xs text-[#ffa800] font-semibold flex items-center gap-1">
                                <KeyRound className="w-3 h-3" /> {lmsAccess ? 'LMS ready' : 'LMS pending'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'certificates' && (
                <motion.div
                  key="certificates"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/*  Earned Certificates  */}
                  <div className="mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900 mb-1">My Earned Certificates</h2>
                    <p className="text-sm text-gray-500">
                      Certificates and internship/project credentials issued by Adyapan appear here when ready.
                    </p>
                  </div>

                  {completedCourses === 0 && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        Your certificate is not issued yet. Our academic team will guide you through the required certification process.
                      </p>
                    </div>
                  )}

                  {courses.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
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

                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/*  Quick links  */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Browse Programs', href: '/#all-programs', icon: BookOpen, color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { label: 'My Profile',      href: '/auth',          icon: Award,    color: 'text-purple-600 bg-purple-50 border-purple-100' },
            {
              label: 'Certificates',
              href: '#',
              icon: GraduationCap,
              color: 'text-green-600 bg-green-50 border-green-100',
              onClick: () => setActiveTab('certificates'),
            },
            { label: 'Support', href: 'mailto:support@adyapan.com', icon: Zap, color: 'text-[#ffa800] bg-amber-50 border-amber-100' },
          ].map(({ label, href, icon: Icon, color, onClick }) =>
            onClick ? (
              <button
                key={label}
                onClick={onClick}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all hover:shadow-sm ${color}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ) : (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all hover:shadow-sm ${color}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            )
          )}
        </div>

      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="w-12 h-12 border-4 border-[#ffa800] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <StudentDashboardInner />
    </Suspense>
  );
}
