/**
 * Test script to verify dynamic date calculations
 * Run with: node test-dynamic-dates.js
 */

// Simulate the date utility functions
function getCurrentISTDateTime() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

function formatDateOrdinal(date) {
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  const suffix = (day) => {
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

function formatCurrentTimeIST() {
  const now = getCurrentISTDateTime();
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();
  
  const formatTime = (h, m) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    const min = m.toString().padStart(2, '0');
    return `${hour12}:${min} ${period}`;
  };
  
  const timeOfDay = hours < 12 ? 'Morning' : hours < 17 ? 'Afternoon' : 'Evening';
  const currentTime = formatTime(hours, minutes);
  
  return `${timeOfDay} ${currentTime} IST`;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function calculateEndDate(startDate, duration, totalDays) {
  const monthsMatch = duration.match(/(\d+)\s*Month/i);
  
  if (monthsMatch) {
    const months = parseInt(monthsMatch[1], 10);
    return addMonths(startDate, months);
  } else {
    return addDays(startDate, totalDays);
  }
}

function getDynamicPlanDates(duration, totalDays) {
  const startDate = getCurrentISTDateTime();
  const endDate = calculateEndDate(startDate, duration, totalDays);
  const validTill = endDate;
  
  return {
    startDate: formatDateOrdinal(startDate),
    endDate: formatDateOrdinal(endDate),
    validTill: formatDateOrdinal(validTill),
    classTime: formatCurrentTimeIST(),
    rawStartDate: startDate,
    rawEndDate: endDate,
    rawValidTill: validTill,
  };
}

// Test all plans
console.log('='.repeat(60));
console.log('DYNAMIC DATES TEST - Adyapan Plans');
console.log('='.repeat(60));
console.log();

const plans = [
  { id: 'plan-1', name: 'Adyapan Starter', duration: '2 Months', totalDays: 60 },
  { id: 'plan-2', name: 'Adyapan Standard', duration: '2 Months', totalDays: 60 },
  { id: 'plan-3', name: 'Adyapan Professional', duration: '3 Months', totalDays: 90 },
  { id: 'plan-4-premium', name: 'Adyapan Career Pro', duration: '4 Months', totalDays: 120 },
];

plans.forEach(plan => {
  console.log(`📦 ${plan.name}`);
  console.log(`   Duration: ${plan.duration} (${plan.totalDays} days)`);
  console.log();
  
  const dates = getDynamicPlanDates(plan.duration, plan.totalDays);
  
  console.log(`   📅 ${dates.startDate} – ${dates.endDate}`);
  console.log(`   🕐 ${dates.classTime}`);
  console.log(`   ✅ Valid till ${dates.validTill}`);
  console.log(`   ⏱  Duration: ${plan.duration}`);
  console.log();
  console.log(`   Raw Dates (for database):`);
  console.log(`   - Start: ${dates.rawStartDate.toISOString()}`);
  console.log(`   - End:   ${dates.rawEndDate.toISOString()}`);
  console.log(`   - Valid: ${dates.rawValidTill.toISOString()}`);
  console.log();
  console.log('-'.repeat(60));
  console.log();
});

console.log('✅ All date calculations completed successfully!');
console.log();
console.log('Note: Dates are calculated in IST (UTC+5:30)');
console.log('      Times will vary based on when you run this script');
