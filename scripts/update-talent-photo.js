/**
 * Updates Rupesh's talent profile photo in MongoDB Atlas.
 * Run: node scripts/update-talent-photo.js
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

async function run() {
  await mongoose.connect(MONGO_URI, {
    dbName: DB_NAME,
    serverSelectionTimeoutMS: 15000,
  });

  const db = mongoose.connection.db;
  const result = await db.collection('studenttalents').updateMany(
    {
      $or: [
        { email: 'rupeshrupak609@gmail.com' },
        { phone: '8179124566' },
        { name: 'Rupesh Kumar Rupak' },
      ],
    },
    { $set: { photoUrl: '/images/rup.jpeg', updatedAt: new Date() } }
  );

  const rows = await db.collection('studenttalents')
    .find(
      { name: 'Rupesh Kumar Rupak' },
      { projection: { _id: 0, name: 1, role: 1, company: 1, photoUrl: 1 } }
    )
    .toArray();

  console.log(JSON.stringify({ matched: result.matchedCount, modified: result.modifiedCount, rows }, null, 2));
  await mongoose.disconnect();
}

run().catch(error => {
  console.error(error.message);
  process.exit(1);
});
