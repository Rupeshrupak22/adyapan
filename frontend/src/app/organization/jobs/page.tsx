'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Briefcase, Users, Edit2, X, CheckCircle,
  Clock, AlertCircle, Loader2, Search, Filter, ChevronDown,
  MapPin, Calendar, FileText, Send, DollarSign,
} from 'lucide-react';

interface Job {
  _id: string;
  jobTitle: string;
  category: string;
  employmentType: string;
  workMode: string;
  location: string;
  status: string;
  applicantsCount: number;
  createdAt: string;
  deadline: string;
  salaryOrStipend: string;
}

const STATUS_CFG: Record<string, { label: string; cls: string; icon: any }> = {
  active:   { label: 'Active',   cls: 'bg-green-100 text-green-700',  icon: CheckCircle },
  draft:    { label: 'Draft',    cls: 'bg-gray-100 text-gray-600',    icon: FileText },
  closed:   { label: 'Closed',  cls: 'bg-red-100 text-red-600',      icon: X },
  rejected: { label: 'Rejected', cls: 'bg-orange-100 text-orange-700', icon: AlertCircle },
};

const TYPE_COLORS: Record<string, string> = {
  'full-time':      'bg-blue-100 text-blue-700',
  'part-time':      'bg-purple-100 text-purple-700',
  'internship':     'bg-orange-100 text-orange-700',
  'freelance':      'bg-teal-100 text-teal-700',
  'project-based':  'bg-yellow-100 text-yellow-700',
  'work-from-home': 'bg-green-100 text-green-700',
};

const CATEGORIES = [
  'Sales & Marketing',
  'Software Development',
  'Design & Creative',
  'Community & Marketing',
  'Operations & Management',
  'Data Science & AI',
  'Customer Support',
  'Human Resources',
];

const EMP_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'project-based', label: 'Project-based' },
  { value: 'work-from-home', label: 'Work from Home' },
];

const WORK_MODES = [
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];

const EXP_LEVELS = [
  'Fresher',
  'Student / Fresher',
  'Fresher to 2 Years',
  '1 - 3 Years',
  '3 - 5 Years',
  '5+ Years',
];

