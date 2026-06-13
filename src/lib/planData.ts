/**
 * Centralized plan data - single source of truth for all plan details.
 * Used by: checkout page, pricing modal, payment API, order summary.
 */

import { getDynamicPlanDates } from './dateUtils';

export interface PlanDetail {
  id: string;
  label: string;           // "Career Pro Plan"
  name: string;            // "Adyapan Career Pro"
  price: number;           // GST-inclusive price in INR
  originalPrice: number;   // crossed-out price
  discount: number;        // % discount shown
  duration: string;        // "4 Months"
  totalDays: number;       // 120
  startDate: string;       // "18th May 2026" - DYNAMIC
  endDate: string;         // "17th July 2026" - DYNAMIC
  classTime: string;       // "Morning 9:00 AM IST" - DYNAMIC
  validTill: string;       // "17th July 2026" - DYNAMIC
  emoji: string;           // plan icon
  tagline: string;         // short marketing line
  benefits: string[];      // feature list
  badge?: string;          // optional badge text e.g. "Most Popular"
  isPremium?: boolean;
}

// Helper function to create plan with dynamic dates
function createPlan(
  id: string,
  label: string,
  name: string,
  price: number,
  originalPrice: number,
  discount: number,
  duration: string,
  totalDays: number,
  emoji: string,
  tagline: string,
  benefits: string[],
  badge?: string,
  isPremium?: boolean
): PlanDetail {
  const dates = getDynamicPlanDates(duration, totalDays);
  
  return {
    id,
    label,
    name,
    price,
    originalPrice,
    discount,
    duration,
    totalDays,
    startDate: dates.startDate,
    endDate: dates.endDate,
    classTime: dates.classTime,
    validTill: dates.validTill,
    emoji,
    tagline,
    benefits,
    badge,
    isPremium,
  };
}

export const PLAN_DATA: Record<string, PlanDetail> = {
  'plan-1': createPlan(
    'plan-1',
    'Starter Plan',
    'Adyapan Starter',
    5000,
    6850,
    27,
    '30 Days',
    30,
    '',
    'Industry training starter program',
    [
      'Month 1 - Industry Training',
      'Course Completion Certificate',
      'Project Certificate',
      'Access to Recorded Sessions',
      '\u2B50 University Approved Certification',
      '\u2B50 Industry Expert Sessions',
    ]
  ),
  'plan-2': createPlan(
    'plan-2',
    'Standard Plan',
    'Adyapan Standard',
    6000,
    8220,
    27,
    '45 Days',
    45,
    '',
    'Industry training with live project',
    [
      '45 Days - Industry Training',
      'Course Completion Certificate',
      'Internship Completion Certificate',
      'Best Performance Certificate',
      'Resume Template Provided',
      '\u2B50 Live Project Allotment',
      '\u2B50 University Approved Certification',
      '\u2B50 Dedicated Mentor Support',
    ]
  ),
  'plan-3': createPlan(
    'plan-3',
    'Professional Plan',
    'Adyapan Professional',
    8000,
    10960,
    27,
    '3 Months',
    90,
    '',
    'Projects, resume building, and mock interviews',
    [
      'Month 1 - Industry Training',
      'Month 2 - Minor & Major Projects',
      'Month 3 - Resume Building + Mock Interviews',
      'Project Completion Certificate',
      'Internship Completion Certificate',
      'Course Completion Certificate',
      'Best Performance Certificate',
      '\u2B50 LOR (Letter of Recommendation)',
      '\u2B50 University Approved Certification',
      '\u2B50 Priority Placement Support',
      '\u2B50 LinkedIn Profile Optimization',
    ],
    'Most Popular'
  ),
  'plan-4-premium': createPlan(
    'plan-4-premium',
    'Career Pro Plan',
    'Adyapan Career Pro',
    25000,
    34250,
    27,
    '4 Months',
    120,
    '',
    'Premium career support until placement',
    [
      'Months 1-3 - Training + Minor & Major Industry Projects',
      'Month 4 (Offline) - Resume Building',
      'Mock Interviews',
      'Interview Training',
      'Experience Certificate',
      'University Approved Certification',
      '\u2B50 Stipend up to Rs. 15,000',
      '\u2B50 Resume Referrals',
      '\u2B50 Company References',
      '\u2B50 LOR (Letter of Recommendation)',
      '\u2B50 Direct Recruiter Connections',
      '\u2B50 Guaranteed Job Support Until Placement',
    ],
    'Best Value',
    true
  ),
};

/** Fallback plan if an unknown key is passed */
export const DEFAULT_PLAN_ID = 'plan-4-premium';

/** Get plan by ID with fallback */
export function getPlan(id: string): PlanDetail {
  return PLAN_DATA[id] ?? PLAN_DATA[DEFAULT_PLAN_ID];
}

/** All plans as an array (for listing UIs) */
export const ALL_PLANS: PlanDetail[] = Object.values(PLAN_DATA);
