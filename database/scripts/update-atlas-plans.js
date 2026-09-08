/**
 * Updates only the plan/course documents in MongoDB Atlas.
 * Run: node scripts/update-atlas-plans.js
 */
require('dotenv').config({ path: '.env.local', quiet: true });
require('dotenv').config({ path: '.env', quiet: true });

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'adyapan';

if (!MONGO_URI) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

const planSchema = new mongoose.Schema(
  {
    planId: { type: String, unique: true },
    planName: String,
    displayName: String,
    price: Number,
    originalPrice: Number,
    discountPercent: Number,
    duration: String,
    totalDays: Number,
    benefits: [String],
    features: [String],
    isPopular: Boolean,
    status: String,
  },
  { timestamps: true, collection: 'plans' }
);

const courseSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    name: String,
    title: String,
    subtitle: String,
    price: Number,
    isActive: Boolean,
    duration: String,
    totalLessons: Number,
  },
  { timestamps: true, collection: 'courses', strict: false }
);

const planBenefits = {
  'plan-1': [
    'Month 1 - Industry Training',
    'Course Completion Certificate',
    'Project Certificate',
  ],
  'plan-2': [
    '45 Days - Industry Training',
    'Live Project Allotment',
    'Course Completion Certificate',
    'Internship Completion Certificate',
    'Best Performance Certificate',
  ],
  'plan-3': [
    'Month 1 - Industry Training',
    'Month 2 - Minor & Major Projects',
    'Month 3 - Resume Building + Mock Interviews',
    'Project Completion Certificate',
    'Internship Completion Certificate',
    'Course Completion Certificate',
    'Best Performance Certificate',
  ],
  'plan-4-premium': [
    'Months 1-3 - Training + Minor & Major Industry Projects',
    'Month 4 (Offline) - Resume Building',
    'Mock Interviews',
    'Interview Training',
    'Stipend up to Rs. 15,000',
    'Experience Certificate',
    'Resume Referrals',
    'Company References',
    'Guaranteed Job Support Until Placement',
  ],
};

const plans = [
  {
    planId: 'plan-1',
    planName: 'Starter Plan',
    displayName: 'Adyapan Starter',
    price: 3000,
    originalPrice: 4110,
    discountPercent: 27,
    duration: '30 Days',
    totalDays: 30,
    isPopular: false,
    status: 'active',
  },
  {
    planId: 'plan-2',
    planName: 'Standard Plan',
    displayName: 'Adyapan Standard',
    price: 3500,
    originalPrice: 4795,
    discountPercent: 27,
    duration: '45 Days',
    totalDays: 45,
    isPopular: false,
    status: 'active',
  },
  {
    planId: 'plan-3',
    planName: 'Professional Plan',
    displayName: 'Adyapan Professional',
    price: 5000,
    originalPrice: 6850,
    discountPercent: 27,
    duration: '3 Months',
    totalDays: 90,
    isPopular: true,
    status: 'active',
  },
  {
    planId: 'plan-4-premium',
    planName: 'Career Pro Plan',
    displayName: 'Adyapan Career Pro',
    price: 15000,
    originalPrice: 20550,
    discountPercent: 27,
    duration: '4 Months',
    totalDays: 120,
    isPopular: true,
    status: 'active',
  },
].map(plan => ({
  ...plan,
  benefits: planBenefits[plan.planId],
  features: planBenefits[plan.planId],
}));

const courses = [
  {
    slug: 'plan-1',
    name: 'Adyapan Starter',
    title: 'Adyapan Starter',
    subtitle: '30-day industry training with course and project certification',
    price: 3000,
    isActive: true,
    duration: '30 Days',
    totalLessons: 14,
  },
  {
    slug: 'plan-2',
    name: 'Adyapan Standard',
    title: 'Adyapan Standard',
    subtitle: '45-day industry training with live project allotment',
    price: 3500,
    isActive: true,
    duration: '45 Days',
    totalLessons: 18,
  },
  {
    slug: 'plan-3',
    name: 'Adyapan Professional',
    title: 'Adyapan Professional',
    subtitle: '3-month program with projects, resume building and mock interviews',
    price: 5000,
    isActive: true,
    duration: '3 Months',
    totalLessons: 22,
  },
  {
    slug: 'plan-4-premium',
    name: 'Adyapan Career Pro',
    title: 'Adyapan Career Pro',
    subtitle: 'Premium career support with stipend, references and job support',
    price: 15000,
    isActive: true,
    duration: '4 Months',
    totalLessons: 28,
  },
];

async function run() {
  await mongoose.connect(MONGO_URI, {
    dbName: DB_NAME,
    serverSelectionTimeoutMS: 15000,
  });

  const Plan = mongoose.models.Plan || mongoose.model('Plan', planSchema);
  const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

  for (const plan of plans) {
    await Plan.findOneAndUpdate(
      { planId: plan.planId },
      { $set: plan },
      { upsert: true, returnDocument: 'after' }
    );
  }

  for (const course of courses) {
    await Course.findOneAndUpdate(
      { slug: course.slug },
      { $set: course },
      { upsert: true, returnDocument: 'after' }
    );
  }

  const savedPlans = await Plan.find(
    { planId: { $in: plans.map(plan => plan.planId) } },
    { _id: 0, planId: 1, price: 1, duration: 1, benefits: 1 }
  ).sort({ price: 1 }).lean();

  console.log(JSON.stringify({ database: mongoose.connection.name, savedPlans }, null, 2));
  await mongoose.disconnect();
}

run().catch(error => {
  console.error(error.message);
  process.exit(1);
});
