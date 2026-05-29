# Admin Login Testing Guide

## 🧪 Quick Testing Checklist

### 1. **Access the Admin Login Page**
```
URL: http://localhost:3000/admin/login
```

### 2. **Verify No Warning Message**
- ✅ The page should NOT show: "Please use the admin login page at /admin/login"
- ✅ Only the login form should be visible

### 3. **Test Student/Admin Toggle**

#### **Admin Mode (Default)**
- ✅ "Admin" button should be highlighted with orange gradient
- ✅ Shield icon should be visible
- ✅ Access Key field should be visible
- ✅ Heading: "Admin Login"
- ✅ Subheading: "Adyapan Admin Portal — Authorized access only"

#### **Student Mode**
- ✅ Click "Student" button
- ✅ "Student" button should be highlighted with white background
- ✅ GraduationCap icon should be visible
- ✅ Access Key field should disappear (smooth animation)
- ✅ Heading: "Student Login"
- ✅ Subheading: "Sign in to access your courses"
- ✅ Button color changes to blue gradient

### 4. **Test Form Validation**

#### **Email Validation**
1. Leave email empty and click outside → Should show "Email is required"
2. Enter invalid email (e.g., "test") → Should show "Please enter a valid email address"
3. Enter valid email → Error should disappear

#### **Password Validation**
1. Leave password empty and click outside → Should show "Password is required"
2. Enter short password (< 6 chars) → Should show "Password must be at least 6 characters"
3. Enter valid password → Error should disappear

#### **Access Key Validation (Admin Mode Only)**
1. Try to submit without access key → Should show "Access key is required for admin login"

### 5. **Test Password Visibility Toggle**

#### **Password Field**
- ✅ Click eye icon → Password should become visible
- ✅ Click eye-off icon → Password should be hidden
- ✅ No layout shift should occur

#### **Access Key Field (Admin Mode)**
- ✅ Click eye icon → Access key should become visible
- ✅ Click eye-off icon → Access key should be hidden
- ✅ No layout shift should occur

### 6. **Test Admin Login Flow**

#### **Valid Credentials**
```
Email: admin@adyapan.com (or your ADMIN_EMAIL)
Password: your_admin_password
Access Key: your_admin_access_key
```

**Expected Behavior:**
1. Click "Sign In to Admin"
2. Button shows loading spinner with "Signing in..."
3. Success message appears: "Login successful! Redirecting to admin dashboard..."
4. Redirects to `/admin` after 900ms

#### **Invalid Email**
```
Email: wrong@example.com
Password: any_password
Access Key: any_key
```

**Expected Behavior:**
- Error message: "You are not authorized to access the admin panel."

#### **Invalid Password**
```
Email: admin@adyapan.com
Password: wrong_password
Access Key: correct_access_key
```

**Expected Behavior:**
- Error message: "Invalid credentials. X attempt(s) remaining."
- After 5 failed attempts: "Too many failed attempts. Account locked for 30 minutes."

#### **Invalid Access Key**
```
Email: admin@adyapan.com
Password: correct_password
Access Key: wrong_key
```

**Expected Behavior:**
- Error message: "Invalid access key."

### 7. **Test Rate Limiting**

1. Make 6 login attempts quickly (within 15 minutes)
2. **Expected Behavior:**
   - After 5th attempt: Error message
   - 6th attempt: "Too many login attempts. Please try again in 15 minutes."

### 8. **Test Student Mode Redirect**

1. Switch to "Student" mode
2. Enter any email and password
3. Click "Sign In as Student"
4. **Expected Behavior:**
   - Should redirect to `/login` (student login page)

### 9. **Test Responsive Design**

#### **Mobile (< 640px)**
- ✅ Open DevTools → Toggle device toolbar
- ✅ Select iPhone or similar device
- ✅ Verify:
  - Card is full-width with proper padding
  - Text is readable
  - Buttons are touch-friendly (min 44px height)
  - Toggle buttons work correctly
  - No horizontal scroll

#### **Tablet (640px - 1024px)**
- ✅ Select iPad or similar device
- ✅ Verify:
  - Card is centered with max-width
  - Spacing is optimized
  - Touch targets are adequate

#### **Desktop (> 1024px)**
- ✅ Full screen view
- ✅ Verify:
  - Card is centered with max-width (28rem)
  - Hover effects work on buttons
  - Animations are smooth

### 10. **Test Loading States**

#### **Initial Check**
- ✅ Refresh page
- ✅ Should see loading spinner with "Checking authentication..."
- ✅ Should disappear after authentication check

#### **Form Submission**
- ✅ Submit form
- ✅ Button should show loading spinner
- ✅ Button text changes to "Signing in..."
- ✅ Button is disabled during loading

