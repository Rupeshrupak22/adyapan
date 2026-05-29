/**
 * Check if admin user exists in database
 * Run: node check-admin-user.js
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
  passwordHash: String,
  accountStatus: String,
  isActive: Boolean,
}, { collection: 'authusers' });

const AuthUser = mongoose.model('AuthUser', userSchema);

async function checkAdminUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📧 Looking for admin email:', ADMIN_EMAIL);
    console.log('🔍 Searching in database...\n');

    const user = await AuthUser.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() });

    if (!user) {
      console.log('❌ ADMIN USER NOT FOUND!');
      console.log('\n📝 You need to create an admin user first.');
      console.log('Run: node backend/scripts/createSuperAdmin.js');
      console.log('Or create manually in MongoDB with:');
      console.log('- email:', ADMIN_EMAIL);
      console.log('- role: ADMIN or SUPERADMIN');
      console.log('- passwordHash: (bcrypt hashed password)');
      console.log('- accountStatus: active');
      console.log('- isActive: true');
    } else {
      console.log('✅ ADMIN USER FOUND!');
      console.log('\n📋 User Details:');
      console.log('- ID:', user._id.toString());
      console.log('- Email:', user.email);
      console.log('- Name:', user.name || 'Not set');
      console.log('- Role:', user.role);
      console.log('- Account Status:', user.accountStatus);
      console.log('- Is Active:', user.isActive);
      console.log('- Has Password:', !!user.passwordHash);
      
      if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
        console.log('\n⚠️  WARNING: User role is not ADMIN or SUPERADMIN!');
        console.log('Current role:', user.role);
        console.log('Please update the role to ADMIN or SUPERADMIN');
      }
      
      if (user.accountStatus !== 'active') {
        console.log('\n⚠️  WARNING: Account status is not active!');
        console.log('Current status:', user.accountStatus);
        console.log('Please update accountStatus to "active"');
      }
      
      if (!user.isActive) {
        console.log('\n⚠️  WARNING: isActive is false!');
        console.log('Please update isActive to true');
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAdminUser();
