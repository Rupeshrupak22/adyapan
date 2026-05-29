# Dynamic Dates Flow Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React/Next.js)                    │
├─────────────────────────────────────────────────────────────────┤
│  1. User opens pricing modal or checkout page                   │
│  2. Component imports getPlan() from planData.ts                 │
│  3. planData.ts calls getDynamicPlanDates()                     │
│  4. Dates calculated in real-time based on current IST time     │
│  5. UI displays dynamic dates to user                           │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATE CALCULATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  src/lib/dateUtils.ts                                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ getCurrentISTDateTime()                                    │ │
│  │   ↓                                                        │ │
│  │ formatDateOrdinal()                                        │ │
│  │   ↓                                                        │ │
│  │ calculateEndDate()                                         │ │
│  │   ↓                                                        │ │
│  │ getDynamicPlanDates()                                      │ │
│  │   ↓                                                        │ │
│  │ Returns: { startDate, endDate, validTill, classTime }     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PAYMENT FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│  User clicks "Buy Now" → Razorpay Payment → Payment Success     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND API (Payment Verify)                    │
├─────────────────────────────────────────────────────────────────┤
│  src/app/api/payment/verify/route.ts                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 1. Verify Razorpay signature                              │ │
│  │ 2. Get plan details: getPlan(courseSlug)                  │ │
│  │ 3. Calculate dates: getDynamicPlanDates()                 │ │
│  │ 4. Parse duration: parseDuration()                        │ │
│  │ 5. Get current time: formatCurrentTimeIST()               │ │
│  │ 6. Save to database with all date fields                  │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE SERVICE LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  src/lib/db-service.ts                                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ savePayment({                                             │ │
│  │   paymentDate, paymentTime,                               │ │
│  │   courseStartDate, courseEndDate,                         │ │
│  │   validTill, durationDays, durationMonths                 │ │
│  │ })                                                        │ │
│  │   ↓                                                        │ │
│  │ createEnrollmentWithProgress({                            │ │
│  │   paymentDate, paymentTime,                               │ │
│  │   courseStartDate, courseEndDate,                         │ │
│  │   validTill, durationDays, durationMonths                 │ │
│  │ })                                                        │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB ATLAS                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐    ┌──────────────────────────────┐  │
│  │  Payment Collection  │    │  Enrollment Collection       │  │
│  ├──────────────────────┤    ├──────────────────────────────┤  │
│  │ paymentDate          │    │ paymentDate                  │  │
│  │ paymentTime          │    │ paymentTime                  │  │
│  │ courseStartDate      │    │ courseStartDate              │  │
│  │ courseEndDate        │    │ courseEndDate                │  │
│  │ validTill            │    │ validTill                    │  │
│  │ durationDays         │    │ durationDays                 │  │
│  │ durationMonths       │    │ durationMonths               │  │
│  │ selectedPlan         │    │ selectedPlan                 │  │
│  └──────────────────────┘    └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Date Calculation Flow

```
Current Date/Time (System)
         │
         ▼
┌─────────────────────┐
│ Get IST Time        │
│ (UTC + 5:30 hours)  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Format Start Date   │
│ "18th May 2026"     │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Calculate End Date  │
│ Based on Duration   │
└─────────────────────┘
         │
         ├─── 60 Days Plan ──→ Start + 60 days
         │
         ├─── 2 Months Plan ─→ Start + 2 months
         │
         ├─── 3 Months Plan ─→ Start + 3 months
         │
         └─── 4 Months Plan ─→ Start + 4 months
         │
         ▼
┌─────────────────────┐
│ Format End Date     │
│ "18th Jul 2026"     │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Set Valid Till      │
│ (Same as End Date)  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Format Time         │
│ "Morning 9:30 AM"   │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Return All Dates    │
└─────────────────────┘
```

## 📅 Example Timeline