### 11. **Test Keyboard Navigation**

1. Press Tab → Should focus email field
2. Press Tab → Should focus password field
3. Press Tab → Should focus access key field (admin mode)
4. Press Tab → Should focus eye toggle buttons
5. Press Tab → Should focus submit button
6. Press Enter → Should submit form

### 12. **Test Already Logged In**

1. Login successfully as admin
2. Navigate to `/admin/login` again
3. **Expected Behavior:**
   - Should automatically redirect to `/admin` dashboard
   - Should not show login form

### 13. **Browser Console Check**

1. Open DevTools → Console tab
2. Perform all actions above
3. **Expected Behavior:**
   - ✅ No errors
   - ✅ No warnings
   - ✅ No hydration errors

### 14. **Network Tab Check**

1. Open DevTools → Network tab
2. Submit login form
3. **Expected Behavior:**
   - ✅ POST request to `/api/admin/login`
   - ✅ Response status: 200 (success) or 401/403 (error)
   - ✅ Cookie set: `authToken` (httpOnly)

## 🔧 Environment Setup

Before testing, ensure these environment variables are set:

```env
# .env.local
ADMIN_EMAIL=admin@adyapan.com
ADMIN_ACCESS_KEY=your_secure_access_key_here
JWT_SECRET=your_jwt_secret_at_least_32_characters_long
MONGODB_URI=your_mongodb_connection_string
```

## 🚀 Running the Tests

### Development Server
```bash
npm run dev
# or
yarn dev
```

### Access the Page
```
http://localhost:3000/admin/login
```

## 📊 Expected Results Summary

| Test | Expected Result | Status |
|------|----------------|--------|
| No warning message on admin login page | ✅ Pass | |
| Student/Admin toggle works | ✅ Pass | |
| Email validation works | ✅ Pass | |
| Password validation works | ✅ Pass | |
| Password visibility toggle works | ✅ Pass | |
| Access key visibility toggle works | ✅ Pass | |
| Admin login with valid credentials | ✅ Pass | |
| Admin login with invalid credentials | ✅ Pass | |
| Rate limiting works | ✅ Pass | |
| Account lockout works | ✅ Pass | |
| Student mode redirects correctly | ✅ Pass | |
| Responsive on mobile | ✅ Pass | |
| Responsive on tablet | ✅ Pass | |
| Responsive on desktop | ✅ Pass | |
| Loading states work | ✅ Pass | |
| Keyboard navigation works | ✅ Pass | |
| Already logged in redirect works | ✅ Pass | |
| No console errors | ✅ Pass | |
| No hydration errors | ✅ Pass | |

## 🐛 Common Issues & Solutions

### Issue 1: Warning message still appears
**Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue 2: Access key field not appearing
**Solution:** Ensure you're in "Admin" mode (orange gradient button)

### Issue 3: Login fails with "Invalid access key"
**Solution:** Check `.env.local` file for correct `ADMIN_ACCESS_KEY`

### Issue 4: Rate limiting not working
**Solution:** Wait 15 minutes or restart the development server

### Issue 5: Redirect not working after login
**Solution:** Check browser console for errors, ensure JWT_SECRET is set

### Issue 6: Hydration errors
**Solution:** Clear `.next` folder and restart dev server
```bash
rm -rf .next
npm run dev
```

## 📝 Testing Notes

- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on real mobile devices if possible
- Test with slow network (DevTools → Network → Slow 3G)
- Test with JavaScript disabled (should show basic form)
- Test with cookies disabled (should show error)

## ✅ Sign-Off Checklist

Before marking as complete:

- [ ] All tests pass
- [ ] No console errors
- [ ] No hydration errors
- [ ] Responsive on all devices
- [ ] Warning message removed from admin login page
- [ ] Student/Admin toggle works correctly
- [ ] Form validation works
- [ ] Password visibility toggles work
- [ ] Loading states work
- [ ] Error messages are clear
- [ ] Success messages are clear
- [ ] Rate limiting works
- [ ] Account lockout works
- [ ] Security features work
- [ ] Documentation is complete

## 🎉 Success Criteria

The admin login page is considered fully functional when:

1. ✅ No warning message appears on `/admin/login`
2. ✅ Student/Admin toggle works seamlessly
3. ✅ All form validations work correctly
4. ✅ Password visibility toggles work without layout shift
5. ✅ Admin login succeeds with valid credentials
6. ✅ Error messages are clear and helpful
7. ✅ Loading states are smooth and professional
8. ✅ Responsive on all devices
9. ✅ No console errors or warnings
10. ✅ Security features (rate limiting, lockout) work correctly
