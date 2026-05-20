# Deployment Checklist - Dynamic Dates Feature

## ✅ Pre-Deployment Checks

### 1. Code Quality
- [x] No TypeScript errors
- [x] All files properly formatted
- [x] Imports are correct
- [x] No console errors in browser

### 2. Testing
- [ ] Run test script: `node test-dynamic-dates.js`
- [ ] Test in development: `npm run dev`
- [ ] Test pricing modal displays dynamic dates
- [ ] Test checkout page displays dynamic dates
- [ ] Test dates update on page refresh
- [ ] Test different plans show different durations
- [ ] Test time shows current IST time

### 3. Payment Flow Testing
- [ ] Complete a test payment
- [ ] Verify payment record in MongoDB has all date fields
- [ ] Verify enrollment record in MongoDB has all date fields
- [ ] Check date values are correct
- [ ] Verify IST timezone is correct

### 4. Database Verification
```javascript
// Check Payment collection
db.payments.findOne({}, { 
  paymentDate: 1, 
  paymentTime: 1, 
  courseStartDate: 1, 
  courseEndDate: 1,
  validTill: 1,
  durationDays: 1,
  durationMonths: 1,
  selectedPlan: 1
})

// Check Enrollment collection
db.enrollments.findOne({}, { 
  paymentDate: 1, 
  paymentTime: 1, 
  courseStartDate: 1, 
  courseEndDate: 1,
  validTill: 1,
  durationDays: 1,
  durationMonths: 1,
  selectedPlan: 1
})
```

### 5. Build Process
- [ ] Run build: `npm run build`
- [ ] No build errors
- [ ] No build warnings (or acceptable warnings only)
- [ ] Build completes successfully

## 🚀 Deployment Steps

### Step 1: Backup
```bash
# Backup current code
git add .
git commit -m "Backup before dynamic dates deployment"
git push origin backup-branch

# Backup database (if needed)
# Use MongoDB Atlas backup or mongodump
```

### Step 2: Deploy Code
```bash
# Build production version
npm run build

# Deploy to your hosting platform
# (Vercel, Netlify, AWS, etc.)
```

### Step 3: Verify Deployment
- [ ] Visit production URL
- [ ] Check pricing modal
- [ ] Check checkout page
- [ ] Verify dates are dynamic
- [ ] Test complete payment flow

### Step 4: Monitor
- [ ] Check server logs for errors
- [ ] Monitor MongoDB for new payment records
- [ ] Verify date fields are being saved
- [ ] Check user feedback

## 🔍 Post-Deployment Verification

### Frontend Checks
```
✓ Pricing modal shows dynamic dates
✓ Checkout page shows dynamic dates
✓ Dates format correctly (18th May 2026)
✓ Time shows current IST time
✓ Different plans show different end dates
✓ Dates update on page refresh
```

### Backend Checks
```
✓ Payment API calculates dates correctly
✓ Dates saved to Payment collection
✓ Dates saved to Enrollment collection
✓ All 8 date fields are populated
✓ IST timezone is correct
✓ Duration calculations are accurate
```

### Database Checks
```
✓ paymentDate field exists and has value
✓ paymentTime field exists and has value
✓ courseStartDate field exists and has value
✓ courseEndDate field exists and has value
✓ validTill field exists and has value
✓ durationDays field exists and has value
✓ durationMonths field exists and has value
✓ selectedPlan field exists and has value
```

## 🐛 Troubleshooting

### Issue: Dates Not Showing
**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check if planData.ts imports dateUtils
4. Verify build includes new files

### Issue: Wrong Dates
**Solution:**
1. Check IST offset in dateUtils.ts (should be 5.5)
2. Verify getCurrentISTDateTime() function
3. Check calculateEndDate() logic
4. Test with test-dynamic-dates.js

### Issue: Database Fields Missing
**Solution:**
1. Check payment/verify/route.ts imports
2. Verify savePayment() includes date fields
3. Check MongoDB schema allows new fields
4. Verify db-service.ts is updated

