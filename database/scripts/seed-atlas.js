/**
 * Atlas Seed Script — Adyapan
 *
 * Creates all collections in MongoDB Atlas with initial data.
 * Run: node scripts/seed-atlas.js
 *
 * Collections created:
 *   authusers, payments, courses, enrollments, certificates,
 *   plans, recruiterjobs, projectrequests, offlineinternshipleads,
 *   counsellorrequests, emaillogs, adminactivitylogs
 */

require('dotenv').config();
const mongoose = require('mongoose');
const argon2 = require('argon2');

const ARGON2ID_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
};

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('❌ MONGODB_URI not set in .env');
  process.exit(1);
}

// ── Minimal inline schemas (avoids TypeScript compilation) ────
const UserSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, role: String, passwordHash: String, accountStatus: String, isActive: Boolean }, { timestamps: true, collection: 'authusers' });
const PaymentSchema = new mongoose.Schema({ userName: String, userEmail: String, paymentId: { type: String, unique: true }, orderId: String, courseName: String, totalAmount: Number, status: String }, { timestamps: true, collection: 'payments' });
const CourseSchema = new mongoose.Schema({ slug: { type: String, unique: true }, name: String, title: String, subtitle: String, price: Number, isActive: Boolean, duration: String, totalLessons: Number }, { timestamps: true, collection: 'courses' });
const EnrollmentSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, courseId: mongoose.Schema.Types.ObjectId, userEmail: String, courseName: String, status: String }, { timestamps: true, collection: 'enrollments' });
const CertificateSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, courseId: mongoose.Schema.Types.ObjectId, certificateNumber: { type: String, unique: true }, recipientName: String, recipientEmail: String, courseName: String, isValid: Boolean }, { timestamps: true, collection: 'certificates' });
const PlanSchema = new mongoose.Schema({ planId: { type: String, unique: true }, planName: String, displayName: String, price: Number, originalPrice: Number, discountPercent: Number, duration: String, totalDays: Number, benefits: [String], features: [String], isPopular: Boolean, status: String }, { timestamps: true, collection: 'plans' });
const RecruiterJobSchema = new mongoose.Schema({ title: String, companyName: String, status: String, jobType: String }, { timestamps: true, collection: 'recruiterjobs' });
const ProjectRequestSchema = new mongoose.Schema({ projectTitle: String, contactEmail: String, budget: Number, projectStatus: String, paymentStatus: String }, { timestamps: true, collection: 'projectrequests' });
const OfflineLeadSchema = new mongoose.Schema({ name: String, email: String, phone: String, status: String }, { timestamps: true, collection: 'offlineinternshipleads' });
const CounsellorSchema = new mongoose.Schema({ name: String, email: String, phone: String, topic: String, status: String }, { timestamps: true, collection: 'counsellorrequests' });
const EmailLogSchema = new mongoose.Schema({ to: String, subject: String, type: String, status: String }, { timestamps: true, collection: 'emaillogs' });
const AdminLogSchema = new mongoose.Schema({ adminEmail: String, action: String, details: String }, { timestamps: true, collection: 'adminactivitylogs' });

