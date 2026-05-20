/**
 * Dynamic Coupon System Utilities
 * Handles coupon generation, validation, and expiry logic
 */

import { getCurrentISTDateTime, formatDateOrdinal, addDays } from './dateUtils';

export interface CouponData {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  label: string;
  createdAt: Date;
  expiryDate: Date;
  isExpired: boolean;
  daysRemaining: number;
  formattedExpiry: string;
}

/**
 * Generate coupon with 10-day validity from current date
 */
export function generateCouponValidity(couponCode: string = 'ADYAPAN5'): CouponData {
  const now = getCurrentISTDateTime();
  const expiryDate = addDays(now, 10);
  
  // Calculate days remaining
  const diffTime = expiryDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Check if expired
  const isExpired = now > expiryDate;
  
  // Get coupon details based on code
  const couponDetails = getCouponDetails(couponCode);
  
  return {
    code: couponCode,
    type: couponDetails.type,
    value: couponDetails.value,
    label: couponDetails.label,
    createdAt: now,
    expiryDate,
    isExpired,
    daysRemaining: isExpired ? 0 : daysRemaining,
    formattedExpiry: formatDateOrdinal(expiryDate),
  };
}

/**
 * Validate if coupon is still valid
 */
export function isCouponValid(expiryDate: Date): boolean {
  const now = getCurrentISTDateTime();
  return now <= expiryDate;
}

/**
 * Get coupon details by code
 */
function getCouponDetails(code: string): { type: 'percent' | 'flat'; value: number; label: string } {
  const coupons: Record<string, { type: 'percent' | 'flat'; value: number; label: string }> = {
    'ADYAPAN5':  { type: 'percent', value: 5,    label: 'Extra 5% Off' },
    'STUDENT10': { type: 'flat',    value: 1000,  label: 'Rs. 1,000 Off' },
    'CAREER20':  { type: 'percent', value: 20,    label: '20% Off Premium' },
  };
  
  return coupons[code] || { type: 'percent', value: 0, label: 'Invalid Coupon' };
}

/**
 * Calculate discount amount based on coupon type
 */
export function calculateDiscount(basePrice: number, coupon: CouponData): number {
  if (coupon.isExpired) return 0;
  
  if (coupon.type === 'percent') {
    return Math.round(basePrice * coupon.value / 100);
  } else {
    return coupon.value;
  }
}

/**
 * Get or create coupon session
 * Stores coupon validity in sessionStorage
 */
export function getCouponSession(couponCode: string = 'ADYAPAN5'): CouponData {
  if (typeof window === 'undefined') {
    // Server-side: generate new coupon
    return generateCouponValidity(couponCode);
  }
  
  const sessionKey = `coupon_${couponCode}`;
  const stored = sessionStorage.getItem(sessionKey);
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const couponData: CouponData = {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        expiryDate: new Date(parsed.expiryDate),
      };
      
      // Check if still valid
      if (isCouponValid(couponData.expiryDate)) {
        // Recalculate days remaining
        const now = getCurrentISTDateTime();
        const diffTime = couponData.expiryDate.getTime() - now.getTime();
        couponData.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        couponData.isExpired = false;
        return couponData;
      }
      
      // Expired - mark as expired
      couponData.isExpired = true;
      couponData.daysRemaining = 0;
      return couponData;
    } catch (e) {
      // Invalid stored data, generate new
    }
  }
  
  // Generate new coupon and store
  const newCoupon = generateCouponValidity(couponCode);
  sessionStorage.setItem(sessionKey, JSON.stringify(newCoupon));
  return newCoupon;
}

/**
 * Format coupon expiry message
 */
export function getCouponExpiryMessage(coupon: CouponData): string {
  if (coupon.isExpired) {
    return 'Coupon expired';
  }
  
  if (coupon.daysRemaining === 1) {
    return 'Expires tomorrow';
  }
  
  if (coupon.daysRemaining <= 3) {
    return `Expires in ${coupon.daysRemaining} days`;
  }
  
  return `Expires on: ${coupon.formattedExpiry}`;
}

/**
 * Get all available coupons with their validity
 */
export function getAllCoupons(): CouponData[] {
  const couponCodes = ['ADYAPAN5', 'STUDENT10', 'CAREER20'];
  return couponCodes.map(code => getCouponSession(code));
}
