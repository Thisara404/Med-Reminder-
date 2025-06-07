const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getReminders,
  markAsTaken,
  markAsMissed
} = require('../controllers/reminderController');

router.get('/:patientId/reminders', protect, getReminders);
router.put('/:patientId/reminders/:reminderId/taken', protect, markAsTaken);
router.put('/:patientId/reminders/:reminderId/missed', protect, markAsMissed);

module.exports = router;