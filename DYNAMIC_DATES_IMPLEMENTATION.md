# Dynamic Dates & Times Implementation

## Overview
This document describes the implementation of dynamic dates and times for the pricing/payment plan cards. All hardcoded dates have been replaced with live, calculated values based on the current date/time in IST.

## Changes Made

### 1. Date Utility Functions (`src/lib/dateUtils.ts`)
Created a new utility file with functions to:
- Get current date/time in IST timezone
- Format dates as "18th May 2026" with ordinal suffixes
- Format current time as "Morning 9:00 AM IST"
- Calculate end dates based on plan duration (days or months)
- Parse duration strings to extract months and days

**Key Functions:**
- `getCurrentISTDateTime()` - Returns current date/time in IST (UTC+5:30)
- `formatDateOrdinal(date)` - Formats date with ordinal suffix (18th, 19th, etc.)
- `formatCurrentTimeIST()` - Returns current time with time of day (Morning/Afternoon/Evening)
- `calculateEndDate(startDate, duration, totalDays)` - Calculates end date based on plan duration
- `getDynamicPlanDates(duration, totalDays)` - Returns all dynamic dates for a plan
- `parseDuration(duration, totalDays)` - Extracts months and days from duration string

### 2. Plan Data Updates (`src/lib/planData.ts`)
- Removed all hardcoded dates ("10th May 2026", "10th July 2026", etc.)
- Created `createPlan()` helper function that generates dynamic dates for each plan
- All plans now calculate dates dynamically when accessed
- Dates are calculated based on:
  - **Start Date**: Current date/time when user selects plan
  - **End Date**: Start date + plan duration (60 days, 2 months, 3 months, 4 months)
  - **Valid Till**: Same as end date
  - **Class Time**: Current time in IST with time of day

**Plan Durations:**
- Plan 1 (Starter): 2 Months / 60 Days
- Plan 2 (Standard): 2 Months / 60 Days
- Plan 3 (Professional): 3 Months / 90 Days
- Plan 4 (Career Pro): 4 Months / 120 Days

### 3. Database Schema Updates

#### Payment Model (`src/models/Payment.ts`)
Added new fields to store dynamic plan information:
```typescript
paymentDate?: Date;       // Date when payment was made
paymentTime?: string;     // Time when payment was made (IST)
courseStartDate?: Date;   // Course start date
courseEndDate?: Date;     // Course end date
validTill?: Date;         // Valid till date
durationDays?: number;    // Duration in days
durationMonths?: number;  // Duration in months
selectedPlan?: string;    // Selected plan ID
```

#### Enrollment Model (`src/models/Enrollment.ts`)
Added the same fields to track enrollment dates:
```typescript
paymentDate?: Date;
paymentTime?: string;
courseStartDate?: Date;
courseEndDate?: Date;
validTill?: Date;
durationDays?: number;
durationMonths?: number;
selectedPlan?: string;
```

### 4. Database Service Updates (`src/lib/db-service.ts`)
Updated interfaces and functions to handle new fields:
- `SavePaymentInput` interface - Added dynamic date fields
- `CreateEnrollmentInput` interface - Added dynamic date fields
- `savePayment()` function - Saves dynamic dates to Payment collection
- `createEnrollmentWithProgress()` function - Saves dynamic dates to Enrollment collection

### 5. Payment Verification API (`src/app/api/payment/verify/route.ts`)
Updated to calculate and save dynamic dates:
- Imports `getPlan`, `getDynamicPlanDates`, `parseDuration`, `formatCurrentTimeIST`
- Calculates dynamic dates when payment is verified
- Saves dates to both Payment and Enrollment records
- Handles both successful and failed payments

**Calculation Flow:**
1. Get plan details using `getPlan(courseSlug)`
2. Calculate dynamic dates using `getDynamicPlanDates(plan.duration, plan.totalDays)`
3. Parse duration to get months/days using `parseDuration(plan.duration, plan.totalDays)`
4. Get current time in IST using `formatCurrentTimeIST()`
5. Save all calculated values to database

## Date Calculation Examples

