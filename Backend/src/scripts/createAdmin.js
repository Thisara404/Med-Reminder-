const mongoose = require('mongoose');
const User = require('../model/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Delete existing admin if exists (for testing)
    await User.deleteOne({ email: 'admin@medreminder.com' });
    
    // Create new admin user
    await User.create({
      name: 'Admin',
      email: 'admin@medreminder.com',
      password: 'admin123', // Will be hashed by pre-save middleware
      role: 'admin',
      isAdmin: true
    });
    
    console.log('Admin user created successfully');
    console.log('Email: admin@medreminder.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();