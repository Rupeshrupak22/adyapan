'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Briefcase, Building2, MapPin, DollarSign,
  Calendar, CheckCircle, AlertCircle, Loader2, Send, Lock
} from 'lucide-react';

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

export default function PostJobPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isOrgAuth, setIsOrgAuth] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [form, setForm] = useState({
    jobTitle: '',
    category: 'Sales & Marketing',
    employmentType: 'full-time',
    workMode: 'onsite',
    location: '',
    salaryOrStipend: '',
    experienceLevel: 'Fresher to 2 Years',
    openings: 1,
    deadline: '',
    description: '',
    responsibilities: '',
    requiredSkills: '',
    educationRequirement: '',
  });

  useEffect(() => {
    // Check if organization is logged in via /api/organization/me
    fetch('/api/organization/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setIsOrgAuth(true);
        } else {
          setIsOrgAuth(false);
        }
      })
      .catch(() => setIsOrgAuth(false))
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.jobTitle.trim()) { setError('Job title is required'); return; }
    if (!form.description.trim()) { setError('Job description is required'); return; }
    if (!form.deadline) { setError('Application deadline is required'); return; }

    setSubmitting(true);
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
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/jobs');
        }, 1500);
      } else {
        setError(data.error || 'Failed to post job. Please ensure your organization account is active.');
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/organization/jobs"
              className="text-xs font-bold text-gray-500 hover:text-orange-600 px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
            >
              Org Dashboard
            </Link>
          </div>
        </div>

        {checkingAuth ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : !isOrgAuth ? (
          /* Login Prompt Card if not logged in */
          <div className="bg-white rounded-3xl border-2 border-orange-200 p-8 sm:p-12 shadow-xl text-center">
            <div className="w-20 h-20 rounded-3xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Organization Login Required</h1>
            <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base mb-6 leading-relaxed">
              To publish verified job openings and review student applications, please sign in with your Adyapan Organization account.
            </p>

            <div className="bg-orange-50 rounded-2xl p-4 max-w-md mx-auto border border-orange-200 mb-8 text-left text-xs text-gray-700 space-y-1.5">
              <p className="font-bold text-orange-900 uppercase tracking-wider text-[11px]">Organization Credentials:</p>
              <p><span className="font-semibold text-gray-900">Email:</span> <code className="bg-white px-2 py-0.5 rounded border border-orange-200 text-orange-700">recruiter@adyapan.com</code></p>
              <p><span className="font-semibold text-gray-900">Password:</span> <code className="bg-white px-2 py-0.5 rounded border border-orange-200 text-orange-700">Adyapan@Jobs2026</code></p>
            </div>

            <Link
              href="/organization/login?redirect=/organization/jobs/post"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
            >
              Sign In to Organization Portal →
            </Link>
          </div>
        ) : (
          /* Job Posting Form */
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8 sm:p-10" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
              <div className="flex items-center gap-3 text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Adyapan Partner Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Post a New Job Opportunity</h1>
              <p className="text-orange-100 text-sm mt-1">Publish verified roles directly to 1,000+ job-ready students.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Job posted successfully! Redirecting to jobs...</span>
                </div>
              )}

              {/* Job Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Job Title *</label>
                  <input
                    type="text"
                    name="jobTitle"
                    required
                    placeholder="e.g. Inside Sales Specialist"
                    value={form.jobTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500 bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Employment Type & Work Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Type *</label>
                  <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500 bg-white"
                  >
                    {EMP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Work Mode *</label>
                  <select
                    name="workMode"
                    value={form.workMode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500 bg-white"
                  >
                    {WORK_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Hyderabad (On-site)"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Salary, Experience & Openings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Salary / Stipend</label>
                  <input
                    type="text"
                    name="salaryOrStipend"
                    placeholder="e.g. ₹3.5 LPA - ₹6.0 LPA"
                    value={form.salaryOrStipend}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={form.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500 bg-white"
                  >
                    {EXP_LEVELS.map(x => <option key={x} value={x}>{x}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Deadline *</label>
                  <input
                    type="date"
                    name="deadline"
                    required
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500 bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Job Description *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Describe the role, team, and what candidate will achieve..."
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500 resize-y"
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Key Responsibilities <span className="font-normal text-gray-400 lowercase">(one per line)</span>
                </label>
                <textarea
                  name="responsibilities"
                  rows={4}
                  placeholder="Conduct consultative career counseling&#10;Manage sales funnels and student follow-ups&#10;Coordinate with academic mentors"
                  value={form.responsibilities}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500 resize-y"
                />
              </div>

              {/* Required Skills & Education */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Required Skills <span className="font-normal text-gray-400 lowercase">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    name="requiredSkills"
                    placeholder="Inside Sales, CRM, Negotiation, Counseling"
                    value={form.requiredSkills}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Education Requirement</label>
                  <input
                    type="text"
                    name="educationRequirement"
                    placeholder="e.g. Any Bachelor's Degree"
                    value={form.educationRequirement}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                <Link href="/organization/jobs" className="text-sm font-semibold text-gray-500 hover:text-gray-800">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white shadow-md shadow-orange-200 hover:shadow-lg transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
                >
                  {submitting ? (
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
          </div>
        )}
      </div>
    </div>
  );
}