### Example 1: 60 Days Plan (2 Months)
- **User clicks Buy Now on**: 18th May 2026 at 9:30 AM IST
- **Start Date**: 18th May 2026
- **Start Time**: Morning 9:30 AM IST
- **End Date**: 17th July 2026 (18th May + 60 days)
- **Valid Till**: 17th July 2026
- **Duration**: 60 Days / 2 Months

### Example 2: 3 Months Plan (90 Days)
- **User clicks Buy Now on**: 18th May 2026 at 2:45 PM IST
- **Start Date**: 18th May 2026
- **Start Time**: Afternoon 2:45 PM IST
- **End Date**: 18th August 2026 (18th May + 3 months)
- **Valid Till**: 18th August 2026
- **Duration**: 90 Days / 3 Months

## UI Display Format

The pricing card displays:
```
📅 18th May 2026 – 17th July 2026
🕐 Morning 9:30 AM IST
✅ Valid till 17th July 2026  [60 Days]
⏱ Duration: 2 Months
```

## Database Storage

### Payment Collection
```javascript
{
  paymentId: "pay_XXXXX",
  orderId: "order_XXXXX",
  courseSlug: "plan-2",
  courseName: "Adyapan Standard",
  totalAmount: 4130,
  // Dynamic fields
  paymentDate: ISODate("2026-05-18T04:00:00.000Z"),
  paymentTime: "Morning 9:30 AM IST",
  courseStartDate: ISODate("2026-05-18T04:00:00.000Z"),
  courseEndDate: ISODate("2026-07-17T04:00:00.000Z"),
  validTill: ISODate("2026-07-17T04:00:00.000Z"),
  durationDays: 60,
  durationMonths: 2,
  selectedPlan: "plan-2"
}
```

### Enrollment Collection
```javascript
{
  userId: "user123",
  courseSlug: "plan-2",
  courseName: "Adyapan Standard",
  paymentId: "pay_XXXXX",
  // Dynamic fields
  paymentDate: ISODate("2026-05-18T04:00:00.000Z"),
  paymentTime: "Morning 9:30 AM IST",
  courseStartDate: ISODate("2026-05-18T04:00:00.000Z"),
  courseEndDate: ISODate("2026-07-17T04:00:00.000Z"),
  validTill: ISODate("2026-07-17T04:00:00.000Z"),
  durationDays: 60,
  durationMonths: 2,
  selectedPlan: "plan-2"
}
```

## Benefits

1. **No Hardcoded Dates**: All dates are calculated dynamically
2. **Accurate Duration**: End dates are calculated based on actual plan duration
3. **IST Timezone**: All times are in Indian Standard Time
4. **Database Tracking**: All date/time information is saved for reporting
5. **Consistent Display**: Same format across all components
6. **Easy Maintenance**: Change duration in one place, dates update everywhere

## Testing Checklist

- [ ] Verify dates update when page is refreshed
- [ ] Check that different plans show different end dates
- [ ] Confirm time shows current IST time
- [ ] Verify dates are saved correctly in MongoDB
- [ ] Test with different times of day (morning/afternoon/evening)
- [ ] Confirm 60-day plans calculate correctly
- [ ] Confirm 2-month, 3-month, 4-month plans calculate correctly
- [ ] Check that payment records include all dynamic fields
- [ ] Check that enrollment records include all dynamic fields

## Future Enhancements

1. Add timezone selection for international users
2. Add countdown timer showing days until course starts
3. Add expiry notifications based on validTill date
4. Generate reports using stored date/time data
5. Add date range filters in admin panel

## Files Modified

1. `src/lib/dateUtils.ts` - NEW FILE
2. `src/lib/planData.ts` - Updated to use dynamic dates
3. `src/models/Payment.ts` - Added dynamic date fields
4. `src/models/Enrollment.ts` - Added dynamic date fields
5. `src/lib/db-service.ts` - Updated to handle dynamic dates
6. `src/app/api/payment/verify/route.ts` - Calculate and save dynamic dates

## Notes

- All dates are stored as JavaScript Date objects in MongoDB
- Times are stored as formatted strings (e.g., "Morning 9:30 AM IST")
- IST offset is UTC+5:30 (5.5 hours ahead of UTC)
- Month calculations use JavaScript's built-in Date.setMonth()
- Day calculations use simple date arithmetic
- No external date libraries required (no moment.js, date-fns, etc.)