function StatCard({
  label, value, icon: Icon, color,
}: {
  label: string; value: number; icon: any; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function OrganizationJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [closing, setClosing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Job creation modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const [form, setForm] = useState({
    jobTitle: '',
    category: 'Sales & Marketing',
    employmentType: 'full-time',
    workMode: 'onsite',
    location: '',
    salaryOrStipend: '',
    experienceLevel: 'Fresher to 2 Years',
    openings: '1',
    deadline: '',
    description: '',
    responsibilities: '',
    requiredSkills: '',
    educationRequirement: '',
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/company/jobs', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setJobs(data.jobs || []);
      else setError(data.error || 'Failed to load jobs');
    } catch {
      setError('Failed to load jobs. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleClose = async (id: string) => {
    if (!confirm('Close this job? Students will no longer be able to apply.')) return;
    setClosing(id);
    try {
      await fetch(`/api/company/jobs/${id}/close`, { method: 'PATCH', credentials: 'include' });
      setJobs(prev => prev.map(j => j._id === id ? { ...j, status: 'closed' } : j));
    } finally {
      setClosing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job permanently?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/company/jobs/${id}`, { method: 'DELETE', credentials: 'include' });
      setJobs(prev => prev.filter(j => j._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    if (!form.jobTitle.trim()) { setCreateError('Job title is required'); return; }
    if (!form.description.trim()) { setCreateError('Job description is required'); return; }
    if (!form.deadline) { setCreateError('Application deadline is required'); return; }

    setCreateSubmitting(true);
    try {
      const payload = {
        ...form,
        openings: Number(form.openings) || 1,
        responsibilities: form.responsibilities
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
        requiredSkills: form.requiredSkills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        status: 'active',
      };

      const res = await fetch('/api/company/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.job) {
        setCreateSuccess('Job posted successfully!');
        setJobs(prev => [data.job, ...prev]);
        setTimeout(() => {
          setIsCreateOpen(false);
          setCreateSuccess('');
          setForm({
            jobTitle: '',
            category: 'Sales & Marketing',
            employmentType: 'full-time',
            workMode: 'onsite',
            location: '',
            salaryOrStipend: '',
            experienceLevel: 'Fresher to 2 Years',
            openings: '1',
            deadline: '',
            description: '',
            responsibilities: '',
            requiredSkills: '',
            educationRequirement: '',
          });
        }, 1200);
      } else {
        setCreateError(data.error || 'Failed to post job.');
      }
    } catch {
      setCreateError('Could not connect to server. Please try again.');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.jobTitle.toLowerCase().includes(q) || (j.location && j.location.toLowerCase().includes(q));
    const matchStatus = filterStatus === 'all' || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total:      jobs.length,
    active:     jobs.filter(j => j.status === 'active').length,
    draft:      jobs.filter(j => j.status === 'draft').length,
    closed:     jobs.filter(j => j.status === 'closed').length,
    applicants: jobs.reduce((s, j) => s + (j.applicantsCount || 0), 0),
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your job vacancies and applications</p>
        </div>
        <button
          onClick={() => {
            setIsCreateOpen(true);
            setCreateError('');
            setCreateSuccess('');
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-md shadow-orange-200 transition-all hover:shadow-lg active:scale-95"
          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
        >
          <Plus className="w-4 h-4" /> Post a Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatCard label="Total Jobs"  value={stats.total}      icon={Briefcase}   color="bg-orange-100 text-orange-600" />
        <StatCard label="Active"      value={stats.active}     icon={CheckCircle} color="bg-green-100 text-green-600" />
        <StatCard label="Draft"       value={stats.draft}      icon={FileText}    color="bg-gray-100 text-gray-600" />
        <StatCard label="Closed"      value={stats.closed}     icon={X}           color="bg-red-100 text-red-600" />
        <StatCard label="Applicants"  value={stats.applicants}  icon={Users}       color="bg-blue-100 text-blue-600" />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 bg-white"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 bg-white appearance-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, j) => <div key={j} className="h-8 bg-gray-100 rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No jobs found</p>
          <button
            onClick={() => {
              setIsCreateOpen(true);
              setCreateError('');
              setCreateSuccess('');
            }}
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-500 hover:underline"
          >
            <Plus className="w-4 h-4" /> Post your first job
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map(job => {
              const sc = STATUS_CFG[job.status] || STATUS_CFG.draft;
              const StatusIcon = sc.icon;
              return (
                <motion.div
                  key={job._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-orange-200 p-5 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 flex-wrap mb-2">
                        <h3 className="font-bold text-gray-900 text-base">{job.jobTitle}</h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.cls}`}>
                          <StatusIcon className="w-3 h-3" /> {sc.label}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_COLORS[job.employmentType] || 'bg-gray-100 text-gray-600'}`}>
                          {job.employmentType}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />{job.applicantsCount || 0} applicants
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Posted: {new Date(job.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <Link
                        href={`/organization/jobs/${job._id}/applicants`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all"
                      >
                        <Users className="w-3.5 h-3.5" /> Applicants ({job.applicantsCount || 0})
                      </Link>
                      <Link
                        href={`/organization/jobs/${job._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </Link>
                      {job.status === 'active' && (
                        <button
                          onClick={() => handleClose(job._id)}
                          disabled={closing === job._id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all disabled:opacity-50"
                        >
                          {closing === job._id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <X className="w-3.5 h-3.5" />}
                          Close
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(job._id)}
                        disabled={deleting === job._id}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-50"
                      >
                        {deleting === job._id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <X className="w-3.5 h-3.5" />}
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Post a Job Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8"
            >
              {/* Top Banner */}
              <div className="p-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Post a New Job</h2>
                    <p className="text-xs text-orange-100">Publish immediately to Adyapan students</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {createError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{createError}</span>
                  </div>
                )}
                {createSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{createSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Job Title *</label>
                    <input
                      type="text"
                      name="jobTitle"
                      required
                      placeholder="e.g. Inside Sales Specialist"
                      value={form.jobTitle}
                      onChange={handleCreateChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Category *</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleCreateChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 bg-white"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Type *</label>
                    <select
                      name="employmentType"
                      value={form.employmentType}
                      onChange={handleCreateChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 bg-white"
                    >
                      {EMP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Work Mode *</label>
                    <select
                      name="workMode"
                      value={form.workMode}
                      onChange={handleCreateChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 bg-white"
                    >
                      {WORK_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. Hyderabad (On-site)"
                      value={form.location}
                      onChange={handleCreateChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Salary / Stipend</label>
                    <input
                      type="text"
                      name="salaryOrStipend"
                      placeholder="e.g. ₹3.5 LPA - ₹6.0 LPA"
                      value={form.salaryOrStipend}
                      onChange={handleCreateChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Experience</label>
                    <select
                      name="experienceLevel"
                      value={form.experienceLevel}
                      onChange={handleCreateChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 bg-white"
                    >
                      {EXP_LEVELS.map(x => <option key={x} value={x}>{x}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Deadline *</label>
                    <input
                      type="date"
                      name="deadline"
                      required
                      value={form.deadline}
                      onChange={handleCreateChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Job Description *</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    placeholder="Describe the opportunity, core tasks, and ideal student profile..."
                    value={form.description}
                    onChange={handleCreateChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Responsibilities <span className="font-normal text-gray-400 lowercase">(one per line)</span>
                  </label>
                  <textarea
                    name="responsibilities"
                    rows={3}
                    placeholder="Conduct consultative career counseling&#10;Coordinate with students and mentors"
                    value={form.responsibilities}
                    onChange={handleCreateChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                      Required Skills <span className="font-normal text-gray-400 lowercase">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      name="requiredSkills"
                      placeholder="Sales, Communication, CRM"
                      value={form.requiredSkills}
                      onChange={handleCreateChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Education</label>
                    <input
                      type="text"
                      name="educationRequirement"
                      placeholder="e.g. Any Bachelor's Degree"
                      value={form.educationRequirement}
                      onChange={handleCreateChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md shadow-orange-200 hover:shadow-lg transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
                  >
                    {createSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Publish Job
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
