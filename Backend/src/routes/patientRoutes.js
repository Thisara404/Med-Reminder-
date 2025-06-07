const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { getProfile, updateMedications, updateReminders } = require('../controllers/patientController');

router.get('/profile', protect, authorize('patient'), getProfile);
router.put('/medications', protect, authorize('patient'), updateMedications);
router.put('/reminders', protect, authorize('patient'), updateReminders);

module.exports = router;