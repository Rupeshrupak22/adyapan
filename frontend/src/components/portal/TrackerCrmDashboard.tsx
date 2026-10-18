'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LineChart as LineChartIcon, Users, MousePointerClick, Eye,
  Globe, Smartphone, BookOpen, Loader2, AlertCircle, Inbox,
  TrendingUp, MessageSquare, CreditCard, Calendar,
} from 'lucide-react';

// â"€â"€ Types â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
interface KeyedCount { key: string; count: number; }
interface Metrics {
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  ctaClicks: number;
  enquirySubmits: number;
  checkoutStarts: number;
  topPages: KeyedCount[];
  topCourses: KeyedCount[];
  sources: KeyedCount[];
  campaigns: KeyedCount[];
  devices: KeyedCount[];
  dailyTrend: { date: string; count: number }[];
}

const CRM_STATUSES = ['New', 'Contacted', 'Counselling', 'Enrolled', 'Lost'] as const;
type CrmStatus = (typeof CRM_STATUSES)[number];

interface FollowUp { note: string; by: string; at: string; }
interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  courseInterest: string;
  campaign: string;
  status: CrmStatus;
  followUps: FollowUp[];
  source: string;
  createdAt: string;
}

const STATUS_COLORS: Record<CrmStatus, string> = {
  New:         'bg-blue-100 text-blue-700',
  Contacted:   'bg-amber-100 text-amber-700',
  Counselling: 'bg-purple-100 text-purple-700',
  Enrolled:    'bg-green-100 text-green-700',
  Lost:        'bg-gray-200 text-gray-600',
};

