/**
 * Fix admin user account status
 * Run: node fix-admin-status.js
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
  accountStatus: String,
  isActive: Boolean,
}, { collection: 'authusers' });

const AuthUser = mongoose.model('AuthUser', userSchema);

async function fixAdminStatus() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📧 Looking for admin email:', ADMIN_EMAIL);
    
    const user = await AuthUser.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() });

    if (!user) {
      console.log('❌ Admin user not found!');
      await mongoose.disconnect();
      return;
    }

    console.log('📋 Current Status:');
    console.log('- Account Status:', user.accountStatus);
    console.log('- Is Active:', user.isActive);

    // Update status
    user.accountStatus = 'active';
    user.isActive = true;
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    await user.save();

    console.log('\n✅ Status Updated Successfully!');
    console.log('📋 New Status:');
    console.log('- Account Status:', user.accountStatus);
    console.log('- Is Active:', user.isActive);

    console.log('\n🎉 Admin user is now ready to login!');
    console.log('\n🔑 Login at: http://localhost:3000/admin/login');
    console.log('- Email:', user.email);
    console.log('- Access Key:', process.env.ADMIN_ACCESS_KEY);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAdminStatus();
