/**
 * Complete Admin Login Diagnostic
 * Run: node diagnose-admin-login.js
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
  passwordHash: String,
  accountStatus: String,
  isActive: Boolean,
  failedLoginAttempts: Number,
  lockedUntil: Date,
}, { collection: 'authusers' });

const AuthUser = mongoose.model('AuthUser', userSchema);

async function diagnose() {
  console.log('🔍 ADMIN LOGIN DIAGNOSTIC TOOL\n');
  console.log('═'.repeat(60));
  
  // Step 1: Check Environment Variables
  console.log('\n📋 STEP 1: Checking Environment Variables');
  console.log('─'.repeat(60));
  
  const checks = {
    mongodb: !!MONGODB_URI,
    adminEmail: !!ADMIN_EMAIL,
    accessKey: !!ADMIN_ACCESS_KEY,
    jwtSecret: !!JWT_SECRET && JWT_SECRET.length >= 32,
  };
  
  console.log('MONGODB_URI:', checks.mongodb ? '✅ Set' : '❌ Missing');
  console.log('ADMIN_EMAIL:', checks.adminEmail ? `✅ ${ADMIN_EMAIL}` : '❌ Missing');
  console.log('ADMIN_ACCESS_KEY:', checks.accessKey ? `✅ ${ADMIN_ACCESS_KEY}` : '❌ Missing');
  console.log('JWT_SECRET:', checks.jwtSecret ? '✅ Set (32+ chars)' : '❌ Missing or too short');
  
  if (!checks.mongodb || !checks.adminEmail || !checks.accessKey || !checks.jwtSecret) {
    console.log('\n❌ Environment variables missing! Check .env file');
    return;
  }
  
  // Step 2: Test MongoDB Connection
  console.log('\n📋 STEP 2: Testing MongoDB Connection');
  console.log('─'.repeat(60));
  
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // Get database info
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📦 Database:', db.databaseName);
    console.log('📚 Collections found:', collections.length);
    
    const hasAuthUsers = collections.some(c => c.name === 'authusers');
    console.log('👥 authusers collection:', hasAuthUsers ? '✅ Exists' : '❌ Not found');
    
    if (!hasAuthUsers) {
      console.log('\n❌ authusers collection not found!');
      console.log('Create admin user first: node create-admin-user.js');
      await mongoose.disconnect();
      return;
    }
    
  } catch (error) {
    console.log('❌ MongoDB Connection Failed!');
    console.log('Error:', error.message);
    console.log('\nCheck:');
    console.log('1. MongoDB URI is correct');
    console.log('2. IP address is whitelisted in MongoDB Atlas');
    console.log('3. Database user has correct permissions');
    return;
  }
  
  // Step 3: Find Admin User
  console.log('\n📋 STEP 3: Finding Admin User');
  console.log('─'.repeat(60));
  
  try {
    const normalizedEmail = ADMIN_EMAIL.toLowerCase().trim();
    console.log('🔍 Searching for:', normalizedEmail);
    
    const user = await AuthUser.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log('❌ ADMIN USER NOT FOUND!');
      console.log('\n📝 Create admin user:');
      console.log('   node create-admin-user.js');
      await mongoose.disconnect();
      return;
    }
    
    console.log('✅ Admin user found!');
    console.log('\n📋 User Details:');
    console.log('─'.repeat(60));
    console.log('ID:', user._id.toString());
    console.log('Email:', user.email);
    console.log('Name:', user.name || 'Not set');
    console.log('Role:', user.role);
    console.log('Account Status:', user.accountStatus);
    console.log('Is Active:', user.isActive);
    console.log('Has Password:', !!user.passwordHash);
    console.log('Failed Attempts:', user.failedLoginAttempts || 0);
    console.log('Locked Until:', user.lockedUntil || 'Not locked');
    
    // Step 4: Validate User Configuration
    console.log('\n📋 STEP 4: Validating User Configuration');
    console.log('─'.repeat(60));
    
    const issues = [];
    
    // Check role
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      issues.push(`❌ Role is "${user.role}" (should be ADMIN or SUPERADMIN)`);
    } else {
      console.log('✅ Role is correct:', user.role);
    }
    
    // Check account status
    if (user.accountStatus !== 'active') {
      issues.push(`❌ Account status is "${user.accountStatus}" (should be "active")`);
    } else {
      console.log('✅ Account status is active');
    }
    
    // Check isActive
    if (!user.isActive) {
      issues.push('❌ isActive is false (should be true)');
    } else {
      console.log('✅ isActive is true');
    }
    
    // Check password
    if (!user.passwordHash) {
      issues.push('❌ No password set');
    } else {
      console.log('✅ Password is set');
    }
    
    // Check if locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      issues.push(`❌ Account is locked for ${minutesLeft} more minutes`);
    } else {
      console.log('✅ Account is not locked');
    }
    
    if (issues.length > 0) {
      console.log('\n⚠️  ISSUES FOUND:');
      console.log('─'.repeat(60));
      issues.forEach(issue => console.log(issue));
      console.log('\n🔧 Fix these issues:');
      console.log('   node fix-admin-status.js');
    } else {
      console.log('\n✅ All checks passed!');
    }
    
    // Step 5: Test Password (if provided)
    console.log('\n📋 STEP 5: Password Test');
    console.log('─'.repeat(60));
    console.log('To test password, enter it when prompted');
    console.log('Or press Enter to skip');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('\nEnter admin password to test (or press Enter to skip): ', async (testPassword) => {
      if (testPassword) {
        try {
          const isValid = await bcrypt.compare(testPassword, user.passwordHash);
          if (isValid) {
            console.log('✅ Password is CORRECT!');
          } else {
            console.log('❌ Password is WRONG!');
            console.log('Reset password: node create-admin-user.js');
          }
        } catch (error) {
          console.log('❌ Error testing password:', error.message);
        }
      } else {
        console.log('⏭️  Password test skipped');
      }
      
      // Final Summary
      console.log('\n═'.repeat(60));
      console.log('📊 DIAGNOSTIC SUMMARY');
      console.log('═'.repeat(60));
      
      if (issues.length === 0) {
        console.log('\n✅ ALL CHECKS PASSED!');
        console.log('\n🔑 Login Credentials:');
        console.log('   URL: http://localhost:3000/admin/login');
        console.log('   Email:', user.email);
        console.log('   Password: [your password]');
        console.log('   Access Key:', ADMIN_ACCESS_KEY);
        console.log('\n🚀 Try logging in now!');
      } else {
        console.log('\n⚠️  ISSUES FOUND:', issues.length);
        console.log('\n🔧 Run this to fix:');
        console.log('   node fix-admin-status.js');
      }
      
      rl.close();
      await mongoose.disconnect();
      console.log('\n✅ Disconnected from MongoDB');
    });
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    await mongoose.disconnect();
  }
}

diagnose().catch(console.error);
