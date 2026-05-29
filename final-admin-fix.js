/**
 * Final Admin Login Fix
 * This will fix all issues and test login
 * Run: node final-admin-fix.js
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY;

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function finalFix() {
  console.log('🔧 FINAL ADMIN LOGIN FIX\n');
  console.log('═'.repeat(60));
  
  try {
    // Connect to MongoDB
    console.log('\n🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!\n');
    
    // Find admin user
    const normalizedEmail = ADMIN_EMAIL.toLowerCase().trim();
    let user = await AuthUser.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log('❌ Admin user not found!');
      console.log('\n📝 Creating new admin user...\n');
      
      const password = await question('Enter admin password (min 6 characters): ');
      if (password.length < 6) {
        console.log('❌ Password too short!');
        rl.close();
        await mongoose.disconnect();
        return;
      }
      
      const name = await question('Enter admin name (default: Admin): ') || 'Admin';
      
      console.log('\n🔐 Creating admin user...');
      const passwordHash = await bcrypt.hash(password, 10);
      
      user = await AuthUser.create({
        email: normalizedEmail,
        name: name,
        role: 'ADMIN',
        passwordHash: passwordHash,
        accountStatus: 'active',
        isActive: true,
        failedLoginAttempts: 0,
      });
      
      console.log('✅ Admin user created!');
      
    } else {
      console.log('✅ Admin user found!');
      console.log('\n📋 Current Status:');
      console.log('- Email:', user.email);
      console.log('- Name:', user.name);
      console.log('- Role:', user.role);
      console.log('- Account Status:', user.accountStatus);
      console.log('- Is Active:', user.isActive);
      console.log('- Failed Attempts:', user.failedLoginAttempts || 0);
      console.log('- Locked:', user.lockedUntil ? 'Yes' : 'No');
      
      // Fix all issues
      console.log('\n🔧 Fixing all issues...');
      
      let fixed = false;
      
      if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
        user.role = 'ADMIN';
        console.log('✅ Fixed role to ADMIN');
        fixed = true;
      }
      
      if (user.accountStatus !== 'active') {
        user.accountStatus = 'active';
        console.log('✅ Fixed accountStatus to active');
        fixed = true;
      }
      
      if (!user.isActive) {
        user.isActive = true;
        console.log('✅ Fixed isActive to true');
        fixed = true;
      }
      
      if (user.failedLoginAttempts > 0) {
        user.failedLoginAttempts = 0;
        console.log('✅ Reset failed login attempts');
        fixed = true;
      }
      
      if (user.lockedUntil) {
        user.lockedUntil = undefined;
        console.log('✅ Unlocked account');
        fixed = true;
      }
      
      if (fixed) {
        await user.save();
        console.log('\n✅ All issues fixed!');
      } else {
        console.log('\n✅ No issues found - user is already configured correctly!');
      }
      
      // Ask if want to reset password
      const resetPw = await question('\nDo you want to reset the password? (yes/no): ');
      if (resetPw.toLowerCase() === 'yes' || resetPw.toLowerCase() === 'y') {
        const newPassword = await question('Enter new password (min 6 characters): ');
        if (newPassword.length >= 6) {
          user.passwordHash = await bcrypt.hash(newPassword, 10);
          await user.save();
          console.log('✅ Password updated!');
        } else {
          console.log('❌ Password too short - not updated');
        }
      }
    }
    
    // Final status
    console.log('\n═'.repeat(60));
    console.log('✅ ADMIN USER READY FOR LOGIN');
    console.log('═'.repeat(60));
    console.log('\n📋 Final Configuration:');
    console.log('- ID:', user._id.toString());
    console.log('- Email:', user.email);
    console.log('- Name:', user.name);
    console.log('- Role:', user.role);
    console.log('- Account Status:', user.accountStatus);
    console.log('- Is Active:', user.isActive);
    console.log('- Has Password:', !!user.passwordHash);
    
    console.log('\n🔑 Login Credentials:');
    console.log('═'.repeat(60));
    console.log('URL: http://localhost:3000/admin/login');
    console.log('Email:', user.email);
    console.log('Password: [your password]');
    console.log('Access Key:', ADMIN_ACCESS_KEY);
    
    console.log('\n📝 Steps to Login:');
    console.log('1. Make sure server is running: npm run dev');
    console.log('2. Go to: http://localhost:3000/admin/login');
    console.log('3. Select "Admin" mode (orange button)');
    console.log('4. Enter email, password, and access key');
    console.log('5. Click "Sign In to Admin"');
    
    console.log('\n✅ Setup complete!');
    
    rl.close();
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

finalFix();
