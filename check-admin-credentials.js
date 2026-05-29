/**
 * Check admin credentials and login history from MongoDB Atlas
 * Run: node check-admin-credentials.js
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_ACCESS_KEY_HASH = process.env.ADMIN_ACCESS_KEY_HASH || process.env.ADMIN_ACCESS_KEY;

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
  passwordHash: String,
  accountStatus: String,
  isActive: Boolean,
  isEmailVerified: Boolean,
  phone: String,
  loginCount: Number,
  failedLoginAttempts: Number,
  lastLoginAt: Date,
  lastLoginIP: String,
  lockedUntil: Date,
  signupAt: Date,
  createdAt: Date,
  updatedAt: Date,
}, { collection: 'authusers' });

const AuthUser = mongoose.model('AuthUser', userSchema);

async function checkAdminCredentials() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 ADMIN EMAIL FROM .ENV');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Access Key Hash:', ADMIN_ACCESS_KEY_HASH ? '✅ Set' : '❌ Not set');
    console.log('');

    console.log('🔍 Searching for admin user in database...\n');

    const user = await AuthUser.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() });

    if (!user) {
      console.log('❌ ADMIN USER NOT FOUND IN DATABASE!');
      console.log('\n📝 You need to create an admin user first.');
      console.log('Run: node backend/scripts/createSuperAdmin.js');
      await mongoose.disconnect();
      return;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ADMIN USER FOUND IN DATABASE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📋 Account Details:');
    console.log('- ID:', user._id.toString());
    console.log('- Email:', user.email);
    console.log('- Name:', user.name || 'Not set');
    console.log('- Role:', user.role);
    console.log('- Phone:', user.phone || 'Not set');
    console.log('');
    console.log('🔐 Security Status:');
    console.log('- Account Status:', user.accountStatus);
    console.log('- Is Active:', user.isActive ? '✅ Yes' : '❌ No');
    console.log('- Email Verified:', user.isEmailVerified ? '✅ Yes' : '❌ No');
    console.log('- Has Password Hash:', user.passwordHash ? '✅ Yes (length: ' + user.passwordHash.length + ')' : '❌ No');
    console.log('- Account Locked:', user.lockedUntil && new Date(user.lockedUntil) > new Date() ? '🔒 Yes (until ' + user.lockedUntil + ')' : '✅ No');
    console.log('');
    console.log('📊 Login History:');
    console.log('- Total Logins:', user.loginCount || 0);
    console.log('- Failed Attempts:', user.failedLoginAttempts || 0);
    console.log('- Last Login:', user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never');
    console.log('- Last Login IP:', user.lastLoginIP || 'N/A');
    console.log('- Account Created:', user.signupAt ? new Date(user.signupAt).toLocaleString() : (user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unknown'));
    console.log('- Last Updated:', user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Unknown');
    console.log('');

    // Check for issues
    const issues = [];
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      issues.push('⚠️  Role is not ADMIN or SUPERADMIN (current: ' + user.role + ')');
    }
    if (user.accountStatus !== 'active' && user.accountStatus !== 'approved') {
      issues.push('⚠️  Account status is not active (current: ' + user.accountStatus + ')');
    }
    if (!user.isActive) {
      issues.push('⚠️  isActive is false');
    }
    if (!user.passwordHash) {
      issues.push('❌ No password hash found!');
    }
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      issues.push('🔒 Account is locked until ' + user.lockedUntil);
    }

    if (issues.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚠️  ISSUES FOUND');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      issues.forEach(issue => console.log(issue));
      console.log('');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 LOGIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('To login at /admin/login, you need:');
    console.log('');
    console.log('1. Email: ' + user.email);
    console.log('2. Password: [The password you set when creating the admin]');
    console.log('3. Access Key Hash: ' + (ADMIN_ACCESS_KEY_HASH ? '[SET - hidden]' : '[NOT SET IN .ENV]'));
    console.log('');
    console.log('💡 Note: The actual password is hashed and cannot be retrieved.');
    console.log('   If you forgot it, you need to reset it using a reset script.');
    console.log('');

    // Check all admin/superadmin users
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👥 ALL ADMIN USERS IN DATABASE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    
    const allAdmins = await AuthUser.find({ 
      role: { $in: ['ADMIN', 'SUPERADMIN'] } 
    }).select('email name role accountStatus isActive loginCount lastLoginAt');

    if (allAdmins.length === 0) {
      console.log('❌ No admin users found in database');
    } else {
      allAdmins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.email}`);
        console.log(`   Name: ${admin.name || 'Not set'}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Status: ${admin.accountStatus} | Active: ${admin.isActive}`);
        console.log(`   Logins: ${admin.loginCount || 0} | Last: ${admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : 'Never'}`);
        console.log('');
      });
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB Atlas');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

checkAdminCredentials();
