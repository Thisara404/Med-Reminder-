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
  name: {
    type: String,
    default: 'Prescription'
  },
  doctor: {
    type: String,
    default: 'Unknown Doctor'
  },
  prescriptionFile: {
    filename: String,
    path: String,
    mimetype: String,
    originalname: String,
    size: Number
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'active', 'expired'],
    default: 'active'
  },
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  notes: String,
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  analyzedAt: Date
}, { timestamps: true });

// Add index for better query performance
prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ uploadedBy: 1 });

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;