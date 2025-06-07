const mongoose = require('mongoose');
const User = require('../model/User');
const Patient = require('../model/Patient');
const Caregiver = require('../model/Caregiver');
require('dotenv').config();

async function createTestData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create a test patient
    const patientUser = await User.create({
      name: 'Test Patient',
      email: 'patient@test.com',
      password: '$2a$10$test', // Hashed password
      role: 'patient'
    });

    await Patient.create({
      user: patientUser._id,
      dateOfBirth: new Date('1990-01-01'),
      conditions: ['Hypertension'],
      medications: []
    });

    // Create a test caregiver
    const caregiverUser = await User.create({
      name: 'Test Caregiver',
      email: 'caregiver@test.com',
      password: '$2a$10$test', // Hashed password
      role: 'caregiver'
    });

    await Caregiver.create({
      user: caregiverUser._id,
      specialization: 'General Care',
      patients: [patientUser._id]
    });

    console.log('Test data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
}

createTestData();