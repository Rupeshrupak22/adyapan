/**
 * Seed initial jobs and organization account into MongoDB Atlas
 * Run: $env:NODE_PATH="frontend/node_modules"; node database/scripts/seed-jobs-and-org.js
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../backend/.env') });

const mongoose = require('mongoose');
const argon2 = require('argon2');

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('MONGODB_URI not found in env');
  process.exit(1);
}

const ARGON2ID_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
};

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;

  // 1. Create or update Organization User
  const orgEmail = 'recruiter@adyapan.com';
  const orgPassword = 'Adyapan@Jobs2026';
  const passwordHash = await argon2.hash(orgPassword, ARGON2ID_OPTIONS);

  let orgUser = await db.collection('organizationusers').findOne({ email: orgEmail });
  if (!orgUser) {
    const insertRes = await db.collection('organizationusers').insertOne({
      name: 'Adyapan Careers Team',
      email: orgEmail,
      passwordHash,
      role: 'organization',
      isApproved: true,
      accountStatus: 'active',
      failedLoginAttempts: 0,
      loginCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    orgUser = { _id: insertRes.insertedId, email: orgEmail };
    console.log('✅ Created Organization User:', orgEmail);
  } else {
    await db.collection('organizationusers').updateOne(
      { _id: orgUser._id },
      {
        $set: {
          passwordHash,
          isApproved: true,
          accountStatus: 'active',
          failedLoginAttempts: 0,
          lockedUntil: null,
          updatedAt: new Date(),
        }
      }
    );
    console.log('✏️ Updated Organization User:', orgEmail);
  }

  const orgUserIdStr = orgUser._id.toString();

  // 2. Create or update Company Profile
  await db.collection('companyprofiles').updateOne(
    { organizationUserId: orgUserIdStr },
    {
      $set: {
        organizationUserId: orgUserIdStr,
        companyName: 'ADYAPAN',
        companyEmail: orgEmail,
        website: 'https://adyapan.com',
        logoUrl: '/adyapan-logo.png',
        industry: 'Education Technology',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      }
    },
    { upsert: true }
  );
  console.log('✅ Verified Company Profile configured for ADYAPAN');

  // 3. Seed the 2 Jobs
  const jobsToSeed = [
    {
      companyId: orgUserIdStr,
      organizationUserId: orgUserIdStr,
      companyName: 'ADYAPAN',
      companyEmail: orgEmail,
      companyLogoUrl: '/adyapan-logo.png',
      companyWebsite: 'https://adyapan.com',
      companyIndustry: 'Education Technology',
      companyCity: 'Hyderabad',
      companyVerified: true,
      jobTitle: 'Inside Sales Specialist',
      category: 'Sales & Marketing',
      description: 'We are looking for an ambitious, driven Inside Sales Specialist to join our high-energy admissions and counseling team at Adyapan in Hyderabad. In this role, you will connect directly with aspiring learners, understand their career aspirations, and guide them toward the most impactful certification and professional training programs. You will manage end-to-end enrollment pipelines, conduct high-conversion consultative outreach, and drive student success.',
      responsibilities: [
        'Reach out to inbound leads and prospective students via call, email, and WhatsApp.',
        'Conduct consultative career counseling sessions with students and fresh graduates.',
        'Manage end-to-end sales pipelines, maintain follow-ups, and ensure daily enrollment targets are met.',
        'Coordinate with academic mentors and marketing teams to optimize lead quality and conversions.',
        'Maintain detailed pipeline and activity records in Adyapan CRM.'
      ],
      requiredSkills: ['Inside Sales', 'Lead Conversion', 'Cold Calling', 'CRM Management', 'Career Counseling', 'EdTech Sales', 'Negotiation', 'Communication Skills'],
      educationRequirement: "Bachelor's degree in any discipline",
      experienceLevel: 'Fresher to 2 Years',
      openings: 5,
      employmentType: 'full-time',
      workMode: 'onsite',
      location: 'Hyderabad (On-site)',
      salaryOrStipend: '₹3.5 LPA - ₹6.0 LPA + Incentives',
      deadline: new Date('2026-12-31T23:59:59Z'),
      status: 'active',
      applicantsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      companyId: orgUserIdStr,
      organizationUserId: orgUserIdStr,
      companyName: 'ADYAPAN',
      companyEmail: orgEmail,
      companyLogoUrl: '/adyapan-logo.png',
      companyWebsite: 'https://adyapan.com',
      companyIndustry: 'Education Technology',
      companyCity: 'Pan-India',
      companyVerified: true,
      jobTitle: 'Student Representative',
      category: 'Community & Marketing',
      description: 'Adyapan is seeking energetic, community-oriented Student Representatives across colleges and universities nationwide. As a Student Representative, you will be the primary campus ambassador and bridge between your university community and Adyapan’s flagship tech training, hackathons, and placement initiatives. This flexible, remote leadership role lets you build valuable leadership and marketing experience while earning performance-based stipends and career mentorship.',
      responsibilities: [
        'Represent Adyapan on your campus, student clubs, and online student communities.',
        'Spread awareness regarding tech workshops, free masterclasses, and placement programs.',
        'Organize campus outreach, coding competitions, webinars, and hackathons.',
        'Gather student feedback and career needs to help shape new learning programs.',
        'Facilitate student onboarding and coordinate peer-learning study groups.'
      ],
      requiredSkills: ['Campus Outreach', 'Community Building', 'Social Media Marketing', 'Public Speaking', 'Event Organizing', 'Networking', 'Leadership'],
      educationRequirement: 'Enrolled College Student / Fresh Graduate',
      experienceLevel: 'Student / Fresher',
      openings: 20,
      employmentType: 'part-time',
      workMode: 'remote',
      location: 'India (Remote)',
      salaryOrStipend: '₹10,000 - ₹25,000 / month + Performance Stipend',
      deadline: new Date('2026-12-31T23:59:59Z'),
      status: 'active',
      applicantsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  for (const job of jobsToSeed) {
    const existing = await db.collection('jobposts').findOne({
      companyName: job.companyName,
      jobTitle: job.jobTitle
    });

    if (existing) {
      await db.collection('jobposts').updateOne(
        { _id: existing._id },
        {
          $set: {
            ...job,
            updatedAt: new Date(),
          }
        }
      );
      console.log(`✏️ Updated Job: ${job.jobTitle}`);
    } else {
      await db.collection('jobposts').insertOne(job);
      console.log(`✅ Created Job: ${job.jobTitle}`);
    }
  }

  const totalJobs = await db.collection('jobposts').countDocuments({ status: 'active' });
  console.log(`\n🎉 Total Active Jobs in Database: ${totalJobs}`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 ORGANIZATION LOGIN CREDENTIALS:');
  console.log(`   Email:    ${orgEmail}`);
  console.log(`   Password: ${orgPassword}`);
  console.log('   Portal:   /organization/login');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