function daysAgoISO(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// â"€â"€ Small UI atoms â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function StatCard({ icon: Icon, label, value, tint }: { icon: any; label: string; value: number | string; tint: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${tint}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function ListCard({ title, icon: Icon, rows, empty }: { title: string; icon: any; rows: KeyedCount[]; empty: string }) {
  const max = rows.reduce((m, r) => Math.max(m, r.count), 0) || 1;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-[#ffa800]" />
        <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">{empty}</p>
      ) : (
        <ul className="space-y-2.5">
          {rows.map((r) => (
            <li key={r.key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="truncate text-gray-700 pr-3">{r.key}</span>
                <span className="font-semibold text-gray-900 flex-shrink-0">{r.count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(r.count / max) * 100}%`, background: 'linear-gradient(90deg,#ffa800,#ff6b00)' }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// â"€â"€ Analytics tab â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function AnalyticsTab({ from, to }: { from: string; to: string }) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/tracker/analytics?from=${from}&to=${to}`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load analytics');
      setMetrics(data.metrics);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading analytics...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-600">
        <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
      </div>
    );
  }
  if (!metrics) return null;

  const noData = metrics.pageViews === 0 && metrics.uniqueVisitors === 0;
  if (noData) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg, rgba(255,168,0,0.12), rgba(255,107,0,0.06))' }}>
          <LineChartIcon className="w-8 h-8 text-[#ffa800]" />
        </div>
        <p className="text-gray-700 font-semibold text-lg">No analytics data in this range</p>
        <p className="text-gray-400 text-sm mt-1">
          Events appear here once visitors browse the live site with the first-party tracker enabled.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={Eye}                label="Page Views"      value={metrics.pageViews}      tint="bg-orange-100 text-orange-600" />
        <StatCard icon={Users}              label="Unique Visitors" value={metrics.uniqueVisitors} tint="bg-blue-100 text-blue-600" />
        <StatCard icon={TrendingUp}         label="Sessions"        value={metrics.sessions}       tint="bg-teal-100 text-teal-600" />
        <StatCard icon={MousePointerClick}  label="CTA Clicks"      value={metrics.ctaClicks}      tint="bg-purple-100 text-purple-600" />
        <StatCard icon={MessageSquare}      label="Enquiries"       value={metrics.enquirySubmits} tint="bg-amber-100 text-amber-600" />
        <StatCard icon={CreditCard}         label="Checkout Starts" value={metrics.checkoutStarts} tint="bg-green-100 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ListCard title="Most-Viewed Pages"   icon={Eye}      rows={metrics.topPages}   empty="No page views yet" />
        <ListCard title="Most-Viewed Courses" icon={BookOpen} rows={metrics.topCourses} empty="No course views yet" />
        <ListCard title="Traffic Sources"     icon={Globe}    rows={metrics.sources}    empty="No referrer data yet" />
        <ListCard title="Campaigns (UTM)"     icon={TrendingUp} rows={metrics.campaigns} empty="No campaign data yet" />
        <ListCard title="Devices"             icon={Smartphone} rows={metrics.devices}  empty="No device data yet" />
        <ListCard title="Daily Page Views"    icon={Calendar}
          rows={metrics.dailyTrend.map((d) => ({ key: d.date, count: d.count }))} empty="No trend data yet" />
      </div>
    </div>
  );
}

// â"€â"€ Leads tab â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState('');
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      const res = await fetch(`/api/admin/tracker/leads?${params}`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load leads');
      setLeads(data.leads || []);
      setStatusCounts(data.statusCounts || {});
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  const patch = async (id: string, payload: { status?: CrmStatus; note?: string }) => {
    setSavingId(id);
    try {
      const res = await fetch('/api/admin/tracker/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setLeads((prev) => prev.map((l) => (l._id === id ? data.lead : l)));
      if (payload.note) setNoteDrafts((d) => ({ ...d, [id]: '' }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="space-y-5">
      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusFilter === '' ? 'bg-[#ffa800] text-white border-[#ffa800]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
        >
          All
        </button>
        {CRM_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusFilter === s ? 'bg-[#ffa800] text-white border-[#ffa800]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
          >
            {s}{statusCounts[s] != null ? ` (${statusCounts[s]})` : ''}
          </button>
        ))}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, email, phone, course..."
        className="w-full sm:max-w-md rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa800] focus:ring-2 focus:ring-[#ffa800]/10"
      />

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading leads...
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, rgba(255,168,0,0.12), rgba(255,107,0,0.06))' }}>
            <Inbox className="w-8 h-8 text-[#ffa800]" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">No leads yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Leads appear here when visitors submit the contact / enquiry form.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #ffa800, #ff6b00)' }}>
                    {lead.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-900">{lead.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status]}`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 break-all">{lead.email || '—'} {lead.phone ? `· ${lead.phone}` : ''}</p>
                    {lead.courseInterest && <p className="text-xs text-gray-500 mt-0.5">Interest: {lead.courseInterest}</p>}
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(lead.createdAt).toLocaleString('en-IN')} · {lead.source}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:w-72 flex-shrink-0">
                  <select
                    value={lead.status}
                    disabled={savingId === lead._id}
                    onChange={(e) => patch(lead._id, { status: e.target.value as CrmStatus })}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#ffa800] bg-white disabled:opacity-50"
                  >
                    {CRM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <input
                      value={noteDrafts[lead._id] || ''}
                      onChange={(e) => setNoteDrafts((d) => ({ ...d, [lead._id]: e.target.value }))}
                      placeholder="Add follow-up note..."
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#ffa800]"
                    />
                    <button
                      disabled={savingId === lead._id || !(noteDrafts[lead._id] || '').trim()}
                      onClick={() => patch(lead._id, { note: (noteDrafts[lead._id] || '').trim() })}
                      className="px-3 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #ffa800, #ff6b00)' }}
                    >
                      {savingId === lead._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                    </button>
                  </div>
                </div>
              </div>

              {lead.followUps?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                  {lead.followUps.slice().reverse().map((f, i) => (
                    <div key={i} className="text-xs text-gray-600">
                      <span className="text-gray-400">{new Date(f.at).toLocaleDateString('en-IN')} · {f.by}:</span> {f.note}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// â"€â"€ Main dashboard â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export default function TrackerCrmDashboard() {
  const [tab, setTab] = useState<'analytics' | 'leads'>('analytics');
  const [from, setFrom] = useState(daysAgoISO(30));
  const [to, setTo] = useState(daysAgoISO(0));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tracker &amp; CRM</h1>
          <p className="text-gray-500 text-sm mt-0.5">First-party website analytics and lead management.</p>
        </div>
        {tab === 'analytics' && (
          <div className="flex items-center gap-2">
            <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#ffa800]" />
            <span className="text-gray-400 text-sm">to</span>
            <input type="date" value={to} min={from} max={daysAgoISO(0)} onChange={(e) => setTo(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#ffa800]" />
          </div>
        )}
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {(['analytics', 'leads'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${tab === t ? 'border-[#ffa800] text-[#ffa800]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t === 'analytics' ? 'Analytics' : 'Leads'}
          </button>
        ))}
      </div>

      {tab === 'analytics' ? <AnalyticsTab from={from} to={to} /> : <LeadsTab />}
    </div>
  );
}
