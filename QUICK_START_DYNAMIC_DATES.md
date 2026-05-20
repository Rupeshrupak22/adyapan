# Quick Start - Dynamic Dates

## 🚀 What Changed?

All hardcoded dates in pricing/payment cards are now **DYNAMIC** and calculated in real-time based on:
- Current date/time when user clicks "Buy Now"
- Plan duration (60 days, 2 months, 3 months, 4 months)
- IST timezone (UTC+5:30)

## 📋 Quick Reference

### Before (Hardcoded):
```typescript
startDate: '10th May 2026',
endDate: '10th Jul 2026',
classTime: 'Morning 9:00 AM – 12:00 PM IST',
validTill: '15th Jul 2026',
```

### After (Dynamic):
```typescript
// Calculated automatically based on current date/time
startDate: '18th May 2026',  // Today's date
endDate: '18th Jul 2026',    // Today + 2 months
classTime: 'Morning 9:30 AM IST',  // Current time
validTill: '18th Jul 2026',  // Same as end date
```

## 🎯 How to Use

### Frontend (Display Dates):
```typescript
import { getPlan } from '@/lib/planData';

const plan = getPlan('plan-2');
console.log(plan.startDate);  // "18th May 2026"
console.log(plan.endDate);    // "18th Jul 2026"
console.log(plan.classTime);  // "Morning 9:30 AM IST"
```

### Backend (Calculate Dates):
```typescript
import { getDynamicPlanDates, parseDuration } from '@/lib/dateUtils';

const dates = getDynamicPlanDates('2 Months', 60);
const { durationMonths, durationDays } = parseDuration('2 Months', 60);

// Use dates.rawStartDate, dates.rawEndDate for database
```

## 📊 Plan Durations

| Plan ID | Name | Duration | Days |
|---------|------|----------|------|
| plan-1 | Starter | 2 Months | 60 |
| plan-2 | Standard | 2 Months | 60 |
| plan-3 | Professional | 3 Months | 90 |
| plan-4-premium | Career Pro | 4 Months | 120 |

## 🗄️ Database Fields

### Payment Collection:
```javascript
{
  paymentDate: Date,      // When payment was made
  paymentTime: String,    // "Morning 9:30 AM IST"
  courseStartDate: Date,  // Course start
  courseEndDate: Date,    // Course end
  validTill: Date,        // Validity end
  durationDays: Number,   // 60, 90, 120
  durationMonths: Number, // 2, 3, 4
  selectedPlan: String    // "plan-2"
}
```

### Enrollment Collection:
Same fields as Payment collection.

## 🧪 Testing

### Test Date Calculations:
```bash
node test-dynamic-dates.js
```

### Test in Browser:
1. Start dev server: `npm run dev`
2. Open pricing modal
3. Check dates update on refresh
4. Complete test payment
5. Check MongoDB for saved dates

## 🔧 Utility Functions

### Get Current IST Time:
```typescript
import { getCurrentISTDateTime } from '@/lib/dateUtils';
const now = getCurrentISTDateTime();
```

### Format Date with Ordinal:
```typescript
import { formatDateOrdinal } from '@/lib/dateUtils';
const formatted = formatDateOrdinal(new Date());
// "18th May 2026"
```

### Calculate End Date:
```typescript
import { calculateEndDate } from '@/lib/dateUtils';
const endDate = calculateEndDate(startDate, '2 Months', 60);
```

### Get All Plan Dates:
```typescript
import { getDynamicPlanDates } from '@/lib/dateUtils';
const dates = getDynamicPlanDates('2 Months', 60);
// Returns: { startDate, endDate, validTill, classTime, rawStartDate, rawEndDate, rawValidTill }
```

## 📝 Common Tasks

### Change Plan Duration:
Edit `src/lib/planData.ts`:
```typescript
createPlan(
  'plan-2',
  'Standard Plan',
  'Adyapan Standard',
  3500,
  4795,
  27,
  '3 Months',  // Change this
  90,          // Change this
  // ... rest of params
)
```

### Add New Plan:
```typescript
'plan-5': createPlan(
  'plan-5',
  'New Plan',
  'Adyapan New',
  5000,
  6850,
  27,
  '6 Months',
  180,
  '🎓',
  'New plan tagline',
  ['Benefit 1', 'Benefit 2']
)
```

### Query Payments by Date:
```javascript
// MongoDB query
db.payments.find({
  courseStartDate: {
    $gte: ISODate("2026-05-01"),
    $lte: ISODate("2026-05-31")
  }
})
```

## ⚡ Quick Checks

### ✅ Verify Implementation:
- [ ] Dates change when page is refreshed
- [ ] Different plans show different end dates
- [ ] Time shows current IST time
- [ ] Payment saves all date fields to MongoDB
- [ ] Enrollment saves all date fields to MongoDB

### ✅ No TypeScript Errors:
```bash
npm run build
```

### ✅ Test Script Passes:
```bash
node test-dynamic-dates.js
```

## 🐛 Troubleshooting

### Dates Not Updating?
- Clear browser cache
- Check if `planData.ts` imports `dateUtils`
- Verify `getDynamicPlanDates()` is called

### Wrong Timezone?
- Check IST offset in `dateUtils.ts` (should be 5.5 hours)
- Verify `getCurrentISTDateTime()` function

### Database Fields Missing?
- Check if `payment/verify/route.ts` imports date utils
- Verify `savePayment()` includes date fields
- Check MongoDB schema allows new fields

## 📚 Documentation

- **Detailed Docs**: `DYNAMIC_DATES_IMPLEMENTATION.md`
- **Summary**: `IMPLEMENTATION_SUMMARY.md`
- **This Guide**: `QUICK_START_DYNAMIC_DATES.md`

## 🎉 Done!

Your pricing/payment cards now show **live, dynamic dates** that update automatically based on the current date and time in IST!

---

**Need Help?** Check the detailed documentation or test script for examples.
