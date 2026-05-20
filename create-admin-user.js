/**
 * Create or update admin user
 * Run: node create-admin-user.js
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
  passwordHash: String,
  accountStatus: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
}, { collection: 'authusers', timestamps: true });

const AuthUser = mongoose.model('AuthUser', userSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdminUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📧 Admin Email:', ADMIN_EMAIL);
    
    // Check if user exists
    let user = await AuthUser.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() });
    
    if (user) {
      console.log('✅ Admin user already exists!');
      console.log('Current details:');
      console.log('- Name:', user.name);
      console.log('- Role:', user.role);
      console.log('- Status:', user.accountStatus);
      console.log('- Active:', user.isActive);
      console.log();
      
      const update = await question('Do you want to update the password? (yes/no): ');
      if (update.toLowerCase() !== 'yes' && update.toLowerCase() !== 'y') {
        console.log('❌ Cancelled');
        rl.close();
        await mongoose.disconnect();
        return;
      }
    } else {
      console.log('📝 Creating new admin user...\n');
    }

    // Get password
    const password = await question('Enter admin password (min 6 characters): ');
    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    // Get name
    const name = await question('Enter admin name (default: Admin): ') || 'Admin';

    console.log('\n🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    if (user) {
      // Update existing user
      user.passwordHash = passwordHash;
      user.name = name;
      user.role = 'ADMIN';
      user.accountStatus = 'active';
      user.isActive = true;
      user.failedLoginAttempts = 0;
      user.lockedUntil = undefined;
      await user.save();
      console.log('✅ Admin user updated successfully!');
    } else {
      // Create new user
      user = await AuthUser.create({
        email: ADMIN_EMAIL.toLowerCase().trim(),
        name: name,
        role: 'ADMIN',
        passwordHash: passwordHash,
        accountStatus: 'active',
        isActive: true,
        failedLoginAttempts: 0,
      });
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📋 Admin User Details:');
    console.log('- ID:', user._id.toString());
    console.log('- Email:', user.email);
    console.log('- Name:', user.name);
    console.log('- Role:', user.role);
    console.log('- Status:', user.accountStatus);
    console.log('- Active:', user.isActive);

    console.log('\n🔑 Login Credentials:');
    console.log('- Email:', user.email);
    console.log('- Password:', password);
    console.log('- Access Key:', process.env.ADMIN_ACCESS_KEY);

    console.log('\n✅ You can now login at: http://localhost:3000/admin/login');

    rl.close();
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

createAdminUser();
