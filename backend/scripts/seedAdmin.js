const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const {connectToDatabase} = require('../config/db');
const User = require('../models/User');

const normalizePhone = value => String(value || '').replace(/\D/g, '');

const admin = {
  fullName: process.env.ADMIN_FULL_NAME,
  phone: normalizePhone(process.env.ADMIN_PHONE),
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

async function seedAdmin() {
  if (!admin.fullName || !admin.phone || !admin.email || !admin.password) {
    throw new Error(
      'ADMIN_FULL_NAME, ADMIN_PHONE, ADMIN_EMAIL and ADMIN_PASSWORD are required',
    );
  }

  await connectToDatabase();

  const user = await User.findOne({
    $or: [{phone: admin.phone}, {email: admin.email.toLowerCase()}],
  }).select('+passwordHash');

  const adminUser =
    user ||
    new User({
      fullName: admin.fullName,
      phone: admin.phone,
      email: admin.email,
    });

  adminUser.fullName = admin.fullName;
  adminUser.phone = admin.phone;
  adminUser.email = admin.email;
  adminUser.role = 'admin';
  adminUser.isActive = true;
  adminUser.setPassword(admin.password);

  await adminUser.save();

  console.log(`Admin user is ready: ${admin.phone}`);
}

seedAdmin()
  .catch(error => {
    console.error('Failed to seed admin user', error);
    process.exitCode = 1;
  });
