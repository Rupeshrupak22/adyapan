# Admin Login Troubleshooting Guide

## 🔴 Problem: Admin Login Nahi Ho Raha

Agar admin login nahi ho raha hai, to ye steps follow karo:

---

## Step 1: Check Admin User Exists

Pehle check karo ki admin user database mein hai ya nahi:

```bash
node check-admin-user.js
```

### Possible Results:

#### ❌ If "ADMIN USER NOT FOUND":
Admin user create karna padega. Step 2 dekho.

#### ✅ If "ADMIN USER FOUND":
User details check karo:
- **Role** should be: `ADMIN` or `SUPERADMIN`
- **Account Status** should be: `active`
- **Is Active** should be: `true`
- **Has Password** should be: `true`

Agar koi bhi field wrong hai, to Step 2 run karo to update karne ke liye.

---

## Step 2: Create/Update Admin User

Admin user create ya update karne ke liye:

```bash
node create-admin-user.js
```

Ye script:
1. Admin email check karega (`.env` se)
2. Password puchchega (minimum 6 characters)
3. Name puchchega (optional, default: "Admin")
4. User create/update karega
5. Login credentials show karega

### Example:
```
Enter admin password (min 6 characters): Admin@123
Enter admin name (default: Admin): Rupesh

✅ Admin user created successfully!

📋 Admin User Details:
- Email: rupeshrupak609@gmail.com
- Password: Admin@123
- Access Key: ADYAPAN-ADMIN-2024
```

---

## Step 3: Verify Environment Variables

Check karo `.env` file mein ye variables set hain:

```env
ADMIN_EMAIL="rupeshrupak609@gmail.com"
ADMIN_ACCESS_KEY="ADYAPAN-ADMIN-2024"
JWT_SECRET="super-secret-key-with-at-least-32-characters-123"
MONGODB_URI="mongodb://..."
```

### Important:
- `ADMIN_EMAIL` should match the email you're using to login
- `ADMIN_ACCESS_KEY` should match the access key you're entering
- `JWT_SECRET` should be at least 32 characters

---

## Step 4: Restart Development Server

Environment variables change karne ke baad server restart karo:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## Step 5: Try Login Again

Ab login try karo:

1. Go to: `http://localhost:3000/admin/login`
2. Make sure "Admin" mode is selected (orange button)
3. Enter:
   - **Email**: `rupeshrupak609@gmail.com` (ya jo `.env` mein hai)
   - **Password**: Jo aapne Step 2 mein set kiya
   - **Access Key**: `ADYAPAN-ADMIN-2024` (ya jo `.env` mein hai)
4. Click "Sign In to Admin"

---

## Common Errors & Solutions

### Error: "Invalid access key"
**Solution:** 
- Check `.env` file mein `ADMIN_ACCESS_KEY` correct hai
- Login page mein same access key enter karo
- Server restart karo