async function seed() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Adyapan — MongoDB Atlas Collection Seeder');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await mongoose.connect(MONGO_URI, {
    dbName: 'adyapan',
    serverSelectionTimeoutMS: 15000,
  });
  console.log('✅ Connected to Atlas:', mongoose.connection.host);
  console.log('   Database:', mongoose.connection.name);
  console.log('');

  const User         = mongoose.models.AuthUser         || mongoose.model('AuthUser',         UserSchema);
  const Payment      = mongoose.models.Payment          || mongoose.model('Payment',          PaymentSchema);
  const Course       = mongoose.models.Course           || mongoose.model('Course',           CourseSchema);
  const Enrollment   = mongoose.models.Enrollment       || mongoose.model('Enrollment',       EnrollmentSchema);
  const Certificate  = mongoose.models.Certificate      || mongoose.model('Certificate',      CertificateSchema);
  const Plan         = mongoose.models.Plan             || mongoose.model('Plan',             PlanSchema);
  const RecruiterJob = mongoose.models.RecruiterJob     || mongoose.model('RecruiterJob',     RecruiterJobSchema);
  const ProjectReq   = mongoose.models.ProjectRequest   || mongoose.model('ProjectRequest',   ProjectRequestSchema);
  const OfflineLead  = mongoose.models.OfflineInternshipLead || mongoose.model('OfflineInternshipLead', OfflineLeadSchema);
  const Counsellor   = mongoose.models.CounsellorRequest || mongoose.model('CounsellorRequest', CounsellorSchema);
  const EmailLog     = mongoose.models.EmailLog         || mongoose.model('EmailLog',         EmailLogSchema);
  const AdminLog     = mongoose.models.AdminActivityLog || mongoose.model('AdminActivityLog', AdminLogSchema);

  const results = [];

  // ── Plans ──────────────────────────────────────────────────
  const plans = [
    { planId: 'plan-1', planName: 'Starter Plan', displayName: 'Adyapan Starter', price: 3000, originalPrice: 4110, discountPercent: 27, duration: '30 Days', totalDays: 30, benefits: ['Month 1 - Industry Training', 'Course Completion Certificate', 'Project Certificate'], features: ['Month 1 - Industry Training', 'Course Completion Certificate', 'Project Certificate'], isPopular: false, status: 'active' },
    { planId: 'plan-2', planName: 'Standard Plan', displayName: 'Adyapan Standard', price: 3500, originalPrice: 4795, discountPercent: 27, duration: '45 Days', totalDays: 45, benefits: ['45 Days - Industry Training', 'Live Project Allotment', 'Course Completion Certificate', 'Internship Completion Certificate', 'Best Performance Certificate'], features: ['45 Days - Industry Training', 'Live Project Allotment', 'Course Completion Certificate', 'Internship Completion Certificate', 'Best Performance Certificate'], isPopular: false, status: 'active' },
    { planId: 'plan-3', planName: 'Professional Plan', displayName: 'Adyapan Professional', price: 5000, originalPrice: 6850, discountPercent: 27, duration: '3 Months', totalDays: 90, benefits: ['Month 1 - Industry Training', 'Month 2 - Minor & Major Projects', 'Month 3 - Resume Building + Mock Interviews', 'Project Completion Certificate', 'Internship Completion Certificate', 'Course Completion Certificate', 'Best Performance Certificate'], features: ['Month 1 - Industry Training', 'Month 2 - Minor & Major Projects', 'Month 3 - Resume Building + Mock Interviews', 'Project Completion Certificate', 'Internship Completion Certificate', 'Course Completion Certificate', 'Best Performance Certificate'], isPopular: true, status: 'active' },
    { planId: 'plan-4-premium', planName: 'Career Pro Plan', displayName: 'Adyapan Career Pro', price: 15000, originalPrice: 20550, discountPercent: 27, duration: '4 Months', totalDays: 120, benefits: ['Months 1-3 - Training + Minor & Major Industry Projects', 'Month 4 (Offline) - Resume Building', 'Mock Interviews', 'Interview Training', 'Stipend up to Rs. 15,000', 'Experience Certificate', 'Resume Referrals', 'Company References', 'Guaranteed Job Support Until Placement'], features: ['Months 1-3 - Training + Minor & Major Industry Projects', 'Month 4 (Offline) - Resume Building', 'Mock Interviews', 'Interview Training', 'Stipend up to Rs. 15,000', 'Experience Certificate', 'Resume Referrals', 'Company References', 'Guaranteed Job Support Until Placement'], isPopular: true, status: 'active' },
  ];
  for (const p of plans) {
    await Plan.findOneAndUpdate({ planId: p.planId }, { $set: p }, { upsert: true });
  }
  results.push(['plans', plans.length]);

  // ── Courses ────────────────────────────────────────────────
  const courses = [
    { slug: 'plan-1',         name: 'Adyapan Starter',      title: 'Adyapan Starter',      subtitle: '30-day industry training with course and project certification',        price: 3000,  isActive: true, duration: '30 Days',  totalLessons: 14 },
    { slug: 'plan-2',         name: 'Adyapan Standard',     title: 'Adyapan Standard',     subtitle: '45-day industry training with live project allotment',                   price: 3500,  isActive: true, duration: '45 Days',  totalLessons: 18 },
    { slug: 'plan-3',         name: 'Adyapan Professional', title: 'Adyapan Professional', subtitle: '3-month program with projects, resume building and mock interviews',      price: 5000,  isActive: true, duration: '3 Months', totalLessons: 22 },
    { slug: 'plan-4-premium', name: 'Adyapan Career Pro',   title: 'Adyapan Career Pro',   subtitle: 'Premium career support with stipend, references and job support',         price: 15000, isActive: true, duration: '4 Months', totalLessons: 28 },
  ];
  for (const c of courses) {
    await Course.findOneAndUpdate({ slug: c.slug }, { $set: c }, { upsert: true });
  }
  results.push(['courses', courses.length]);

  // ── Admin user ─────────────────────────────────────────────
  const adminEmail = (process.env.ADMIN_EMAIL || 'rupeshrupak609@gmail.com').toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hash = await argon2.hash('Admin@123', ARGON2ID_OPTIONS);
    await User.create({
      name: 'Adyapan Admin',
      email: adminEmail,
      passwordHash: hash,
      role: 'ADMIN',
      accountStatus: 'approved',
      isActive: true,
    });
    results.push(['authusers (admin)', 1]);
    console.log('  ✅ Admin user created:', adminEmail);
    console.log('     Default password: Admin@123 — CHANGE THIS IMMEDIATELY');
  } else {
    results.push(['authusers (admin)', 0, 'already exists']);
  }

  // ── Placeholder records to create collections ──────────────
  // EmailLog
  const emailCount = await EmailLog.countDocuments();
  if (emailCount === 0) {
    await EmailLog.create({ to: 'system@adyapan.com', subject: 'System Init', type: 'general', status: 'sent' });
    results.push(['emaillogs', 1]);
  } else {
    results.push(['emaillogs', 0, `${emailCount} existing`]);
  }

  // AdminActivityLog
  const logCount = await AdminLog.countDocuments();
  if (logCount === 0) {
    await AdminLog.create({ adminEmail: adminEmail, action: 'SYSTEM_INIT', details: 'Atlas seed completed' });
    results.push(['adminactivitylogs', 1]);
  } else {
    results.push(['adminactivitylogs', 0, `${logCount} existing`]);
  }

  // Empty collections (just ensure indexes are created)
  await Payment.createIndexes();
  await Enrollment.createIndexes();
  await Certificate.createIndexes();
  await RecruiterJob.createIndexes();
  await ProjectReq.createIndexes();
  await OfflineLead.createIndexes();
  await Counsellor.createIndexes();

  results.push(['payments', 0, 'indexes created']);
  results.push(['enrollments', 0, 'indexes created']);
  results.push(['certificates', 0, 'indexes created']);
  results.push(['recruiterjobs', 0, 'indexes created']);
  results.push(['projectrequests', 0, 'indexes created']);
  results.push(['offlineinternshipleads', 0, 'indexes created']);
  results.push(['counsellorrequests', 0, 'indexes created']);

  // ── Summary ────────────────────────────────────────────────
  console.log('');
  console.log('  Collection                    Records   Status');
  console.log('  ─────────────────────────────────────────────');
  results.forEach(([col, count, note]) => {
    const status = note || (count > 0 ? '✅ seeded' : '✅ ready');
    console.log(`  ${String(col).padEnd(30)} ${String(count).padEnd(9)} ${status}`);
  });

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  ✅ All collections ready in Atlas Data Explorer');
  console.log('  🔗 https://cloud.mongodb.com → Browse Collections');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
