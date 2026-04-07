/**
 * Seed script – creates or resets the admin account.
 * Usage:  node scripts/seedAdmin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User     = require('../models/User');

const ADMIN = {
  name:     'Admin',
  email:    'admin@medcare.com',
  password: 'Admin@123',
  phone:    '0000000000',
  role:     'admin',
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      // Reset password in case it drifted
      existing.password = ADMIN.password;
      existing.role     = 'admin';
      await existing.save();
      console.log('🔄  Admin account updated (password reset).');
    } else {
      await User.create(ADMIN);
      console.log('🆕  Admin account created.');
    }

    console.log(`\n✅  Admin credentials:`);
    console.log(`    Email   : ${ADMIN.email}`);
    console.log(`    Password: ${ADMIN.password}\n`);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
})();
