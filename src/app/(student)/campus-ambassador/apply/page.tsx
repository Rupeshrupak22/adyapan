'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, User, Mail, Phone, GraduationCap, MapPin, BookOpen, ChevronDown } from 'lucide-react';

const COUNTRY_CODES = [
  { flag: 'ðŸ‡®ðŸ‡³', code: '+91', name: 'India' },
  { flag: 'ðŸ‡ºðŸ‡¸', code: '+1',  name: 'USA' },
  { flag: 'ðŸ‡¬ðŸ‡§', code: '+44', name: 'UK' },
  { flag: 'ðŸ‡¦ðŸ‡º', code: '+61', name: 'Australia' },
  { flag: 'ðŸ‡¦ðŸ‡ª', code: '+971', name: 'UAE' },
  { flag: 'ðŸ‡¸ðŸ‡¬', code: '+65', name: 'Singapore' },
  { flag: 'ðŸ‡²ðŸ‡¾', code: '+60', name: 'Malaysia' },
  { flag: 'ðŸ‡§ðŸ‡©', code: '+880', name: 'Bangladesh' },
  { flag: 'ðŸ‡µðŸ‡°', code: '+92', name: 'Pakistan' },
  { flag: 'ðŸ‡±ðŸ‡°', code: '+94', name: 'Sri Lanka' },
  { flag: 'ðŸ‡³ðŸ‡µ', code: '+977', name: 'Nepal' },
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG'];

function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  renderOption,
  renderSelected,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  renderOption?: (v: string) => React.ReactNode;
  renderSelected?: (v: string) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm transition-all duration-200 bg-white
          ${open ? 'border-orange-400 ring-2 ring-orange-100' : 'border-gray-200 hover:border-orange-300'}`}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value ? (renderSelected ? renderSelected(value) : value) : placeholder}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto"
          >
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors
                  ${value === opt
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {renderOption ? renderOption(opt) : opt}
                {value === opt && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-orange-500" />
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function CountryCodePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRY_CODES.find(c => c.code === value) ?? COUNTRY_CODES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-3 border-r border-gray-200 bg-gray-50 hover:bg-orange-50 transition-colors text-sm font-medium text-gray-700 rounded-l-xl min-w-[90px]
          ${open ? 'bg-orange-50' : ''}`}
      >
        <span className="text-base">{selected.flag}</span>
        <span>{selected.code}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 left-0 w-52 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
          >
            {COUNTRY_CODES.map((c) => (
              <li
                key={c.code}
                onClick={() => { onChange(c.code); setOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors
                  ${value === c.code
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <span className="text-base">{c.flag}</span>
                <span className="font-medium">{c.code}</span>
                <span className="text-gray-400 text-xs">{c.name}</span>
                {value === c.code && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-orange-500" />
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CampusAmbassadorApplyPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    college: '',
    city: '',
    branch: '',
    year: '',
    linkedin: '',
    why: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setForm({ ...form, phone: digits });
      return;
    }
    if (['name', 'city', 'branch', 'college'].includes(name)) {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setForm({ ...form, [name]: lettersOnly });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all duration-200 hover:border-orange-300";

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Application Submitted!</h2>
          <p className="text-gray-500 mb-6">
            Thanks for applying to become a Campus Ambassador. Our team will review your application and get back to you within 2"3 business days.
          </p>
          <a
            href="/campus-ambassador"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#ffa800] to-[#ff8c00] text-white rounded-full font-bold hover:from-[#e69500] hover:to-[#e67e00] transition-all"
          >
            Back to Campus Ambassador
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-orange-300 bg-orange-50 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold text-orange-700 uppercase tracking-widest">Campus Ambassador Program</span>
          </span>
          <h1 className="text-4xl font-black text-gray-900 mb-3">
            Apply <span className="text-orange-500">Directly</span>
          </h1>
          <p className="text-gray-500 text-lg">Fill in your details and we'll get back to you within 2"3 business days.</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" name="name" required value={form.name} onChange={handleChange}
                placeholder="Enter your full name" className={inputClass} />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" name="email" required value={form.email} onChange={handleChange}
                  placeholder="Enter your email" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
              <div className={`flex border border-gray-200 rounded-xl overflow-visible transition-all duration-200
                focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 hover:border-orange-300`}>
                <CountryCodePicker
                  value={form.countryCode}
                  onChange={(v) => setForm({ ...form, countryCode: v })}
                />
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    maxLength={10}
                    pattern="\d{10}"
                    title="Please enter a valid 10-digit phone number"
                    inputMode="numeric"
                    className="w-full pl-10 pr-4 py-3 text-sm focus:outline-none bg-white rounded-r-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* College */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">College / University *</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" name="college" required value={form.college} onChange={handleChange}
                placeholder="Your college name" className={inputClass} />
            </div>
          </div>

          {/* City, Branch, Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" name="city" required value={form.city} onChange={handleChange}
                  placeholder="City" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Branch *</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" name="branch" required value={form.branch} onChange={handleChange}
                  placeholder="e.g. CSE, MBA" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Year *</label>
              <CustomDropdown
                options={YEARS}
                value={form.year}
                onChange={(v) => setForm({ ...form, year: v })}
                placeholder="Select year"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn Profile</label>
            <input type="url" name="linkedin" value={form.linkedin} onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all duration-200 hover:border-orange-300" />
          </div>

          {/* Why */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Why do you want to be a Campus Ambassador? *</label>
            <textarea name="why" required value={form.why} onChange={handleChange} rows={4}
              placeholder="Tell us a bit about yourself and your motivation..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm resize-none transition-all duration-200 hover:border-orange-300" />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-[#ffa800] to-[#ff8c00] text-white rounded-xl font-bold text-lg hover:from-[#e69500] hover:to-[#e67e00] transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>Submit Application <ChevronRight className="w-5 h-5" /></>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
