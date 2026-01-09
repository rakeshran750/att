require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const { connectDB } = require('../config/dbconfig');

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'rakeshran750@gmail.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }
    
    // Delete existing admin if exists
    await Admin.deleteOne({ email: 'rakeshran750@gmail.com' });
    
    // Create admin user using new + save to ensure pre-save hook runs
    const admin = new Admin({
      email: 'rakeshran750@gmail.com',
      password: '123456'
    });
    await admin.save();
    
    console.log('✅ Admin user created successfully:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();

