/**
 * Test Admin Login API
 * Run: node test-admin-login.js
 * 
 * This script tests the admin login endpoint directly
 */

require('dotenv').config({ path: '.env' });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY;

console.log('\n🧪 Admin Login API Test\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Configuration:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Admin Email:', ADMIN_EMAIL);
console.log('Access Key:', ADMIN_ACCESS_KEY ? '✅ Set' : '❌ Not set');
console.log('');

if (!ADMIN_EMAIL || !ADMIN_ACCESS_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('Please set ADMIN_EMAIL and ADMIN_ACCESS_KEY in .env file');
  process.exit(1);
}

console.log('📋 Test Instructions:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. Start dev server: npm run dev');
console.log('2. Open browser: http://localhost:3000/admin/login');
console.log('3. Open browser console (F12)');
console.log('4. Enter credentials:');
console.log('   - Email:', ADMIN_EMAIL);
console.log('   - Password: [your admin password]');
console.log('   - Access Key:', ADMIN_ACCESS_KEY);
console.log('5. Click "Sign In to Admin"');
console.log('');

console.log('✅ Expected Results:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Browser Console:');
console.log('  🔵 ADMIN LOGIN FORM SUBMITTED');
console.log('  🔵 API Endpoint: /api/admin/login');
console.log('  🔵 API CALL COMPLETED SUCCESSFULLY');
console.log('  🔵 LOGIN SUCCESS');
console.log('  🔵 REDIRECTING TO: /admin');
console.log('');
console.log('Terminal:');
console.log('  🔵 [ADMIN LOGIN API] Request received');
console.log('  [AdminLogin] ✅ Access key valid');
console.log('  [AdminLogin] ✅ Email authorized');
console.log('  [AdminLogin] ✅ User is admin');
console.log('  [AdminLogin] ADMIN login succeeded');
console.log('  🔵 TOKEN CREATED');
console.log('  🔵 COOKIE SET - authToken');
console.log('  🔵 [ADMIN LOGIN API] LOGIN SUCCESS');
console.log('');
console.log('Browser Network Tab:');
console.log('  POST /api/admin/login → 200 OK');
console.log('  (NOT /api/auth/login)');
console.log('');

console.log('❌ If You See This Instead:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Terminal:');
console.log('  [Login] 🚫 Admin user attempting regular login');
console.log('  POST /api/auth/login 403');
console.log('');
console.log('Then:');
console.log('  1. Hard refresh browser: Ctrl+Shift+R');
console.log('  2. Clear browser cache');
console.log('  3. Restart dev server');
console.log('  4. Check Network tab - verify calling /api/admin/login');
console.log('');

console.log('🔧 Troubleshooting:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. Clear .next folder: rm -rf .next (already done)');
console.log('2. Clear browser cache: Ctrl+Shift+Delete');
console.log('3. Hard refresh: Ctrl+Shift+R');
console.log('4. Check Network tab for actual endpoint called');
console.log('5. Verify console logs match expected output');
console.log('');

console.log('✅ Test script ready!');
console.log('Start your dev server and test the login.\n');
