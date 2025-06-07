const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  caregivers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caregiver'
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    time: String,
    startDate: Date,
    endDate: Date,
    instructions: String,
    purpose: String
  }],
  conditions: [String],
  reminders: [{
    medication: String,
    dosage: String,
    time: String,
    taken: Boolean,
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'missed']
    }
  }],
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    privacy: {
      shareWithCaregiver: { type: Boolean, default: true },
      shareWithDoctor: { type: Boolean, default: true }
    }
  }
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;