```
User Action: Clicks "Buy Now" on 18th May 2026 at 9:30 AM IST

┌──────────────────────────────────────────────────────────────┐
│                    PLAN: Standard (2 Months)                  │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  START                                                   END  │
│  18th May 2026                              18th July 2026   │
│  9:30 AM IST                                                 │
│  │                                                        │   │
│  ├────────────────────────────────────────────────────────┤  │
│  │                    60 Days / 2 Months                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  Valid Till: 18th July 2026                                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘

Database Stores:
├─ paymentDate: 2026-05-18T04:00:00.000Z
├─ paymentTime: "Morning 9:30 AM IST"
├─ courseStartDate: 2026-05-18T04:00:00.000Z
├─ courseEndDate: 2026-07-18T04:00:00.000Z
├─ validTill: 2026-07-18T04:00:00.000Z
├─ durationDays: 60
├─ durationMonths: 2
└─ selectedPlan: "plan-2"
```

## 🎯 Component Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    PricingModal.tsx                          │
├─────────────────────────────────────────────────────────────┤
│  import { ALL_PLANS } from '@/lib/planData'                 │
│                                                              │
│  ALL_PLANS.map(plan => (                                    │
│    <div>                                                     │
│      <p>{plan.startDate} – {plan.endDate}</p>              │
│      <p>{plan.classTime}</p>                                │
│      <p>Valid till {plan.validTill}</p>                     │
│      <p>Duration: {plan.duration}</p>                       │
│    </div>                                                    │
│  ))                                                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    checkout/page.tsx                         │
├─────────────────────────────────────────────────────────────┤
│  import { getPlan } from '@/lib/planData'                   │
│                                                              │
│  const plan = getPlan(planKey)                              │
│                                                              │
│  <div>                                                       │
│    <p>{plan.startDate} – {plan.endDate}</p>                │
│    <p>{plan.classTime}</p>                                  │
│    <p>Valid till {plan.validTill}</p>                       │
│  </div>                                                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    planData.ts                               │
├─────────────────────────────────────────────────────────────┤
│  import { getDynamicPlanDates } from './dateUtils'          │
│                                                              │
│  function createPlan(...) {                                  │
│    const dates = getDynamicPlanDates(duration, totalDays)   │
│    return {                                                  │
│      startDate: dates.startDate,                            │
│      endDate: dates.endDate,                                │
│      classTime: dates.classTime,                            │
│      validTill: dates.validTill                             │
│    }                                                         │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    dateUtils.ts                              │
├─────────────────────────────────────────────────────────────┤
│  export function getDynamicPlanDates(duration, totalDays) { │
│    const startDate = getCurrentISTDateTime()                │
│    const endDate = calculateEndDate(...)                    │
│    return {                                                  │
│      startDate: formatDateOrdinal(startDate),              │
│      endDate: formatDateOrdinal(endDate),                  │
│      classTime: formatCurrentTimeIST(),                     │
│      validTill: formatDateOrdinal(endDate)                 │
│    }                                                         │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Data Flow Security

```
Frontend (Untrusted)
         │
         │ User sees dynamic dates
         │ (for display only)
         │
         ▼
Backend API (Trusted)
         │
         │ Recalculates dates
         │ (never trust frontend)
         │
         ▼
Database (Persistent)
         │
         │ Stores calculated dates
         │ (source of truth)
         │
         ▼
Reports & Analytics
```

## 📊 Time of Day Logic

```
IST Hour Range  →  Time of Day Label
─────────────────────────────────────
00:00 - 11:59   →  Morning
12:00 - 16:59   →  Afternoon
17:00 - 23:59   →  Evening
```

## 🌍 Timezone Handling

```
System Time (Local)
         │
         ▼
Convert to UTC
         │
         ▼
Add IST Offset (+5:30)
         │
         ▼
IST Time
         │
         ▼
Format for Display
         │
         ▼
Store in Database (UTC)
```

---

**Visual Guide Version**: 1.0.0  
**Last Updated**: 18th May 2026
