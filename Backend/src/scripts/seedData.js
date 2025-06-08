const mongoose = require('mongoose');
const User = require('../model/User');
const Doctor = require('../model/Doctor');
const Patient = require('../model/Patient');
const Caregiver = require('../model/Caregiver');
const Medication = require('../model/Medication');
const Prescription = require('../model/Prescription');
const Note = require('../model/Note');
const Reminder = require('../model/Reminder');
require('dotenv').config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
      Caregiver.deleteMany({}),
      Medication.deleteMany({}),
      Prescription.deleteMany({}),
      Note.deleteMany({}),
      Reminder.deleteMany({})
    ]);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@medreminder.com',
      password: 'admin123',
      role: 'admin',
      isAdmin: true
    });

    // Create doctors
    const doctors = await Doctor.create([
      {
        name: 'Dr. John Smith',
        specialization: 'Cardiology',
        registrationNumber: 'DOC001',
        contact: {
          email: 'john.smith@example.com',
          phone: '123-456-7890'
        },
        status: 'active',
        addedBy: adminUser._id
      },
      {
        name: 'Dr. Sarah Johnson',
        specialization: 'Neurology',
        registrationNumber: 'DOC002',
        contact: {
          email: 'sarah.johnson@example.com',
          phone: '123-456-7891'
        },
        status: 'active',
        addedBy: adminUser._id
      }
    ]);

    // Create caregivers with users
    const caregiverUsers = await User.create([
      {
        name: 'James Wilson',
        email: 'james@example.com',
        password: 'password123',
        role: 'caregiver'
      },
      {
        name: 'Maria Garcia',
        email: 'maria@example.com',
        password: 'password123',
        role: 'caregiver'
      }
    ]);

    const caregivers = await Caregiver.create([
      {
        user: caregiverUsers[0]._id,
        specialization: 'General Care',
        qualifications: ['RN', 'BSN'],
        organization: 'City Hospital',
        position: 'Senior Nurse'
      },
      {
        user: caregiverUsers[1]._id,
        specialization: 'Elder Care',
        qualifications: ['CNA', 'Home Health Aide'],
        organization: 'Sunshine Care Center',
        position: 'Care Coordinator'
      }
    ]);

    // Create patients with users
    const patientUsers = await User.create([
      {
        name: 'Alice Brown',
        email: 'alice@example.com',
        password: 'password123',
        role: 'patient'
      },
      {
        name: 'Bob Davis',
        email: 'bob@example.com',
        password: 'password123',
        role: 'patient'
      }
    ]);

    const patients = await Patient.create([
      {
        user: patientUsers[0]._id,
        dateOfBirth: new Date('1960-05-15'),
        phone: '123-555-0101',
        conditions: ['Hypertension', 'Diabetes'],
        caregivers: [caregivers[0]._id]
      },
      {
        user: patientUsers[1]._id,
        dateOfBirth: new Date('1955-08-22'),
        phone: '123-555-0102',
        conditions: ['Arthritis', 'High Cholesterol'],
        caregivers: [caregivers[1]._id]
      }
    ]);

    // Add patients to caregivers
    await Caregiver.findByIdAndUpdate(caregivers[0]._id, {
      $push: { patients: patients[0]._id }
    });
    await Caregiver.findByIdAndUpdate(caregivers[1]._id, {
      $push: { patients: patients[1]._id }
    });

    // Create medications
    const medications = await Medication.create([
      {
        name: 'Lisinopril',
        category: 'ACE Inhibitor',
        description: 'For blood pressure control',
        dosage: '10mg',
        frequency: 'Once daily',
        instructions: 'Take in the morning',
        sideEffects: 'May cause dizziness',
        addedBy: adminUser._id,
        patient: patients[0]._id
      },
      {
        name: 'Metformin',
        category: 'Antidiabetic',
        description: 'For diabetes management',
        dosage: '500mg',
        frequency: 'Twice daily',
        instructions: 'Take with meals',
        sideEffects: 'May cause stomach upset',
        addedBy: adminUser._id,
        patient: patients[0]._id
      }
    ]);

    // Create prescriptions
    const prescriptions = await Prescription.create([
      {
        patient: patients[0]._id,
        uploadedBy: caregivers[0]._id,
        doctor: {
          name: 'Dr. John Smith',
          specialization: 'Cardiology'
        },
        status: 'active',
        medications: [{
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '3 months'
        }],
        issueDate: new Date()
      }
    ]);

    // Create notes
    const notes = await Note.create([
      {
        patient: patients[0]._id,
        caregiver: caregivers[0]._id,
        title: 'Blood Pressure Check',
        content: 'Blood pressure readings are stable: 120/80',
        category: 'check-in'
      },
      {
        patient: patients[0]._id,
        caregiver: caregivers[0]._id,
        title: 'Medication Adjustment',
        content: 'Discussed medication side effects, no concerns reported',
        category: 'medication'
      }
    ]);

    // Create reminders
    const reminders = await Reminder.create([
      {
        medication: medications[0]._id,
        patient: patients[0]._id,
        time: '09:00',
        scheduledDate: new Date(),
        status: 'upcoming'
      },
      {
        medication: medications[1]._id,
        patient: patients[0]._id,
        time: '18:00',
        scheduledDate: new Date(),
        status: 'upcoming'
      }
    ]);

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();