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
    3000,
    4110,
    27,
    '30 Days',
    30,
    '',
    'Industry training starter program',
    [
      'Month 1 - Industry Training',
      'Course Completion Certificate',
      'Project Certificate',
    ]
  ),
  'plan-2': createPlan(
    'plan-2',
    'Standard Plan',
    'Adyapan Standard',
    3500,
    4795,
    27,
    '45 Days',
    45,
    '',
    'Industry training with live project',
    [
      '45 Days - Industry Training',
      'Live Project Allotment',
      'Course Completion Certificate',
      'Internship Completion Certificate',
      'Best Performance Certificate',
    ]
  ),
  'plan-3': createPlan(
    'plan-3',
    'Professional Plan',
    'Adyapan Professional',
    5000,
    6850,
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
    ],
    'Most Popular'
  ),
  'plan-4-premium': createPlan(
    'plan-4-premium',
    'Career Pro Plan',
    'Adyapan Career Pro',
    15000,
    20550,
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
      'Stipend up to Rs. 15,000',
      'Experience Certificate',
      'Resume Referrals',
      'Company References',
      'Guaranteed Job Support Until Placement',
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
