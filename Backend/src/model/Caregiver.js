const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  qualifications: [String],
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  organization: {
    type: String,
    required: false
  },
  position: {
    type: String,
    required: false
  },
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    patientAccess: {
      allowViewNotes: { type: Boolean, default: true },
      allowUploadPrescriptions: { type: Boolean, default: true },
      allowModifyMedications: { type: Boolean, default: false }
    }
  }
}, { timestamps: true });

const Caregiver = mongoose.model('Caregiver', caregiverSchema);
module.exports = Caregiver;