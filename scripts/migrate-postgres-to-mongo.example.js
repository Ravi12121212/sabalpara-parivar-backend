/**
 * Example outline to migrate existing Postgres (Prisma) data to Mongo.
 * Adjust file paths and field names to your exports.
 */
const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse/sync');
const mongoose = require('mongoose');

async function run() {
  console.log('Running...', process.env.MONGO_URI); 
  
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth_app_dev';
  await mongoose.connect(MONGO_URI);

  // Load models from separate files
  const User = require('./models/user');
  const UserProfile = require('./models/userProfile');
  const FamilyMember = require('./models/familyMember');

  function readCsv(name) {
    const content = fs.readFileSync(path.join(__dirname, name), 'utf8');
    return csvParse.parse(content, { columns: true, skip_empty_lines: true });
  }

  const users = readCsv('User.csv');
  const profiles = readCsv('UserProfile.csv');
  const family = readCsv('FamilyMember.csv');

  // Insert users
  for (const u of users) {
    await User.updateOne({ _id: u.id }, {
      $set: {
        email: u.email,
        phone: u.phone,
        passwordHash: u.passwordHash,
        createdAt: new Date(u.createdAt),
      }
    }, { upsert: true });
  }

  for (const p of profiles) {
    await UserProfile.updateOne({ userId: p.userId }, {
      $set: {
        village: p.village || null,
        name: p.name || null,
        totalFamilyMembers: p.totalFamilyMembers ? Number(p.totalFamilyMembers) : null,
        currentAddress: p.currentAddress || null,
        businessDetails: p.businessDetails || null,
        createdAt: new Date(p.createdAt),
      }
    }, { upsert: true });
  }

  // Replace family members wholesale
  const grouped = family.reduce((acc, row) => {
    acc[row.userId] = acc[row.userId] || [];
    acc[row.userId].push(row);
    return acc;
  }, {});

  for (const [userId, rows] of Object.entries(grouped)) {
    await FamilyMember.deleteMany({ userId });
    await FamilyMember.insertMany(rows.map(r => ({
      userId,
      memberName: r.memberName,
      age: r.age ? Number(r.age) : null,
      std: r.std || null,
      resultImage: r.resultImage || null,
      percentage: r.percentage ? Number(r.percentage) : null,
      createdAt: new Date(r.createdAt),
    })));
  }

  console.log('Migration complete');
  await mongoose.disconnect();
}

if (require.main === module) {
  run().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
