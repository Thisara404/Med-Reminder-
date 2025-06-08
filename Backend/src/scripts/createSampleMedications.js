const mongoose = require('mongoose');
const User = require('../model/User');
const Medication = require('../model/Medication');
require('dotenv').config();

async function createSampleMedications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find admin user
    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      console.log('No admin user found. Creating one...');
      const newAdmin = await User.create({
        name: 'Admin',
        email: 'admin@medreminder.com',
        password: 'admin123',
        role: 'admin',
        isAdmin: true
      });
      console.log('Admin created');
    }

    const admin = await User.findOne({ isAdmin: true });

    // Delete existing medications
    await Medication.deleteMany({});

    // Create sample medications
    const medications = await Medication.create([
      {
        name: 'Aspirin',
        category: 'Pain Relief',
        description: 'Pain reliever and blood thinner',
        dosage: '81mg',
        frequency: 'Once daily',
        instructions: 'Take with food',
        sideEffects: 'Stomach upset, bleeding',
        addedBy: admin._id,
        status: 'active'
      },
      {
        name: 'Lisinopril',
        category: 'ACE Inhibitor',
        description: 'Blood pressure medication',
        dosage: '10mg',
        frequency: 'Once daily',
        instructions: 'Take in the morning',
        sideEffects: 'Dizziness, dry cough',
        addedBy: admin._id,
        status: 'active'
      },
      {
        name: 'Metformin',
        category: 'Antidiabetic',
        description: 'Diabetes medication',
        dosage: '500mg',
        frequency: 'Twice daily',
        instructions: 'Take with meals',
        sideEffects: 'Nausea, stomach upset',
        addedBy: admin._id,
        status: 'active'
      }
    ]);

    console.log(`Created ${medications.length} sample medications`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample medications:', error);
    process.exit(1);
  }
}

createSampleMedications();