const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getReminders,
  addReminder,
  markAsTaken,
  markAsMissed,
  getTodayReminders
} = require('../controllers/reminderController');

// Get all reminders for a patient
router.get('/:patientId/reminders', protect, getReminders);

// Add a new reminder
router.post('/:patientId/reminders', protect, addReminder);

// Mark reminder as taken or missed
router.put('/:patientId/reminders/:reminderId/taken', protect, markAsTaken);
router.put('/:patientId/reminders/:reminderId/missed', protect, markAsMissed);

// Get today's reminders
router.get('/:patientId/reminders/today', protect, getTodayReminders);

module.exports = router;