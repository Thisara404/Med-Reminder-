const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    name: String,
    specialization: String
  },
  prescriptionFile: {
    filename: String,
    path: String,
    mimetype: String
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'active', 'expired'],
    default: 'pending'
  },
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  issueDate: Date,
  expiryDate: Date,
  analyzedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;