### Error: "You are not authorized to access the admin panel"
**Solution:**
- Check `.env` file mein `ADMIN_EMAIL` correct hai
- Login page mein same email enter karo
- Email case-sensitive nahi hai (lowercase/uppercase doesn't matter)

### Error: "Invalid credentials"
**Possible Reasons:**
1. Password wrong hai
2. User database mein nahi hai
3. User ka role ADMIN/SUPERADMIN nahi hai

**Solution:**
- Run `node check-admin-user.js` to verify user exists
- Run `node create-admin-user.js` to reset password

### Error: "Account locked. Try again in X minutes"
**Solution:**
- 5 baar wrong password dalne se account lock ho jata hai
- Wait karo 30 minutes
- Ya database mein manually unlock karo:
  ```javascript
  db.authusers.updateOne(
    { email: "rupeshrupak609@gmail.com" },
    { $set: { failedLoginAttempts: 0, lockedUntil: null } }
  )
  ```

### Error: "Too many login attempts. Please try again in 15 minutes"
**Solution:**
- Rate limiting active hai (5 attempts per 15 minutes)
- Wait karo 15 minutes
- Ya server restart karo (development mein)

### Error: "Admin login is not configured"
**Solution:**
- `.env` file mein `ADMIN_EMAIL` aur `ADMIN_ACCESS_KEY` set karo
- Server restart karo

---

## Debug Mode

Agar abhi bhi problem hai, to console logs check karo:

### Browser Console:
1. Open DevTools (F12)
2. Go to Console tab
3. Try login
4. Check for errors

### Server Console:
Server terminal mein ye logs dikhenge:

```
[AdminLogin] 🔍 Login attempt: { email: 'rupeshrupak609@gmail.com', hasPassword: true, hasAccessKey: true }
[AdminLogin] 🔑 Checking access key...
[AdminLogin] ✅ Access key valid
[AdminLogin] 📧 Checking email whitelist...
[AdminLogin] Provided email: rupeshrupak609@gmail.com
[AdminLogin] Allowed email: rupeshrupak609@gmail.com
[AdminLogin] ✅ Email authorized
[AdminLogin] 🔍 Finding user in database...
[AdminLogin] User found: true | Role: ADMIN
[AdminLogin] ✅ User is admin
[AdminLogin] ADMIN login succeeded | User: 507f1f77bcf86cd799439011 | IP: ::1
```

Agar koi step fail ho raha hai, to wahan problem hai.

---

## Quick Fix Commands

### 1. Check if admin user exists:
```bash
node check-admin-user.js
```

### 2. Create/update admin user:
```bash
node create-admin-user.js
```

### 3. Restart server:
```bash
npm run dev
```

### 4. Clear rate limiting (restart server):
```bash
# Ctrl+C to stop
npm run dev
```

---

## Test Login Credentials

After creating admin user, test with these:

```
URL: http://localhost:3000/admin/login

Email: rupeshrupak609@gmail.com
Password: [jo aapne set kiya]
Access Key: ADYAPAN-ADMIN-2024
```

---

## Still Not Working?

Agar abhi bhi nahi ho raha, to:

1. **Check MongoDB Connection:**
   ```bash
   # Test MongoDB connection
   node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(e => console.log('❌ Error:', e.message))"
   ```

2. **Check Database Name:**
   - MongoDB Compass open karo
   - Database name check karo (should be "adyapan")
   - Collection name check karo (should be "authusers")

3. **Manually Check User in MongoDB:**
   ```javascript
   // In MongoDB Compass or Shell
   db.authusers.findOne({ email: "rupeshrupak609@gmail.com" })
   ```

4. **Check Server Logs:**
   - Server terminal mein detailed logs dikhenge
   - Kahan fail ho raha hai wo dekho

---

## Success Checklist

Login successful hone ke liye ye sab hona chahiye:

- [x] `.env` file mein `ADMIN_EMAIL` set hai
- [x] `.env` file mein `ADMIN_ACCESS_KEY` set hai
- [x] `.env` file mein `JWT_SECRET` set hai (32+ chars)
- [x] `.env` file mein `MONGODB_URI` correct hai
- [x] Admin user database mein exist karta hai
- [x] User ka role `ADMIN` ya `SUPERADMIN` hai
- [x] User ka `accountStatus` = `active` hai
- [x] User ka `isActive` = `true` hai
- [x] User ka password set hai (bcrypt hashed)
- [x] Server running hai (`npm run dev`)
- [x] MongoDB connected hai
- [x] Browser console mein koi error nahi hai
- [x] Server console mein koi error nahi hai

---

## Contact

Agar koi problem hai to:
1. Server logs screenshot bhejo
2. Browser console screenshot bhejo
3. `.env` file check karo (password mat bhejo!)
4. `node check-admin-user.js` ka output bhejo

---

**Last Updated:** [Current Date]
**Status:** Ready to Debug