### Issue: Build Errors
**Solution:**
1. Run `npm install` to ensure dependencies
2. Check TypeScript errors: `npm run build`
3. Verify all imports are correct
4. Check for syntax errors

## 📊 Monitoring Queries

### Check Recent Payments with Dates
```javascript
db.payments.find({
  createdAt: { $gte: new Date('2026-05-18') }
}).sort({ createdAt: -1 }).limit(10)
```

### Count Payments with Dynamic Dates
```javascript
db.payments.countDocuments({
  paymentDate: { $exists: true },
  courseStartDate: { $exists: true }
})
```

### Find Payments Missing Date Fields
```javascript
db.payments.find({
  $or: [
    { paymentDate: { $exists: false } },
    { courseStartDate: { $exists: false } }
  ]
})
```

## 📈 Success Metrics

### Day 1
- [ ] No errors in production logs
- [ ] At least 1 successful payment with date fields
- [ ] All new payments have date fields populated
- [ ] No user complaints about dates

### Week 1
- [ ] 100% of new payments have date fields
- [ ] Date calculations are accurate
- [ ] No timezone issues reported
- [ ] Users see correct dates in their timezone

### Month 1
- [ ] All payments have dynamic dates
- [ ] Analytics show correct date distributions
- [ ] No date-related bugs reported
- [ ] Feature is stable and working as expected

## 🔄 Rollback Plan

If issues occur:

### Quick Rollback
```bash
# Revert to previous deployment
git revert HEAD
git push origin main

# Or restore from backup
git checkout backup-branch
git push origin main --force
```

### Database Rollback
```javascript
// Remove date fields if needed (not recommended)
db.payments.updateMany({}, {
  $unset: {
    paymentDate: "",
    paymentTime: "",
    courseStartDate: "",
    courseEndDate: "",
    validTill: "",
    durationDays: "",
    durationMonths: "",
    selectedPlan: ""
  }
})
```

## 📝 Documentation

### Files to Review
- [x] DYNAMIC_DATES_IMPLEMENTATION.md
- [x] IMPLEMENTATION_SUMMARY.md
- [x] QUICK_START_DYNAMIC_DATES.md
- [x] DYNAMIC_DATES_FLOW.md
- [x] DEPLOYMENT_CHECKLIST.md (this file)

### Code Files Changed
- [x] src/lib/dateUtils.ts (NEW)
- [x] src/lib/planData.ts (MODIFIED)
- [x] src/models/Payment.ts (MODIFIED)
- [x] src/models/Enrollment.ts (MODIFIED)
- [x] src/lib/db-service.ts (MODIFIED)
- [x] src/app/api/payment/verify/route.ts (MODIFIED)

## 🎉 Launch Checklist

### Before Launch
- [ ] All tests pass
- [ ] Code reviewed
- [ ] Documentation complete
- [ ] Backup created
- [ ] Team notified

### During Launch
- [ ] Deploy to production
- [ ] Monitor logs
- [ ] Test live site
- [ ] Verify payments work
- [ ] Check database

### After Launch
- [ ] Monitor for 24 hours
- [ ] Check error rates
- [ ] Verify user feedback
- [ ] Update documentation if needed
- [ ] Celebrate success! 🎊

## 📞 Support Contacts

### Technical Issues
- Check logs in hosting platform
- Review MongoDB Atlas logs
- Check browser console errors

### Database Issues
- MongoDB Atlas support
- Check connection strings
- Verify schema changes

### Code Issues
- Review GitHub commits
- Check TypeScript errors
- Run diagnostics

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Status**: ⏳ Pending / ✅ Complete / ❌ Failed  
**Notes**: _____________

---

## ✨ Final Notes

This feature makes your pricing system dynamic and accurate. Users will always see the correct start and end dates based on when they make their payment. All date information is saved to the database for reporting and analytics.

**Good luck with your deployment!** 🚀
