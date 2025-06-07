const mongoose = require('mongoose');
const User = require('../model/User');
const Caregiver = require('../model/Caregiver');
const Patient = require('../model/Patient');
require('dotenv').config();

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});

    for (const user of users) {
      if (user.role === 'caregiver') {
        const existingCaregiver = await Caregiver.findOne({ user: user._id });
        if (!existingCaregiver) {
          await Caregiver.create({
            user: user._id,
            specialization: 'General Care',
            qualifications: [],
            patients: []
          });
          console.log(`Created caregiver profile for ${user.email}`);
        }
      } else if (user.role === 'patient') {
        const existingPatient = await Patient.findOne({ user: user._id });
        if (!existingPatient) {
          await Patient.create({
            user: user._id,
            dateOfBirth: new Date(),
            caregivers: [],
            medications: [],
            conditions: []
          });
          console.log(`Created patient profile for ${user.email}`);
        }
      }
    }

    console.log('Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateUsers();