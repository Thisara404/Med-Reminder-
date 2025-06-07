const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  time: {
    type: String,
    required: true
  },
  taken: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'missed'],
    default: 'upcoming'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;