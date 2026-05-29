/**
 * Date utility functions for dynamic plan dates
 * Handles IST timezone and date calculations
 */

/**
 * Get current date and time in IST
 */
export function getCurrentISTDateTime() {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

/**
 * Format date as "18th May 2026"
 */
export function formatDateOrdinal(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  const suffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  return `${day}${suffix(day)} ${month} ${year}`;
}

/**
 * Format time as "Morning 9:00 AM – 12:00 PM IST"
 * Returns current time in IST
 */
export function formatCurrentTimeIST(): string {
  const now = getCurrentISTDateTime();
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();
  
  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    const min = m.toString().padStart(2, '0');
    return `${hour12}:${min} ${period}`;
  };
  
  const timeOfDay = hours < 12 ? 'Morning' : hours < 17 ? 'Afternoon' : 'Evening';
  const currentTime = formatTime(hours, minutes);
  
  return `${timeOfDay} ${currentTime} IST`;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Calculate end date based on plan duration
 * @param startDate - The start date
 * @param duration - Duration string like "30 Days", "45 Days", or "3 Months"
 * @param totalDays - Total days for the plan
 */
export function calculateEndDate(startDate: Date, duration: string, totalDays: number): Date {
  // Parse duration to determine if it's in months or days
  const monthsMatch = duration.match(/(\d+)\s*Month/i);
  
  if (monthsMatch) {
    const months = parseInt(monthsMatch[1], 10);
    return addMonths(startDate, months);
  } else {
    // Use totalDays as fallback
    return addDays(startDate, totalDays);
  }
}

/**
 * Get dynamic plan dates based on current date/time
 */
export function getDynamicPlanDates(duration: string, totalDays: number) {
  const startDate = getCurrentISTDateTime();
  const endDate = calculateEndDate(startDate, duration, totalDays);
  const validTill = endDate; // Valid till is same as end date
  
  return {
    startDate: formatDateOrdinal(startDate),
    endDate: formatDateOrdinal(endDate),
    validTill: formatDateOrdinal(validTill),
    classTime: formatCurrentTimeIST(),
    // Raw dates for database storage
    rawStartDate: startDate,
    rawEndDate: endDate,
    rawValidTill: validTill,
  };
}

/**
 * Parse duration string to extract months and days
 */
export function parseDuration(duration: string, totalDays: number) {
  const monthsMatch = duration.match(/(\d+)\s*Month/i);
  const daysMatch = duration.match(/(\d+)\s*Day/i);
  
  return {
    durationMonths: monthsMatch ? parseInt(monthsMatch[1], 10) : 0,
    durationDays: daysMatch ? parseInt(daysMatch[1], 10) : totalDays,
  };
}
